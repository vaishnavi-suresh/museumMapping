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
 

async function getAirportCode(q){  
    const res = await axios.request({method: 'GET',
        url: 'https://sky-scanner3.p.rapidapi.com/flights/airports',params: {query:q},headers:headers});
    let allAirports = res.data;
    let airportCodes = [];
    for ( let airport of allAirports){
        if (airport.type == "AIRPORT"){
            airportCodes.push(airport.id);
        }
    }
    return airportCodes;
}

async function getAllCodes(){
    const allCities = await city.findAll();
    let allCodes = [];
    for (let each of allCities){
        let airportCodes = await getAirportCode(`${each.dataValues.city}, ${each.dataValues.state}, ${each.dataValues.country}`);
        if (airportCodes.length == 0){
            airportCodes = await getAirportCode(`${each.dataValues.city},  ${each.dataValues.country}`);
        }
        for (let code in airportCodes){
            allCodes.push([each.dataValues.id,code]);
        }
    }
    return allCodes;

}


async function getFlightInfo(starting, ending, cityIdStarting, cityIdEnding){
    const options = {
        method:'GET',
        url: 'https://booking-com15.p.rapidapi.com/api/v1/flights/searchFlights',
        params:{
            fromId: starting,
            toId: ending,
            pageNo: '1',
            sort: 'BEST',
            currency_code: 'USD',
            departDate:  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0,10)

        },
        headers:{
            'x-rapidapi-key': process.env.FLIGHT_RAPIDAPI_KEY,
            'x-rapidapi-host':process.env.FLIGHT_RAPIDAPI_HOST

        }
    }
    const res = await axios.request(options);
    console.log(res.data.data.flightDeals[1]);
    const fastestCode = res.data.data.flightDeals[1].offerToken;
    const allFlights = res.data.data.flightOffers;
    let shortestTime = null;
    let routeInfo = "";
    if (allFlights){
        for (let each of allFlights){
            if ( each.token == fastestCode){
                shortestTime= 0;
                console.log(each);
                for (let segment of each.segments){
                    shortestTime +=segment.totalTime;
                    for (let leg of segment.legs){
                        routeInfo += ` Flight from ${leg.departureAirport.code} to ${leg.arrivalAirport.code} leaving at ${leg.departureTime.slice(0,10)} through carrier ${leg.carriersData[0].name}\n`
                    }  
                }
            }
        }
        return  {starting_id : cityIdStarting, ending_id : cityIdEnding, route_info: routeInfo, shortest_time: shortestTime};
    }
    return null;


}

async function getTrainInfo(starting, ending, cityIdStarting, cityIdEnding){
    const params = {
        origin: starting,
        destination: ending,
        mode: "transit",
        key: process.env.GOOGLE_MAPS_API
    };
    
    const res = await axios.get("https://maps.googleapis.com/maps/api/directions/json", { params });
    const shortestPath = res.data.routes[0].legs[0];
        if (shortestPath){
        let routeInfo = ""
        for (let step of shortestPath.steps){
            routeInfo += step.html_instructions + ', ';
        }
        return {starting_id: cityIdStarting, ending_id: cityIdEnding, route_info: routeInfo,  shortest_time :shortestPath.duration.value};
    }
    return null



}

async function seedRoutes(){
    const allCities =  await city.findAll();
    const allCodes = await getAllCodes();
    for (let each of allCities){
        let startingCityId = each.dataValues.id;
        let startingName = `${each.dataValues.city}, ${each.dataValues.state}, ${each.dataValues.country}`;
        let startingNameNoState = `${each.dataValues.city},  ${each.dataValues.country}`;
        let routesArr = [];
        let airportCodes = await getAirportCode(startingName);
        if (airportCodes.length == 0){
            airportCodes = await getAirportCode(startingNameNoState);
        }
        for (let startCode in airportCodes){
            for (let endCode in allCodes){
                if (airportCodes.find((element) =>element == endCode[1])){
                    continue;
                } else{
                    routesArr.push( getFlightInfo(routesArr,startCode,endCode[1], startingCityId,endCode[0]));
                }
            }
        }
        for (let ending of allCities){
            let endingName = `${ending.dataValues.city}, ${ending.dataValues.state}, ${ending.dataValues.country}`;
            let endingNameNoState = `${ending.dataValues.city},  ${ending.dataValues.country}`;
            if (each.dataValues.id != ending.dataValues.id){
                let trainArr = getTrainInfo( startingName, endingName,startingCityId, ending.dataValues.id);
                if (!trainArr){
                    trainArr = getTrainInfo(startingNameNoState, endingName,startingCityId, ending.dataValues.id);
                    if (!trainArr){
                        trainArr = getTrainInfo( startingNameNoState, endingNameNoState,startingCityId, ending.dataValues.id);
                    }
                }
                if (trainArr){
                    routesArr.push(trainArr);
                }
            }

        }
        //find the lowest score and append to routes


        

    }


}

//const arr = await getFlightInfo("EWR.AIRPORT", "SFO.AIRPORT", 1, 2);
//console.log(arr);





