const Joi = require("joi"); // get joi (for input validation)
const express = require("express"); // get express 
const jdata = require("./server/Lab3-timetable-data.json"); // json data

const app = express(); // create app constant
const cdata = JSON.parse(JSON.stringify(jdata)); // parse json object

app.use(express.json()); // allows express to parse json objects (middleware)

app.use(express.static("client")); // folder where client-side code is stored

//app.use("/api", require("./server/api"));

app.get("/api/courses", (req, res) => { // get all subjects and classnames

    let courses = ""; // empty string variable to return

    for (c in cdata)
    {
        courses += `${cdata[c].subject}: ${cdata[c].className}, `;
    }

    res.send(courses);

});

app.get("/api/courses/:subject", (req, res) => { // get catalog numbers for a given subject

    let catalog = ""; // empty string variable to return

    for (c in cdata)
    {
        if (cdata[c].subject == req.params.subject)
        {
            catalog += `${cdata[c].catalog_nbr}, `;
        }
    }

    if (catalog == "") // if no results are found (catalog never modified)
    {
        res.status(404).send(`No course found with subject name: ${req.params.subject}`)
    }
    else // if there was a corresponding subject
    {
        res.send(catalog);
    }
        
});

// get PORT environment variable, or use 3000 if not available
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listeneing on port ${port}...`)) // choose which port to listen on