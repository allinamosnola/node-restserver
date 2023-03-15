const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion',
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const usuarioAutenticado = await Usuario.findById(uid);

        if (!usuarioAutenticado) {
            return res.status(401).json({
                msg: 'Usuario no existe en BD',
            });
        }

        //verificar que uid está vigente/activo
        if (!usuarioAutenticado.estado) {
            return res.status(401).json({
                msg: 'Token no válido - usuario estado: false',
            });
        }

        req.uid = uid;
        req.usuario = usuarioAutenticado;

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido',
        });
    }
};

module.exports = {
    validarJWT,
};
