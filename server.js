const express = require('express')
const bodyparser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const { dbURI, SECRET } = require('./app/config/keys')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const env = require('dotenv').config()

//Express App
const app = express()

//Body Parser
app.use(bodyparser.json())

//CORS
app.use(cors())

if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1) // trust first proxy
}

const options = {
    url: dbURI,
    ttl: 365 * 24 * 60 * 60,
}

const sess = {
    store: new MongoStore(options),
    secure: process.env.NODE_ENV === 'production',
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365,
    },
}

//use sessions for tracking login
app.use(session(sess))

const userRoute = require('./app/routes/user.route')
app.use(userRoute)
const loginRoute = require('./app/routes/login.route')
app.use(loginRoute)

app.get('/', (req, res) => {
    res.send('Working')
})

mongoose
    .connect(dbURI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => {
        console.log(`connected`)
    })

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`Server runnng on port ${PORT}`)
})
