const express = require ('express');
const fs = require('fs');
var requests  =require('requests');
const app = express();

const homeFile =  fs.readFileSync("home.html" ,"utf-8" );
app.use(express.static(__dirname));

const replaceval = (htmlfile,value)=>{
let temprature=  htmlfile.replace("{%tempval%}",Math.round(value.main.temp-273.15));
temprature = temprature.replace("{%mintempval%}",Math.round(value.main.temp_min-273.15));
temprature = temprature.replace("{%maxtempval%}",Math.round(value.main.temp_max-273.15));
temprature = temprature.replace("{%location%}",value.name);
temprature = temprature.replace("{%country%}",value.sys.country);
return temprature;
}
app.get("/",(req,res)=>{

   requests(
"http://api.openweathermap.org/data/2.5/weather?q=ajmer&appid=be0d5bf2f1542edb40cac076c129543a"
    ).on("data",(chunk)=>{
     const dataobj = JSON.parse(chunk);
console.log(dataobj);
     const arrdata= [dataobj];
     const realdata  = arrdata.map((value)=>replaceval(homeFile,value)).join("");
   res.write(realdata);

}).on("end",(err)=>{
      if(err)return console.log(err);
   res.end();
    })
})



app.listen(80,()=>{
  console.log("Server is running at port 80");
})
