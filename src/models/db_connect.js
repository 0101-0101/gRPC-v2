const mysql = require('mysql')
const dbConfig = require('../../config/db_config')

console.log(dbConfig)
const connection = mysql.createConnection({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  port: dbConfig.port
})

const connect = () => {
  return new Promise((resolve, reject) => {
    try {
      connection.connect((err) => {
        if (err) {
          console.log(err.message)
        }
        resolve({ connection })
      })
    } catch (e) {
      reject(new Error(e))
    }
  }
  )
}

const createAuthor =
  `
  CREATE TABLE IF NOT EXISTS Author (
    author_id INT AUTO_INCREMENT PRIMARY KEY,
    authorName VARCHAR(255) NOT NULL,
    address CHAR(100),
    contactNo CHAR(250))
   `
connection.query(createAuthor)

const createNews =
  `
  CREATE TABLE IF NOT EXISTS News (
    news_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image CHAR(250),
    author_id int,
    CONSTRAINT fk_Author 
    FOREIGN KEY (author_id)
      REFERENCES Author(author_id))
  `
connection.query(createNews)

module.exports = connect
