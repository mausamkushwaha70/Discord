import { DbConnect } from "./src/config/db.js";
import { server } from "./src/app.js";

DbConnect();

let port = 3000;

server.listen(port, ()=>{
    console.log(`server is running on port ${port}`)
})

