function isString(str) {
    return typeof(str) == 'string' || str instanceof String;
}

function arrayToString(array) {
    return array.flat().join('');
}

/** Represents a generic operation. */
class Operation {
    /**
     * Creates an instance of a generic operation.
     * @param {String} name - The name of the operation.
     */
    constructor(name) {
        this.name = name;
    }

    /**
     * Evaluates the current operation.
     * @returns {undefined}
     */
    evaluate() {
        return undefined;
    }
}

/** Represents an operation with a single argument. */
class UnaryOperation extends Operation {
    /**
     * Creates an instance of an unary operation.
     * @param {String} name - The name of the operation.
     * @param {Number} arg1 - The argument of the operation.
     */
    constructor(name, arg1) {
        super(name);

        this.arg1 = arg1;
    }
}

/** Represents an operation with two arguments. */
class BinaryOperation extends Operation {
    /**
     * Creates an instance of a binary operation.
     * @param {String} name - The name of the operation.
     * @param {Number} arg1 - The first argument of the operation.
     * @param {Number} arg2 - The second argument of the operation.
     */
    constructor(name, arg1, arg2) {
        super(name);

        this.arg1 = arg1;
        this.arg1 = arg2;
    }
}

/** Represents the sign flip operation. */
class ChangeSignOperation extends UnaryOperation {
    static name = 'change-sign';

    /**
     * Creates an instance of a sign flip operation.
     * @param {Number} arg1 - The argument of the operation.
     */
    constructor(arg1) {
        super(ChangeSignOperation.name, arg1);
    }
}

/** Represents the add operation. */
class AddOperation extends BinaryOperation {
    static name = 'add';

    /**
     * Creates an instance of an addition operation.
     * @param {Number} arg1 - The first argument of the addition.
     * @param {Number} arg2 - The second argument of the addition.
     */
    constructor(arg1, arg2) {
        super(AddOperation.name, arg1, arg2);
    }

    /**
     * Evaluates the current addition.
     * @returns {Number} The result of the addition.
     * */
    evaluate() {
        return arg1 + arg2;
    }
}

/** Represents the subtract operation. */
class SubtractOperation extends BinaryOperation {
    static name = 'subtract';

    /**
     * Creates an instance of a subtraction operation.
     * @param {Number} arg1 - The first argument of the subtraction.
     * @param {Number} arg2 - The second argument of the subtraction.
     */
    constructor(arg1, arg2) {
        super(SubtractOperation.name, arg1, arg2);
    }

    /**
     * Evaluates the current subtraction.
     * @returns {Number} The result of the subtraction.
     * */
    evaluate() {
        return arg1 - arg2;
    }
}

/** Represents the multiply operation. */
class MultiplyOperation extends BinaryOperation {
    static name = 'multiply';

    /**
     * Creates an instance of a multiplication operation.
     * @param {Number} arg1 - The first argument of the multiplication.
     * @param {Number} arg2 - The second argument of the multiplication.
     */
    constructor(arg1, arg2) {
        super(MultiplyOperation.name, arg1, arg2);
    }

    /**
     * Evaluates the current multiplication.
     * @returns {Number} The result of the multiplication.
     * */
    evaluate() {
        return arg1 * arg2;
    }
}

/**
 * Represents the divide operation.
 */
class DivideOperation extends BinaryOperation {
    static name = 'divide';

    /**
     * Creates an instance of a division operation.
     * @param {Number} arg1 - The first argument of the division.
     * @param {Number} arg2 - The second argument of the division.
     */
    constructor(arg1, arg2) {
        super(DivideOperation.name, arg1, arg2);
    }

    /**
     * Evaluates the current division.
     * @returns {Number} The result of the division.
     * */
    evaluate() {
        return arg1 / arg2;
    }
}

/**
 * A class that manipulates an array of numbers and operations.
 */
class ExpressionBuilder {
    constructor() {
        this.currentOperation = undefined;
        this.operations = [];
        this.operands = [];
    }

    addOperator(operator) {
        if (isString(operator)) {
            this.operations.push(operator);
            return true;
        }

        return false;
    }

    addOperand(number) {
        if (!Number.isNaN(number)) {
            this.operands.push(number);
            return true;
        }

        return false;
    }

    updateLastOperand(number) {
        if (!Number.isNaN(number) && this.operands.length > 0) {
            this.operands[this.operands.length - 1] = number;

            return true;
        }

        return false;
    }

    removeOperand() {
        return this.operands.pop() != undefined;
    }

    resetExpression() {
        this.operands = [];
        this.operations = [];
        this.lastOperator = undefined;
    }

    evaluate2() {
        let result = 0;
        let numbers = [];

        let reversedOperands = this.operands.toReversed();
        let reversedOperations = this.operations.toReversed();

        for (const number of reversedOperands) {
            if (numbers.length == 1 && reversedOperations) {

            }
        }
    }

    evaluate() {
        let op = undefined;

        if (this.operands.length == 2) {
            const number1 = this.operands[0];
            const number2 = this.operands[1];

            switch (this.currentOperation) {
                case AddOperation.name:
                    op = new AddOperation(number1, number2);

                case SubtractOperation.name:
                    op = new SubtractOperation(number1, number2);

                case MultiplyOperation.name:
                    op = new MultiplyOperation(number1, number2);

                case DivideOperation.name:
                    op = new DivideOperation(number1, number2);

                default:
                    if (this.currentOperation instanceof BinaryOperation) {
                        op = this.currentOperation;
                    }
            }
        } else if (this.operands.length == 1) {
            const number = this.operands[0];

            switch (this.currentOperation) {
                case ChangeSignOperation.name:
                    return new ChangeSignOperation(number);
                
                default:
                    if (this.currentOperation instanceof UnaryOperation) {
                        op = this.currentOperation;
                    }
            }
        }

        let result = op.evaluate();

        if (result != undefined) {
            this.operands = [];
            this.currentOperation = undefined;
        }

        return result;
    }
}

class CalculatorDisplay {
    constructor(numberSeparator) {
        this.numberSeparator = numberSeparator;
        this.upperDisplay = [];
        this.lowerDisplay = [];
    }

    pushDigit(digit) {
        const num = parseInt(digit);

        if (Number.isNaN(num)) {
            return false;
        }
        
        this.lowerDisplay.push(num);
        return true;
    }

    pushNumberSeparator() {
        if (this.lowerDisplay.includes(this.numberSeparator)) {
            return false;
        }

        if (this.lowerDisplay.length == 0) {
            this.pushDigit(0);
        }

        this.lowerDisplay.push(this.numberSeparator);
        return true;
    }

    pushOperator(operator) {
        if (this.lowerDisplay.length == 0) {
            return false;
        }

        this.upperDisplay.push(this.getDisplayString('lower'));
        this.upperDisplay.push(' ');
        this.upperDisplay.push(operator);
        this.upperDisplay.push(' ');

        this.clear('lower');

        return true;
    }

    popCharacter() {
        return this.lowerDisplay.pop();
    }

    clearAll() {
        this.upperDisplay = [];
        this.lowerDisplay = [];
    }

    clear(display) {
        if (display == 'upper') {
            this.upperDisplay = [];
        } else if (display == 'lower') {
            this.lowerDisplay = [];
        }
    }

    getDisplayString(display) {
        let target = display == 'upper' ? this.upperDisplay : (display == 'lower' ? this.lowerDisplay : undefined);

        if (target == undefined) {
            return undefined;
        }

        if (target.at(-1) == this.numberSeparator) {
            target.push(0);
        }

        return arrayToString(target);
    }

    getNumber() {
        if (this.lowerDisplay.length == 0) {
            return 0;
        }

        let str = this.getDisplayString('lower');

        return Number.isInteger(str) ? parseInt(str) : parseFloat(str);
    }
}

class Calculator {
    constructor() {
        this.lastOperator = undefined;
        this.display = new CalculatorDisplay('.');
        this.expressionBuilder = new ExpressionBuilder();
    }

    pushDigit(digit) {
        return this.display.pushDigit(digit);
    }

    pushNumberSeparator() {
        return this.display.pushNumberSeparator();
    }

    pushOperator(operator) {
        let number = this.display.getNumber();

        if (!Number.isNaN(number)) {
            this.expressionBuilder.addOperand(number);
        }

        if (!this.display.pushOperator(operator)) {
            return false;
        }

        this.expressionBuilder.addOperator(operator);

        return true;
    }

    deleteCharacter() {
        if (this.display.popCharacter() == undefined) {
            return false;
        }

        let number = this.display.getNumber();
        this.expressionBuilder.updateLastOperand(number);

        return true;
    }

    clear() {
        this.display.clear('lower');
        this.expressionBuilder.removeOperand();
    }

    clearAll () {
        this.display.clearAll();
        this.expressionBuilder.resetExpression();
    }

    getUpperDisplayString() {
        return this.display.getDisplayString('upper');
    }

    getLowerDisplayString() {
        return this.display.getDisplayString('lower');
    }

    evaluate() {
        return false;
    }
}

const calculator = new Calculator();
const upperDisplay = document.getElementsByClassName('display displayupper')[0];
const lowerDisplay = document.getElementsByClassName('display displaylower')[0];

function sendCalculatorCommand(command) {
    if (!Number.isNaN(parseInt(command))) {
        handleDigit(command);
    } else {
        handleCommand(command);
    }
}

function handleDigit(key) {
    calculator.pushDigit(key);
    lowerDisplay.innerHTML = calculator.getLowerDisplayString();
}

function handleCommand(key) {
    let updateLowerDisplay = true;
    let updateUpperDisplay = false;

    switch (key) {
        case '+':
        case 'add':
            updateLowerDisplay = calculator.pushOperator('+');
            updateUpperDisplay = true;
            break;

        case '-':
        case 'subtract':
            updateLowerDisplay = calculator.pushOperator('-');
            updateUpperDisplay = true;
            break;

        case '*':
        case 'multiply':
            updateLowerDisplay = calculator.pushOperator('*');
            updateUpperDisplay = true;
            break;

        case '/':
        case 'divide':
            updateLowerDisplay = calculator.pushOperator('/');
            updateUpperDisplay = true;
            break;

        case ',':
        case '.':
            updateLowerDisplay = calculator.pushNumberSeparator();
            break;
        
        case 'clear':
            calculator.clear();
            break;

        case 'clear-everything':
            calculator.clearAll();
            updateLowerDisplay = true;
            updateUpperDisplay = true;
            break;

        case 'delete-character':
            updateLowerDisplay = calculator.deleteCharacter();
            break;

        case 'evaluate':
            updateLowerDisplay = calculator.evaluate();
            updateUpperDisplay = true;
            break;
    }

    if (updateLowerDisplay) {
        lowerDisplay.innerHTML = calculator.getLowerDisplayString();
    }

    if (updateUpperDisplay) {
        upperDisplay.innerHTML = calculator.getUpperDisplayString();
    }
}

document.querySelector('body').addEventListener('keydown', (ev) => {
    if (ev instanceof KeyboardEvent) {
        const key = ev.key;

        if (!Number.isNaN(parseInt(key))) {
            handleDigit(key);
            return;
        }

        handleCommand(key);
    }
});