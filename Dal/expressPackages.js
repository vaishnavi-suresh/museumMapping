const dotenv = require('dotenv');
const request = require('superagent');
dotenv.config({path: '../.env'});
const express = require('express');
const {Sequelize ,DataTypes,Model} = require('sequelize');
const app = express();
const axios = require('axios');
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


module.exports={sequelize,express,DataTypes, Model,getKey};