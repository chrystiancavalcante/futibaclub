const express = require ('express')
const app = express.Router()
const fs = require('fs')
const crypto = require ('crypto')
const alg ='aes-256-ctr'



const init = connection => {
app.get('/', async(req, res)=>{
    
    res.render('home')
})
app.get('/logout',(req, res) =>{
    req.session.destroy( err => {
        res.redirect('/')
    })
})
app.get('/login', (req, res) =>{
    res.render('login', {error: false})
})
app.post('/new-account', async(req, res) => {
    const [rows, fields] = await connection.execute('select * from users where email = ?', [req.body.email]) 
    if(rows.length === 0){
        const { name, email, passwd } = req.body
        function crypt(Text){    
        const cipher = crypto.createCipher(alg, passwd)
        const crypted = cipher.update(Text, 'utf8', 'hex')
        return crypted
        } 
      const [inserted, insertFields] = await connection.execute('insert into users (name, email, passwd, role) values(?,?,?,?)', [
       name,
       email,
       (crypt('passwd')),
       'user'
    ])
    const user = {
        id: inserted.insertId,
        name: name,
        role: 'user'

    }
    req.session.user = user
        res.redirect('/')

    }else{
        
        res.render('new-account', {
            error: 'Usuário já existente'
        })
    } 
    
})
app.post('/login', async(req, res) =>{
    const [rows, fields] = await connection.execute('select * from users where email = ?', [req.body.email])
    if(rows.length===0){
        res.render('login', { error: 'Usuário e/ou senha inválidos.'})
    }else{
            const pwd = req.body.passwd
            function crypt(Text){       
                const cipher = crypto.createCipher(alg, pwd)
                const crypted = cipher.update(Text, 'utf8', 'hex')
                return crypted
            } 
            if(rows[0].passwd===(crypt('passwd'))){
         
            const userDb = rows[0]
            const user = {
                id: userDb.id,
                name: userDb.name,
                role: userDb.role

            }
            req.session.user = user
            res.redirect('/')
    }else{
            res.render('login', { error: 'Usuário e/ou senha enválidos.'})
        }
    }   
})
app.get('/new-account',(req, res)=>{
    res.render('new-account', {error: false})
})

return app

}
module.exports = init