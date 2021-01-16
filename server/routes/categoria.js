const express = require('express');

let { verificarToken } = require('../middlewares/autentificacion');

let app = express();

let Categoria = require('../models/categoria');

const { verificarAdmin_Role } = require('../middlewares/autentificacion')

//=================================
// Mostar todas las categoria
//=================================
app.get('/categoria', verificarToken, ( req, res ) => {
    
    Categoria.find( {})
             .sort('descripcion')
             .populate('usuario', 'nombre email')
             .exec( ( err, categorias) => {

                if( err ) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }

                Categoria.count( {}, (err, count) => {
                    res.json({
                        ok: true,
                        categorias,
                        cuantos: count,
                    })
                })

             })
});

//=================================
// Mostar una categoria por ID
//=================================
app.get('/categoria/:id', verificarToken, ( req, res ) => {
    //Categoria.findById();

    let id = req.params.id;

    Categoria.findById(id, function (err, categoriaDB) {

        if(err){
            return res.status(500).json({
              ok: false,
              err
            });
          }

  
          if(!categoriaDB){
              return res.status(400).json({
                ok: false,
                err: {
                    messages: `No existe la categoria con el id: ${id}`
                }
              });
            }
          res.json({
            ok: true,
            categoria: categoriaDB
          });

    });

});

//=================================
// Crear una nueva categoria
//=================================
app.post('/categoria', verificarToken,  ( req, res ) => {
    //Regresa una nueva categoria
    // req.usuario._id
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err,categoriaDB) =>{

        if(err){
          return res.status(500).json({
            ok: false,
            err
          });
        }

        if(!categoriaDB){
            return res.status(400).json({
              ok: false,
              err
            });
          }
   
        res.json({
          ok: true,
          categoria: categoriaDB
        });
    });
});

//=================================
// Editar una categoria
//=================================
app.put('/categoria/:id', verificarToken, ( req, res ) => {

    let id = req.params.id;
    let body = req.body;

    Categoria.findByIdAndUpdate( id, body, {new:true, runValidators:true} , (err,categoriaDB) => {

        if(err){
            return res.status(500).json({
              ok: false,
              err
            });
          }

          if(!categoriaDB){
            return res.status(400).json({
              ok: false,
              err
            });
          }
          
          res.json({
            ok: true,
            categoria: categoriaDB
          });
    
    });
});

//=================================
// Eliminar una categoria
//=================================
app.delete('/categoria/:id', [verificarToken,verificarAdmin_Role], ( req, res ) => {
    //solo el Admin puede borrar categoria
    //Categoria.findByIdAndRemove();
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        if(err){
            return res.status(500).json({
              ok: false,
              err
            });
          }

          if(!categoriaDB){
            return res.status(400).json({
              ok: false,
              err: {
                  message: 'El id no existe'
              }
            });
          }
          
          res.json({
            ok: true,
            message: 'Categoria borrada'
          });
    
    });

});

module.exports = app;