const EXPRESSION_NUMBER_TYPE = 0;
const EXPRESSION_OPERATION_TYPE = 1;

class Expression {
    constructor(value, type){
        this.type = type;
        this.value = value;
    }
}

class Calculator {
    constructor(){
        this.numberBuffer = [];
        this.expressionBuffer = [];
        this.allowedOperation = ['+', '-', '*', '/']
    }

    isAllowedOperation(char) {
        if (char instanceof String && char.length != 0) {
            return this.allowedOperation.includes(char.charAt(0));
        }

        return false;
    }

    flushNumberBuffer() {
        if (this.numberBuffer.length == 0) {
            return undefined;
        }
        
        let number = 0;
        // 1 2 = (1 * 10^1) + (2 * 10^0)
        for (let i = this.numberBuffer.length - 1; i >= 0; i--) {
            number += this.numberBuffer[this.numberBuffer.length - i - 1] * Math.pow(10, i);
        }

        this.deleteAllDigits();

        return number;
    }

    numberBufferHasValue() {
        return this.numberBuffer.length != 0;
    }

    expressionBufferHasNumber() {
        if (this.expressionBuffer.length == 0) {
            return false
        }

        return this.expressionBuffer[this.expressionBuffer.length - 1].type == EXPRESSION_NUMBER_TYPE;
    }

    addDigit(digit) {
        if (Number.isInteger(digit)) {
            this.numberBuffer.push(digit);
        }
        else {
            console.error(`Value '${digit}' is not a digit`)
        }
    }

    deleteDigit() {
        if (this.numberBufferHasValue()) {
            this.numberBuffer.pop();
            return true;
        }
        
        return false;
    }

    deleteAllDigits() {
        this.numberBuffer = [];
    }

    clearCalculator() {
        this.deleteAllDigits();

        this.expressionBuffer = [];
    }

    // 1 + 2 + 3
    addOperation(operation) {
        // No number available to perform a binary operation
        if (!this.expressionBufferHasNumber() && !this.numberBufferHasValue()) {
            return false;
        }

        let val = undefined;

        if (this.expressionBuffer.length != 0) {
            var lastElement = this.expressionBuffer[this.expressionBuffer.length - 1];

            // The last expression is also an operation, replace it with a new one
            if (this.isAllowedOperation(lastElement.value)) {
                this.expressionBuffer.pop();
            } else {
                val = lastElement.value;
            }
        }

        this.expressionBuffer = [];

        if (this.allowedOperation.includes(operation)) {
            let number = this.flushNumberBuffer();

            if (number == undefined) {
                number = val;
            }

            let operationNode = new Expression(operation, EXPRESSION_OPERATION_TYPE);
            let numberNode = new Expression(number, EXPRESSION_NUMBER_TYPE);

            this.expressionBuffer.push(operationNode);
            this.expressionBuffer.push(numberNode);
        }

        return true;
    }
    evaluate() {
        let number = this.flushNumberBuffer();

        if (number != undefined) {
            this.expressionBuffer.push(new Expression(number, EXPRESSION_NUMBER_TYPE));
        }

        let returnValue = 0;
        let result = [];
        let lastOp = undefined;

        for (let i = 0; i < this.expressionBuffer.length; i++) {
            const exp = this.expressionBuffer[i];

            if (exp.type == EXPRESSION_OPERATION_TYPE) {
                lastOp = exp.value;
            }
            else if (exp.type == EXPRESSION_NUMBER_TYPE) {
                if (result.length > 2 && lastOp != undefined) {
                    if (lastOp == '+') {
                        returnValue += result[0] + result[1];
                    } else if (lastOp == '-') {
                        returnValue += result[0] - result[1];
                    } else if (lastOp == '*') {
                        returnValue += result[0] * result[1];
                    } else if (lastOp == '/') {
                        if (result[1] == 0) {
                            alert('Não é possível dividir por 0.');
                        } else {
                            returnValue += result[0] / result[1];
                        }
                    }

                    result = [ returnValue ];

                    lastOp = undefined;
                } else {
                    result.push(exp.value);
                }
            }
        }

        if (result.length == 2 && lastOp != undefined) {
            if (lastOp == '+') {
                returnValue += result[0] + result[1];
            } else if (lastOp == '-') {
                returnValue += result[0] - result[1];
            } else if (lastOp == '*') {
                returnValue += result[0] * result[1];
            } else if (lastOp == '/') {
                if (result[1] == 0) {
                    alert('Não é possível dividir por 0.');
                } else {
                    returnValue += result[0] / result[1];
                }
            }
        }

        if (returnValue != undefined) {
            const valueStr = returnValue.toString();

            for (let i = 0; i < valueStr.length; i++) {
                this.addDigit(parseInt(valueStr.charAt(i)));
            }
        }

        this.expressionBuffer = [];

        return returnValue;
    }
}

const calculator = new Calculator();
const calculatorDisplay = document.getElementById('display');
let clearDisplayOnNextInput = false;

function sendCalculatorCommand(command) {
    let charCode = command.charCodeAt(0);

    if (clearDisplayOnNextInput) {
        clearDisplayOnNextInput = false;
        calculatorDisplay.innerHTML = '';
    }

    if (charCode >= 48 && charCode <= 57) {
        let number = charCode - 48;

        calculator.addDigit(number);
        calculatorDisplay.innerHTML += command;
    } else {
        if (command == 'add') {
            if (calculator.addOperation('+')) {
                calculatorDisplay.innerHTML = '+';
                clearDisplayOnNextInput = true;
            }
        } else if (command == 'subtract') {
            if (calculator.addOperation('-')) {
                calculatorDisplay.innerHTML = '-';
                clearDisplayOnNextInput = true;
            }
        } else if (command == 'multiply') {
            if (calculator.addOperation('*')) {
                calculatorDisplay.innerHTML = '*';
                clearDisplayOnNextInput = true;
            }
        } else if (command == 'divide') {
            if (calculator.addOperation('/')) {
                calculatorDisplay.innerHTML = '/';
                clearDisplayOnNextInput = true;
            }
        } else if (command == 'delete-character') {
            if (calculatorDisplay.innerHTML.length != 0) {
                if (calculator.deleteDigit()) {
                    calculatorDisplay.innerHTML = calculatorDisplay.innerHTML.substring(0, calculatorDisplay.innerHTML.length - 1);
                }
            }
        } else if (command == 'clear') {
            calculator.deleteAllDigits();
            calculatorDisplay.innerHTML = '';
        } else if (command == 'clear-everything') {
            calculator.clearCalculator();
            calculatorDisplay.innerHTML = '';
        } else if (command == 'evaluate') {
            let result = calculator.evaluate();
            calculatorDisplay.innerHTML = result;
        }
    }
}