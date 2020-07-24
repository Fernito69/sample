const express = require("express")
const connectDB = require("./config/db")
const cors = require("cors")

//crear server
const app = express()

//conectar a db
connectDB()

//habilitar CORS
app.use(cors()) 

//habilitar express.json para leer datos que el usuario coloque
app.use(express.json({ extended: true }))

//puerto de la app
const port = process.env.PORT || 4000

//importar rutas
app.use("/api/users", require("./routes/users"))
app.use("/api/auth", require("./routes/auth"))
app.use("/api/projects", require("./routes/projects"))
app.use("/api/tasks", require("./routes/tasks"))

//run app
app.listen(port, '0.0.0.0', () =>  {
    console.log(`Server is working in port ${port}`) 
})   

//holi
console.log("Testing...")