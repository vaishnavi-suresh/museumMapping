const dotenv = require('dotenv');
dotenv.config('../.env');


async function getSearchData (simpleQuery){
    const url = `https://api.europeana.eu/record/v2/search.json?query=${simpleQuery}&wskey=${process.env.API_KEY}`;

    try{
        const response = await fetch(url);
        const jsonRes = await response.json();
        console.log(jsonRes.totalResults);
    }
    catch(error){
        console.log(error);
    }
}
getSearchData();