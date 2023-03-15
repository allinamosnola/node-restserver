const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const usuariosGet = async (req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments({ estado: true }),
        Usuario.find({ estado: true })
            .skip(Number(desde))
            .limit(Number(limite)),
    ]);

    res.json({
        total,
        usuarios,
    });
};

const usuariosPost = async (req, res) => {
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    // Guardar en BD
    await usuario.save();

    res.status(201).json({
        msg: 'post API - controlador',
        usuario,
    });
};

const usuariosPut = async (req, res) => {
    const { id } = req.params;
    console.log('🚀 ~ file: usuarios.js:38 ~ usuariosPut ~ id:', id);
    const { _id, password, google, correo, ...resto } = req.body;

    // TODO validar vs BD
    if (password) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuario);
};

const usuariosDelete = async (req, res) => {
    const { id } = req.params;

    const { usuarioAutenticado } = req;

    //borrado físico
    // const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
    res.json(usuario);
};

const usuariosPatch = (req, res) => {
    res.json({
        msg: 'patch API -controlador',
    });
};

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    usuariosPatch,
};
