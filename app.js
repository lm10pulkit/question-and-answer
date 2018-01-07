const express     = require('express');
const bodyparser  = require('body-parser');
const cookieparser= require('cookie-parser');
const session     = require('express-session');
const passport = require('passport');
var strategy = require('passport-local').Strategy;
var {hash,compare}= require('./hashing.js');
var {find,finduser,save}= require('./user.js');
var   {questionasked,questionanswered,savequestion} = require('./question.js');
var  { saverequest, findrequest,deleterequest,findbyid}= require('./request.js');
var {createrequest,createquestion}= require('./create.js');
// express app
 var app= express();
 //loggedin 
 var loggedin = function(req,res, next){
  if(req.user)
    next();
  else
    res.redirect('/login');
 };
 // not loggecin 
 var notloggedin = function(req,res,next){
    if(req.user)
      res.redirect('/');
    else
      next();
 }
 //middle register
 var middleregister= function(req,res,next)
 {  
    hash(req.body.password,function(err,hash){
      if(err)
        res.redirect('/register');
          req.body.password= hash;
          next();
    });
 };
 // setting view engine
app.set('view engine','hbs');
//for forms
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
// middleware for cookie parser

app.use(cookieparser());

//middleware for session
app.use(session(
	{
		secret:'secret',
	    saveUninitialized:true,
		resave:true
	}));
//middleware for passport
app.use(passport.initialize());
app.use(passport.session());
//welcome app
app.get('/',function(req,res){
res.send(' welcome to quora');
});
//register route
app.get('/register',function(req,res){
res.render('register');
});
// login route
app.get('/login',function(req,res){
res.render('login');
});
//setting up local strategy
passport.use(
  new strategy(function(username,password, done )
  {
      console.log('in the local srategy');
      finduser(username,function(err,user){
        if(err)
          throw err;
        if(!user)
          return done(err,false);
          console.log(user);
          console.log(err);
        compare(password,user.password,function(err,match){
          if(err)
            throw err;
          if(match)
           return     done(null,user);
          else
            return done(null,false);
        });
      });
}));

//serializing user
passport.serializeUser(function(user,done){
 done(null,user.username);
});
// deserializing user
passport.deserializeUser(function(username,done){
  finduser(username,function(err,user){
     done(err,user);
  });
});
//registering route
app.post('/register',middleregister,function(req,res){
       save(req.body,function(err,data){
           console.log(data);
           res.redirect('/login');
       });
});
//login
app.post('/login', passport.authenticate('local',{failureRedirect:'/login'}),function(req,res){
        res.redirect('/prof');
});
//prof page
app.get('/prof',loggedin,function(req,res){
     find(function(err,data){
           if(err)
            throw err;
          res.render('list',{friends :data});
     });
});
// friends
app.get('/friends',loggedin,function(req,res){
  finduser(req.query.username,function(err,data){
    res.render('friends',{user: data});
  });
});
//create  a request
app.post('/askaquestion',loggedin,function(req,res){
    saverequest(createrequest(req.user.username,req.query.username,req.body.question),function(err,data){
           console.log(data);
           res.render('friends',{user:{username :req.query.username}});
    });
});
// request route
app.get('/request',loggedin,function(req,res){
    findrequest(req.user.username,function(err,data){
        if(err)
          throw err;
        res.render('request',{request:data});
    });
});
//saving question
app.post('/question',loggedin,function(req,res){
      findbyid(req.query._id,function(err,data){
            if(err)
              throw err;
            var q= createquestion(data.from,data.to,data.question,req.body.answer);
            console.log(q);
            savequestion(q,function(err,data){
               console.log(data);
            });
            deleterequest(req.query._id,function(err,data){
              if(err)
                throw err;
              res.redirect('/request');
            });
      });
});
// delete request
app.post('/deleterequest',loggedin,function(req,res){
     deleterequest(req.query._id,function(err, data){
         console.log(data);
         res.redirect('/request');
     });
});
// viewing questions related
app.post('/questionask',loggedin,function(req,res){
   
    questionasked(req.query.username,function(err,data){
      if(err)
        throw err;
      console.log(data);
      console.log(err);
      res.render('question', {question:data});
    });
});
//viewing questions answered
app.post('/questionans',loggedin,function(req,res){
        questionanswered(req.query.username,function(err,data){
           if(err)
            throw err;
          console.log(data);
          res.render('question',{question:data});
        });
});
//listening to the port 8080
app.listen(8080,function(err){
  if(err)
     console.log(err);
   else
    console.log('listening to the port 8080');
});