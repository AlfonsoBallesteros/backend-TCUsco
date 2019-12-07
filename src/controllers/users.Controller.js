const bcrypt = require('bcrypt')

const useCtrl = {};

const User = require('../models/User');

useCtrl.getUsers = async (req, res) => {
    const users = await User.find();
    res.json(users);
}

useCtrl.createUsers = (req, res) => {
    //recuperamos los datos que viene de la vista
    const {photo, name, lastname, cedula, date, dir, tel, gender, ocupation, carrer, codigo, password} = req.body;
    //igualamos a los que tenemos en BD
    const newUser = new User({
        photo: photo,
        first_name: name, 
        last_name: lastname, 
        cedula: cedula, 
        date_nacimiento: date, 
        direccion: dir, 
        genero: gender, 
        celular: tel,
        ocupacion: ocupation, 
        carrera: carrer, 
        codigo: codigo, 
        password:  password
    });
    User.findOne({
        //Buscamos si existe el codigo
        codigo: codigo
    })
        .then(user => {
            if (!user) {
                //encriptamos la contraseña
                bcrypt.hash(password, 10, (err, hash) => {
                    newUser.password = hash
                    //crear el usuarios
                    User.create(newUser)
                        .then(user => {
                            res.json({ status: user.codigo + ' Registered!' })
                        })
                        .catch(err => {
                            res.send('error: ' + err)
                        })
                })
            } else {
                res.json({ error: 'Codigo ya existe' })
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
}

useCtrl.getUser = (req, res) => {

    //recuperamos el usuarios atraves del token
    res.status(200).json(req.user);
}

useCtrl.login = (req, res) => {
    //buscamos el codigo 
    User.findOne({
        codigo: req.body.codigo
    })
        .then(user => {
            if (user) {
                //comparamos el password encryptado con el que viene de la vista
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    // arquitectura de token 
                    const payload = {
                        _id: user._id,
                        photo: user.photo,
                        first_name: user.first_name, 
                        last_name: user.last_name, 
                        cedula: user.date_nacimiento, 
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
                        expiresIn: 1440 
                    })
                    //respuesta
                    res.json({
                        ok: true,
                        token: token,
                        //id: user._id
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
}

useCtrl.updateUser = async (req, res) => {
    //recogemos los datos que vienen de la vista
    const {photo, name, lastname, date, dir, tel, gender, ocupation, carrer, password} = req.body;
    //Igualamos a los que tenemos en la BD
    await User.findOneAndUpdate({_id: req.params.id}, {
        photo: photo,
        first_name: name, 
        last_name: lastname, 
        date_nacimiento: date, 
        direccion: dir, 
        genero: gender, 
        celular: tel,
        ocupacion: ocupation, 
        carrera: carrer, 
        password:  password
    });
    res.json( 'Nota Actualizada');
}


module.exports = useCtrl;