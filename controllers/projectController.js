const Project = require("../models/Project")
const {validationResult} = require("express-validator")

exports.createProject = async (req, res) => {

    //revisar errores
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    try {
        //crear nuevo proyecto
        const project = new Project(req.body)

        //guardar creador via jwt
        project.creator = req.user.id

        //guardar project
        project.save()
        res.json(project)
    } catch (error) {
        console.log(error)
        res.status(500).send("There was an error")
    }
}

//obotiene proyectos usuario actual
exports.getProjects = async (req, res) => {

    try {
        const projects = await Project.find({creator: req.user.id})
        res.json({projects})
    } catch (error) {
        console.log(error)
        res.status(500).send("There was an error")
    }
}

//actualiza project
exports.updateProject = async (req, res) => {

    //revisar errores
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    //extraer info project
    const {name} = req.body
    const newProject = {}

    // "pensando a futuro" (no entiendo ni chucha a qué se refiere)
    if (name) {
        newProject.name = name
    }

    try {
        //revisar id
        let project = await Project.findById(req.params.id)

        //revisar si existe project
        if(!project) {
            return res.status(404).json({msg: "Project not found"})
        }

        //verificar creador proyecto
        if (project.creator.toString() !== req.user.id) {
            return res.status(401).json({msg: "User not authorized"})
        }

        //actualizar
        project = await Project.findOneAndUpdate({_id: req.params.id}, {$set: newProject}, {new: true})

        res.json({project})

    } catch (error) {
        console.log(error)
        res.status(500).send("There was an error")
    }
}

//eliminar project
exports.deleteProject = async (req, res) => {
    
    try {
        //revisar id
        let project = await Project.findById(req.params.id)

        //revisar si existe project
        if(!project) {
            return res.status(404).json({msg: "Project not found"})
        }

        //verificar creador proyecto
        if (project.creator.toString() !== req.user.id) {
            return res.status(401).json({msg: "User not authorized"})
        }

        //eliminar
        await Project.findOneAndRemove({_id: req.params.id})
        res.json({msg: "Project deleted"})

    } catch (error) {
        console.log(error)
        res.status(500).send("There was an error")
    }
}