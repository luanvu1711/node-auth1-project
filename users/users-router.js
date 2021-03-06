const express = require("express")
const bcrypt = require("bcrypt")
const Users = require("./users-model")
const restrict = require("../middleware/restrict")

const router = express.Router()

router.get("/api/users", restrict(), async (req,res,next) => {
    try{
        res.json(await Users.find())
    } catch(err){
        next(err)
    }
})

router.post("/api/register", async(req,res,next) => {
    try{
        const {username, password} = req.body
        const user = await Users.findBy({ username }).first()

        if(user){
            return res.status(409).json({
                message: "Username is already taken"
            })
        }

        const newUser = await Users.add({
            username,
            password: await bcrypt.hash(password, 14)
        })
        
        res.status(201).json(newUser)
    } catch(err){
        next(err)
    }
})

router.post("/api/login", async (req,res,next) => {
    try{
        const { username, password } = req.body
        const user = await Users.findBy({ username }).first()

        if(!user){
            return res.status(401).json({
                message: "Invalid Credentials"
            })
        }

        const passwordValid = await bcrypt.compare(password, user.password)
        if(!passwordValid){
            return res.status(401).json({
                message: "Invalid Credentials"
            })
        }

        req.session.user = user
        res.json({
            message: `Welcome back ${user.username}`
        })
    } catch(err){
        next(err)
    }
})

router.get("/api/logout", async (req,res,next) => {
    try{
        req.session.destroy((err) => {
            if(err){
                next(err)
            } else {
                res.status(204).end()
            }
        })
    } catch(err){
        next(err)
    }
})

module.exports = router