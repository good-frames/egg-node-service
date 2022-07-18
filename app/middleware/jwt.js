/* eslint-disable no-unused-vars */
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

module.exports = (options, app) => {
  return async function userInterceptor(ctx, next) {
    try {
      let authToken = ctx.header.authorization;
      if (authToken) {
        authToken = authToken.substring(7);
        const res = verifyToken(authToken);

        if (res.uuid) {
          const redis_token = await app.redis.get('tokens').get(res.uuid);// 获取保存的token
          if (authToken === redis_token) {
            // redis中有相对应的记录
            ctx.locals.uuid = res.uuid;
            await next();
          } else {
            ctx.body = {
              code: 1002,
              message: '该账号已在其他地区登录',
            };
          }
        } else {
          ctx.body = {
            code: 1003,
            message: '登录已过期',
          };
        }

      } else {
        ctx.body = {
          code: 1001,
          message: '请登录后再进行操作',
        };
      }
    } catch (error) {
      ctx.throw(500, 'remote response error', error);
    }

  };
};


// 解密，验证
function verifyToken(token) {
  const cert = fs.readFileSync(path.join(__dirname, '../public/token_cert_key.pem'));
  let res = '';
  try {
    const result = jwt.verify(token, cert, { algorithms: [ 'RS256' ] }) || {};
    const { exp } = result;
    const current = Math.floor(Date.now() / 1000);
    if (current <= exp) res = result.data || {};
  } catch (e) {
    console.log(e);
  }
  return res;
}
