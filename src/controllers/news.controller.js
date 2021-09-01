const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')

const PROTO_PATH = '/home/dell/Javascript/Intern/gRPC-Node2/src/service/news.proto'
const packageDefinition = protoLoader.loadSync(PROTO_PATH)
const NewsService = grpc.loadPackageDefinition(packageDefinition).NewsService
const AuthorService = grpc.loadPackageDefinition(packageDefinition).AuthorService

const client = new NewsService(
  process.env.RPC_CLIENT,
  grpc.credentials.createInsecure()
)

const newsClient = new AuthorService(
  process.env.RPC_CLIENT,
  grpc.credentials.createInsecure()
)

exports.getAllNews = (req, res) => {
  client.getAllNews({}, (error, value) => {
    if (!error) console.log(error)
    res.send(value.news)
  })
}

exports.getNews = (req, res) => {
  const meta = new grpc.Metadata()
  meta.add('data', JSON.stringify(req.body))

  client.getNews({}, meta, (error, value) => {
    if (!error) console.log(error)
    res.send(value)
  })
}

exports.DeleteNews = (req, res) => {
  const meta = new grpc.Metadata()
  meta.add('data', JSON.stringify(req.body))

  client.deleteNews({}, meta, (error) => {
    if (!error) console.log(error)
    res.send({ Message: 'Value is Delected' })
  })
}

exports.EditNews = (req, res) => {
  const meta = new grpc.Metadata()
  meta.add('data', JSON.stringify(req.body))

  client.editNews({}, meta, (error) => {
    if (!error) console.log(error)
    res.send({ Message: 'News Updated' })
  })
}

exports.AddNews = (req, res) => {
  const data = req.body
  const meta = new grpc.Metadata()
  meta.add('data', JSON.stringify(req.body))

  newsClient.AddAuthor({}, meta, (error, value) => {
    if (error) throw error
    data.authorId = value.id
    meta.add('dataNews', JSON.stringify(data))

    client.addNews({}, meta, (error) => {
      if (!error) console.log(error)
      res.send({ Message: 'News Crested Sucessfull' })
    })
  }
  )
}
