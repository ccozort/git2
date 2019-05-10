console.log("Hello world!");
var x = 42;
var y = 54;
var z = x + y;
var myVariable = "Bob";
var myOthervariable = "Stevenson";
var heroHitpoints = "100";
var heroName = "Glug";
var heroClass = "winner";
console.log(z);
console.log(myVariable + myOthervariable);

// alert(z);

console.log();

// we javascript now
const square = function(x) {
    return x * x;
};
console.log(square(12));
// 144

var myHeading = document.querySelector('h1');
myHeading.textContent = (Math.floor(Math.random()*20))+1;
