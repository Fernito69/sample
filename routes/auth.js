const express = require("express")
const router = express.Router()
const {check} = require("express-validator")
const authController = require("../controllers/authController")
const auth = require("../middleware/auth")

//iniciar sesión
//api/auth
router.post("/",    
    authController.autenticarUser     
)

//obtiene usuario autenticado
router.get("/",
    auth,
    authController.whichUserIsAuth
)

module.exports = router