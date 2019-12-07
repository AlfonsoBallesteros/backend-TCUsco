const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
    
    id_usuario:{
        type:Schema.Types.ObjectId,
        ref: 'users',
    },
    descripcion:{
        type: String
    },
    lugar:{
        type: String
    },
    ubicacion:{
        type: String
    },
    like:{
        type: Number
    }
},{
    timestamps: true
})

module.exports = Post = mongoose.model('posts', PostSchema)