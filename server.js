// since this was made as part of my learning during a bootcamp, code is messy & unclean
// I decided to keep it with everything messy to be able to see what I did prior
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const register = require("./controllers/register");
const signIn = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

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

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) }) // dependency injuection;
// app.post('/signin', (req, res) => { signIn.handleSignIn(req, res, db, bcrypt) })
app.post('/signin', signIn.handleSignIn(db, bcrypt) )
app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db) })
app.put('/image', (req, res) => { image.handleIMG(req, res, db) })
app.post('/imageURL', (req, res) => { image.handleAPICall(req, res) })

//bcrypt.compare("veggies", hash, function(err, res) {
//    // res = false
//});

app.listen(3000, () => {
    console.log('app is running on port 3000');
});