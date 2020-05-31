const mongoose = require('mongoose');

// Define a schema
const Schema = mongoose.Schema;
const courseSchema = new Schema({
    topic: String,
    title: String,
    image: String,
    price: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
        fullname: String
    },
    students:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student"
        }
    ]
});

// Compile model from schema
module.exports = mongoose.model('Course', courseSchema);