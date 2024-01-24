const DEFAULT_DISPLAY_VALUE = '0';
const EMPTY_DISPLAY_VALUE = '';

let expression = {
   operand1: undefined,
   operand2: undefined,
   operator: undefined,
};
let displayVal = DEFAULT_DISPLAY_VALUE;

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
      expression.operator = button.textContent;
      if (expression.operand1 === undefined) {
         expression.operand1 = +displayVal;
         displayVal = EMPTY_DISPLAY_VALUE;
      }
   });
})

equalBtn.addEventListener('click', () => {
   expression.operand2 = +displayVal;
   displayVal = operate(expression.operator, expression.operand1, expression.operand2);
   displayText.textContent = displayVal;
})

clearBtn.addEventListener('click', ()  => {
   // Clears expression memory
   expression.operand1 = undefined;
   expression.operand2 = undefined;
   expression.operator = undefined;
   
   displayVal = DEFAULT_DISPLAY_VALUE;
   displayText.textContent = displayVal;
});



function populateDisplay(num) {
   if (displayVal == DEFAULT_DISPLAY_VALUE && expression.operand1 === undefined) {
      displayVal = num;
   }
   else {
      displayVal += num;
   }
   displayText.textContent = displayVal;
}

function operate(operator, operand1, operand2) {
   switch (operator) {
      case '+':
         return add(operand1, operand2); 
      case '-':
         return subract(operand1, operand2);
      case '*': 
         return multiply(operand1, operand2);
      case '/':
         return divide(operand1, operand2); 
      default:
         return;
   }
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