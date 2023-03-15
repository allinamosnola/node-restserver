const { Router } = require('express');
const { check } = require('express-validator');
const Role = require('../models/rol');
const { validarCampos } = require('../middlewares/validar-campos');
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
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');

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
        esAdminRole,
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existeUsuarioPorId),
        validarCampos,
    ],
    usuariosDelete
);
router.patch('/', usuariosPatch);

module.exports = router;
