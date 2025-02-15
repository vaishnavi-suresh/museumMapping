//create a set of CRUD uperations
//Since this is not meant to be a scalable or business level project,
//the DAL and service layer are combined to seedDal. The purpose of this 
//is only to seed the database

//This is assuming all of the API data is in the correct format

const {artwork,museum,city,airport, artwork, routes} = require( './models.js');
//ARTWORK CRUD
//create
export const createArtwork = async function (payload) {
    const newArtwork = await artwork.create(payload);
    return newArtwork;
}

//Update
export  const updateArtwork =  async function (qId,partialPayload){
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
export const requestArtwork = async function (qId){
    const newArtwork = await artwork.findByPk(qId);
    if (! newArtwork){
        throw new Error('no artwork found');
    }
    return newArtwork;

}

//Delete
export const deleteArtwork = async function(qId){
    const deletedArtwork = await artwork.destroy({
        where:{qId}
    });
    return deletedArtwork;
}

//CITY CRUD
//create
export const createCity = async function (payload) {
    const newCity = await city.create(payload);
    return newCity;
}

//Update
export  const updateCity =  async function (qId,partialPayload){
    const oldCity = await city.findByPk(qId);
    if (!oldCity){
        throw new Error('no city found')
    }
    const newCity = await city.update(partialPayload,{
        where:{
            name: qId
        }
    });
    return newCity;
}

//Read
export const requestCity = async function (qId){
    const newCity = await city.findByPk(qId);
    if (! newCity){
        throw new Error('no city found');
    }
    return newCity;

}

//Delete
export const deleteCity = async function(qId){
    const deletedCity = await city.destroy({
        where:{qId}
    });
    return deletedCity;
}


//MUSEUM CRUD
//create
export const createMuseum = async function (payload) {
    const newMuseum = await museum.create(payload);
    return newMuseum;
}

//Update
export  const updateMuseum =  async function (qName,partialPayload){
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
export const requestMuseum = async function (qName){
    const newMuseum = await museum.findByPk(qName);
    if (! newMuseum){
        throw new Error('no museum found');
    }
    return newMuseum;

}

//Delete
export const deleteMuseum = async function(qName){
    const deletedMuseum = await museum.destroy({
        where:{qName}
    });
    return deletedMuseum;
}


//AIRPORT CRUD
//create
export const createAirport = async function (payload) {
    const newAirport = await airport.create(payload);
    return newAirport;
}

//Update
export  const updateAirport =  async function (qId,partialPayload){
    const oldAirport = await airport.findByPk(qId);
    if (!oldAirport){
        throw new Error('no airport found')
    }
    const newAirport = await airport.update(partialPayload,{
        where:{
            name: qId
        }
    });
    return newAirport;
}

//Read
export const requestAirport = async function (qId){
    const newAirport = await airport.findByPk(qId);
    if (! newAirport){
        throw new Error('no airport found');
    }
    return newAirport;

}

//Delete
export const deleteAirport = async function(qId){
    const deletedAirport = await airport.destroy({
        where:{qId}
    });
    return deletedAirport;
}

//ROUTES CRUD

export const createRoute = async function(payload){
    const newRoute = await routes.create(payload);
    return newRoute;
};

//Update
export const updateRoute = async function (starting, ending, partialPayload){
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
export const requestRoute = async function (starting, ending){
    const newRoute = routes.findByPk(starting_id = starting, ending_id = ending);
    return newRoute;
}

//Delete
export const deleteRoute = async function (starting, ending){
    const deletedRoute = routes.destroy({where:{
        starting_id : starting,
        ending_id : ending
    }})
    return deletedRoute;
}