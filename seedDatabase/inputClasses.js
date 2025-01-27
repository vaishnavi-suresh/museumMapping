//This file contains information to create classes that can be inputted for CRUD operations
//ARTWORK
export class artwork {
    constructor(name=null, year=null,artist = null,keywords= null,museum_name = null){
        this.name = name;
        this.year = year;
        this.artist = artist;
        this.keywords = keywords;
        this.museum_name = museum_name;

    }
    toJson(){
        return JSON.stringify(this);
    }
    toPartialJson(){
        const serialized = {};
        for (const key in this){
            if (this[key]!==null && this[key]!== undefined){
                serialized[key] = this[key];
            }
        }
        return JSON.stringify(serialized);
    }
}

//MUSEUM
export class museum {
    constructor(name=null, city_id = null){
        this.name = name;
        this.city_id = city_id;


    }
    toJson(){
        return JSON.stringify(this);
    }
    toPartialJson(){
        const serialized = {};
        for (const key in this){
            if (this[key]!==null && this[key]!== undefined){
                serialized[key] = this[key];
            }
        }
        return JSON.stringify(serialized);
    }
}

//CITY
export class city {
    constructor(city = null,state= null,country = null){
        this.city = city;
        this.state = state;
        this.country = country;

    }
    toJson(){
        return JSON.stringify(this);
    }
    toPartialJson(){
        const serialized = {};
        for (const key in this){
            if (this[key]!==null && this[key]!== undefined){
                serialized[key] = this[key];
            }
        }
        return JSON.stringify(serialized);
    }
}
//airport
export class airport {
    constructor(name = null, id = null,city = null){
        this.name = name;
        this.id = id;
        this.city = city;

    }
    toJson(){
        return JSON.stringify(this);
    }
    toPartialJson(){
        const serialized = {};
        for (const key in this){
            if (this[key]!==null && this[key]!== undefined){
                serialized[key] = this[key];
            }
        }
        return JSON.stringify(serialized);
    }
}