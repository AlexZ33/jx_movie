var mongoose = require('mongoose');
var MovieSchema= require('../schemas/movie');

//创建模型  （构造函数）
var Movie = mongoose.model('Movie',MovieSchema);

module.exports = Movie;
