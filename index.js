const express = require('express')
const app = express()
const mysql = require('mysql2')
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

const config = { 
        host:'us-cdbr-iron-east-05.cleardb.net',
        user:'bac7187b8e72e9',
        password: '593fdea1',
        database:'heroku_da351e278e4b625', 
        port: 3306,
        ssl: true
     }

const init = async() => {
 const connection = await mysql.createConnection(config)

 connection.connect(
    function (err) { 
    if (err) { 
        console.log("!!! Cannot connect !!! Error:")
       
        throw err
    }
    else
    {
       connection.end()
       console.log("Connection established.")
           //queryDatabase()
    }   
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




app.listen( process.env.PORT || 3000, err => {
    console.log('futiba club server running...')
    })
 }

init()

