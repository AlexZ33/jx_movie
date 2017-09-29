var express =require('express') //这里主要是引用所必须要的模块，当然，这些模块是需要使用"npm install 模块名"安装的
var path = require('path')
var mongoose = require('mongoose')
var _ = require('underscore')
var Movie = reuqire('./modules/movie')
var port = process.env.PORT || 3000
var app = express()

mongoose.connect('mongodb://localhost/jxmovie')
app.set('views', './views/pages')//定义了一些路径和所用到的引擎
app.set('view engine', 'jade')
//app.use(bodyParser.urlencoded({extended: true}))
//app.use(require('body-parser').urlencoded({extended: true}))
// app.use(express.static(path.join(__dirname,'bower_components')))
app.use(express.static(__dirname + '/views'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.listen(port);

console.log('imooc started on port ' + port);


//index page    这里以及下面皆是路由以及赋值，这里的字段如title, poster等都会在相应的jade如index.jade中用到，实际上是将这里的值传入相应的jade以渲染页面
app.get('/', function (req, res) {
    Movie.fetch(function(err,movies){
        if(err) {
            console.log(err);
        }
        res.render('index', {
        title: '镜心的小树屋 首页',
        movies: movies
      })
    })    
})

//detail page
app.get('/movie/:id', function (req, res) {
    var id = req.params.id

    Movie.findById(id, function (err,movie){
      res.render('detail', {
        title: '镜心电影' + movie.title,
        movie: movie
    })
  })   
})
//admin page
app.get('/admin/movie', function (req, res) {
    res.render('admin', {
        title: '镜子电影 后台录入页',
        movie: {
            doctor: '',
            country: '',
            title: '',
            year: '',
            poster: '',
            language: '',
            flash: '',
            summary: ''
        }
    })
})

//admin update moive
app.get('/admin/update/:id',function(req,res) {
    var id = req.params.id

    if(id) {
        Movie.findById(id,function(err, movie) {
           res.render('admin', {
             title: '镜子电影 后台更新页面',
             movie:movie

           })
        })
    }
})

//admin post movie
app.post("/admin/movie/new", function (req,res) {
    
  var id = req.body.movie._id
  var movieObj =  req.body.movie
  var _movie
  if(id !== 'undefined') {
   Movie.findById(id,function(err,movie) {
     if(err) {
       console.log(err)
     }
     _movie = _.extend(movie,movieObj)
     _movie.save(function (err,movie){
       if(err) {
        console.log(err)
       }

       res.redirect('/movie/' + movie._id)
     })
   })
  } 
  else{
    _movie = new Movie({
        doctor: movieObj.doctor,
        title: movieObj.title,
        country: movieObj.country,
        language: movieObj.language,
        year:movieObj.year,
        poster:movieObj.poster,
        summary: movieObj.summary,
        flash:movieObj.flash
    })
    _movie.save(function (err,movie){
       if(err) {
        console.log(err)
       }

       res.redirect('/movie/' + movie._id) 
    })
  }
})
//list page
app.get('/admin/list', function (req, res) {
    Movie.fetch(function(err,movies){
        if(err) {
            console.log(err);
        }
          
        res.render('list', {
            title: '镜子电影 列表页',
            movies: movies
        })
    })
})
