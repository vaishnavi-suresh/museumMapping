const{ sequelize, DataTypes,Model} =require( './expressPackages');
class city extends Model {};
class museum extends Model{};
class artwork extends Model {};
class routes extends Model{};


city.init(
    {
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        city:{
            type:DataTypes.STRING,
            allowNull: false
        },
        state:{
            type:DataTypes.STRING,
        },
        country:{
            type:DataTypes.STRING,
            allowNull:false
        }
    },{
        sequelize,
        modelName:'city'
    }
);

museum.init(
    {
        name:{
            type:DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        city_id:{
            type:DataTypes.INTEGER,
            references:{
                model:city,
                key:'id'
            }
        }
    },{
        sequelize,
        modelName:'museum',
    }
);


artwork.init(
    {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true

        },
        name:{
            type: DataTypes.STRING,
            allowNull: false

        },
        year:{
            type: DataTypes.INTEGER,
            allowNull: false

        },
        artist:{
            type: DataTypes.STRING,
        },

        museum_name:{
            type: DataTypes.STRING,
            references:{
                model:museum,
                key:'name'
            }


        }
    },{
        sequelize,
        modelName: 'artwork'
    }
);


routes.init(
    {
        starting_id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            references:{
                model:city,
                key:'id'
            }
        },
        ending_id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            references:{
                model:city,
                key:'id'
            }
        },
        shortest_time:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        cheapest_price:{
            type: DataTypes.INTEGER,
            allowNull:false
        },
        cost_score:{
            type: DataTypes.INTEGER,
            allowNull:false

        }
    }, {
        sequelize,
        modelName:'routes'
    }
)
module.exports = {artwork,museum,city,routes};

