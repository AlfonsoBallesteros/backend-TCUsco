const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const UserSchema = new Schema({
    photo:{
        type: String
    },
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    cedula: {
        type: String
    },
    date_nacimiento: {
        type: Date
    },
    direccion:{
        type: String
    },
    celular:{
        type: String
    },
    genero:{
        type: String
    },
    ocupacion:{
        type: String
    },
    carrera:{
        type: String
    },
    codigo: {
        type: String, 
        required: true
    },
    password: {
        type: String,
        required: true
    },  
    like:{
        type: Number
    },
    rol:{
        type: String
    },
    estado:{
        type: String
    }
},{
    timestamps: true
})

module.exports = User = mongoose.model('users', UserSchema)
