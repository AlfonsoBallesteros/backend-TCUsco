const { Router } = require('express');
const Post = require('../models/Post');
const router = Router();

router.get('/', async (req, res) => {
    const post = await Post.find()
                .populate('id_usuario', [ '_id', 'first_name', 'last_name', 'photo'])
                .exec();/*(err, data) =>{
                    if (err) return handleError(err);
                    res.json(data)
                })*/
    res.json(post)
});

router.post('/', (req, res) => {
    const { id_usuario, descripcion, lugar, ubicacion, like} = req.body
    const newPost = new Post({
        id_usuario: id_usuario, 
        descripcion: descripcion, 
        lugar: lugar, 
        ubicacion: ubicacion, 
        like: like
    })
    Post.create( newPost ).then( async postdb => {
        await postdb.populate('id_usuario', [ '_id', 'first_name', 'last_name', 'photo']).execPopulate();
        res.json({
            ok: true,
            post: postdb
        })
    }).catch( err => {
        res.json(err)
    });
});

module.exports = router;