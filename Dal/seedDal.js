//create a set of CRUD uperations
//Since this is not meant to be a scalable or business level project,
//the DAL and service layer are combined to seedDal. The purpose of this 
//is only to seed the database

//This is assuming all of the API data is in the correct format

import { artwork, museum, city, routes } from './models.js';

//ARTWORK CRUD
//create
const createArtwork = async function (payload) {
    let newArtwork=await artwork.findOne({where:payload});

    
    if(!newArtwork){
        newArtwork = await artwork.create(payload);
    }
    return newArtwork;
}

//Update
const updateArtwork =  async function (qId,partialPayload){
    const oldArtwork = await artwork.findByPk(qId);
    if (!oldArtwork){
        throw new Error('no artwork found')
    }
    const newArtwork = await artwork.update(partialPayload,{
        where:{
            id:qId
        }
    });
    return newArtwork;
}

//Read
const requestArtwork = async function (qId){
    const newArtwork = await artwork.findByPk(qId);
    if (! newArtwork){
        throw new Error('no artwork found');
    }
    return newArtwork;

}

//Delete
const deleteArtwork = async function(qId){
    const deletedArtwork = await artwork.destroy({
        where:{qId}
    });
    return deletedArtwork;
}

//CITY CRUD
//create
const createCity = async function (payload) {
    let newCity = await city.findOne({where:payload});
    if(newCity==null){
        newCity = await city.create(payload);

    }
    return newCity;
}

//Update
const updateCity =  async function (qId,partialPayload){
    const oldCity = await city.findByPk(qId);
    if (!oldCity){
        throw new Error('no city found')
    }
    const newCity = await city.update(partialPayload,{
        where:{
            id: qId
        }
    });
    return newCity;
}

//Read
const requestCity = async function (qId){
    const newCity = await city.findByPk(qId);
    if (! newCity){
        throw new Error('no city found');
    }
    return newCity;

}
const requestCityByName = async function (payload){
    const newCity = await city.findOne({where:payload});
    if (!newCity){
        throw new Error('no city found');
    }
    return newCity
}

//Delete
const deleteCity = async function(qId){
    const deletedCity = await city.destroy({
        where:{qId}
    });
    return deletedCity;
}


//MUSEUM CRUD
//create
const createMuseum = async function (payload) {
    let newMuseum = await museum.findOne({where:payload});
    
    if(!newMuseum){
        newMuseum = await museum.create(payload);

    }
    return newMuseum;
}

//Update
const updateMuseum =  async function (qName,partialPayload){
    const oldMuseum = await museum.findByPk(qName);
    if (!oldMuseum){
        throw new Error('no museum found')
    }
    const newMuseum = await museum.update(partialPayload,{
        where:{
            name: qName
        }
    });
    return newMuseum;
}

//Read
const requestMuseum = async function (qName){
    const newMuseum = await museum.findByPk(qName);
    if (! newMuseum){
        throw new Error('no museum found');
    }
    return newMuseum;

}

//Delete
const deleteMuseum = async function(qName){
    const deletedMuseum = await museum.destroy({
        where:{qName}
    });
    return deletedMuseum;
}


//ROUTES CRUD

const createRoute = async function(payload){
    let newRoute = await findOne({where:payload});
    if (!newRoute){
        newRoute = await routes.create(payload);
    }
    return newRoute;
};

//Update
const updateRoute = async function (starting, ending, partialPayload){
    const oldRoute = routes.findByPk(starting_id = starting, ending_id = ending);
    if (!oldRoute){
        throw new Error('no route found');
    }
    const newRoute = await routes.update(partialPayload, {where:{
        starting_id: starting,
        ending_id: ending
    }});
    return newRoute
};

//Read
const requestRoute = async function (starting, ending){
    const newRoute = routes.findByPk(starting_id = starting, ending_id = ending);
    return newRoute;
}

//Delete
const deleteRoute = async function (starting, ending){
    const deletedRoute = routes.destroy({where:{
        starting_id : starting,
        ending_id : ending
    }})
    return deletedRoute;
}
export default {createArtwork, updateArtwork, deleteArtwork, requestArtwork, createCity, requestCity, updateCity, deleteCity,
    createMuseum, requestMuseum, updateMuseum, deleteMuseum, createRoute, requestRoute, updateRoute, deleteRoute, requestCityByName
};