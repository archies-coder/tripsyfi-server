const express = require('express')
const bodyparser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

//Express App
const app = express()

//Body Parser
app.use(bodyparser.json())

//CORS
app.use(cors());

const userRoute = require('./app/routes/user.route')
app.use(userRoute)
const loginRoute = require('./app/routes/login.route')
app.use(loginRoute)

const dbURI = 'mongodb://localhost:27017/tripsyfi'

mongoose.connect(dbURI, { 
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
    .then(()=>{
        console.log(`connected db ${dbURI}`)
    })
    .catch(err=>console.log(err))

const PORT = process.env.PORT || 8080

app.listen(PORT,()=>{
    console.log(`Server runnng on port ${PORT}`)
})