const mongoose= require('mongoose');
const mongodb = require('mongodb');
mongoose.connect('mongodb://localhost/quora');
var schema = mongoose.Schema;
var requestschema = new schema ({
    from : {
    	type:String,
    	required:true
    },
    to :{
    	type:String,
    	required:true
    },
    question :{
    	type:String ,
    	required:true
    }
});
var request = mongoose.model('request',requestschema);
var saverequest= function(req,callback){
   var new_request = new request(req);
   new_request.save(callback);
};
var findrequest= function(username,callback){
	request.find({to:username},callback);
};
var deleterequest= function(id,callback){
     request.remove({_id:id},callback);
};
var findbyid= function(id,callback){
     request.findById(id,callback);
};
module.exports= {
    saverequest,
    findrequest,
    deleterequest,
    findbyid
};
