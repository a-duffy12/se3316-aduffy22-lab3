const Joi = require("joi"); // get joi (for input validation)
const express = require("express"); // get express 
const jdata = require("./Lab3-timetable-data.json"); // json data

//const router = express.Router(); // set router object from express
const app = express();

// GET
app.get("/api/courses", (req, res) => { // get all subjects and classnames

    let courses = ""; // empty string variable to return

    for (c in jdata)
    {
        courses += `${jdata.subject}: ${jdata.className}, `;
    }

    console.log(courses);
    res.send(courses);

});

// GET
// get catalog numbers for a given subject
// return error if subject doen't exist

// GET
// get timetable for a given combo of suject, catalog (and optionally component)
// return error if subject or catalog doesn't exist
// if no component was specified, return timetables for all possible components

// POST
// create a new schedule with a given (entered) name
// creates a list of courses and saves it
// returns error if schedule name already exists

// PUT
// save of list of subject and catalog pairs under a given schedule name
// reutrn error if name does not exist
// replace subject + catalog pairs with new values and new pairs if name does not exist

// GET
// get the subject+catalog pair list when searching by schedule name

// DELETE
// delete an existing schedule with a given name
// return an error if the given schedule doesn't exist

// GET
// get the names of all created schedules and how many courses are saved in each

// DELETE
// delete all created schedules

// sanitization (using Joi?) code

//
function validateCourse(course)
{
    const joiSchema = { // create validation schema
        name: Joi.string().min(3).required()
    };

    return Joi.ValidationError(course, joiSchema);
}

module.exports = router;