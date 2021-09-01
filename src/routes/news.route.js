const express = require('express')
const router = express.Router()

const { getAllNews, getNews, DeleteNews, EditNews, AddNews } = require('../controllers/news.controller')

router.get('/getAllNews', getAllNews)

router.post('/getNews', getNews)

router.post('/addNews', AddNews)

router.post('/deleteNews', DeleteNews)

router.post('/editNews', EditNews)

module.exports = router
