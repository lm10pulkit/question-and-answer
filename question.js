const mongoose= require('mongoose');
const mongodb = require('mongodb');
mongoose.connect('mongodb://localhost/quora');
var schema = mongoose.Schema;
var questionschema = new schema ({
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
    },
    answer :{
    	type :String ,
    	required: true
    },
    time :{
    	type :Number,
        required :true
    }
	});
var question= mongoose.model('question',questionschema);
var questionasked = function(username,callback){
	question.find({from:username},callback);
};
var questionanswered = function(username,callback)
{
   question.find({to:username},callback);
};
var savequestion= function(q,callback){
    var new_question = new question(q);
    new_question.save(callback);
};
module.exports= {
questionasked,
questionanswered,
savequestion
};
 question.find().then(function(data){
    console.log("question is"+data);
 },function(err){
    console.log(err);
 });