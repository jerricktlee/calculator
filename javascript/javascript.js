const DEFAULT_DISPLAY_VALUE = '0';
const EMPTY_DISPLAY_VALUE = '';
const MAX_DISPLAY_LENGTH = 11;

let expression = {
   operand1: undefined,
   operand2: undefined,
   operator: undefined,
   prevResult: undefined,
};
let displayVal = DEFAULT_DISPLAY_VALUE;
let resetOn = false;

const displayText = document.querySelector('#display-text'); 
const numberBtns = document.querySelectorAll('.number-btn');
const operatorBtns = document.querySelectorAll('.operator-btn');
const equalBtn = document.querySelector('#equal-btn');
const clearBtn = document.querySelector('#clear-btn');

// Button event listeners
numberBtns.forEach((button) => {
   button.addEventListener('click', () => {
      let numVal = button.textContent;
      populateDisplay(numVal);
   });
})

operatorBtns.forEach((button) => {
   button.addEventListener('click', () => {
      if (expression.operator !== undefined) {
         expression.operand2 = +displayVal;
         if (operate(expression.operator, expression.operand1, expression.operand2)) {
            updateCalc();
            expression.operand1 = +displayVal;
            expression.operator = button.textContent;
         }
      } else {
         expression.operator = button.textContent;
         if (expression.operand1 === undefined){
            if (expression.prevResult === undefined) {
               expression.operand1 = +displayVal;
            }
            else {
               // memory component, allows most recent result to be used
               expression.operand1 = expression.prevResult;
            }
            resetOn = true;
         }
      }
   });
})

equalBtn.addEventListener('click', () => {
   if (expression.operand1 === undefined || expression.operator === undefined) { 
      return; 
   }
   expression.operand2 = +displayVal;
   if (operate(expression.operator, expression.operand1, expression.operand2)) {
      updateCalc();
   }
})

clearBtn.addEventListener('click', ()  => {
   // Clears expression memory
   expression.operand1 = undefined;
   expression.operand2 = undefined;
   expression.operator = undefined;
   expression.prevResult = undefined;

   displayVal = DEFAULT_DISPLAY_VALUE;
   displayText.textContent = displayVal;
});



function populateDisplay(num) {
   if (resetOn) {
      displayVal = EMPTY_DISPLAY_VALUE;
      resetOn = false;
   }
   if (expression.prevResult !== undefined) {
      expression.prevResult = undefined;
   }
   if (displayVal === DEFAULT_DISPLAY_VALUE && expression.operand1 === undefined) {
      displayVal = num;
   }
   else {
      displayVal += num;
   }
   displayText.textContent = displayVal;
}

function updateCalc() {
   displayText.textContent = displayVal;
   expression.operand1 = undefined;
   expression.operand2 = undefined;
   expression.operator = undefined;
   expression.prevResult = +displayVal;
   resetOn = true;

}

function operate(operator, operand1, operand2) {
   let result;
   switch (operator) {
      case '+':
         result = add(operand1, operand2); 
         break;
      case '-':
         result = subract(operand1, operand2);
         break;
      case '*': 
         result = multiply(operand1, operand2);
         break;
      case '/':
         result = divide(operand1, operand2);
         break; 
      default:
         return false;
   }
   if (result === NaN) {
      return false;
   }
   displayVal = result;
   return true;
}

// All basic math operators
function add(operand1, operand2) {
   return operand1 + operand2;
}

function subract(operand1, operand2) {
   return operand1 - operand2;
}

function multiply(operand1, operand2) {
   return operand1 * operand2;
}

function divide(operand1, operand2) {
   return operand1 / operand2;
}

/* Notes:
Things to work on:

Need to truncate and limit the numbers
9 decimal places
*/