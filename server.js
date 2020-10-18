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

    if (catalog == "") // if no instances of the given subject are found
    {
        res.status(404).send(`No course found with subject name: ${req.params.subject}`);
    }
    else // if there was a corresponding subject
    {
        res.send(catalog);
    }
        
});

app.get("/api/courses/:subject/:catalog", (req, res) => { // get the timetable entry for a subjcet and catalog

    let timetables = "";
    let sub = false;

    for (c in cdata)
    {
        if (cdata[c].subject == req.params.subject)
        {
            sub = true; // found at least one instance of the subject

            if (cdata[c].catalog_nbr == req.params.catalog)
            {
                for (d in cdata[c].course_info[0].days) // build timetable by day //TODO
                {
                    timetables += `${cdata[c].course_info[0].days[d]}: ${cdata[c].course_info[0].start_time} - ${cdata[c].course_info[0].end_time}, `;
                }
            }
        }
    }

    if (!sub) // if no instances of the given subject are found
    {
        res.status(404).send(`No course found with subject name: ${req.params.subject}`);
    }
    else if ((sub) && (timetables == "")) // if instances of the given subject are found, but the course code is not found
    {
        res.status(404).send(`No course found with catalog number: ${req.params.catalog}`);
    } 
    else // all was found properly
    {
        res.send(timetables); // return the time table
    }
});

// get PORT environment variable, or use 3000 if not available
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listeneing on port ${port}...`)) // choose which port to listen on