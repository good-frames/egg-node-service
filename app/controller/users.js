const Controller = require('egg').Controller;

const createRule = {
  loginName: 'string',
  nick: 'string',
  password: { type: 'password', max: 30 },
  role: 'string',
  gender: { type: 'number', default: 3, required: false },
  phone: { type: 'string', required: false },
  mail: { type: 'email', required: false },
};

class UsersController extends Controller {
  // 用户登入
  async login() {
    try {
      const ctx = this.ctx;
      const loginInfo = ctx.request.body;

      const response = await ctx.service.users.login(loginInfo);

      ctx.setResponse(response);

    } catch (error) {
      this.ctx.throw(500, 'remote response error', error);
    }
  }

  // 用户登出
  async logout() {
    try {
      const ctx = this.ctx;

      const response = await ctx.service.users.logout(ctx.locals.uuid);

      ctx.setResponse(response);
    } catch (error) {
      this.ctx.throw(500, 'remote response error', error);
    }
  }

  // 获取登录用户信息
  async loginUserInfo() {
    try {
      const ctx = this.ctx;

      const response = await ctx.service.users.getUserInfo(ctx.locals.uuid);

      ctx.setResponse(response);
    } catch (error) {
      this.ctx.throw(500, 'remote response error', error);
    }
  }

  // 注册用户
  async create() {
    try {
      const ctx = this.ctx;

      const userInfo = ctx.request.body;

      ctx.validate(createRule, userInfo);

      const response = await ctx.service.users.register(userInfo);

      ctx.setResponse(response);

    } catch (error) {
      this.ctx.throw(500, 'remote response error', error);
    }
  }

  // 用户信息
  async show() {
    try {
      const ctx = this.ctx;

      const uuid = ctx.params.id;

      const response = await ctx.service.users.getUserInfo(uuid);

      ctx.setResponse(response);
    } catch (error) {
      this.ctx.throw(500, 'remote response error', error);
    }
  }

  // 编辑用户信息
  async update() {
    try {
      const ctx = this.ctx;

      const uuid = ctx.params.id;
      const newUserInfo = ctx.request.body;

      const response = await ctx.service.users.updateUserInfo(uuid, newUserInfo);

      ctx.setResponse(response);

    } catch (error) {
      this.ctx.throw(500, 'remote response error', error);
    }
  }

  // 删除用户
  async destroy() {
    try {
      const ctx = this.ctx;

      const uuid = ctx.params.id;

      const response = await ctx.service.users.deleteUser(uuid);

      ctx.setResponse(response);
    } catch (error) {
      this.ctx.throw(500, 'remote response error', error);
    }
  }
}


module.exports = UsersController;
