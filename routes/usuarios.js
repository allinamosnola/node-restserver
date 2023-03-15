const { Router } = require('express');
const { check } = require('express-validator');
const Role = require('../models/rol');
const {
    esRolValido,
    correoExiste,
    existeUsuarioPorId,
} = require('../helpers/db-validators');
const {
    usuariosGet,
    usuariosPost,
    usuariosDelete,
    usuariosPatch,
    usuariosPut,
} = require('../comtrollers/usuarios');

const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRol,
} = require('../middlewares');

const router = Router();

router.get('/', usuariosGet);

router.put(
    '/:id',
    [
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existeUsuarioPorId),
        check('rol').custom(esRolValido),
        validarCampos,
    ],
    usuariosPut
);
router.post(
    '/',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password debe tener más de 6 letras').isLength({
            min: 6,
        }),
        check('correo', 'El correo no es válido')
            .isEmail()
            .custom(correoExiste),

        // check('correo').custom(correoExiste),
        //check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
        check('rol').custom(esRolValido),
        validarCampos,
    ],
    usuariosPost
);
router.delete(
    '/:id',
    [
        validarJWT,
        // esAdminRole,
        tieneRol('ADMIN_ROLE', 'NOSE_ROLE'),
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existeUsuarioPorId),
        validarCampos,
    ],
    usuariosDelete
);
router.patch('/', usuariosPatch);

module.exports = router;
