const express = require("express"); // get express 
const fs = require("fs"); // get fs module
const j1data = require("./data/Lab3-timetable-data.json"); // json data for courses
const j2data = require("./data/Lab3-schedule-data.json"); // json data for schedules
const sfile = "./data/Lab3-schedule-data.json"; // file holding json data for scehdules

const app = express(); // create app constant
const crouter = express.Router(); // create router obejct for courses
const srouter = express.Router(); // create router object for schedules
const cdata = JSON.parse(JSON.stringify(j1data)); // parse json object holding the courses

crouter.use(express.json()); // allows express to parse json objects (middleware)
srouter.use(express.json()); // allows express to parse json objects (middleware)

app.use("/", express.static("static")); // folder where client-side code is stored

app.use((req, res, next) => { // middleware function to do console logs
    console.log(`${req.method} request for ${req.url}`); // print to console
    next(); // continue processeing
});

crouter.get("/", (req, res) => { // get all subjects and course codes Q1

    let courses = []; // empty array variable to return

    for (c in cdata)
    {
        let obj = {}; // create empty object
        obj.subject = cdata[c].subject; // add subject
        obj.catalog = cdata[c].catalog_nbr; // add course code
        courses.push(obj); // add object to array
    }

    res.send(courses);

});

crouter.get("/:subject", (req, res) => { // get catalog numbers for a given subject Q2

    let catalog = []; // empty string variable to return

    for (c in cdata)
    {
        if (cdata[c].subject == req.params.subject)
        {
            let obj = {}; // create empty obj
            obj.catalog = cdata[c].catalog_nbr; // add course code
            catalog.push(obj); // add object to array
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

crouter.get("/:subject/:catalog", (req, res) => { // get the timetable entry for a subjcet and catalog Q3a

    let timetables = [];
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
                    let obj = {}; // create empty object
                    obj.number = cdata[c].course_info[p].class_nbr; // add class number
                    obj.component = cdata[c].course_info[p].ssr_component; // add component type
                    obj.times = [];

                    for (d in cdata[c].course_info[p].days) // build timetable by day
                    {
                        let obj2 = {};
                        obj2.day = cdata[c].course_info[p].days[d]; // add day
                        obj2.start = cdata[c].course_info[p].start_time; // add start time
                        obj2.end = cdata[c].course_info[p].end_time; // add end time
                        obj.times.push(obj2); // add object to nested array
                    }

                    timetables.push(obj); // add object to array
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

crouter.get("/:subject/:catalog/:component", (req, res) => { // get the timetable entry for a subjcet and catalog Q3b

    let timetables = [];
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
                        let obj = {}; // create empty object
                        obj.number = cdata[c].course_info[p].class_nbr; // add class number
                        obj.component = cdata[c].course_info[p].ssr_component; // add component type
                        obj.times = [];

                        for (d in cdata[c].course_info[p].days) // build timetable by day
                        {
                            let obj2 = {};
                            obj2.day = cdata[c].course_info[p].days[d]; // add day
                            obj2.start = cdata[c].course_info[p].start_time; // add start time
                            obj2.end = cdata[c].course_info[p].end_time; // add end time
                            obj.times.push(obj2); // add object to nested array
                        }

                        timetables.push(obj); // add object to array
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

srouter.post("/:schedule", (req, res) => { // create a new schedule with a given name Q4

    sdata = getScheduleData(j2data); // get up to date schedule data

    const newSchedule = req.body; // get info for the updated schedule
    newSchedule.name = req.params.schedule; // get name for the updated schedule

    const exIndex = sdata.findIndex(s => s.name === newSchedule.name); // find index of existing schedule of same name

    if (exIndex >= 0) // if schedule already exists
    {
        res.status(404).send(`Schedule already exists with name: ${newSchedule.name}`);
    }
    else if (exIndex < 0) // create a new schedule
    {
        sdata.push(newSchedule); // add new schedule to the array
        res.send(`Created schedule with name: ${newSchedule.name}`);
    }

    setScheduleData(sdata, sfile); // send updated schedules array to JSON file
});

srouter.put("/:schedule", (req, res) => { // save a schedule by overwriting an existing one Q5

    sdata = getScheduleData(j2data); // get up to date schedule data

    const newSchedule = req.body; // get info for the new schedule
    newSchedule.name = req.params.schedule; // set name for new schedule

    const exIndex = sdata.findIndex(s => s.name === newSchedule.name); // find index existing schedule of same name
    
    if (exIndex >= 0) // if the schedule does exist
    {
        sdata[exIndex] = newSchedule; // replace existing schedule with updated schedule
        res.send(`Updated schedule with name: ${newSchedule.name}`);
    }
    else if (exIndex < 0) // if the schedule does not exist
    {
        res.status(404).send(`No schedule found with name: ${newSchedule.name}`);
    }

    setScheduleData(sdata, sfile); // send updated schedules array to JSON file
});

srouter.get("/:schedule", (req, res) => { // get list of subject and catalog pairs in given schedule Q6

    sdata = getScheduleData(j2data); // get up to date schedule data

    const exIndex = sdata.findIndex(s => s.name === req.params.schedule); // find index of existing schedule of same name

    if (exIndex >= 0) // if the schedule exists
    {
        res.send(sdata[exIndex].classes); // send array of class pairs from specified schedule
    }
    else if (exIndex < 0) // if the schedule doesn't exist
    {
        res.status(404).send(`No schedule found with name: ${req.params.schedule}`);
    }
});

srouter.delete("/:schedule", (req, res) => { // delete a schedule with given name Q7
   
    sdata = getScheduleData(j2data); // get up to date schedule data

    const exIndex = sdata.findIndex(s => s.name === req.params.schedule); // find index of existing schedule of same name

    if (exIndex >= 0) // if the schedule exists
    {
        sdata = sdata.filter(s => s.name != req.params.schedule); // retain all array elements except the one with the specified name
        res.send(`Deleted schedule with name: ${req.params.schedule}`)
    }
    else if (exIndex < 0) // if the schedule doesn't exist
    {
        res.status(404).send(`No schedule found with name: ${req.params.schedule}`);
    }

    setScheduleData(sdata, sfile); // send updated schedules array to JSON file
});

srouter.get("/", (req, res) => { // get a list of schedule names and the number of courses in each Q8

    sdata = getScheduleData(j2data); // get up to date schedule data

    if (sdata.length > 0) // if there are saved schedules
    {
        let schedules = []; // empty array of schedule objects

        for (s in sdata)
        {
            const obj = {}; // create empty object
            obj.name = sdata[s].name; // add schedule name
            obj.course_count = sdata[s].classes.length; // add number of classes
            schedules.push(obj); // add object to array
        }

        res.send(schedules); // send the new array to the front end
    }
    else // if there are no saved schedules
    {
        res.status(404).send("No schedules exist");
    }
});

srouter.delete("/", (req, res) => {

    sdata = getScheduleData(j2data); // get up to date schedule data

    if (sdata.length > 0) // if there are saved schedules
    {
        sdata.length = 0; // delete all schedule elements

        res.send("Deleted all schedules");
    }
    else // if there are no saved schedules
    {
        res.status(404).send("No schedules exist");
    }

    setScheduleData(sdata, sfile); // send updated schedules array to JSON file
});

app.use("/api/courses", crouter); // install router object path for courses
app.use("/api/schedules", srouter) // install router object path for schedules

// get PORT environment variable, or use 3000 if not available
const port = process.env.PORT || 3000;
app.listen(port, () => {console.log(`Listeneing on port ${port}`)}); // choose which port to listen on

// function to read from JSON file before each usage of the sdata array
function getScheduleData(file)
{
    return JSON.parse(JSON.stringify(file)); // parse json object holding the schedules;
};

// function to write to JSON file after each update to sdata array
function setScheduleData(array, file)
{
    let data = JSON.stringify(array); // turn given array into JSON 
    
    fs.writeFile(file, data, error => {

        if (error) // if an error is thrown when writing
        {
            throw error;
        }

        console.log(`Successfully wrote to file with name: ${file}`);
    })
};

// function to validate input
function validateInput(input) 
{ 
    return true; // TODO
};

