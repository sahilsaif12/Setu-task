import app from "./app.js";
import connectDb from "./src/db/db.js";

const port =process.env.PORT

connectDb()
.then(()=>{
    app.listen(port,()=>{
        console.log(`\nApp listening on http://localhost:${port}`);
    })
})
.catch(err=>{
    console.log(`mongo db connection error : ${err}`);
})