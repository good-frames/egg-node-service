/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1657156899198_3520';

  // add your middleware config here
  // // 加载 errorHandler 中间件
  config.middleware = [ 'errorHandler', 'jwt' ];
  // // 只对 /api 前缀的 url 路径生效
  config.errorHandler = {
    match: '/api',
  };

  // const WhiteList = {
  //   POST: [
  //     '/api/users',
  //   ],
  //   GET: []
  // };
  config.jwt = {
    enable: true,
    ignore: [
      '/api/login',
      /(\/api\/users)$/,
    ],
  };

  config.cors = {
    origin: '*',
    allowMethods: 'GET, HEAD, PUT, POST, DELETE, PATCH',
    credentials: true,
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
      // 判断是否需要 ignore 的方法，请求上下文 context 作为第一个参数
      // ignore: ctx => {
      //   // if (ctx.request.url == '/admin/goods/uploadImg') {
      //   //   return true
      //   // }
      //   return true;
      // },
    },
    // 跨域白名单
    // domainWhiteList: [ 'http://localhost:3000' ],
  };

  config.redis = {
    clients: {
      tokens: {
        host: '127.0.0.1',
        port: '6379',
        password: '',
        db: 0,
      },
    },
  };

  config.mysql = {
    // 单数据库信息配置
    client: {
    // host
      host: '127.0.0.1',
      // 端口号
      port: '3306',
      // 用户名
      user: 'root',
      // 密码
      password: '123456',
      // 数据库名
      database: 'education',
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };

  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    password: '123456',
    database: 'education',
    define: {
      freezeTableName: true,
      underscored: true,
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
