module.exports = function(sequelize, DataTypes) {
	return sequelize.define('ratings', {
		lastName: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 250]
			}
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 250]
			}
		},
		attendance: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		rate1: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		},

		rate2: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		},

		subtotal: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		exam: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		total: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		},

		letter: {
			type: DataTypes.CHAR,
			allowNull: false,
			defaultValue: 'F'
		},

		trad_rate: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 2
		}

		
	},
    {
		timestamps: false,  
		freezeTableName: true
	}

	);
};
