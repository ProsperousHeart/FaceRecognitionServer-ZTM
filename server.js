const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

const db = {
    users: [
        {
            id: '123',
            name: 'MJ',
            email: 'spiderman4me@gmail.com',
            password: 'passon',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Silar',
            email: 'TheGreat4ever@gmail.com',
            password: 'fake',
            entries: 0,
            joined: new Date()
        }
    ]
}

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
    res.send(db.users);
    //res.json(db.users);
})

/*
    Routes:
    / --> res = thsi is working
    /signin --> POST = success/fail (since sending PW)
    /register --> POST = user
    /profile:userID --> GET = user
    /image --> PUT --> user
 */

app.post('/register', (req, res) => {
    // create new profile
    const { email, name, password} = req.body // destructuring
    bcrypt.hash(password, null, null, function(err, hash) {
        // Store hash in your password DB.
        console.log(hash);
    });
    db.users.push({
        id: '126',
        name: name,
        email: email,
        //password: password,
        entries: 0,
        joined: new Date()
    })
    res.json(db.users[db.users.length - 1]);
})

app.post('/signin', (req, res) => {
    // check input with current list of users & if passwords match
    // Load hash from your password DB.
    //bcrypt.compare("bacon", hash, function(err, res) {
    //    // res == true
    //});
    if (req.body.email === db.users[0].email &&
        req.body.password === db.users[0].password) {
            //res.json('success');
            res.status(200).json(db.users[0]);
    } else {
        res.status(400).json('Error logging in');
    }
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
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
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    //const user = getUser(id)
    let found = false;
    db.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    })
    if (!found) {
        res.status(400).json('not found');
    }
})

//bcrypt.compare("veggies", hash, function(err, res) {
//    // res = false
//});

app.listen(3000, () => {
    console.log('app is running on port 3000');
});