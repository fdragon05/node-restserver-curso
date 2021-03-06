//=======================
// Puerto
//=======================
process.env.PORT = process.env.PORT || 3000;

//=======================
// Entorno
//=======================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=======================
// Vencimiento del Token
//=======================
// 60 segunedo
// 60 minutos
// 24 horas
// 30 dias
//process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
process.env.CADUCIDAD_TOKEN = '48h';

//=======================
// SEED de autentificación
//=======================
process.env.SEDD = process.env.SEDD || 'este-es-el-seed-desarrollo';

//=======================
// Base de Datos
//=======================
let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = process.env.MONGO_URI;
}
process.env.urlDB = urlDB;

//=======================
// Cliente Google
//=======================
process.env.CLIENT_ID = process.env.CLIENT_ID || '221536698874-r6ksojq0jjs7hscd0ojer7274hj04ja2.apps.googleusercontent.com';