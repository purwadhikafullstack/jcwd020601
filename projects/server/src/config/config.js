const { db_username, db_password, db_database, db_host, db_dialect } =
  process.env;
const PORT = process.env.PORT;
// console.log(PORT);
module.exports = {
  development: {
    username: db_username,
    password: db_password,
    database: db_database,
    host: db_host,
    dialect: db_dialect,
  },
};
