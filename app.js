require('dotenv').config()
const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs')

app.get("/",function(req,res) {

	res.render('index');
	
})


app.post("/", function(req,res) {
	const cityName = req.body.cityName;

	query = cityName;
	const apikey = process.env.API_KEY;
	const url = "https://api.openweathermap.org/data/2.5/weather?q="+ query+"&appid="+ apikey+"&units=metric";

	https.get(url,function(response) {
		if(response.statusCode ===200)
		{
			response.on("data",function(data) {
			const weatherData=JSON.parse(data);

			const name = weatherData.name;
			const temp = weatherData.main.temp;
			const imageURL = "http://openweathermap.org/img/wn/"+weatherData.weather[0].icon+"@2x.png";
			const description = weatherData.weather[0].description;
			
			res.render('final',{city :name,temperature:temp,des: description,imageURL:imageURL});
			})	
		}

		if(response.statusCode === 404){
			res.render('NotFound');
		}

	})

})

app.listen(process.env.PORT,function() {
	console.log("Server running on port ${process.env.PORT}.");
})