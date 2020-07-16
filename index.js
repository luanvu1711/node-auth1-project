const express = require("express")
const helmet = require("helmet")
const cors = require("cors")
const session = require("express-session")
const KnexSessionStore = require("connect-session-knex")(session)
const db = require("./database/config")
const userRouter = require("./users/users-router")
const Knex = require("knex")

const server = express()
const port = 5000

server.use(helmet())
server.use(cors())
server.use(express.json())
server.use(session({
    resave:false,
    saveUninitialized: false,
    secret: "top of the world mama",
    store: new KnexSessionStore({
        knex:db,
        createTable:true
    })
}))
server.use(userRouter)

server.use((err,req,res,next) => {
    console.log(err)
    res.status(500).json({
        message: "Something went wrong"
    })
})

server.listen(port, () => {
    console.log(`Running at http://localhost${port}`)
})


