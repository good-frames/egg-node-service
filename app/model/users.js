'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const User = app.model.define(
    'users',
    {
      uuid: { type: INTEGER, primaryKey: true },
      login_name: STRING(30),
      password: STRING(30),
      nick: STRING(20),
      gender: {
        type: INTEGER,
        defaultValue: 3,
      },
      birthday: DATE,
      role: STRING(4),
      phone: STRING(12),
      mail: STRING(60),
    },
    {
      tableName: 'users',
      timestamps: true,
    }
  );

  return User;
};
