const dotenv = require('dotenv');
const request = require('superagent');
const axios = require('axios');
dotenv.config({path:'../.env'});
const {getKey} = require( '../Dal/expressPackages.js');
const axiosRetry = require("axios-retry").default;
const CRUD = require( '../Dal/seedDal.js');
const {sequelize} = require('../Dal/expressPackages.js');

console.log(sequelize);

axiosRetry(axios, {retries: 3, retryDelay: axiosRetry.exponentialDelay});

async function getLocation(name){
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(name)}&addressdetails=1&limit=1`
    const locResp = await axios.get(url);
    return locResp.data[0].address;
}



async function getSearchData (simpleQuery){
    const key = await getKey();
    let next = "https://api.artsy.net/api/artworks?page=1&total_count=1";
    console.log(next);
    try{
        await sequelize.sync();

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
    for(const piece of  response.data._embedded.artworks){
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

                
                //create object function call
                //put in DB
            const artworkPL = {title: piece.title, year: piece.date,artist: artistName, musuem_name : piece.collecting_institution.split(', ')[0]};
            const address = await getLocation(piece.collecting_institution.split(', ')[0]);
            //if no city for this place, 
            const cityPL = {city: address.city, state: address.state, country: address.country}
        }
    } 
    // initialize sequelize instance and add the payloads into the database. 
        
    };

async function seedDatabases (simpleQuery){
    jsonRes =  await getSearchData(simpleQuery);


    

}

seedDatabases('impressionism');
