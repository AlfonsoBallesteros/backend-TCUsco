const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema({
    id_usuario:{
        type:Schema.Types.ObjectId,
        ref: 'users',
    },
    id_post:{
        type:Schema.Types.ObjectId,
        ref: 'posts',
    },
    descripcion:{
        type: String
    }
}, {
    timestamps: true
})

module.exports = Comment = mongoose.model('comment', CommentSchema)