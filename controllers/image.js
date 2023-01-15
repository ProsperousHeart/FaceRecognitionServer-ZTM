const handleIMG = (req, res, db) => {
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
}

module.exports = {
    handleIMG: handleIMG
};