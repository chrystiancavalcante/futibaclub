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

//Definindo o banco de dados
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
const defaultData = require('./data/default-data.json')
db.defaults(defaultData).write()


const app = express();
app.io = require('socket.io')()

var placar = require('./routes/index')({io: app.io, db});
var admin_placar = require('./routes/admin')({io: app.io, db});


app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true}))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/placar', placar)
app.use('/admin_placar', admin_placar)

app.use(express.static('public'))
app.use(session({
    secret: 'softwarepro',
    resave: true,
    saveUninitialized: true
}))

const init = async() => {
connection = await mysql.createConnection(
        { 

          host:'us-cdbr-iron-east-05.cleardb.net',
          user:'bac7187b8e72e9',
          password: '593fdea1',
          database:'heroku_da351e278e4b625', 
          
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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500)
  res.render('error')
  })

var port = normalizePort(process.env.PORT || '3000')
console.log('FutibaClub rodando na porta 3000')
app.set('port', port)
/**
 * Create HTTP server.
 */
var server = http.createServer(app)
app.io.attach(server)
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)
/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}
/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
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
/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address()
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  debug('Listening on ' + bind)
   }

}

init()

