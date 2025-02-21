import dotenv from 'dotenv';
import request  from 'superagent';
dotenv.config({path: '../.env'});
import express from 'express';
import  {Sequelize ,DataTypes,Model}  from 'sequelize';
const app = express();
import  axios from 'axios';
let xappToken;
const port = process.env.PORT || 5432;


async function getKey(){

  const response = await axios.post(process.env.ARTSY_API_URL);
  return response.data.token;

}
let sequelize = "";
if (process.env.EXTERNAL_DATABASE_URL){
  sequelize =new  Sequelize(process.env.EXTERNAL_DATABASE_URL,{
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      },
    },
    logging:false
  });

} else{
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PW,
    {
      host: 'localhost',
      dialect: 'postgres',
    },);
}


export {sequelize,express,DataTypes, Model,getKey};