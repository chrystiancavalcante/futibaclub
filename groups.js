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
        const [groups, fields] = await connection.execute('SELECT groups.*, groups_users.role FROM groups left join groups_users on groups.id = groups_users.group_id and groups_users.user_id = ?',[
            req.session.user.id
        ])
        res.render('groups', {
            groups
        }) 

    })
    
    app.get('/:id', async(req, res) =>{
        const [group] = await connection.execute('SELECT groups.*, groups_users.role FROM groups LEFT JOIN groups_users ON groups_users.group_id = groups.id and groups_users.user_id = ? WHERE groups.id = ?',[
            req.session.user.id,
            req.params.id
        ])
        const [pendings] = await connection.execute('SELECT groups_users.*, users.name FROM groups_users INNER JOIN users ON groups_users.user_id = users.id and groups_users.group_id = ? AND groups_users.role like "Pending"',[
            req.params.id
        ])
        const [games] = await connection.execute('SELECT games.*, guessings.result_a as guess_a, guessings.result_b as guess_b, guessings.score FROM games LEFT JOIN guessings ON games.id = guessings.game_id AND guessings.user_id = ? AND guessings.groups_user_id = ?',[
        req.session.user.id,
        req.params.id  
        ])
    
        res.render('group', {
            group: group[0],
            pendings,
            games
        })
    
    })

    app.post('/:id', async(req, res) =>{
        const guessings = []
        Object
        .keys(req.body)
        .forEach( team => {
         const parts = team.split('_')
         const game = {
             game_id:  parts[1],
             result_a:  req.body[team].a,
             result_b:  req.body[team].b
         }
         guessings.push(game)    
        })
        const batch = guessings.map( guess => {
         return connection.execute('insert into guessings (result_a, result_b, game_id, group_user_id, user_id) values (?,?,?,?,?)',[
            guess.result_a,
           guess.result_b,
           guess.game_id,
           req.params.id,
           req.session.user.id
            ])  
        })
        await Promise.all(batch)
        
        res.redirect('/groups/'+req.params.id)
    })
    app.get('/:id/pending/:idGU/:op', async(req, res) =>{
        const [group] = await connection.execute('SELECT * FROM groups LEFT JOIN groups_users ON groups_users.group_id = groups.id AND groups_users.user_id = ? WHERE groups.id = ?',[
            req.session.user.id,
            req.params.id
        ])
        if(group.length === 0 || group[0].role !== 'owner'){
            res.redirect('/groups/'+req.params.id)
        }else{
       
        if(req.params.op === 'yes'){
            await connection.execute('update groups_users set role = "user" WHERE id = ? limit 1',[
                req.params.idGU
            ])
            res.redirect('/groups/'+req.params.id)
        }else{
            await connection.execute('delete FROM groups_users WHERE id = ? limit 1',[
                req.params.idGU
            ])
            res.redirect('/groups/'+req.params.id)
        }
      }
    })
    app.get('/:id/join', async(req, res) =>{
      const [rows, fields] = await connection.execute('SELECT * FROM groups_users WHERE user_id = ? AND group_id = ?',[
          req.session.user.id,
          req.params.id
      ])
      if(rows.length > 0){
          res.redirect('/groups')
      }else{
        await connection.execute('insert into groups_users(group_id, user_id, role) values (?,?,?)',[
            req.params.id,
            req.session.user.id,
            'pending'
        ])
        res.redirect('/groups')
      }
    })
    app.post('/', async(req, res) =>{
    const [insertedId, insertedFilds] = await connection.execute('insert into groups (name) values (?)', [
            req.body.name
        ])
        await connection.execute('insert into groups_users(group_id, user_id, role) values (?,?,?)',[
            insertedId.insertId,
            req.session.user.id,
            'owner'
        ])
        res.redirect('/groups')
    })
    app.get('/delete/:id', async(req, res) => {
        await connection.execute('delete FROM groups where id = ? limit 1', [
            req.params.id
        ])
        res.redirect('/groups')
    })

    return app
}


module.exports = init