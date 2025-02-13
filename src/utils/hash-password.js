import bcrypt from 'bcrypt'

const saltRounds = 10

const hashPassword = function (plainPassword) {
    let result
    bcrypt.genSaltSync(saltRounds, function(err, salt) {
        if (err) {
            throw new Error(`Error getting salt: ${err}`)
        }
        bcrypt.hashSync(plainPassword, salt, function (err, hash) {
            if (err) {
                throw new Error(`Error hasing password: ${err}`)
            }
            result = hash
        })
    })
    return result
}

const checkPassword =  function (plainPassword, hash) {
    bcrypt.compareSync(plainPassword, hash).then((result) => {
        return result
    });
}

export {hashPassword, checkPassword}