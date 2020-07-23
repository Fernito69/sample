const express = require("express")
const router = express.Router()
const taskController = require("../controllers/taskController")
const auth = require("../middleware/auth")
const {check} = require("express-validator")

//crear tarea
//api/tasks
router.post("/",    
    auth,
    [
        check("name", "Name not valid").not().isEmpty(),
        check("project", "Project not valid").not().isEmpty(),
    ],
    taskController.createTask
)

//obtener tareas por project
router.get("/",
    auth,
    taskController.getTasks
)

//actualizar tarea
router.put("/:id",
    auth,
    taskController.updateTask
)

//eliminar tarea
router.delete("/:id",
    auth,
    taskController.removeTask
)

module.exports = router