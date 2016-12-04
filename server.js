var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var app = express();
var PORT = process.env.PORT || 3000;
var ratings = [];
var ratingsNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res){
	res.send("API ROOT"); 
});



//GET
app.get('/ratings', function(req, res){
	var query = req.query;
	var  where ={};
	if(query.hasOwnProperty('attendance') && query.attendance === 'true'){
		where.attendance = true;
	} else if(query.hasOwnProperty('attendance') && query.attendance === 'false'){
		where.attendance = false;
	}

	if(query.hasOwnProperty('l') && query.l.length>0){
 		where.lastName={
 			$like: '%'+query.l+'%'
 		};
	}
	else if(query.hasOwnProperty('n') && query.n.length>0){
 		where.name={
 			$like: '%'+query.n+'%'
 		};
	}
	else if(query.hasOwnProperty('c') && query.c.length>0){
 		where.course={
 			$like: '%'+query.c+'%'
 		};
	}
	db.rating.findAll({where: where}).then(function(rating){
		res.json(rating);
	}, function(e){
		res.status(500).send();
	});
});



//GET/:id
app.get('/ratings/:id', function(req,res){
	var ratingsId = parseInt(req.params.id, 10);

db.rating.findById(ratingsId).then(function (rating){
	if(!!rating){
		res.json(rating.toJSON());
	} else{
		res.status(404).send({"Ошибка": "Студент  c id "+ratingsId+" не найден!"});
	}
}, function(e){
	res.status(500).send();
});

});



//POST

app.post('/ratings', function(req, res){
	var body = _.pick(req.body, 'lastName', 'name', 'course', 'attendance','rate1', 'rate2','subtotal', 'exam','total' );

	if (body.hasOwnProperty('rate1') && body.rate1>100){
		Attributes.rate1 = body.rate1;
	} 
	if (body.hasOwnProperty('rate2') && body.rate2>100){
		Attributes.rate2 = body.rate2;
	} 
	if (body.hasOwnProperty('exam') && body.exam>40){
		Attributes.exam = body.exam;
	} 

	body.subtotal = Math.round(((body.rate1+body.rate2)/2)*0.6);
	body.total = body.subtotal + body.exam;

	db.rating.create(body).then(function (rating) {
		res.json(rating.toJSON());
	}, function (e) {
		res.status(400).json(e);
	});
});




// ratings/delete
app.delete('/ratings/:id', function(req, res){
	var ratingsId = parseInt(req.params.id,10);
	 db.rating.destroy({
	 	where: {
	 		id: ratingsId
	 	}
	 }).then (function (rowsDeleted){
	 	if(rowsDeleted ===0){
	 		res.status(404).json({
	 			error: "Ошибка: Студент  c id "+ratingsId+" не найден!"
	 		});
	 	} else {
	 		res.status(204).send();
	 	}
	 }, function(){
	 	res.status(500).send();
	 });
});



//put
app.put('/ratings/:id',function(req, res){
	var ratingsId = parseInt(req.params.id,10);
	var body = _.pick(req.body, 'attendance');
	var Attributes = {};

	if (body.hasOwnProperty('attendance')){
		Attributes.attendance = body.attendance;
	}
	

	db.rating.findById(ratingsId).then(function(rating){
		if(rating){
			rating.update(Attributes).then(function(rating){
				res.json(rating.toJSON());
			}, function(e){
				res.status(400).json(e);
			});
		}else{
			res.status(404).send();
		}

	}, function(){
		res.status(500).send();
	});
	});

db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log('Экспресс использует порт ' + PORT + '!');
	});
});
