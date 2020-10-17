const Joi = require("joi"); // get joi (for input validation)
const express = require("express"); // get express 

const app = express(); // create app constant

app.use(express.json()); // allows express to parse json objects (middleware)

app.use(express.static("client")); // folder where client-side code is stored

app.use("/api", require("./server/api"));

// get PORT environment variable, or use 27101 if not available
const port = process.env.PORT || 27101;
app.listen(port, () => console.log(`Listeneing on port ${port}...`)) // choose which port to listen on