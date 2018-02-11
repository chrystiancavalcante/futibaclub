const express = require ('express')
const app = express.Router()

const init = connection => {
    app.use((req, res, next) =>{
        if(!req.session.user ){
            res.redirect('/login')
        }else{
            next()
        }
    })
app.get('/', async(req, res) => {
    const [classification, fields] = await connection.execute(
         `select users.id,
    users.name,
    sum(guessings.score) as score
    from users left join guessings
    on guessings.user_id = users.id
    group by guessings.user_id 
    order by score DESC`,[
        req.session.user.id
    ])
 
    res.render('classification',{
     classification 
        
    })
})
return app

}
module.exports = init