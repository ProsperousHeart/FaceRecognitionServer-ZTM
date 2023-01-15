// since this was made as part of my learning during a bootcamp, code is messy & unclean
// I decided to keep it with everything messy to be able to see what I did prior
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const register = require("./controllers/register");

const db = require('knex')({
    client: 'pg',
    connection: { // connection: process.env.PG_CONNECTION_STRING,
        host : '127.0.0.1',
        port : 5432,
        // user : 'sbrain',
        user: 'postgres',
        // password : 'Sm4rtBr41n2023!',
        password : 'P0stgr3SQL69!',
        database : "smart-brain"
    }
    //searchPath: ['knex', 'public'],
});

const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

// const db_hc = {
//     users: [
//         {
//             id: '123',
//             name: 'MJ',
//             email: 'spiderman4me@gmail.com',
//             password: 'passon',
//             entries: 0,
//             joined: new Date()
//         },
//         {
//             id: '124',
//             name: 'Silar',
//             email: 'TheGreat4ever@gmail.com',
//             password: 'fake',
//             entries: 0,
//             joined: new Date()
//         }
//     ]
// }

function getUser(id) {
    let found = false;
    db.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    })
    if (!found) {
        res.status(400).json('not found');
    }
}

app.get('/', (req, res) => {
    //res.send('this is working');
    //res.send(db.users);
    res.json('Welcome home!');
})

/*
    Routes:
    / --> res = thsi is working
    /signin --> POST = success/fail (since sending PW)
    /register --> POST = user
    /profile:userID --> GET = user
    /image --> PUT --> user
 */

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) }) // dependency injuection

app.post('/signin', (req, res) => {
    // check input with current list of users & if passwords match
    
    // Load hash from your password DB.

    // if (req.body.email === db.users[0].email &&
    //     req.body.password === db.users[0].password) {
    //         //res.json('success');
    //         res.status(200).json(db.users[0]);
    // } else {
    //     res.status(400).json('Error logging in');
    // }
    db.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            // console.log(data[0]);
            //bcrypt.compare(req.body.password, data[0], function(err, res) {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
            // console.log("isValid:", isValid);
            if (isValid) {
                return db.select('*').from('users')
                    .where('email', '=', req.body.email)
                    .then(user => {
                        res.status(200).json(user[0])
                    })
                    .catch(err => res.status(400).json('unable to get user'))
            }
            res.status(400).json('unable to sign in - wrong credentials')
        })
        .catch(err => res.status(400).json('unable to sign in'))
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    //let found = false;
    //db.users.forEach(user => {
    //    if (user.id === id) {
    //        found = true;
    //        return res.json(user);
    //    }
    //})
    db.select('*').from('users').where({id}) // can do this because property & value are the same
//        id: id
//    })
        .then(user => {
            if (user.length) {
                res.status(200).json(user[0]);
            } else {
                res.status(400).json('Error getting user.');
            }
        });
//    if (!found) {
//        res.status(400).json('not found');
//    }
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    // //const user = getUser(id)
    // let found = false;
    // db.users.forEach(user => {
    //     if (user.id === id) {
    //         found = true;
    //         user.entries++;
    //         return res.json(user.entries);
    //     }
    // })
    // if (!found) {
    //     res.status(400).json('not found');
    // }
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.status(200).json(entries[0].entries)
        })
        .catch(err => res.status(400).json('Unable to get count'))
})

//bcrypt.compare("veggies", hash, function(err, res) {
//    // res = false
//});

app.listen(3000, () => {
    console.log('app is running on port 3000');
});