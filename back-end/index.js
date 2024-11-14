const express=  require("express");
const PORT=5500;


const app= express();


app.listen(PORT,()=>{
    console.log(`Server is running in port= ${PORT}`);
    
})