
const Service = require('egg').Service;

/**
 * User Service
 */
class UsersService extends Service {

  constructor(ctx) {
    super(ctx);
    this.Op = this.app.Sequelize.Op;
    this.usersModle = this.ctx.model.Users;
  }

  /**
   * 用户登录
   * @param {*} loginInfo 登录信息
   * @return {*} 执行结果
   */
  async login(loginInfo) {
    const usersModle = this.usersModle;

    // 查数据库
    const userInfo = await usersModle.findOne(
      {
        attributes: [ 'uuid' ],
        where: {
          login_name: loginInfo.loginName,
          password: loginInfo.password,
        },
      }
    );
    if (userInfo) {
      const token = this.ctx.helper.loginToken({ uuid: userInfo.uuid });
      await this.app.redis.get('tokens').set(userInfo.uuid, token);
      return {
        code: 2000,
        data: {
          token,
          expires: 7200,
        },
      };
    }
    return {
      code: 4000,
      message: '用户名或密码错误',
    };
  }

  /**
   * 用户登出
   * @param {*} uuid 用户唯一ID
   * @return {Object} 执行结果
   */
  async logout(uuid) {
    await this.app.redis.get('tokens').del(uuid);

    return {
      code: 2000,
      message: '账号已登出',
    };
  }

  /**
   * 用户注册
   * @param {Object} userInfo 用户注册信息
   * @return {Object} 执行结果
   */
  async register(userInfo) {

    const usersModle = this.usersModle;
    const Op = this.Op;

    // 查询用户表，查重
    const userCount = await usersModle.count({
      where: {
        [Op.or]: {
          login_name: {
            [Op.eq]: userInfo.loginName,
          },
          phone: {
            [Op.eq]: userInfo.phone,
          },
          mail: {
            [Op.eq]: userInfo.mail,
          },
        },
      },
    });

    if (userCount) {
      return {
        code: 2004,
        message: '创建失败，登录名/手机号/邮箱已被注册',
      };
    }

    // 数据入库
    const result = await usersModle.create(this.ctx.helper.formatFields(userInfo));

    if (!result) {

      return {
        code: 2005,
        message: '数据入库失败',
      };
    }

    return {
      code: 2001,
      message: '注册成功',
    };

  }

  /**
   * 用户信息
   * @param {String} uuid 用户唯一ID
   */
  async getUserInfo(uuid) {
    const usersModle = this.usersModle;
    // const Op = this.Op;

    const userInfo = await usersModle.findOne({
      attributes: { exclude: [ 'login_name', 'password' ] },
      where: {
        uuid,
      },
    });

    if (userInfo) {
      return {
        code: 2000,
        data: userInfo,
      };
    }

    return {
      code: 4004,
      message: '未找到用户',
    };
  }

  /**
   * 更新用户信息
   * @param {String} uuid 用户唯一ID
   * @param {Object} newUserInfo 新用户信息
   */
  async updateUserInfo(uuid, newUserInfo) {
    const usersModle = this.usersModle;

    if (this.ctx.locals.uuid === uuid) {
      const result = await usersModle.update(
        this.ctx.helper.formatFields(newUserInfo),
        {
          where: {
            uuid,
          },
        }
      );

      if (result[0]) {
        return {
          code: 2000,
          message: '修改成功',
        };
      }

      return {
        code: 4004,
        message: '未找到用户',
      };
    }

    return {
      code: 4003,
      message: '您没有修改其他用户的权限',
    };

  }

  /**
   * 删除用户
   * @param {String} uuid 用户唯一ID
   */
  async deleteUser(uuid) {
    const usersModle = this.usersModle;
    if (this.ctx.locals.uuid === uuid) {
      const result = await usersModle.destroy(
        {
          where: {
            uuid,
          },
        }
      );
      if (result) {
        return {
          code: 2000,
          message: '已删除该用户',
        };
      }
      return {
        code: 4004,
        message: '删除失败',
      };
    }

    return {
      code: 4003,
      message: '您没有删除其他用户的权限',
    };
  }
}

module.exports = UsersService;
