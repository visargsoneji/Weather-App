const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

const PORT = 5500;

let baseUrl = "http://api.openweathermap.org/data/2.5/weather";

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");  
});

app.post("/", (req, res) => {
    let apiKey;
    try {
        const data = fs.readFileSync('apiKey.txt', 'utf8')
        console.log(data);
        apiKey = data;
    } 
    catch (err) {
        console.error(err)
    }
    console.log(apiKey);
    let city = req.body.cityName;
    let units = "metric";
    axios.get(baseUrl+"?q="+city+"&appid=" + apiKey +"&units=" + units)
        .then((response) => {
            let data = response.data;
            console.log(data);
            res.write("<h1>Temperature at " + city + " is " + data.main.temp + " degree Celcius.</h1>");
            res.write("<p> Current weather is " + data.weather[0].description + ".</p>");
            let weatherIcon = data.weather[0].icon;
            res.write("<img src=\"http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png\">");
            res.send();
        })
        .catch((err) => res.send(err.message));  
});

app.listen(PORT, () => {
    console.log("App running on PORT: "+ PORT);
})