const SUCCESS_CODES_REGEXP = [ '^(200)', '^(400)' ];

const DEFAULT_OPTIONS = {
  code: 200,
  data: null,
  message: 'ok',
};

module.exports = {
  setResponse({ code, data, message } = DEFAULT_OPTIONS) {
    const success = SUCCESS_CODES_REGEXP.some(regexpstr => {
      const regexp = new RegExp(regexpstr);
      return regexp.test(String(code));
    });

    // ?如果传入的code不在 SUCCESS_CODES_REGEXP 数组中，直接使用传入的code， 这时候需要code传入标准http状态码
    this.status = success ? 200 : code;

    this.body = {
      success,
      code,
      data,
      message,
    };
  },
};
