const express = require("express"); // get express 
const router = express.Router(); // create router obejct
const j1data = require("./data/Lab3-timetable-data.json"); // json data for courses
const j2data = require("./data/Lab3-schedule-data.json"); // json data for schedules

const app = express(); // create app constant
const cdata = JSON.parse(JSON.stringify(j1data)); // parse json object holding the courses
const sdata = JSON.parse(JSON.stringify(j2data)); // parse json object holding the schedules

router.use(express.json()); // allows express to parse json objects (middleware)

app.use("/", express.static("static")); // folder where client-side code is stored

app.use((req, res, next) => { // middleware function to do console logs
    console.log(`${req.method} request for ${req.url}`); // print to console
    next(); // continue processeing
});

router.get("/", (req, res) => { // get all subjects and classnames

    let courses = ""; // empty string variable to return

    for (c in cdata)
    {
        courses += `${cdata[c].subject}: ${cdata[c].className}, `;
    }

    res.send(courses);

});

router.get("/:subject", (req, res) => { // get catalog numbers for a given subject

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

router.get("/:subject/:catalog", (req, res) => { // get the timetable entry for a subjcet and catalog

    let timetables = "";
    let sub = false;

    for (c in cdata)
    {
        if (cdata[c].subject == req.params.subject)
        {
            sub = true; // found at least one instance of the subject

            if (cdata[c].catalog_nbr == req.params.catalog)
            {
                for (p in cdata[c].course_info) // iterate through all class sections
                {
                    timetables += `Class number: ${cdata[c].course_info[p].class_nbr} Component type: ${cdata[c].course_info[p].ssr_component}`;

                    for (d in cdata[c].course_info[p].days) // build timetable by day
                    {
                        timetables += `, ${cdata[c].course_info[p].days[d]}: ${cdata[c].course_info[p].start_time} - ${cdata[c].course_info[p].end_time}`;
                    }
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

router.get("/:subject/:catalog/:component", (req, res) => { // get the timetable entry for a subjcet and catalog

    let timetables = "";
    let sub = false;
    let cat = false;

    for (c in cdata)
    {
        if (cdata[c].subject == req.params.subject)
        {
            sub = true; // found at least one instance of the subject

            if (cdata[c].catalog_nbr == req.params.catalog)
            {
                cat = true;

                for (p in cdata[c].course_info) // iterate through all class sections
                {
                    if (cdata[c].course_info[p].ssr_component == req.params.component) // check for the given component
                    {
                        timetables += `Class number: ${cdata[c].course_info[p].class_nbr}`;

                        for (d in cdata[c].course_info[p].days) // build timetable by day
                        {
                            timetables += `, ${cdata[c].course_info[p].days[d]}: ${cdata[c].course_info[p].start_time} - ${cdata[c].course_info[p].end_time}`;
                        }
                    } 
                }
            }
        }
    }

    if (!sub) // if no instances of the given subject are found
    {
        res.status(404).send(`No course found with subject name: ${req.params.subject}`);
    }
    else if ((sub) && (!cat)) // if instances of the given subject are found, but the course code is not found
    {
        res.status(404).send(`No course found with catalog number: ${req.params.catalog}`);
    }
    else if ((sub) && (cat) && (timetables == "")) // if the subject and code are found, but the component is not available
    {
        res.status(404).send(`No course found with specified component: ${req.params.component}`);
    } 
    else // all was found properly
    {
        res.send(timetables); // return the time table
    }
});

router.put("/:schedule", (req, res) => {

    const newSchedule = req.body; // get info for the new schedule
    newSchedule.name = req.params.schedule; // set name for new schedule

    const exIndex = sdata.findIndex(s => s.name === newSchedule.name); // find index existing schedule of same name
    
    if (exIndex >= 0) // if overwriting an existing schedule
    {
        sdata[exIndex] = newSchedule; // replace existing schedule with request body
    }
    else if (exIndex < 0) // if adding a new schedule
    {
        sdata.push(newSchedule);
    }

    res.send("ting");
});

router.post("/:schedule", (req, res) => {

    const newSchedule = req.body; // get info for the updated schedule
    newSchedule.name = req.params.schedule; // get name for the updated schedule

    const exIndex = sdata.findIndex(s => s.name === newSchedule.name); // find index of existing schedule of same name

    if (exIndex >= 0) // if updating an existing schedule
    {
        sdata[exIndex] = newSchedule; // update
    }
    else if (exIndex < 0) // if schedule doesn't exist
    {
        res.status(404).send(`No schedule found with name: ${newSchedule.name}`);
    }
});

app.use("/api/courses", router); // install router object path

// get PORT environment variable, or use 3000 if not available
const port = process.env.PORT || 3000;
app.listen(port, () => {console.log(`Listeneing on port ${port}`)}); // choose which port to listen on