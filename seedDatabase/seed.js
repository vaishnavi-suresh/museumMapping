import  dotenv from'dotenv';
import axios  from 'axios';
dotenv.config({path:'../.env'});
import {getKey,sequelize} from '../Dal/expressPackages.js';
import  axiosRetry from "axios-retry";
import  CRUD  from  '../Dal/seedDal.js';
import pLimit from 'p-limit';

axiosRetry(axios, {retries: 5, retryDelay: axiosRetry.exponentialDelay});

async function getLocation(name){
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(name)}&addressdetails=1&limit=1`
    const locResp = await axios.get(url);
    try{
        if (locResp.data[0].address.city && locResp.data[0].address.country){
            return locResp.data[0].address;
        } else{
            return null
        }
    }
    catch (error){
        return null;
    }
}
async function showAll(){
    const tables = await sequelize.getQueryInterface().showAllTables();
    console.log(tables);
    for (let table of tables){
        const[results] = await sequelize.query(`SELECT COUNT( * ) FROM ${table}`);
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



async function getSearchData (key,response, simpleQuery){
    for(const piece of  response.data._embedded.artworks){
        //save title, date, artists (follow api call, save first name), museum name (collecting_institution)
        let response2;
        try{
                response2 = await axios.get(piece._links.genes.href, {
                    headers: {
                        "Accept": "application/json",
                        "X-Xapp-Token": key
                    }
                });
        }
        catch(err){
            continue;
        }
        if(piece.collecting_institution &&JSON.stringify(response2.data._embedded.genes).indexOf(simpleQuery) != -1) {
            let artistRes;
            try{
                artistRes = await axios.get(piece._links.artists.href, {
                    headers: {
                        "Accept": "application/json",
                        "X-Xapp-Token": key
                    }
                });
            }
            catch(err){
                continue;
            }
            let artistName = null;
            if (artistRes.data._embedded.artists[0]){
                artistName = artistRes.data._embedded.artists[0].name;
            }
            const address = await getLocation(piece.collecting_institution.split(', ')[0]);


                
            if (piece.title && piece.collecting_institution&& address){
                let artworkPL = {name: piece.title, year: piece.date,artist: artistName, museum_name : piece.collecting_institution.split(', ')[0]};
                artworkPL = changeUndef(artworkPL);
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
    const key = await getKey();
    const limit = pLimit(1);
    let promises = [];
    try{
        await sequelize.sync();

    }catch (err){
        console.log(err);
    }

    let next =  "https://api.artsy.net/api/artworks?page=1&total_count=1"; 
    while (next){

        await new Promise (r => setTimeout(r,200));
        const response = await axios.get(next, {
            headers: {
                "Accept": "application/json",
                "X-Xapp-Token": key
            }
        });
       const promise = limit(() => getSearchData(key,response, simpleQuery));
       promises.push(promise);
       console.log(next);
       next = response.data._links.next ? response.data._links.next.href : null;

    
    }

    await Promise.allSettled(promises);
    showAll();
}

showAll();

seedDatabases('painting');



