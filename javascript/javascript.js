let operand1;
let operand2;
let operator;

function operate(operator, operand1, operand2) {
   switch (operator) {
      case '+':
         return add(operand1, operand2); 
         break;
      case '-':
         return subract(operand1, operand2);
         break;
      case '*': 
         return multiply(operand1, operand2);
         break;
      case '/':
         return divide(operand1, operand2); 
         break;
      default:
         return;
         break;
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