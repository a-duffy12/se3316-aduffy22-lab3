// front-end js file

// get DOM objects for each function
let output = document.getElementById("output"); // field to print output to
let buttonQ1 = document.getElementById("buttonQ1"); // button to call function q1
let buttonQ2 = document.getElementById("buttonQ2"); // button to call function q2
let buttonQ3 = document.getElementById("buttonQ3"); // button to call functon q3

// event handlers for each function
buttonQ1.addEventListener("click", displayCourses);
buttonQ2.addEventListener("click", displayCourseCodes);
buttonQ3.addEventListener("click", displayTimeTable);

// function to print all subjects + classnames q1
function displayCourses()
{
    clear();

    let data = document.createTextNode("");
    
    let req = new Request("/api/courses", {
        method: "GET",
        headers: new Headers ({
            "Content-Type": "text/plain"
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
    let subject = prompt("Please enter a subject code: ", ""); // prompt user for a subject 

    if (sanitize(subject))
    {
        clear();

        let data = document.createTextNode("");
        
        let req = new Request("/api/courses/" + subject, {
            method: "GET",
            headers: new Headers ({
                "Content-Type": "text/plain"
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
        alert("Invalid input!")
    }   
}

// function to get a timetable entry(ies) when given a subject/catalog/(component) q3
function displayTimeTable()
{
    let subject = prompt("Please enter a subject code: ", "");
    let catalog = prompt("Please enter a catalog number: ", "");

    if (sanitize(subject) && sanitize(catalog))
    {
        clear();

        let data = document.createTextNode("");
        let req = new Request("/api/courses/" + subject + "/" + catalog, {

            method: "GET",
            headers: new Headers ({
                "Content-Type": "text/plain"
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
        alert("Invalid input for field(s): catalog number!")
    }
    else if (sanitize(catalog))
    {
        alert("Invalid input for field(s): subject code!")
    }
    else
    {
        alert("Invalid input for field(s): subject code, catalog number")
    }
}

// function to create a new schedule with subject+catalog pairs and a given name q4

// function to save a list of subject+catalog pairs under a given name, should be used to
// overwrite an existing schedule of the same name q5

// function to print the subject+catalog pairs in a given schedule q6

// function to delete a schedule with a given name q7

// function to list all schedule names and the number of courses within them q8

// function to delete all schedules q9

// function to sanitize input on the front end
function sanitize(input)
{
    return true; //TODO
}

// function to clear existing results
function clear()
{
    output.textContent = "";
}