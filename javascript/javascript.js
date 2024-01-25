const DEFAULT_DISPLAY_VALUE = '0';
const EMPTY_DISPLAY_VALUE = '';
const MAX_DISPLAY_LENGTH = 11;
const ZERO_DIVISOR = 0;

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
const addBtn = document.querySelector('#add-btn');
const subBtn = document.querySelector('#sub-btn');
const mulBtn = document.querySelector('#mul-btn');
const divBtn = document.querySelector('#div-btn');
const equalBtn = document.querySelector('#equal-btn');
const clearBtn = document.querySelector('#clear-btn');
const decimalBtn = document.querySelector('#decimal-btn');
const delBtn = document.querySelector('#del-btn');
const signChangeBtb = document.querySelector('#sign-change-btn');


// Keyboard event Listeners
window.addEventListener('keydown', handleKeyboardInput);

function handleKeyboardInput(e) {
   if (e.key >= 0 && e.key <= 9) {
      populateDisplay(e.key);
   }
   if (e.key === '.' && !decimalBtn.disabled) {
      populateDisplay(decimalBtn.textContent);
      decimalBtn.disabled = true;
   }
   if (e.key === '+') {
      handleOperateBtn('+');
   }
   if (e.key === '-') {
      handleOperateBtn('-');
   }
   if (e.key === '*') {
      handleOperateBtn('*');
   }
   if (e.key === '/') {
      handleOperateBtn('/');
   }
   if (e.key === '=' || e.key === 'Enter') {
      handleEqualBtn();
   }
   if (e.key === 'Delete' || e.key === 'Backspace') {
      handleDeleteBtn();
   }
   if (e.key === 'Escape') {
      clear();
      displayText.textContent = displayVal;
   }
}

// Button event listeners
numberBtns.forEach((button) => {
   button.addEventListener('click', () => {
      let numVal = button.textContent;
      populateDisplay(numVal);
   });
})

operatorBtns.forEach((button) => {
   button.addEventListener('click', () => handleOperateBtn(button.textContent));
});

equalBtn.addEventListener('click', () => handleEqualBtn());

clearBtn.addEventListener('click', ()  => {
   // Clears expression memory
   clear();
   displayText.textContent = displayVal;
});

decimalBtn.addEventListener('click', () => {
   populateDisplay(decimalBtn.textContent);
   decimalBtn.disabled = true;
   toggleDecimalColor(decimalBtn.disabled);
})

delBtn.addEventListener('click', () => handleDeleteBtn());

signChangeBtb.addEventListener('click', () => {
   if (!resetOn && +displayVal !== 0) {
      displayVal = (+displayVal) * (-1);
      displayText.textContent = displayVal;
   }
   else {
      populateDisplay('-');
   }
});

function populateDisplay(num) {
   if (resetOn) {
      displayVal = EMPTY_DISPLAY_VALUE;
      resetOn = false;
   }
   if (expression.prevResult !== undefined) {
      expression.prevResult = undefined;
   }
   if (displayVal === DEFAULT_DISPLAY_VALUE && expression.operand1 === undefined
       && num !== '.') {
      displayVal = num;
   }
   else {
      if (displayVal.toString().length < MAX_DISPLAY_LENGTH) {
         displayVal += num;
      }
      else {
         clear();
         displayText.textContent = 'OVERFLOW!';
         return;
      }
   }
   displayText.textContent = displayVal;
}

function formatDisplay(num) {
   let numIntegerDigits = Math.max(Math.floor(Math.log10(Math.abs(+num))), 0) + 1;
   if (numIntegerDigits > MAX_DISPLAY_LENGTH) {
      clear();
      displayText.textContent = 'OVERFLOW!';
      return;
   }
   let numDigitsAvailable = MAX_DISPLAY_LENGTH - numIntegerDigits;
   if (numDigitsAvailable > 0) {
      displayVal = Math.round((+displayVal + Number.EPSILON) * (10 ** numDigitsAvailable)) / (10 ** numDigitsAvailable);
   }
   displayText.textContent = displayVal;
}

function updateCalc() {
   // displayText.textContent = displayVal;
   formatDisplay(displayVal);
   expression.operand1 = undefined;
   expression.operand2 = undefined;
   toggleOperatorColor(expression.operator, false);
   expression.operator = undefined;
   expression.prevResult = +displayVal;
   resetOn = true;
   decimalBtn.disabled = false;
   toggleDecimalColor(decimalBtn.disabled);
}

function clear() {
   expression.operand1 = undefined;
   expression.operand2 = undefined;
   toggleOperatorColor(expression.operator, false);
   expression.operator = undefined;
   expression.prevResult = undefined;
   displayVal = DEFAULT_DISPLAY_VALUE;
   decimalBtn.disabled = false;
   toggleDecimalColor(decimalBtn.disabled);
}

function handleOperateBtn(operator) {
   if (expression.operator !== undefined) {
      expression.operand2 = +displayVal;
      if (operate(expression.operator, expression.operand1, expression.operand2)) {
         updateCalc();
         expression.operand1 = +displayVal;
         expression.operator = operator;
         toggleOperatorColor(expression.operator, true);
      }
   } else {
      expression.operator = operator;
      toggleOperatorColor(expression.operator, true);
      if (expression.operand1 === undefined){
         if (expression.prevResult === undefined) {
            expression.operand1 = +displayVal;
         }
         else {
            // memory component, allows most recent result to be used
            expression.operand1 = expression.prevResult;
         }
         resetOn = true;
         decimalBtn.disabled = false;
         toggleDecimalColor(decimalBtn.disabled);
      }
   }
}

function handleEqualBtn() {
   if (expression.operand1 === undefined || expression.operator === undefined) { 
      return; 
   }
   expression.operand2 = +displayVal;
   if (operate(expression.operator, expression.operand1, expression.operand2)) {
      updateCalc();
   }
}

function handleDeleteBtn() {
   if (!resetOn && displayVal.toString().length > 0) {
      deletedVal = displayVal.toString().slice(-1);
      if (deletedVal === '.') {
         decimalBtn.disabled = false;
         toggleDecimalColor(decimalBtn.disabled);
      }
      displayVal = displayVal.toString().slice(0, -1);
      displayText.textContent = displayVal;
   }
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
         if (operand2 === ZERO_DIVISOR) {
            clear();
            displayText.textContent = "N/A";
            return;
         }
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

function toggleOperatorColor(operator, toggle) {
   let operatorBtn;
   switch (operator) {
      case '+':
         operatorBtn = addBtn;
         break;
      case '-':
         operatorBtn = subBtn;
         break;
      case '*': 
         operatorBtn = mulBtn;
         break;
      case '/':
         operatorBtn = divBtn;
         break; 
      default:
         return;
   }
   if (toggle) {
      operatorBtn.style.backgroundColor = "rgb(254, 166, 58)";
   }
   else {
      operatorBtn.style.backgroundColor = "rgb(252, 143, 34)";
   }
}

function toggleDecimalColor(toggle) {
   if (toggle) {
      decimalBtn.style.backgroundColor = "rgb(90, 226, 253)";
   }
   else {
      decimalBtn.style.backgroundColor = "rgb(74, 168, 249)";
   }
}