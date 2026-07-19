// Welcome message
alert("Welcome to my portfolio website!");

// Cookie
document.cookie = "visitor=Student";

// Class
class Profile {
    constructor(name, role) {
        this.name = name;
        this.role = role;
    }

    introduce() {
        return `${this.name} - ${this.role}`;
    }
}

// Getter and Setter
class User {
    constructor(name) {
        this._name = name;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }
}

// Inheritance
class Skill {
    constructor(name) {
        this.name = name;
    }
}

class ProgrammingSkill extends Skill {
    constructor(name) {
        super(name);
    }
}

// Profile Object
const profile = new Profile("Phat Khemarin", "Frontend Developer Student");

document.getElementById("logoName").textContent = profile.name;
document.getElementById("heroName").textContent = profile.name;
document.getElementById("heroRole").textContent = profile.role;

console.log(profile.introduce());

// Getter and Setter Test
const user = new User("Khemarin");
console.log(user.name);

user.name = "Student";
console.log(user.name);

// Inheritance Test
const jsSkill = new ProgrammingSkill("JavaScript");
console.log(jsSkill.name);

// Show / Hide About
document.getElementById("toggleAbout").addEventListener("click", function () {
    document.getElementById("about").classList.toggle("hidden");
});

// Add Skill Dynamically
document.getElementById("addSkillBtn").addEventListener("click", function () {
    const input = document.getElementById("skillInput");
    const value = input.value.trim();

    if (value === "") {
        alert("Please enter a skill");
        return;
    }

    const card = document.createElement("div");
    card.className = "bg-white p-6 rounded-lg shadow text-center";

    card.innerHTML = `
        <h3 class="text-xl font-semibold text-blue-600">${value}</h3>
    `;

    document.getElementById("skillCards").appendChild(card);

    input.value = "";
});

// Promise
function loadProjects() {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve([
                {
                    title: "Portfolio Website",
                    description: "A responsive portfolio website using HTML and Tailwind CSS.",
                    tech: "HTML, Tailwind CSS"
                },
                {
                    title: "Landing Page",
                    description: "A modern landing page design for a small business.",
                    tech: "HTML, CSS"
                },
                {
                    title: "JavaScript Mini App",
                    description: "A simple interactive web app using JavaScript DOM.",
                    tech: "JavaScript, DOM"
                },
                {
                    title: "JavaScript Mini App",
                    description: "A simple interactive web app using JavaScript DOM.",
                    tech: "JavaScript, DOM"
                }
            ]);
        }, 2000);
    });
}

// Async / Await
async function displayProjects() {
    const projects = await loadProjects();

    const projectList = document.getElementById("projectList");

    projectList.innerHTML = "";

    projects.forEach(function (project) {
        const card = document.createElement("div");

        card.className = "border rounded-lg p-6 shadow hover:shadow-lg transition";

        card.innerHTML = `
            <h3 class="text-xl font-bold text-gray-900 mb-3">${project.title}</h3>
            <p class="text-gray-600 mb-4">${project.description}</p>
            <p class="text-sm text-blue-600 font-medium mb-4">${project.tech}</p>
            <a href="#" class="text-blue-600 hover:underline">View Project</a>
        `;

        projectList.appendChild(card);
    });
}

displayProjects();

// Contact Form Event
document.getElementById("contactForm").addEventListener("submit", function (event) {
    event.preventDefault();

    document.getElementById("formMessage").textContent =
        "Message Sent Successfully!";
});

// Browser BOM
document.getElementById("screenWidth").textContent = screen.width;
document.getElementById("screenHeight").textContent = screen.height;
document.getElementById("browserName").textContent = navigator.userAgent;
document.getElementById("cookieText").textContent = document.cookie;

// Mobile Menu
document.getElementById("menuBtn").addEventListener("click", function () {
    document.getElementById("menu").classList.toggle("hidden");
});

// Dark Mode
document.getElementById("darkModeBtn").addEventListener("click", function () {
    document.body.classList.toggle("bg-gray-900");
    document.body.classList.toggle("text-white");
});


// ===============================
// Web Form Validation API
// ===============================

const contactForm = document.getElementById("contactForm");
const ageInput = document.getElementById("age");
const ageError = document.getElementById("ageError");
const formResult = document.getElementById("formResult");

contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!ageInput.checkValidity()) {
        ageError.textContent = ageInput.validationMessage;
        return;
    }

    ageError.textContent = "";

    formResult.textContent =
        "Message sent successfully!";

    localStorage.setItem(
        "contactName",
        document.getElementById("name").value
    );

    sessionStorage.setItem(
        "draftMessage",
        document.getElementById("message").value
    );

    contactForm.reset();
});

// ===============================
// localStorage
// ===============================

const visitorName = document.getElementById("visitorName");
const saveLocalBtn = document.getElementById("saveLocalBtn");
const localResult = document.getElementById("localResult");

localResult.textContent =
    localStorage.getItem("visitorName") || "No data";

saveLocalBtn.addEventListener("click", function () {
    localStorage.setItem(
        "visitorName",
        visitorName.value
    );

    localResult.textContent =
        localStorage.getItem("visitorName");

    visitorName.value = "";
});

// ===============================
// sessionStorage
// ===============================

const draftMessage = document.getElementById("draftMessage");
const saveSessionBtn = document.getElementById("saveSessionBtn");
const sessionResult = document.getElementById("sessionResult");

sessionResult.textContent =
    sessionStorage.getItem("draftMessage") || "No draft";

saveSessionBtn.addEventListener("click", function () {
    sessionStorage.setItem(
        "draftMessage",
        draftMessage.value
    );

    sessionResult.textContent =
        sessionStorage.getItem("draftMessage");

    draftMessage.value = "";
});

// ===============================
// Geolocation API
// ===============================

const locationBtn = document.getElementById("locationBtn");
const locationResult = document.getElementById("locationResult");

locationBtn.addEventListener("click", function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            showPosition,
            showError
        );
    } else {
        locationResult.textContent =
            "Geolocation is not supported by this browser.";
    }
});

function showPosition(position) {
    locationResult.innerHTML = `
        <p><strong>Latitude:</strong> ${position.coords.latitude}</p>
        <p><strong>Longitude:</strong> ${position.coords.longitude}</p>
    `;
}

function showError() {
    locationResult.textContent =
        "Unable to get location. Please allow location permission.";
}

// ===============================
// Fetch API
// ===============================

const fetchBtn = document.getElementById("fetchBtn");
const axiosBtn = document.getElementById("axiosBtn");
const apiResult = document.getElementById("apiResult");

fetchBtn.addEventListener("click", function () {
    apiResult.innerHTML =
        "<p class='col-span-3 text-center'>Loading with Fetch API...</p>";

    fetch("https://jsonplaceholder.typicode.com/users")
        .then(function (response) {
            if (!response.ok) {
                throw new Error("HTTP Error");
            }

            return response.json();
        })
        .then(function (data) {
            displayUsers(data.slice(0, 6));
        })
        .catch(function (error) {
            apiResult.innerHTML =
                `<p class="text-red-600">${error}</p>`;
        });
});

// ===============================
// Axios
// ===============================

axiosBtn.addEventListener("click", function () {
    apiResult.innerHTML =
        "<p class='col-span-3 text-center'>Loading with Axios...</p>";

    axios
        .get("https://jsonplaceholder.typicode.com/users/1")
        .then(function (response) {
            displayUsers([response.data]);
        })
        .catch(function (error) {
            apiResult.innerHTML =
                `<p class="text-red-600">${error}</p>`;
        });
});

// ===============================
// Display API Data
// ===============================

function displayUsers(users) {
    apiResult.innerHTML = "";

    users.forEach(function (user) {
        const card = document.createElement("div");

        card.className =
            "border rounded-lg p-6 shadow bg-gray-50";

        card.innerHTML = `
            <h3 class="text-xl font-bold text-gray-900 mb-2">
                ${user.name}
            </h3>

            <p class="text-gray-600">
                ${user.email}
            </p>

            <p class="text-sm text-blue-600 mt-3">
                ${user.company.name}
            </p>
        `;

        apiResult.appendChild(card);
    });
}

// ===============================
// JSON.parse()
// ===============================

document
    .getElementById("parseBtn")
    .addEventListener("click", function () {

        const jsonText =
            `{
                "name": "John",
                "age": 25,
                "skills": ["HTML", "CSS", "JavaScript"]
            }`;

        const objectData =
            JSON.parse(jsonText);

        document.getElementById("parseResult").textContent =
            "Name: " + objectData.name + "\\n" +
            "Age: " + objectData.age + "\\n" +
            "Skills: " + objectData.skills.join(", ");
    });

// ===============================
// JSON.stringify()
// ===============================

document
    .getElementById("stringifyBtn")
    .addEventListener("click", function () {

        const student = {
            name: "Anna",
            age: 22,
            isStudent: true,
            skills: ["HTML", "Tailwind CSS", "JavaScript"]
        };

        const json =
            JSON.stringify(student, null, 2);

        document.getElementById("stringifyResult").textContent =
            json;
    });