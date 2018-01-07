var createrequest= function(from,to,question){
  return {
  	from:from,
  	to:to,
  	question:question
  };
};
var createquestion= function(from,to,question,answer){
return {
   from:from,
   to:to,
   question:question,
   answer:answer,
   time : new Date().getTime()
};
};
module.exports={
   createrequest,
   createquestion
};
