const dotenv = require('dotenv');
const request = require('superagent');
const axios = require('axios');
dotenv.config({path:'../.env'});
const {getKey} = require( '../Dal/expressPackages.js');
const axiosRetry = require("axios-retry").default;
const CRUD = require( '../Dal/seedDal.js');
const {sequelize} = require('../Dal/expressPackages.js');


axiosRetry(axios, {retries: 3, retryDelay: axiosRetry.exponentialDelay});

async function getLocation(name){
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(name)}&addressdetails=1&limit=1`
    const locResp = await axios.get(url);
    return locResp.data[0].address;
}
async function showAll(){
    const tables = await sequelize.getQueryInterface().showAllTables();
    console.log(tables);
    for (let table of tables){
        const[results] = await sequelize.query(`SELECT * FROM ${table}`);
        console.table(results);
    }
}

function changeUndef(library){
    for (let key in library){
        if (library[key] == undefined){
            library[key]=null;
        }
    }
    return library;
}



async function getSearchData (simpleQuery){
    const key = await getKey();
    let next = "https://api.artsy.net/api/artworks?page=1&total_count=1";
    console.log(next);
    try{
        await sequelize.sync({force:true});

    }catch (err){
        console.log(err);
    }
    

    const response = await axios.get(next, {
        headers: {
            "Accept": "application/json",
            "X-Xapp-Token": key
        }
    });
    next = response.data._links.next.href;
    let count = 0;
    for(const piece of  response.data._embedded.artworks){
        console.log(count)
        count ++;
        //save title, date, artists (follow api call, save first name), museum name (collecting_institution)
        const response2 = await axios.get(piece._links.genes.href, {
            headers: {
                "Accept": "application/json",
                "X-Xapp-Token": key
            }
        });
        if(piece.collecting_institution &&JSON.stringify(response2.data._embedded.genes).indexOf(simpleQuery) != -1) {
            const artistRes = await axios.get(piece._links.artists.href, {
                headers: {
                    "Accept": "application/json",
                    "X-Xapp-Token": key
                }
            });
            let artistName = null;
            if (artistRes.data._embedded.artists[0]){
                artistName = artistRes.data._embedded.artists[0].name;
            }

                
            if (piece.title && piece.collecting_institution){
                let artworkPL = {name: piece.title, year: piece.date,artist: artistName, museum_name : piece.collecting_institution.split(', ')[0]};
                artworkPL = changeUndef(artworkPL);
                const address = await getLocation(piece.collecting_institution.split(', ')[0]);
                let cityPL = {city: address.city, state: address.state, country: address.country};
                cityPL = changeUndef(cityPL);
                const newCity = await CRUD.createCity(cityPL);
                let museumPL = {name: piece.collecting_institution.split(', ')[0], city_id: newCity.id};
                museumPL = changeUndef(museumPL);
                let newMuseum;
                try{
                    newMuseum = await CRUD.requestMuseum(piece.collecting_institution.split(', ')[0])
                } catch(error){
                    newMuseum = await CRUD.createMuseum(museumPL);

                }
                await CRUD.createArtwork(artworkPL);
            }
            
        }
    } 
        
    };

async function seedDatabases (simpleQuery){
    jsonRes =  await getSearchData(simpleQuery);
    showAll();
}

seedDatabases('impressionism');

