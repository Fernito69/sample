const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const {check} = require("express-validator")

//crear usuario
//api/users
router.post("/", 
    [
        check("name", "Username is not valid").not().isEmpty(),
        check("email", "Email is not valid").isEmail(),
        check("password", "The password must be at least 6 characters long").isLength({min: 6})
    ],
    userController.createUser
)

module.exports = router