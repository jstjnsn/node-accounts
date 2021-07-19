if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// LIBRARIES

const express = require('express')
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

// APP CONFIG

const app = express()

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

const initializePassport = require('./passport.config')
initializePassport(passport, getUserByEmail, getUserById)

app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

// DATA

const users = []

// HOME

app.get('/', guardAuthenticated, (req, res) => {
  res.render('index.ejs', { name: req.user.name })
})

// LOGIN

app.get('/login', guardNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

const loginStrategy = {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}

app.post('/login', guardNotAuthenticated, passport.authenticate('local', loginStrategy), (req, res) => { })

// REGISTER

app.get('/register', guardNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})

app.post('/register', guardNotAuthenticated, async (req, res) => {
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

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

// RUN APP

app.listen(3000, () => console.log('Listening on port 3000...'))

// FUNCTIONS

function getUserByEmail(email) {
  return users.find(u => u.email === email)
}

function getUserById(id) {
  return users.find(u => u.id === id)
}

function guardAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next()

  return res.redirect('/login')
}

function guardNotAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return res.redirect('/')

  return next()
}
