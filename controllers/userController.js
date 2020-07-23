const User = require("../models/User")
const bcryptjs = require("bcryptjs")
const {validationResult} = require("express-validator")
const jwt = require("jsonwebtoken")

exports.createUser = async (req, res) => {

    //revisa por errores
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    //extraer email y pass
    const {email, password} = req.body

    try {
        //revisar que el usuario sea único
        let user = await User.findOne({email})

        if(user) {
            return res.status(400).json({msg: "The user already exists"})
        }

        //crea nuevo usuario
        user = new User(req.body)

        //hashear el pass
        const salt = await bcryptjs.genSalt(10)
        user.password = await bcryptjs.hash(password, salt)

        //guarda nuevo usuario
        await user.save()

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
        res.status(400).send("There was an error")
    }
}