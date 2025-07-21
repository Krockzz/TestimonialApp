import mongoose, { connect } from "mongoose"
import {DB_NAME} from "../constants.js"

const DB = async () => {
    try{
    const Dbconnection = await mongoose.connect(`${process.env.MongoDb_URI}/${DB_NAME}`)
    console.log(`\n Mongodb connnected successfully DB Host: ${Dbconnection.connection.host}`)
    }
    catch(error){
        console.log("Mongodb error:" , error)
        process.exit(1);
    }
}

export default DB