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
        obj.className = cdata[c].className; // add course code
        courses.push(obj); // add object to array
    }

    res.send(courses);

});

crouter.get("/:subject", (req, res) => { // get catalog numbers for a given subject Q2

    if (sanitizeInput(req.params.subject, 9))
    {
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
    }
    else  
    {
        res.status(400).send("Invalid input!");
    }
});

crouter.get("/:subject/:catalog", (req, res) => { // get the timetable entry for a subjcet and catalog Q3a

    if (sanitizeInput(req.params.subject, 9) && sanitizeInput(req.params.catalog, 6))
    {
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
    }
    else 
    {
        res.status(400).send("Invalid input!");   
    }
});  

crouter.get("/:subject/:catalog/:component", (req, res) => { // get the timetable entry for a subjcet and catalog Q3b

    if (sanitizeInput(req.params.subject, 9) && sanitizeInput(req.params.catalog, 6) && sanitizeInput(req.params.component, 4))
    {
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
    }
    else
    {
        res.status(400).send("Invalid input!"); 
    }
    
});

//Q4 + Q5 + Q6 + Q7
srouter.route("/:schedule") // all routes that access a particular schedule
    .post((req, res) => { // create a new schedule with a given name Q4

        if (sanitizeInput(req.params.schedule, 100) && sanitizeInput(req.body, 1000)) // both header and body are valid
        {
            sdata = getScheduleData(j2data); // get up to date schedule data

            const newSchedule = req.body; // get info for the updated schedule
            newSchedule.name = req.params.schedule; // get name for the updated schedule

            const exIndex = sdata.findIndex(s => s.name === newSchedule.name); // find index of existing schedule of same name

            if (exIndex >= 0) // if schedule already exists
            {
                res.status(400).send(`Schedule already exists with name: ${newSchedule.name}`);
            }
            else if (exIndex < 0) // create a new schedule
            {       
                sdata.push(newSchedule); // add new schedule to the array
                res.send(`Created schedule with name: ${newSchedule.name}`);   
            }

            setScheduleData(sdata, sfile); // send updated schedules array to JSON file
        }
        else if (sanitizeInput(req.params.schedule, 100)) // only header is valid
        {
            res.status(400).send("Schedule cannot be created due to inavlid input in request body");
        }
        else if (sanitizeInput(req.body, 1000)) // only body is valid
        {
            res.status(400).send("Schedule cannot be created due to invalid input in request header");
        }
        else // neither header nor body are valid
        {
            res.status(400).send("Schedule cannot be created due to invalid input in request header and request body");
        }
    })
    .put((req, res) => { // save a schedule by overwriting an existing one Q5

        if (sanitizeInput(req.params.schedule, 100) && sanitizeInput(req.body, 1000)) // both header and body are valid
        {
            sdata = getScheduleData(j2data); // get up to date schedule data
    
            const newSchedule = req.body; // get info for the new schedule
            newSchedule.name = req.params.schedule; // set name for new schedule
        
            const exIndex = sdata.findIndex(s => s.name === newSchedule.name); // find index existing schedule of same name
        
            if (exIndex >= 0) // if the schedule does exist
            {
                if (newSchedule.classes.length > 0) // if the schedule is not empty
                {
                    sdata[exIndex] = newSchedule; // replace existing schedule with updated schedule
                    res.send(`Updated schedule with name: ${newSchedule.name}`);
                }
                else // if schedule is empty
                {
                    res.status(400).send(`Unable to add zero courses, cannot update schedule with name: ${newSchedule.name}`)
                } 
            }
            else if (exIndex < 0) // if the schedule does not exist
            {
                res.status(404).send(`No schedule found with name: ${newSchedule.name}`);
            }
        
            setScheduleData(sdata, sfile); // send updated schedules array to JSON file    
        }
        else if (sanitizeInput(req.params.schedule, 100)) // only header is valid
        {
            res.status(400).send("Schedule cannot be updated due to inavlid input in request body");
        }
        else if (sanitizeInput(req.body, 1000)) // only body is valid
        {
            res.status(400).send("Schedule cannot be updated due to invalid input in request header");
        }
        else // neither header nor body are valid
        {
            res.status(400).send("Schedule cannot be updated due to invalid input in request header and request body");
        }
    })
    .get((req, res) => { // get list of subject and catalog pairs in given schedule Q6

        if (sanitizeInput(req.params.schedule, 100))
        {
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
        }
        else
        {
            res.status(400).send("Invalid input!");    
        }
    })
    .delete( (req, res) => { // delete a schedule with given name Q7
   
        if (sanitizeInput(req.params.schedule, 100))
        {
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
        }
        else
        {
            res.status(400).send("Invalid input!");
        }
    })

// Q8 + Q9
srouter.route("/") // all routes that access all schedules
    .get((req, res) => { // get a list of schedule names and the number of courses in each Q8

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
    })
    .delete((req, res) => { // delete all created schedules

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
    })

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
    fs.writeFile(file, JSON.stringify(array), error => {

        if (error) // if an error is thrown when writing
        {
            throw error;
        }

        console.log(`Successfully wrote to file with name: ${file}`);
    })
};

// function to alphanumeric input
function sanitizeInput(input, l) 
{ 
    // limit is 1000 characters, as test cases with 15 courses (max amount) were always in the range of 700-800 characters
    if (String(input).includes("<") || String(input).includes(">") || String(input).includes(".") || String(input).includes("/") || String(input).includes("(") || String(input).includes(")") || String(input).includes("*") || String(input).includes("'") || String(input).includes("_") || String(input).includes("=") || String(input).includes("$") || String(input).includes("?") || String(input).includes("!") || String(input).includes("%") || String(input).includes("\"") || String(input).includes("`") || String(input).includes("+") || String(input).includes("|") || String(input).includes("&") || String(input).length >= l || String(input).length < 1)
    {
        return false;
    }
    else
    {
        return true;
    }
};