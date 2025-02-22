import dotenv from 'dotenv';
dotenv.config('../.env');
import axios from 'axios';
import {getKey, sequelize} from '../Dal/expressPackages.js';
import CRUD from '../Dal/seedDal.js';
import  axiosRetry from "axios-retry";
import pLimit from 'p-limit';
import {city, museum, artwork} from '../Dal/models.js';
import express from 'express';

//with more API calls, which you have to pay for, you can translate museums and artworks
//for this purpose, I will only be translating cities
async function syncSequelize(){
    try{
        await sequelize.sync();

    }catch (err){
        console.log(err);
    }
}

async function showTable(table){
    const toDisplay = await table.findAll();
    console.table(toDisplay.map(item => item.get({plain:true})));
}

async function translateData(text){
    const res = await axios.request({method: 'POST', url: 'https://openl-translate.p.rapidapi.com/translate', headers: {
        'x-rapidapi-key': process.env.TRANSLATE_RAPIDAPI_KEY,
        'x-rapidapi-host': process.env.TRANSLATE_RAPIDAPI_HOST,
        'Content-Type': 'application/json'
    }, data: {
        target_lang: 'en',
        text: text
    }});
    return res.data.translatedText;
}

async function translateCities(){

    const cityData = await city.findAll();
    let text = "";
    let prevArray = [];
    for (let each of cityData){
        let cityName = each.dataValues.city;
        let stateName = each.dataValues.state;
        let countryName = each.dataValues.country;
        let cityId = each.dataValues.id;
        prevArray.push([cityId, cityName,stateName,countryName]);
        if (stateName){
            text = text+`${cityName}, ${stateName}, ${countryName}\n`;
        } else{
            text = text+`${cityName}, ${countryName}\n`;
        }
    }
    const translatedText = await translateData(text);
    const translatedArray = translatedText.split(`  \n`);
    for (const [index, each] of translatedArray.entries()){
        const eachTranslated = each.split(', ');
        let payload;
        if (prevArray[index][2]){
            payload = {city: eachTranslated[0], state: eachTranslated[1], country: eachTranslated[2]}
            

        } else{
            payload = {city: eachTranslated[0], state: null, country: eachTranslated[1]}
        }

        await CRUD.updateCity(prevArray[index][0],payload);
        

        
    }
    await showTable(city);



}

syncSequelize();
translateCities();



