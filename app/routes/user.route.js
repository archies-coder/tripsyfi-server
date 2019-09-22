const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const validator = require('validator')
const userModel = require('../models/user.model')

router.post('/api/register', async (req,res,next)=>{
    const {email, password} = req.body
    if(!validator.isEmail(email)){
        res.send('invalid email')
        return req.next()
    }
    if(validator.isEmpty(email)){
        res.send('empty email')
        return req.next()
    }
    if(validator.isEmpty(password)){
        res.send('empty password')
        return req.next()
    }
    if(!validator.isLength(password, {min: 5})){
        throw new Error('Short Password')
    }
    const existing = await userModel.findOne({email})
    if(existing){
        res.send('User Already Exists')
        return req.next()
    }
    const hashedPass = await bcrypt.hash(password,12)
    const User = new userModel({
        email,
        password: hashedPass
    })
    const createdUser = await User.save()
    .catch(err=>{
        console.log("Couldn't create User")
        return req.next()
    })
    const userId = createdUser._id.toString()
    return res.send({createdUser,userId})
})

module.exports = router