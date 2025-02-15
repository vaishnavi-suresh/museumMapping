const dotenv = require('dotenv');
const request = require('superagent');
const axios = require('axios');
dotenv.config({path:'../.env'});
const {getKey} = require( '../Dal/expressPackages.js');




async function getSearchData (simpleQuery){
    const key = await getKey();
    const response = await axios.get("https://api.artsy.net/api/artworks?page=1", {
        headers: {
            "Accept": "application/json",
            "X-Xapp-Token": key
        }
    });
    for(piece in response.data._embedded.artworks){
        //save title, date, artists (follow api call, save first name), museum name (collecting_institution)
        const response2 = await axios.get(piece.genes.href, {
            headers: {
                "Accept": "application/json",
                "X-Xapp-Token": key
            }
        });
        if(JSON.stringify(response2.data._embedded.genes).indexOf(simpleQuery) != -1){
            //create object function call
            //put in DB
        }


    }



    
}

async function seedDatabases (simpleQuery){
    jsonRes =  await getSearchData(simpleQuery);


    

}

seedDatabases('impressionism');
