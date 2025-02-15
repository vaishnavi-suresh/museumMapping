const{ sequelize, DataTypes,Model} =require( './expressPackages');
class artwork extends Model {};
class museum extends Model{};
class city extends Model {};
class airport extends Model{};
class routes extends Model{};

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
                model:'museum',
                key:'name'
            }


        }
    },{
        sequelize,
        modelName: 'artwork'
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
                model:'city',
                index:'id'
            }
        }
    },{
        sequelize,
        modelName:'museum',
    }
);

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
            allowNull: false
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

airport.init(
    {
        name:{
            type:DataTypes.STRING,
            allowNull:false
        },
        id:{
            type:DataTypes.STRING,
            autoIncrement:true,
            primaryKey:true
        },
        city_id:{
            type:DataTypes.INTEGER,
            references:{
                model:'city',
                index:'id'

            }

        }
    },{
        sequelize,
        modelName:'airport'
    }
);

routes.init(
    {
        starting_id:{
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        ending_id:{
            type: DataTypes.INTEGER,
            primaryKey: true
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
    }
)
module.exports = {artwork,museum,city,airport,routes};

