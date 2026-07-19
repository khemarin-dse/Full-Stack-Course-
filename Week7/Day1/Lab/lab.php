<?php

// ==========================================
// 1. BASIC PHP
// ==========================================
echo "<h3>1. Basic PHP</h3>";
echo "Hello World!";
echo "<hr>";

// ==========================================
// 2. VARIABLES
// ==========================================
echo "<h3>2. Variables</h3>";
$x = 5;
$y = 10;
echo $x + $y;
echo "<hr>";

// ==========================================
// 3. DATA TYPES
// ==========================================
echo "<h3>3. Data Types</h3>";
$name = "Nova";
$age = 20;
$price = 10.5;

var_dump($name);
echo "<br>";
var_dump($age);
echo "<br>";
var_dump($price);
echo "<hr>";

// ==========================================
// 4. STRINGS
// ==========================================
echo "<h3>4. Strings</h3>";
$text = " Hello PHP ";

echo trim($text);
echo "<br>";
echo substr($text, 1, 5);
echo "<br>";
echo chr(65);
echo "<hr>";

// ==========================================
// 5. NUMBERS & CASTING
// ==========================================
echo "<h3>5. Numbers & Casting</h3>";
$x_cast = 123.45;
echo (int)$x_cast;

echo "<br>";

$y_cast = "456.78";
echo (int)$y_cast;
echo "<hr>";

// ==========================================
// 6. MATH FUNCTIONS
// ==========================================
echo "<h3>6. Math Functions</h3>";
echo pi() . "<br>";
echo min(1, 5, 10) . "<br>";
echo max(1, 5, 10) . "<br>";
echo sqrt(25) . "<br>";
echo rand(1, 10);
echo "<hr>";

// ==========================================
// 7. CONSTANTS
// ==========================================
echo "<h3>7. Constants</h3>";
define("SITE_NAME", "My Website");
echo SITE_NAME;
echo "<hr>";

// ==========================================
// 8. OPERATORS
// ==========================================
echo "<h3>8. Operators</h3>";
$x_op = 10;
$y_op = 3;

echo $x_op + $y_op;
echo "<br>";
echo $x_op % $y_op;
echo "<hr>";

// ==========================================
// 9. COMPARISON
// ==========================================
echo "<h3>9. Comparison</h3>";
$x_comp = 10;
$y_comp = "10";

var_dump($x_comp == $y_comp);
echo "<br>";
var_dump($x_comp === $y_comp);
echo "<hr>";

// ==========================================
// 10. IF ELSE
// ==========================================
echo "<h3>10. If Else</h3>";
$x_cond = 7;

if ($x_cond > 5) {
    echo "Greater";
} else {
    echo "Smaller";
}
echo "<hr>";

// ==========================================
// 11. LOOPS
// ==========================================
echo "<h3>11. Loops</h3>";
echo "<strong>Task 1: for loop</strong><br>";
for ($i = 1; $i <= 5; $i++) {
    echo $i . "<br>";
}

echo "<br><strong>Task 2: foreach loop</strong><br>";
$colors = array("Red", "Green", "Blue");
foreach ($colors as $color) {
    echo $color . "<br>";
}
echo "<hr>";

// ==========================================
// 12. FUNCTIONS
// ==========================================
echo "<h3>12. Functions</h3>";
function greet($name) {
    return "Hello " . $name;
}
echo greet("Student");
echo "<hr>";

// ==========================================
// 13. ARRAYS
// ==========================================
echo "<h3>13. Arrays</h3>";
$cars = array("Volvo", "BMW", "Toyota");
echo $cars[1];
echo "<hr>";

// ==========================================
// 14. MULTIDIMENSIONAL ARRAY
// ==========================================
echo "<h3>14. Multidimensional Array</h3>";
$multi_cars = array(
  array("Volvo", 22),
  array("BMW", 15)
);
echo $multi_cars[1][0];
echo "<hr>";

?>