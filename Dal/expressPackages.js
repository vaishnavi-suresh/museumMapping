const dotenv = require('dotenv');
dotenv.config({path: '../.env'});
const express = require('express');
const {Sequelize ,DataTypes,Model} = require('sequelize');
const app = express();

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
module.exports={sequelize,express,DataTypes, Model};