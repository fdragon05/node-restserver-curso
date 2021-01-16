const express = require('express');

let { verificarToken } = require('../middlewares/autentificacion');

let app = express();

let Producto = require('../models/producto');

//=================================
// Mostar todas los productos
//=================================
app.get('/producto', verificarToken, ( req, res ) => {

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 5;
  limite = Number(limite);
    
  Producto.find( {disponible:true} )
           .skip(desde)
           .limit(limite)
           .sort('nombre')
           .populate('usuario', 'nombre email')
           .populate('categoria', 'descripcion')
           .exec( ( err, productos) => {

              if( err ) {
                  return res.status(400).json({
                      ok: false,
                      err
                  })
              }

              Producto.count( {}, (err, count) => {
                  res.json({
                      ok: true,
                      productos,
                      cuantos: count,
                  })
              })

           })
});

//=================================
// Mostar un Producto por ID
//=================================
app.get('/producto/:id', verificarToken, ( req, res ) => {
  //Categoria.findById();

  let id = req.params.id;

  Producto.findById(id, {disponible:true} )
           .sort('nombre')
           .populate('usuario', 'nombre email')
           .populate('categoria', 'descripcion')
           .exec( ( err, producto) => {

      if(err){
          return res.status(500).json({
            ok: false,
            err
          });
        }


        if(!producto){
            return res.status(400).json({
              ok: false,
              err: {
                  messages: `No existe el producto con el id: ${id}`
              }
            });
          }
        res.json({
          ok: true,
          producto
        });

  });

});

//=================================
// Buscar productos
//=================================
app.get('/producto/buscar/:termino', verificarToken, (req,res) => {

  let termino = req.params.termino;

  let regex = new RegExp(termino,'i');

  Producto.find({ nombre: regex })
          .populate('categoria', 'descripcion')
          .exec((err,productos) => {
            if(err){
              return res.status(500).json({
                ok: false,
                err
              });
            }
            
            res.json({
              ok: true,
              productos
            })
          });

});

//=================================
// Crear una nuevo producto
//=================================
app.post('/producto', verificarToken,  ( req, res ) => {
    
    let body = req.body;

    


    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
       
    });

    producto.save((err,productoDB) =>{

        if(err){
          return res.status(500).json({
            ok: false,
            err
          });
        }

        if(!productoDB){
            return res.status(400).json({
              ok: false,
              err
            });
          }
   
        res.status(201).json({
          ok: true,
          producto: productoDB
        });
    });
});

//=================================
// Editar un producto
//=================================
app.put('/producto/:id', verificarToken, ( req, res ) => {

  let id = req.params.id;
  let body = req.body;

  Producto.findByIdAndUpdate( id, body, {new:true, runValidators:true} , (err,productoDB) => {

      if(err){
          return res.status(500).json({
            ok: false,
            err
          });
        }

        if(!productoDB){
          return res.status(400).json({
            ok: false,
            err
          });
        }
        
        res.json({
          ok: true,
          producto: productoDB
        });
  
  });
});

//=================================
// Eliminar un producto
//=================================
app.delete('/producto/:id', verificarToken, function (req, res) {
    
  let id = req.params.id;

  let cambiaDisponible = {
    disponible: false
  }

  //Usuario.findByIdAndRemove(id, (err, usuarioBorrado) =>{
  Producto.findByIdAndUpdate(id, cambiaDisponible, {new:true}, (err, productoBorrado) =>{

    if(err){
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if( !productoBorrado == null){
      return res.status(400).json({
        ok: false,
        err: {
            message: 'Producto no encontrado'
        }
      });
    }

    res.json({
      ok: true,
      producto: productoBorrado
    });

  })


});

module.exports = app;