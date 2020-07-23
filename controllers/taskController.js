const Task = require("../models/Task")
const Project = require("../models/Project")
const {validationResult} = require("express-validator")

//crea nueva tarea
exports.createTask = async (req, res) => {

    //revisar errores
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    
    
    try {
        //extraer project y comprobar que existe
        const {project} = req.body

        const projectExists = await Project.findById(project)
        if (!projectExists) {
            return res.status(404).json({msg: "Project not found"})
        }

        //revisar si proyecto actual pertenece al usuario autenticado
        if (projectExists.creator.toString() !== req.user.id) {
            return res.status(401).json({msg: "User not authorized"})
        }

        //creamos tarea
        const task = new Task(req.body)
        await task.save()
        res.json({task})

    } catch (error) {
        console.log(error)
        res.status(500).send("There was an error")
    }
}

exports.getTasks = async (req, res) => {

    try {
        //extraer project y comprobar que existe
        const {project} = req.query

        const projectExists = await Project.findById(project)
        if (!projectExists) {
            return res.status(404).json({msg: "Project not found"})
        }

        //revisar si proyecto actual pertenece al usuario autenticado
        if (projectExists.creator.toString() !== req.user.id) {
            return res.status(401).json({msg: "User not authorized"})
        }

        //obtener tareas por projecto
        const tasks = await Task.find({project}).sort({date: -1})
        res.json({tasks})
        

    } catch (error) {
        console.log(error)
        res.status(500).send("There was an error")
    }
}

//actualizar tarea
exports.updateTask = async (req, res) => {
    try {
        //extraer project y comprobar que existe
        
        const {project, name, status} = req.body

        //existe tarea?
        let task = await Task.findById(req.params.id)
        if (!task) {
            return res.status(404).json({msg: "Task not found"})
        }

        const projectExists = await Project.findById(project)
        
        //revisar si proyecto actual pertenece al usuario autenticado
        if (projectExists.creator.toString() !== req.user.id) {
            return res.status(401).json({msg: "User not authorized"})
        }
        
        //crear objeto con nueva info
        const newTask = {}

        newTask.name = name
        newTask.status = status
        
        //save task
        task = await Task.findOneAndUpdate({_id: req.params.id}, newTask, {new: true})

        res.json({task})

    } catch (error) {
        console.log(error)
        res.status(500).send("There was an error")
    }
}

//eliminar tarea
exports.removeTask = async (req, res) => {
    try {
        //extraer project y comprobar que existe
        console.log(req.query)
        const {project} = req.query

        //existe tarea?
        let task = await Task.findById(req.params.id)
        if (!task) {
            return res.status(404).json({msg: "Task not found"})
        }

        const projectExists = await Project.findById(project)
        
        //revisar si proyecto actual pertenece al usuario autenticado
        if (projectExists.creator.toString() !== req.user.id) {
            return res.status(401).json({msg: "User not authorized"})
        }
        
        //elimina
        await Task.findByIdAndRemove({_id: req.params.id})
        res.json({msg: "Task deleted"})

    } catch (error) {
        console.log(error)
        res.status(500).send("There was an error")
    }
}