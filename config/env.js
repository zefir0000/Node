module.exports = {
    dbConfig: () => {
        console.log('env', process.env.MYSQL_PASS)
      return { password: process.env.MYSQL_PASS };
    }
}
  