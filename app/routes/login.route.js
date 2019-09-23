const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const UserModel = require('../models/user.model')

router.post('/api/login', async (req, res, next) => {
    const { email, password } = req.body
    const existingUser = await UserModel.findOne({ email })
    if (!existingUser) {
        console.log('No user with that email')
        res.status(400).send('wrong credentials')
        return req.next()
    }
    const valid = await bcrypt.compare(password, existingUser.password)
    if (!valid) {
        res.status(401).send('Wrong pass Bro')
        return req.next()
    }
    req.session.userId = existingUser.id
    req.session.user = existingUser
    const sid = req.sessionID
    return res.send({
        user: existingUser,
        userId: existingUser.id,
        sid: sid,
    })
})

router.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log('Couldnt destroy')
        }
        res.clearCookie('SESS_SID')
        res.send('logged out')
    })
})

module.exports = router
