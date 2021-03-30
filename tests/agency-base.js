import AgencyBase from "./../src/AgencyBase";

class Cat extends AgencyBase {
    constructor() {
        super();
        
        this.cats  =5;
        this._cats  =5;
    }    
}

const cat = new Cat();

console.log(cat);
console.log(cat.id);
console.log(cat.cats);
console.log(cat.ownKeys);