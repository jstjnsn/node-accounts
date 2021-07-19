const express = require('express')
const app = express()

const users = []

// CONFIG

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

// HOME

app.get('/', (req, res) => {
  res.render('index.ejs', { name: 'there!' })
})

// LOGIN

app.get('/login', (req, res) => {
  res.render('login.ejs')
})

app.post('/login', (req, res) => {
})

// REGISTER

app.get('/register', (req, res) => {
  res.render('register.ejs')
})

app.post('/register', (req, res) => {
})

// RUN APP

app.listen(3000, () => console.log('Listening on port 3000...'))
