const mongoose = require("mongoose")

const TasksSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now()
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project" // name of model
    }
})

module.exports = mongoose.model("Task", TasksSchema)