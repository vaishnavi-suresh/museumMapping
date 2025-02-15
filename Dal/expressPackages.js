const dotenv = require('dotenv');
const request = require('superagent');
dotenv.config({path: '../.env'});
const express = require('express');
const {Sequelize ,DataTypes,Model} = require('sequelize');
const app = express();
const axios = require('axios');
let xappToken;

async function getKey(){
  try {
    const response = await axios.post(process.env.ARTSY_API_URL);
    return response.data.token;
  } catch (error){
    console.log(error);
  }
}


let sequelize =new  Sequelize(process.env.EXTERNAL_DATABASE_URL,
    {
        dialect: "postgres", // Specify the dialect
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false, // For managed databases like Render or Heroku
          },
        }
      }

);
module.exports={sequelize,express,DataTypes, Model,getKey};