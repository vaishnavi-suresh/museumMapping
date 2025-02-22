import dotenv from 'dotenv';
dotenv.config('../.env');
import axios from 'axios';
import {getKey, sequelize} from '../Dal/expressPackages.js';
import CRUD from '../Dal/seedDal.js';
import  axiosRetry from "axios-retry";
import pLimit from 'p-limit';
import {city} from '../Dal/models.js';
import express from 'express';
const headers = {
    'x-rapidapi-key': process.env.FLIGHT_RAPIDAPI_KEY,
    'x-rapidapi-host': process.env.FLIGHT_RAPIDAPI_HOST
  
};



axiosRetry(axios,{retries:5, retryDelay: axiosRetry.exponentialDelay});

function computeRouteCost(time, price){
    return 0.67 * time + 0.33 * price;
}


async function getFlightData(){
    
      let airportData;
      try {
        //airportData = await axios.request({method: 'GET',
        //   url: 'https://sky-scanner3.p.rapidapi.com/flights/airports',headers:headers});
        //console.log(response.data);
        const cityData= await city.findAll();
        for( let each of cityData){
            let cityName = each.dataValues.city;
            let stateName = each.dataValues.state;
            let countryName = each.dataValues.country;
            cleanData(cityName,stateName,countryName);
            console.log(`${cityName}, ${stateName}, ${countryName}`)
            
        }
        
    } catch (error) {
        console.error(error);
    }

}

getFlightData();
