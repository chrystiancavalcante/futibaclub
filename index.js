const express = require('express')
const app = express()
const mysql = require('mysql2/promise')
const bodyParser = require('body-parser')
const session = require('express-session')
const account = require('./account')
const admin = require('./admin')
const groups = require('./groups')
const classification = require('./classification')


app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true}))
app.use(session({
    secret: 'softwarepro',
    resave: true,
    saveUninitialized: true
}))

app.set('view engine', 'ejs')

const init = async() => {
    const connection = await mysql.createConnection({
        host:'us-cdbr-iron-east-05.cleardb.net',
        user:'bdecb435323c08',
        password: 'ee01fdfd',
        database:'heroku_8c9e6d631dc2873' 
     })

app.use((req, res, next) =>{
    if(req.session.user){
        res.locals.user = req.session.user
    }else{
        res.locals.user = false
    }
    next()
})     

app.use(account(connection))
app.use('/admin', admin(connection))
app.use('/groups', groups(connection))
app.use('/classification', classification(connection))

app.listen(3000, err => {
    console.log('futiba club server running...')
    })
 }

init()

