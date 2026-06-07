// Welcome Visitor Message
alert("Welcome to my portfolio website!")

// Create Profile Class
class Profile {

    constructor(name, role) {
        this.name = name;
        this.role = role;
    }

    introduce() {
        return `${this.name} - ${this.role}`;
    }

}
const profile =
    new Profile(
        "Your Name",
        "Frontend Developer"
    );

console.log(profile.introduce());

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
const user = new User("Nova");

console.log(user.name);

user.name = "John";

console.log(user.name);

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
const skill =
    new ProgrammingSkill("JavaScript");

console.log(skill.name);

// Show/Hide About Me Section
document
    .getElementById("toggleAbout")
    .addEventListener("click", () => {

        const about =
            document.getElementById("about");

        about.classList.toggle("hidden");

    });

// Add SKills Dynamically
document
    .getElementById("addSkillBtn")
    .addEventListener("click", () => {

        const input =
            document.getElementById("skillInput");

        const skill =
            document.createElement("li");

        skill.textContent =
            input.value;

        document
            .getElementById("skillList")
            .appendChild(skill);

        input.value = "";

    });

// Load Portfolio Data Using Promise
function loadPortfolio() {

    return new Promise((resolve) => {

        setTimeout(() => {

            resolve({
                name: "Nova Liev",
                role: "Fullstack Developer"
            });

        }, 2000);

    });

}

// Async / Await
async function getPortfolio() {

    const data =
        await loadPortfolio();

    console.log(data);

}

getPortfolio();

// Contact Form Event
document
    .querySelector("form")
    .addEventListener("submit", (event) => {

        event.preventDefault();

        alert("Message Sent Successfully");

    });

// Browser BOM
console.log(
    screen.width
);

console.log(
    screen.height
);

console.log(
    navigator.userAgent
);

// Cookies
document.cookie =
    "visitor=Student";
console.log(
    document.cookie
);