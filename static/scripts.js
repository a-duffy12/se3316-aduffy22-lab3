// front-end js file

// get DOM objects for each function
let output = document.getElementById("output"); // field to print output to
let buttonQ1 = document.getElementById("buttonQ1");
let buttonQ2 = document.getElementById("buttonQ2");
let buttonQ3a = document.getElementById("buttonQ3a");
let buttonQ3b = document.getElementById("buttonQ3b");
let buttonQ4 = document.getElementById("buttonQ4");
let buttonQ5 = document.getElementById("buttonQ5");
let buttonQ6 = document.getElementById("buttonQ6");
let buttonQ7 = document.getElementById("buttonQ7");
let buttonQ8 = document.getElementById("buttonQ8");
let buttonQ9 = document.getElementById("buttonQ9");

// event handlers for each function
buttonQ1.addEventListener("click", displayCourses);
buttonQ2.addEventListener("click", displayCourseCodes);
buttonQ3a.addEventListener("click", displayTimeTableFull);
buttonQ3b.addEventListener("click", displayTimeTableMini);



buttonQ7.addEventListener("click", deleteSchedule);

buttonQ9.addEventListener("click", deleteAllSchedules);

// function to print all subjects + classnames q1
function displayCourses()
{
    clear();

    let data = document.createTextNode("");
    
    let req = new Request("/api/courses", {
        method: "GET",
        headers: new Headers ({
            "Content-Type": "application/json"
        })
    });

    fetch(req)
        .then(res => res.text())
        .then(cons => data.textContent = cons)
        .then(output.appendChild(data))
        .catch(error => console.error("Error: " + error));
}

// function to print all catalogs for a given subject q2
function displayCourseCodes()
{
    let subject = prompt("Please enter a subject code: "); // prompt user for a subject 

    if (sanitize(subject))
    {
        clear();

        let data = document.createTextNode("");
        
        let req = new Request("/api/courses/" + subject, {
            
            method: "GET",
            headers: new Headers ({
                "Content-Type": "application/json"
            })
        });

        fetch(req)
            .then(res => res.text())
            .then(cons => data.textContent = cons)
            .then(output.appendChild(data))
            .catch(error => console.error("Error:" + error));
    }
    else 
    {
        alert("Invalid input!");
    }   
}

// function to get a timetable entry(ies) when given a subject/catalog q3
function displayTimeTableFull()
{
    let subject = prompt("Please enter a subject code: ");
    let catalog = prompt("Please enter a catalog number: ");

    if (sanitize(subject) && sanitize(catalog))
    {
        clear();

        let data = document.createTextNode("");
        let req = new Request("/api/courses/" + subject + "/" + catalog, {

            method: "GET",
            headers: new Headers ({
                "Content-Type": "application/json"
            })
        });

        fetch(req)
            .then(res => res.text())
            .then(cons => data.textContent = cons)
            .then(output.appendChild(data))
            .catch(error => console.error("Error: " + error));
    } 
    else if (sanitize(subject))
    {
        alert("Invalid input for field(s): catalog number!");
    }
    else if (sanitize(catalog))
    {
        alert("Invalid input for field(s): subject code!");
    }
    else
    {
        alert("Invalid input for field(s): subject code, catalog number");
    }
}

// function to get a timetable entry(ies) when given a subject/catalog/component) q3
function displayTimeTableMini()
{
    let subject = prompt("Please enter a subject code: ");
    let catalog = prompt("Please enter a catalog number: ");
    let component = prompt("Please enter a course component: ");

    if (sanitize(subject) && sanitize(catalog) && sanitize(component))
    {
        clear();

        let data = document.createTextNode("");
        let req = new Request("/api/courses/" + subject + "/" + catalog + "/" + component, {

            method: "GET",
            headers: new Headers ({
                "Content-Type": "application/json"
            })
        });

        fetch(req)
            .then(res => res.text())
            .then(cons => data.textContent = cons)
            .then(output.appendChild(data))
            .catch(error => console.error("Error: " + error));
    } 
    else if (sanitize(subject) && sanitize(component))
    {
        alert("Invalid input for field(s): catalog number!");
    }
    else if (sanitize(catalog) && sanitize(component))
    {
        alert("Invalid input for field(s): subject code!");
    }
    else if (sanitize(subject) && sanitize(catalog))
    {
        alert("Invalid input for field(s): component!");
    }
    else if (sanitize(component))
    {
        alert("Invalid input for field(s): subject code, catalog number");
    }
    else if (sanitize(subject))
    {
        alert("Invalid input for field(s): catalog number, component");
    }
    else if (sanitize(catalog))
    {
        alert("Invalid input for field(s): subject code, component");
    }
    else
    {
        alert("Invalid input for field(s): subject code, catalog number, component");
    }
}

// function to create a new schedule with subject+catalog pairs and a given name q4

// function to save a list of subject+catalog pairs under a given name, should be used to
// overwrite an existing schedule of the same name q5

// function to print the subject+catalog pairs in a given schedule q6

// function to delete a schedule with a given name q7
function deleteSchedule() 
{
    let schedule = prompt("Please enter a schedule name: ");

    if (sanitize(schedule))
    {
        clear();

        let data = document.createTextNode("");
        let req = new Request("/api/schedules/" + schedule, {
            
            method: "DELETE",
            headers: new Headers ({
                "Content-Type": "application/json"
            })
        });

        fetch(req)
            .then(res => res.text())
            .then(cons => data.textContent = cons)
            .then(output.appendChild(data))
            .catch(error => console.error("Error: " + error));
    }
    else 
    {
        alert("Invalid input!");
    }
}

// function to list all schedule names and the number of courses within them q8

// function to delete all schedules q9
function deleteAllSchedules()
{
    clear();

    let data = document.createTextNode("");
    let req = new Request("/api/schedules", {
            
        method: "DELETE",
        headers: new Headers ({
            "Content-Type": "application/json"
        })
    });

    fetch(req)
        .then(res => res.text())
        .then(cons => data.textContent = cons)
        .then(output.appendChild(data))
        .catch(error => console.error("Error: " + error));
}

// function to sanitize alphanumeric input on the front end
function sanitize(input)
{
    if (/^[a-zA-Z0-9]+$/.test(input))
    {
        return true;
    }
    else
    {
        return false;
    }
}

// function to sanitize numerical input on the front end
function sanitizeNum(input)
{
    if ((/^[0-9]+$/.text(input)) && (input > 0))
    {
        return true;
    }
    else
    {
        return false;
    }
}

// function to clear existing results
function clear()
{
    output.textContent = "";
}