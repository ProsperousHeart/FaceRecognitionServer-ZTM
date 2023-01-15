const handleProfile = (req, res, db) => {
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
}

module.exports = {
    handleProfile: handleProfile
};