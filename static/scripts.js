// front-end js file

// get DOM objects for each function and apply event handlers
let output = document.getElementById("output"); // field to print output to
let outTitle = document.getElementById("out-title"); // header to hold title for output
let outList = document.getElementById("out-list"); // ordered list to print output into
let buttonQ1 = document.getElementById("buttonQ1").addEventListener("click", displayCourses);
let buttonQ2 = document.getElementById("buttonQ2").addEventListener("click", displayCourseCodes);
let buttonQ3 = document.getElementById("buttonQ3").addEventListener("click", displayTimeTable);
let buttonQ4 = document.getElementById("buttonQ4").addEventListener("click", createSchedule);
let buttonQ5 = document.getElementById("buttonQ5").addEventListener("click", updateSchedule);
let buttonQ6 = document.getElementById("buttonQ6").addEventListener("click", displaySchedule);
let buttonQ7 = document.getElementById("buttonQ7").addEventListener("click", deleteSchedule);
let buttonQ8 = document.getElementById("buttonQ8").addEventListener("click", displayAllSchedules);
let buttonQ9 = document.getElementById("buttonQ9").addEventListener("click", deleteAllSchedules);

// function to print all subjects + classnames q1
function displayCourses()
{
    clear();
    
    let req = new Request("/api/courses", {method: "GET"});

    fetch(req)
        .then(res => {
            if (res.ok) // if the response is a 200, output returned json
            {
                res.json()
                .then(data => {
                    outTitle.appendChild(document.createTextNode("Displaying all courses"));
                    data.forEach(d => {
                        let el = document.createElement("li"); // create empty list element
                        el.appendChild(document.createTextNode(`Subject is ${d.subject}, course code is ${d.catalog}`)); // create text for list element
                        outList.appendChild(el); // add new element to list
                    })
                })
                .catch(error => console.error("Error: " + error));
            }
            else // if the response is not a 200, print the response
            {
                res.text()
                .then(data => { outTitle.appendChild(document.createTextNode(data));})
                .catch(error => console.error("Error: " + error));
            }
        })
        .catch();
}

// function to print all catalogs for a given subject q2
function displayCourseCodes()
{
    let subject = prompt("Please enter a subject code: "); // prompt user for a subject 

    if (validate(subject) && (subject.length < 9))
    {
        clear();
       
        let req = new Request("/api/courses/" + subject, {method: "GET"});

        fetch(req)
            .then(res => {
                if (res.ok) // if the response is a 200, output returned json
                {
                    res.json()
                    .then(data => {
                        outTitle.appendChild(document.createTextNode(`Displaying all course codes in ${subject}`)); // list which subject's courses are being displayed
                        data.forEach(d => {
                            let el = document.createElement("li"); // create empty list element
                            el.appendChild(document.createTextNode(`${d.catalog}`)); // create text for list element
                            outList.appendChild(el); // add new element to list 
                        })
                    })
                    .catch(error => console.error("Error:" + error));
                }
                else // if the response is not a 200, print the response
                {
                    res.text()
                    .then(data => { outTitle.appendChild(document.createTextNode(data));})
                    .catch(error => console.error("Error: " + error));
                }
            })
            .catch();       
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
        if (validate(subject) && validate(catalog) && (subject.length < 9) && (catalog.length < 6))
        {
            clear();

            let req = new Request("/api/courses/" + subject + "/" + catalog, {method: "GET"});
            outList.setAttribute("id", "out-list-mod"); // change id for the output list to get different styling

            fetch(req)
                .then(res => {
                    if (res.ok) // if the response is a 200, output returned json
                    {
                        res.json()
                        .then(data => {
                            outTitle.appendChild(document.createTextNode(`Displaying timetable data for ${subject}: ${catalog}`));
                            let i = 0; // create iterator for differently colored components
                            data.forEach(d => {
                                let el = document.createElement("li"); // create empty list element
                                el.setAttribute("id", `comp${i}`); // add unique tag to the list element
                                let ul = document.createElement("ul"); // create empty ordered list
                                el.appendChild(document.createTextNode(`Class number: ${d.number}, component: ${d.component}`)); // create text for list element
                                (d.times).forEach( t => {
                                    let el2 = document.createElement("li"); // create empty list element
                                    el2.appendChild(document.createTextNode(`${t.day}: ${t.start} - ${t.end}`));
                                    ul.appendChild(el2);
                                })
                                el.appendChild(ul); // add new list into larger list element
                                outList.appendChild(el); // add new element to list 
                                i++; // iterator for different colors of components
                            })
                        })
                        .catch(error => console.error("Error: " + error));
                    }
                    else // if the response is not a 200, print the response
                    {
                        res.text()
                        .then(data => { outTitle.appendChild(document.createTextNode(data));})
                        .catch(error => console.error("Error: " + error));
                    }
                })
                .catch();
                    
        } 
        else if (validate(subject) && (subject.length < 9))
        {
            alert("Invalid input for field(s): catalog number!");
        }
        else if (validate(catalog) && (catalog.length < 6))
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

        if (validate(subject) && validate(catalog) && validate(component) && (subject.length < 9) && (catalog.length < 6) && (component.length < 4))
        {
            clear();

            let req = new Request("/api/courses/" + subject + "/" + catalog + "/" + component, {method: "GET"});
            outList.setAttribute("id", "out-list-mod"); // change id for the output list to get different styling

            fetch(req)
                .then(res => {
                    if (res.ok) // if the response is a 200, output returned json
                    {
                        res.json()
                        .then(data => {
                            outTitle.appendChild(document.createTextNode(`Displaying timetable data for ${subject}: ${catalog}, ${component} component`));
                            let el = document.createElement("li"); // create empty list element
                            let ul = document.createElement("ul"); // create empty ordered list
                            el.appendChild(document.createTextNode(`Class number: ${data[0].number}`)); // create text for list element
                            (data[0].times).forEach( t => {
                                let el2 = document.createElement("li"); // create empty list element
                                el2.appendChild(document.createTextNode(`${t.day}: ${t.start} - ${t.end}`));
                                ul.appendChild(el2);
                            })
                            el.appendChild(ul); // add new list into larger list element
                            outList.appendChild(el); // add new element to list 
                        })
                        .catch(error => console.error("Error: " + error));
                    }
                    else // if the response is not a 200, print the response
                    {
                        res.text()
                        .then(data => { outTitle.appendChild(document.createTextNode(data));})
                        .catch(error => console.error("Error: " + error));
                    }
                })
                .catch();
        } 
        else if (validate(subject) && validate(component) && (subject.length < 9) && (component.length < 4))
        {
            alert("Invalid input for field(s): catalog number!");
        }
        else if (validate(catalog) && validate(component) && (catalog.length < 6) && (component.length < 4))
        {
            alert("Invalid input for field(s): subject code!");
        }
        else if (validate(subject) && validate(catalog) && (subject.length < 9) && (catalog.length < 6))
        {
            alert("Invalid input for field(s): component!");
        }
        else if (validate(component) && (component.length < 4))
        {
            alert("Invalid input for field(s): subject code, catalog number");
        }
        else if (validate(subject) && (subject.length < 9))
        {
            alert("Invalid input for field(s): catalog number, component");
        }
        else if (validate(catalog) && (catalog.length < 6))
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
function createSchedule()
{
    let name = prompt("Please enter a name for your schedule: ");
    let count = prompt("Please enter how many courses you would like to add (max 15):");

    if (validate(name) && validateNum(count) && parseInt(count) < 16)
    {
        clear();

        let sch = {}; // empty object to hold schedule data
        sch.classes = []; // empty array to hold class pairs

        for (let i=0; i<count; i++)
        {
            let pair = {}; // empty object to hold class pair
            let ps = prompt(`Please enter subject ${i+1}: `);
            let pc = prompt(`Please enter course code ${i+1}: `);
            pair.subject_code = ps;
            pair.course_code = pc;
            (sch.classes).push(pair); // add new course pair into schedule
        }

        let req = new Request("/api/schedules/" + name, {
            
            method: "POST",
            headers: new Headers ({
                "Content-Type": "application/json"
            }),
            body: JSON.stringify(sch)
        }); 

        console.log(sch);
        fetch(req)
            .then(res => res.text())
            .then(data => { outTitle.appendChild(document.createTextNode(data));})
            .catch(error => console.error("Error: " + error));
    }
    else if (validate(name) && validateNum(count))
    {
        alert("Invalid input, maximum number of courses is 15!");
    }
    else if (validate(name))
    {
        alert("Inavlid input, must enter a number between 1 and 15 for course count!");
    }
    else if (validateNum(count) && parseInt(count) < 16)
    {
        alert("Invalid input for schedule name!");
    }
    else if (validateNum(count))
    {
        alert("Invalid input for schedule name, and maximum number of courses is 15!");
    }
    else
    {
        alert("Invalid input for schedule name, and must enter a number between 1 and 15 for course count!")
    }
}

// function to save a list of subject+catalog pairs under a given name, should be used to
// overwrite an existing schedule of the same name q5
function updateSchedule()
{
    let name = prompt("Please enter the name of the schdule use wish to update: ");
    let count = prompt("Please enter how many courses you would like to add (max 15):");

    if (validate(name) && validateNum(count) && parseInt(count) < 16)
    {
        clear();

        let sch = {}; // empty object to hold schedule data
        sch.classes = []; // empty array to hold class pairs

        for (let i=0; i<count; i++)
        {
            let pair = {}; // empty object to hold class pair
            let ps = prompt(`Please enter subject ${i+1}: `);
            let pc = prompt(`Please enter course code ${i+1}: `);
            pair.subject_code = ps;
            pair.course_code = pc;
            (sch.classes).push(pair); // add new course pair into schedule
        }

        let req = new Request("/api/schedules/" + name, {
            
            method: "PUT",
            headers: new Headers ({
                "Content-Type": "application/json"
            }),
            body: JSON.stringify(sch)
        }); 

        console.log(sch);
        fetch(req)
            .then(res => res.text())
            .then(data => { outTitle.appendChild(document.createTextNode(data));})
            .catch(error => console.error("Error: " + error));
    }
    else if (validate(name) && validateNum(count))
    {
        alert("Invalid input, maximum number of courses is 15!");
    }
    else if (validate(name))
    {
        alert("Inavlid input, must enter a number between 1 and 15 for course count!");
    }
    else if (validateNum(count) && parseInt(count) < 16)
    {
        alert("Invalid input for schedule name!");
    }
    else if (validateNum(count))
    {
        alert("Invalid input for schedule name, and maximum number of courses is 15!");
    }
    else
    {
        alert("Invalid input for schedule name, and must enter a number between 1 and 15 for course count!")
    }
}

// function to print the subject+catalog pairs in a given schedule q6
function displaySchedule()
{
    let schedule = prompt("Please enter a schedule name: ");

    if (validate(schedule))
    {
        clear();

        let req = new Request("/api/schedules/" + schedule, {method: "GET"});

        fetch(req)
            .then(res => {
                if (res.ok) // if the response is a 200, output returned json
                {
                    res.json()
                    .then(data => {
                        outTitle.appendChild(document.createTextNode(`Schedule ${schedule}`));
                        data.forEach(d => {
                            let el = document.createElement("li"); // create empty list element
                            el.appendChild(document.createTextNode(`${d.subject_code} - ${d.course_code}`)); // create text for list element
                            outList.appendChild(el); // add new element to list
                        })
                    })
                    .catch(error => console.error("Error: " + error));
                }
                else // if the response is not a 200, print the response
                {
                    res.text()
                    .then(data => { outTitle.appendChild(document.createTextNode(data));})
                    .catch(error => console.error("Error: " + error));
                }
            })
            .catch();
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

        let req = new Request("/api/schedules/" + schedule, {method: "DELETE"});

        fetch(req)
            .then(res => res.text())
            .then(data => { outTitle.appendChild(document.createTextNode(data));})
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

    let req = new Request("/api/schedules", {method: "GET"});

    fetch(req)
        .then(res => {
            if (res.ok) // if the response is a 200, output returned json
            {
                res.json()
                .then(data => {
                    outTitle.appendChild(document.createTextNode("Displaying all schedules"));
                    data.forEach(d => {
                        let el = document.createElement("li"); // create empty list element
                        el.appendChild(document.createTextNode(`Schedule ${d.name} contains ${d.course_count} courses`)); // create text for list element
                        outList.appendChild(el); // add new element to list
                    })
                })
                .catch(error => console.error("Error: " + error));
            }
            else // if the response is not a 200, print the response
            {
                res.text()
                .then(data => { outTitle.appendChild(document.createTextNode(data));})
                .catch(error => console.error("Error: " + error));
            }
        })
        .catch();          
}

// function to delete all schedules q9
function deleteAllSchedules()
{
    clear();

    let req = new Request("/api/schedules", {method: "DELETE"});

    fetch(req)
        .then(res => res.text())
        .then(data => { outTitle.appendChild(document.createTextNode(data));})
        .catch(error => console.error("Error: " + error));
}

// function to sanitize alphanumeric input on the front end
function validate(input)
{
    if (String(input).includes("{") || String(input).includes("}") || String(input).includes("[") || String(input).includes("]") || String(input).includes("<") || String(input).includes(">") || String(input).includes(";") || String(input).includes(".") || String(input).includes(",") || String(input).includes("/") || String(input).includes("(") || String(input).includes(")") || String(input).includes("*") || String(input).includes("*") || String(input).includes("'") || String(input).includes("_"))
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
    outTitle.textContent =  ""; // clear header content

    while(outList.firstChild) // remove all list elements
    {
        outList.removeChild(outList.firstChild);
    }
    outList.setAttribute("id", "out-list"); // reset id of output list
}