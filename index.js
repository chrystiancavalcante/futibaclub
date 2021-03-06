const express = require('express')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const http = require('http')
const debug = require('debug')('softwarepro-club:server')
const mysql = require('mysql2/promise')
const bluebird = require('bluebird')
const bodyParser = require('body-parser')
const favicon = require('serve-favicon')
const session = require('express-session')
const account = require('./account')
const admin = require('./admin')
const groups = require('./groups')
const classification = require('./classification')
const app = express()

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true}))
app.use(session({
    secret: 'softwarepro',
    resave: true,
    saveUninitialized: true
}))

const init = async() => {
//Definindo o banco de dados
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
const defaultData = require('./data/default-data.json')
db.defaults(defaultData).write()

app.io = require('socket.io')()

var placar = require('./routes/index')({io: app.io, db});
var admin_placar = require('./routes/admin')({io: app.io, db});

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/placar', placar)
app.use('/admin_placar', admin_placar)

connection = await mysql.createConnection(
        { 

          host:'localhost',
          user:'root',
          password: 'root',
          database:'db',  

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

app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  res.status(err.status || 500)
  res.render('error')
  })

var port = normalizePort(process.env.PORT || '3000')
console.log('FutibaClub rodando na porta 3000')
app.set('port', port)

var server = http.createServer(app)
app.io.attach(server)

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

function normalizePort(val) {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
   
    return val;
  }

  if (port >= 0) {
   
    return port
  }

  return false
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1);
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

function onListening() {
  var addr = server.address()
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  debug('Listening on ' + bind)
   }

}

init()

