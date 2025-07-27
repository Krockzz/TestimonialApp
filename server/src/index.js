import {app} from "./app.js"
import dotevn from "dotenv"
import DB from "./DB/index.js"

dotevn.config({
    path:"./.env"
})

const port = process.env.port ||  8000

DB()
.then(() => {
   app.listen(port , () => {
    console.log(`Server is running on port: ${port}`)
   })
})
.catch((err) => {
    console.log("Mongdb connection failed!!!" , err)
})
