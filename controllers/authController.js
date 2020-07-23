const User = require("../models/User")
const bcryptjs = require("bcryptjs")
const {validationResult} = require("express-validator")
const jwt = require("jsonwebtoken")

exports.autenticarUser = async (req, res) => {

    //revisa por errores
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const {email, password} = req.body

    try {
        //es usuario registrado?
        let user = await User.findOne({email})

        if (!user) {
            return res.status(400).json({msg: "User doesn't exist"})
        }

        //revisar pass
        const passCorrecto = await bcryptjs.compare(password, user.password)

        if(!passCorrecto) {
            return res.status(400).json({msg: "Wrong password"})
        }

        //crear jsonwebtoken
        const payload = {
            user: {
                id: user.id
            }
        }

        //firmar JWT
        jwt.sign(payload, process.env.SECRET, {
            expiresIn: 3600
        }, (error, token) => {
            if(error) throw error
            
            //confirmacion
            res.json({ token: token }) //tb puede ser {token} (porque llave y valor se llaman igual)
        })


    } catch (error) {
        console.log(error)
    }
}

exports.whichUserIsAuth = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password")
        res.json({user})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "There was an error"})
    }
}