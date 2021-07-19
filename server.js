const express = require('express')
const bcrypt = require('bcrypt')

const users = []

// APP CONFIG

const app = express()

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

app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    res.redirect('/login')
  } catch (error) {
    res.redirect('/register')
  }
  console.log(users)
})

// RUN APP

app.listen(3000, () => console.log('Listening on port 3000...'))
