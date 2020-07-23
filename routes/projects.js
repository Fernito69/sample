const express = require("express")
const router = express.Router()
const projectController = require("../controllers/projectController")
const auth = require("../middleware/auth")
const {check} = require("express-validator")

//crear proyectos
//api/projects
router.post("/",
    auth,
    [
        check("name", "Project name is missing").not().isEmpty()
    ],
    projectController.createProject
)

//obtener proyectos
router.get("/",
    auth,
    projectController.getProjects
)

//actualizar proyectos via ID
router.put("/:id",
    auth,
    [
        check("name", "Project name is missing").not().isEmpty()
    ],
    projectController.updateProject
)

//eliminar proyecto
router.delete("/:id",
    auth,   
    projectController.deleteProject
)

module.exports = router