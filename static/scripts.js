// front-end js file

// get DOM objects for each function
let output = document.getElementById("output"); // field to print output to
let buttonQ1 = document.getElementById("buttonQ1");
let buttonQ2 = document.getElementById("buttonQ2");
let buttonQ3 = document.getElementById("buttonQ3")
let buttonQ4 = document.getElementById("buttonQ4");
let buttonQ5 = document.getElementById("buttonQ5");
let buttonQ6 = document.getElementById("buttonQ6");
let buttonQ7 = document.getElementById("buttonQ7");
let buttonQ8 = document.getElementById("buttonQ8");
let buttonQ9 = document.getElementById("buttonQ9");

// event handlers for each function
buttonQ1.addEventListener("click", displayCourses);
buttonQ2.addEventListener("click", displayCourseCodes);
buttonQ3.addEventListener("click", displayTimeTable);


buttonQ6.addEventListener("click", displaySchedule);
buttonQ7.addEventListener("click", deleteSchedule);
buttonQ8.addEventListener("click", displayAllSchedules);
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

    if (validate(subject))
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

// function to get a timetable entry(ies) when given a subject/catalog/(component) q3
function displayTimeTable()
{
    let subject = prompt("Please enter a subject code: ");
    let catalog = prompt("Please enter a catalog number: ");
    let longV = prompt("If you would like to search for a specific component, type 'yes'\nIf you would like to view all components, type anything else");


    if (longV.toLocaleLowerCase() != "yes")
    {
            if (validate(subject) && validate(catalog))
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
        else if (validate(subject))
        {
            alert("Invalid input for field(s): catalog number!");
        }
        else if (validate(catalog))
        {
            alert("Invalid input for field(s): subject code!");
        }
        else
        {
            alert("Invalid input for field(s): subject code, catalog number");
        }
    }
    else if (longV.toLowerCase() == "yes")
    {
        let component = prompt("Please enter a course component: ");

        if (validate(subject) && validate(catalog) && validate(component))
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
        else if (validate(subject) && validate(component))
        {
            alert("Invalid input for field(s): catalog number!");
        }
        else if (validate(catalog) && validate(component))
        {
            alert("Invalid input for field(s): subject code!");
        }
        else if (validate(subject) && validate(catalog))
        {
            alert("Invalid input for field(s): component!");
        }
        else if (validate(component))
        {
            alert("Invalid input for field(s): subject code, catalog number");
        }
        else if (validate(subject))
        {
            alert("Invalid input for field(s): catalog number, component");
        }
        else if (validate(catalog))
        {
            alert("Invalid input for field(s): subject code, component");
        }
        else
        {
            alert("Invalid input for field(s): subject code, catalog number, component");
        }
    }  
}

// function to create a new schedule with subject+catalog pairs and a given name q4

// function to save a list of subject+catalog pairs under a given name, should be used to
// overwrite an existing schedule of the same name q5

// function to print the subject+catalog pairs in a given schedule q6
function displaySchedule()
{
    let schedule = prompt("Please enter a schedule name: ");

    if (validate(schedule))
    {
        clear();

        let data = document.createTextNode("");
        let req = new Request("/api/schedules/" + schedule, {
            
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
    else 
    {
        alert("Invalid input!");
    }
}

// function to delete a schedule with a given name q7
function deleteSchedule() 
{
    let schedule = prompt("Please enter a schedule name: ");

    if (validate(schedule))
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
function displayAllSchedules()
{
    clear();

    let data = document.createTextNode("");
    let req = new Request("/api/schedules", {
        
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
function validate(input)
{
    if (String(input).includes("{") || String(input).includes("}") || String(input).includes("[") || String(input).includes("]") || String(input).includes("<") || String(input).includes(">") || String(input).includes(";") || String(input).includes(".") || String(input).includes(",") || String(input).includes("/") || String(input).includes("(") || String(input).includes(")") || String(input).includes("*") || String(input).includes("*") || String(input).includes("'") || String(input).includes("_") || String(input).includes("-"))
    {
        return false;
    }
    else
    {
        return true;
    }
}

// function to sanitize numerical input on the front end
function validateNum(input)
{
    if ((/^[0-9]+$/.test(input)) && (input > 0))
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