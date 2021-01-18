const jwt = require('jsonwebtoken');


//=========================================
// Verificar Token
//=========================================
let verificarToken = ( req, res, next ) => {

    let token = req.get('token');

    jwt.verify( token, process.env.SEDD , (err, decoded) => {

        if( err ){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });

   // console.log(token);

    

   /*  res.json({
        token: token
    }); */

};

//=========================================
// Verificar Admin Role
//=========================================
let verificarAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {

        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
};

//=========================================
// Verificar token para imagen
//=========================================
let verifivatokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify( token, process.env.SEDD , (err, decoded) => {

        if( err ){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });

}

module.exports = {
    verificarToken,
    verificarAdmin_Role,
    verifivatokenImg
}