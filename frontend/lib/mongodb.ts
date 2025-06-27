import mongoose from "mongoose";


const mongoDB_URL = process.env.MONGODB_URL!;



if(!mongoDB_URL){
    throw new Error("Please define mongodb url")

}

let cached = global.mongoose


if(!cached){
    cached = global.mongoose = {conn: null, promise:null}
}


export async function connectToDb(){

    if(cached.conn){
        return cached.conn
    }


    if(!cached.promise){

        
        mongoose.connect(mongoDB_URL)
        .then(()=> mongoose.connection)

    }



    try{
        cached.conn = await cached.promise
    }catch(err){
        cached.promise = null;
        throw err
    }



    return cached.conn
}