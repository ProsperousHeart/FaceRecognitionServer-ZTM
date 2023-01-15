const handleRegister = (req, res, db, bcrypt) => {
    // create new profile
    const { email, name, password} = req.body // destructuring    
    console.log("reg body:", req.body);
    console.log("email:", email);
    console.log("password:", password);
    //bcrypt.hash(password, null, null, function(err, hash) {
    //    // Store hash in your password DB.
    //    console.log(hash);
    //});
    //db.users.push({
    //    id: '126',
    //    name: name,
    //    email: email,
    //    //password: password,
    //    entries: 0,
    //    joined: new Date()
    //})
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
                .returning('*')
                .insert({
                    email: loginEmail[0].email,
                    name: name,
                    joined: new Date()
                //}).then(console.log)
                })
                //res.json(db_hc.users[db_hc.users.length - 1]);
                .then(user => {
                    res.status(200).json(user[0]);
                })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => {
        console.log(err);
        res.status(400).json('unable to register');
    })
}

module.exports = {
    handleRegister: handleRegister
};