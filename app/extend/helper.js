const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

module.exports = {
  /**
   * 生成token
   * @param {Object} data 用户信息
   * @param {Number} expires 有效时间
   * @return {String} token
   */
  loginToken(data, expires = 7200) {
    const exp = Math.floor(Date.now() / 1000) + expires;
    const cert = fs.readFileSync(path.join(__dirname, '../public/token_cert_key.pem'));
    const token = jwt.sign({ data, exp }, cert, { algorithm: 'RS256' });
    return token;
  },
  /**
   * 将对象中的小驼峰写法字段名转成下划线写法
   * @param {*} fields 信息
   * @return {*} 转化后的信息
   */
  formatFields(fields) {
    if (typeof fields !== 'object' || !fields) return fields;
    const obj = {};
    for (const fieldKey in fields) {
      const newKey = fieldKey.replace(/([A-Z])/g, (p, m) => `_${m.toLowerCase()}`);
      obj[newKey] = fields[fieldKey];
    }

    return obj;
  },
};
