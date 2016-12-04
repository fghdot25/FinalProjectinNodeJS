var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/data/rating.sqlite'
});
var db = {};

db.rating = sequelize.import(__dirname + '/models/rating.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
