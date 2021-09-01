const grpc = require('@grpc/grpc-js')
const PROTO_PATH = '/home/dell/Javascript/Intern/gRPC-Node2/src/service/news.proto'
const protoLoader = require('@grpc/proto-loader')
require('dotenv').config()

const connect = require('./src/models/db_connect')

const packageDefinition = protoLoader.loadSync(PROTO_PATH)
const newsProto = grpc.loadPackageDefinition(packageDefinition)

const server = new grpc.Server()

server.addService(newsProto.AuthorService.service, {
  AddAuthor: async (call, callback) => {
    const { connection } = await connect()
    const val = JSON.parse(call.metadata.get('data')[0])
    connection.query('INSERT INTO author(authorName,address,contactNo) VALUES (?,?,?)', [val.author_name, val.author_address, val.contact_no], function (error, results, fields) {
      if (error) console.error(error)
      const value = results.insertId
      callback(null, { id: value })
    })
  }
})

server.addService(newsProto.NewsService.service, {
  getAllNews: async (_, callback) => {
    const { connection } = await connect()
    connection.query('SELECT * FROM news', function (error, results, fields) {
      if (error) console.error(error)
      console.log(results)
      const val = JSON.parse(JSON.stringify(results))
      console.log(val)
      callback(null, { news: val })
    })
  },

  getNews: async (call, callback) => {
    const { connection } = await connect()
    const sql = 'SELECT * FROM news WHERE newsId = ?'
    const newsId = JSON.parse(call.metadata.get('data')[0]).newsId

    connection.query(sql, newsId, function (error, results) {
      if (error) console.log(error)
      const val = JSON.parse(JSON.stringify(results))[0]
      console.log(val)
      callback(null, val)
    })
  },

  deleteNews: async (call, callback) => {
    const { connection } = await connect()
    const sql = 'DELETE FROM news WHERE newsId = ?'
    const newsId = JSON.parse(call.metadata.get('data')[0]).newsId
    // const sql = `DELETE FROM news WHERE newsId = ${newsId}`
    connection.query(sql, newsId, function (error, results, fields) {
      if (error) console.error(error)
      callback(null, {})
    })
  },

  editNews: async (call, callback) => {
    console.log(call.metadata)
    const val = JSON.parse(call.metadata.get('data')[0])
    console.log(val)
    const { connection } = await connect()

    const query = 'Update news SET title = ?, description=?, image=? Where newsId=?'

    const queryParams = [val.title, val.description, val.image, val.newsId]

    connection.query(query, queryParams, function (error) {
      if (error) console.log(error)
      callback(null, {})
    })
  },

  addNews: async (call, callback) => {
    const val = JSON.parse(call.metadata.get('dataNews')[0])
    console.log(val)
    const { connection } = await connect()
    connection.query('INSERT INTO news(title,description,image,authorId) VALUES (?,?,?,?)', [val.author_name, val.author_address, val.contact_no, val.authorId], function (error, results, fields) {
      if (error) console.error(error)
      callback(null, {})
    })
  }
})

console.log(process.env.RPC_CLIENT)
server.bindAsync(
  process.env.RPC_CLIENT,
  grpc.ServerCredentials.createInsecure(),
  (error) => {
    if (error) console.error(error)
    console.log('Server running at http://127.0.0.1:50051')
    server.start()
  }
)
