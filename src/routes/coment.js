const { Router } = require('express');
const Coment = require('../models/Comment');
const router = Router();

router.get('/:id', async (req, res) => {
    const id_post = req.params.id;
    const comment = await Coment.find({id_post: id_post})
                    .populate('id_usuario', [ '_id', 'first_name', 'last_name', 'photo'])
                    .exec();
    res.json(comment);

});

router.post('/', (req, res) => {
    const {id_post, id_usuario, descripcion} = req.body;
    const newcoment = new Coment({
        id_usuario: id_usuario,
        id_post: id_post,
        descripcion: descripcion,
    });
    newcoment.save();
    res.json({
        ok: true,
        message: 'Coemntario creado'
    });
    
});

router.get('/count/:id', async (req, res) =>{
    const id_post = req.params.id;
    const comment = await Coment.countDocuments({id_post: id_post}, (err, count) =>{
        if (err) return handleError(err);
        res.json(count);
    })
    //res.json(comment);
});

module.exports = router;