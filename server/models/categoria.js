const mongoose = require('mongoose');

let Schema = mongoose.Schema;

//const uniqueValidator = require('mongoose-unique-validator');

let categoriaSchema = new Schema({

    descripcion: { type: String, unique: true, required: [true, 'La descripción es requerida']},
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario'}

});


//usuarioSchema.plugin( uniqueValidator, {message: '{PATH} La descripción de la categoria debe de ser unico'})

module.exports = mongoose.model('Categoria', categoriaSchema);