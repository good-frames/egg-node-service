module.exports = app => {
  const { router, controller } = app;
  router.resources('users', '/api/users', controller.users);
  router.post('/api/login', controller.users.login); // 用户登录
  router.get('/api/logout', controller.users.logout); // 用户登出
  router.get('/api/loginUserInfo', controller.users.loginUserInfo); // 获取登录用户信息
};
