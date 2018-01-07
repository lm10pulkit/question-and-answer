const mongodb = require('mongodb');
const mongoose= require('mongoose');
mongoose.connect('mongodb://localhost/quora');
 var schema = mongoose.Schema;
 var userschema = new schema ({
 	name :{
 		type:String ,
        required:true,
        trim:true
 	},
 	username :{
 		type:String,
 		required:true,
 		unique:true,
 		trim:true
 	},
 	password:{
 		type: String ,
 		required : true		
 	}
 });
 var user= mongoose.model('user', userschema);
 var find = function(callback){
   user.find({},callback);
 }; 
 var finduser= function(username,callback){
   user.findOne({username:username},callback);
 };
 var save = function(user_obj,callback){
 	var object = new user(user_obj);
 	object.save(callback);
 };
 module.exports= {
 	find,
 	finduser,
 	save
 };