const mongoose = require('mongoose');

// Define a schema
let Schema = mongoose.Schema;
let studentSchema = new Schema({
    rating: Number,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
        fullname: String,
        email: String
    }
});

// Compile model from schema
module.exports = mongoose.model('Student', studentSchema);