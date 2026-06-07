// Practice JavaScript Output
console.log("Hello Student!");
document.write("Welcome to JavaScript Lab<br>");
alert("Welcome Student!");

// Practice Input
let name = prompt("Enter your name:");
console.log("Student Name:", name);

let confirmResult = confirm("Are you ready to learn JavaScript?");
console.log("Confirm Result:", confirmResult);

// Practice Variables
var school = "SmallLabs";
let age = 20;
const pi = 3.14;

console.log(school);
console.log(age);
console.log(pi);

// Practice Data Types
let username = "Tana";
let score = 95;
let isPassed = true;
let student = {
    name: "Dara",
    age: 18
};

console.log(typeof username);
console.log(typeof score);
console.log(typeof isPassed);
console.log(typeof student);

// Practice Operators
let a = 10;
let b = 5;

console.log("Add:", a + b);
console.log("Subtract:", a - b);
console.log("Multiply:", a * b);
console.log("Divide:", a / b);

console.log(10 > 5);
console.log(10 == "10");
console.log(10 === "10");

console.log(true && false);
console.log(true || false);
console.log(!true);

// Practice Conditional Statements
let studentAge = 18;

if (studentAge >= 18) {
    console.log("You are an adult");
}

let scoreResult = 85;

if (scoreResult >= 90) {
    console.log("Grade A");
} else if (scoreResult >= 80) {
    console.log("Grade B");
} else {
    console.log("Grade C");
}

// Practice Switch
let day = 2;

switch (day) {
    case 1:
        console.log("Monday");
        break;
    case 2:
        console.log("Tuesday");
        break;
    default:
        console.log("Unknown day");
}

// Practice Loops
for (let i = 0; i < 5; i++) {
    console.log("For loop:", i);
}

let x = 0;
while (x < 3) {
    console.log("While loop:", x);
    x++;
}

let y = 0;
do {
    console.log("Do while loop:", y);
    y++;
} while (y < 3);

// Practice Functions
function showWelcome() {
    alert("Welcome Student!");
}

function addNumber(a, b) {
    return a + b;
}

console.log(addNumber(10, 20));

const multiply = (a, b) => {
    return a * b;
};

console.log(multiply(5, 4));

// Practice Array
let students = ["Dara", "Sokha", "Bopha"];

console.log(students);
console.log(students[0]);

students[1] = "Pisey";
console.log(students);

students.push("Vanna");
console.log(students);

students.pop();
console.log(students);

for (let student of students) {
    console.log(student);
}