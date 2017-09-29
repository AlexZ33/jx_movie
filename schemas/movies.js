var mongoose = require('mongoose');

var MOvieSchema = new mongoose.Schema({
  doctor:String,
  title:String,
  language:String,
  country:String,
  summary:String,
  flash:String,
  poster:String,
  year:Number,
  meta: {
   createAt: {
     type: Date,
      default: Date.now()   
   },
   updateAt: {
     type: Date,
      default: Date.now()   
   }
  }  
})

//给模式（MovieSchema）添加一个pre方法
//每次存储数据之前都会调用这个方法
MovieSchema.pre('save', function(next) {
  if(this.isNew) {//如果数据是新加的
   this.meta.createAt = this.meta.updateAt = Date.now();// 把创建时间和更新时间设置为当前时间
  }
  else {// 如果数据已经有了 我们只保存updateAt
   this.meta.updateAt = Date.now();
  }
  next();
})


//添加一个statics方法
//这个方法不会直接和数据库交互，只有经过模型（module）编译实例化以后才会有这个方法
MovieSchema.statics = {
  //用于取出数据库中所有数据
  fetch: function (cb) {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb)
  },
// 用于查询单条数据
  findById: function (id, cb) {
    return this
      .findOne({_id: id})
      .exec(cb)
  }
}

module.exports = MovieSchema;
