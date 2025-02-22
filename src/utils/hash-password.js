import bcrypt from 'bcrypt'
import { log } from 'console'

const saltRounds = 10

const hashPassword = function (plainPassword) {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(plainPassword, salt);
    return hash
}

const checkPassword =  function (plainPassword, hash) {
    const result = bcrypt.compareSync(plainPassword, hash);
    return result
}

export {hashPassword, checkPassword}