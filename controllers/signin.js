//const handleSignIn = (req, res, db, bcrypt) => {
const handleSignIn = (db, bcrypt) => (req, res) => {
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
}

module.exports = {
    handleSignIn: handleSignIn
};