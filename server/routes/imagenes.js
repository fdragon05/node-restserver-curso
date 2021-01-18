const express = require('express');
const fs = require('fs');
const path = require('path');

const { verifivatokenImg } = require('../middlewares/autentificacion');

let app = express();


app.get('/imagen/:tipo/:img',verifivatokenImg,  (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImg = `./uploads/${ tipo }/${ img }`;

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${ img }`);

    if( fs.existsSync(pathImagen) ){
        res.sendFile(pathImagen);
    }else{
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagePath);
    }


    

});






module.exports = app;