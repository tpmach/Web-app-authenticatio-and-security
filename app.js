/* eslint no-undef: "error" */
/* eslint-env node */

require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const md5 = require('md5')

const app = express()
const port = 3000

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect('mongodb://localhost:27017/userDb', { useNewUrlParser: true, useUnifiedTopology: true })

const userSchema = new mongoose.Schema({
  email: String,
  password: String
})

const User = mongoose.model('User', userSchema)

app.get('/', (req, res) => {
  res.render('home')
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.get('/register', (req, res) => {
  res.render('register')
})

app.post('/register', (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password)
  })
  newUser.save((err) => {
    if (!err) {
      res.render('secrets')
    } else {
      console.log(err)
    }
  })
})

app.post('/login', (req, res) => {
  const username = req.body.username
  const password = md5(req.body.password)

  User.findOne({ email: username }, (err, foundUser) => {
    if (!err) {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render('secrets')
        }
      }
    } else {
      console.log(err)
    }
  })
})

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
