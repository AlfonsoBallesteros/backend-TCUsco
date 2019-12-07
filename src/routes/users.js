const { Router } = require('express');
const auth = require("../middleware/auth");
const User = require('../models/User');
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const router = Router();

router.get("/", async (req, res) => {
        const users = await User.find();
        res.send(users);
})

router.post('/', (req, res) => {
    //recuperamos los datos que viene de la vista
        const {photo, name, lastName, cedula, date, dir, tel, gender, ocupation, carrer, codigo, password, rol, estado, like} = req.body;
        //igualamos a los que tenemos en BD
        const newUser = new User({
            photo: photo,
            first_name: name, 
            last_name: lastName, 
            cedula: cedula, 
            date_nacimiento: date, 
            direccion: dir, 
            genero: gender, 
            celular: tel,
            ocupacion: ocupation, 
            carrera: carrer, 
            codigo: codigo, 
            password:  password,
            rol: rol,
            estado: estado,
            like: like
        });
        //Buscamos si existe el codigo
        User.findOne({
            codigo: codigo
        })  
            .then(user => {
                if (!user) {
                     //encriptamos la contraseña
                        //crear el usuarios
                        User.create(newUser)
                            .then(user => {
                                res.json({
                                    ok: true,
                                    status: user.codigo + ' Registered!' 
                                })
                            })
                            .catch(err => {
                                res.send('error: ' + err)
                            })
                } else {
                    res.json({ 
                        ok: false,
                        error: 'Codigo ya existe'
                     })
                }
            })
            .catch(err => {
                res.send('error: ' + err)
            })
});

router.post('/login', (req, res) => {
    //buscamos el codigo 
        User.findOne({
            codigo: req.body.codigo
        })
            .then(user => {
                if (user) {
                    //comparamos el password encryptado con el que viene de la vista
                    if ((req.body.password == user.password)) {
                       // arquitectura de token 
                        const payload = {
                            _id: user._id,
                            photo: user.photo,
                            first_name: user.first_name, 
                            last_name: user.last_name, 
                            cedula: user.cedula, 
                            date_nacimiento: user.date_nacimiento, 
                            direccion: user.direccion, 
                            genero: user.genero, 
                            celular: user. celular,
                            ocupacion: user.ocupacion, 
                            carrera: user.carrera, 
                            codigo: user.codigo,
                            password: user.password,
                            rol: user.rol,
                            estado: user.estado,
                            like: user.like  
                        }
                        //creamos token a traves del payload
                        let token = jwt.sign(payload, process.env.SECRET_KEY, {
                            expiresIn: '30d'
                        })
                        //respuesta
                        res.json({
                            ok: true,
                            token: token,
                           // id: user._id
                        })
                    } else {
                        // Passwords no es igual
                        res.json({ 
                            ok: false,
                            message: 'La contraseña no es correcta' 
                        })
                    }
                } else {
                     // el usuario no existe
                    res.json({
                        ok: false,
                        message: 'El usuario no existe' 
                    })
                }
            })
            .catch(err => {
                res.send('error: ' + err)
            })
});

router.get('/getUser', auth, (req, res) => {
    //recuperamos el usuarios atraves del token
    const usuario = req.user
    res.json({
        ok: true,
        usuario
    });
     
});

router.put('/update',auth, async (req, res) => {
    //recogemos los datos que vienen de la vista
        const {_id, photo, name, lastname, date, dir, tel, gender, ocupation, carrer, password} = req.body;
        //Igualamos a los que tenemos en la BD
        await User.findOneAndUpdate({_id: req.user._id}, {
            _id: _id,
            photo: photo,
            first_name: name, 
            last_name: lastname, 
            date_nacimiento: date, 
            direccion: dir, 
            genero: gender, 
            celular: tel,
            ocupacion: ocupation, 
            carrera: carrer, 
            password:  password,
        }, (err, user) => {
            if ( err ) {
                res.json(err);
            };

            if ( !user ) {
                return res.json({
                    ok: false,
                    mensaje: 'No existe un usuario con ese ID'
                });
        }

        const payload = {
            _id: user._id,
            photo: user.photo,
            first_name: user.first_name, 
            last_name: user.last_name, 
            cedula: user.cedula, 
            date_nacimiento: user.date_nacimiento, 
            direccion: user.direccion, 
            genero: user.genero, 
            celular: user. celular,
            ocupacion: user.ocupacion, 
            carrera: user.carrera, 
            codigo: user.codigo,
            password: user.password
        }

        //creamos token a traves del payload
        let token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: '10h'
        })

        res.json({
            ok: true,
            token: token
        });
        });
}); 

router.get('/idUser',auth, async (req, res) => {
    res.json({
        ok: true,
        id: req.user._id
    });
});

router.get('/oneUser/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    res.json({
        ok: true,
        user
    });
});

module.exports = router;