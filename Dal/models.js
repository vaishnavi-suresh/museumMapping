import { sequelize, DataTypes,Model} from  './expressPackages.js';
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
            type: DataTypes.STRING(1000),
            allowNull: false

        },
        year:{
            type: DataTypes.STRING,

        },
        artist:{
            type: DataTypes.STRING,
        },

        museum_name:{
            type: DataTypes.STRING,
            allowNull:false,
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
        route_info:{
            type:DataTypes.STRING(5000),
            allowNull: false
        },
        shortest_time:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName:'routes'
    }
)
export {artwork,museum,city,routes};

