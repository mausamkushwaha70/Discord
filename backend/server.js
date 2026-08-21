import app from "./src/app.js"
import { DbConnect } from "./src/config/db.js";


DbConnect();
let port = 3000;
app.listen(port, ()=>{
    console.log(`server is running on port ${port}`)
})

