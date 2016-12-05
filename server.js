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
	res.send("HTML page"); 
});



//GET
app.get('/ratings', function(req, res){
	var query = req.query;
	var  where ={};
	if(query.hasOwnProperty('attendance') && query.attendance === 'true')
	{
		where.attendance = true;
	} else if(query.hasOwnProperty('attendance') && query.attendance === 'false')
	{
		where.attendance = false;
	}

	if(query.hasOwnProperty('l') && query.l.length>0)
	{
 		where.lastName={
 			$like: '%'+query.l+'%'
 		};
	}
	else if(query.hasOwnProperty('n') && query.n.length>0)
	{
 		where.name={
 			$like: '%'+query.n+'%'
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

db.rating.findById(ratingsId).then(function (rating)
{
	if(!!rating)
	{
		res.json(rating.toJSON());
	} else
	{
		res.status(404).send({"Қате шықты": " "+ratingsId+" - деген id номері бар студент табылмады!"});
	}
}, function(e){
	res.status(500).send();
});

});



//POST

app.post('/ratings', function(req, res){
	var body = _.pick(req.body, 'lastName', 'name', 'attendance','rate1', 'rate2','subtotal', 'exam','total' );
	if(body.rate1<=100 && body.rate2<=100 && body.exam<=40) 
	{
		body.subtotal = Math.round(((body.rate1+body.rate2)/2)*0.6);
		body.total = body.subtotal + body.exam;


		// rating letters

		if(body.total<=49){
			body.letter = 'F';
			body.trad_rate = 2;
		} else if(body.total>=50 && body.total<=74){
			body.letter = 'C';
			body.trad_rate = 3;
		}else if(body.total>=75 && body.total<=89){
			body.letter = 'B';
			body.trad_rate = 4;
		}else if(body.total>=90){
			body.letter = 'A';
			body.trad_rate = 5;
		}
	// rating letters
/*if(body.total<=49){
	res.send();
	console.log("F - Fail(Неудовлетворительно!)");
}
if(body.total>=50 && body.total<=74){
	console.log("C (Удовлетворительно!)");
}
if(body.total>=75 && body.total<=89){
	console.log("B (Хорошо!)");
}
if(body.total>=90){
	Attributes.letter = body.letter;
	res.send(JSON.stringify("A - (Отлично!)"));
	console.log("A (Отлично!)");
} */
	} else
	{
		res.status(403).send({"Қате шықты":"Қойылған бағалардың біреуі немесе барлығы да қою керек бағадан жоғары. Қойылған бағаларды қайтадан тексеріп көрруіңізді сұраймын?"});
	}
	

if (body.hasOwnProperty('rate1') && body.hasOwnProperty('rate2')  && body.hasOwnProperty('exam')) 
		{
			res.status(200).send({
				Succesfully: "Сіз жазған ақпарат сәтті енгізілді!",
				ЕСКЕРТУ:" Қойылған бағаларды өзгертуге мүмкіндігіңіз шектелді!",
				help: "қате енгізілген ақпаратты өзгерту үшін, оны толықтай өшіру керек!(DELETE)"
			});
		} 
	db.rating.create(body).then(function (rating) {
		
}, function(e) 
	{
		res.status(500).send();
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
	 			error: "]Студент  c id "+ratingsId+" не найден!"
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
		console.log('Экспресс ' + PORT + ' деген портты қолданып тұр!');
	});
});
