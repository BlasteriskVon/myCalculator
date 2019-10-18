import React, { Component } from "react";
import $ from "jquery";

class Calculator extends Component {
    state = {
        operations: [],
        result: "",
        operators: ["+", "-", "*", "/", "^", "√", "(", ")"],
        numbers: ["1","2","3","4","5","6","7","8","9","0",".", "x"],
        responseWrite: "",
        hasVariable: false
    };

    componentDidMount() {
        var benny = document.getElementById("benny");
        benny.src = "assets/images/benny.png";
        var bennyPrompt = "Welcome to the calculator app! I'm your helper Benny! Please click the buttons to perform your desired calculations!";
        console.log("Benny: Greetings from the console log! If you wish to perform some calculations you will have to use the buttons on the screen or your keyboard!");
        var promptArray = bennyPrompt.split("");
        benny.src = "assets/images/bennyTalking.gif";
        var promptArrayIndex = 0;
        var promptWrite = setInterval(function() {
            if(promptArrayIndex < promptArray.length){
                $("#bennyScript").text($("#bennyScript").text() + promptArray[promptArrayIndex]);
                promptArrayIndex++;
                
            } else {
                clearInterval(promptWrite);
                benny.src = "assets/images/benny.png";
            }
        }, 62);

        document.addEventListener("keydown", function(event) {
            switch(event.which) {
                case 88: //clicked x
                    this.addNumber("x");
                    break;

                case 56:
                    if(event.shiftKey) {
                        if(this.state.result !== "" && this.state.operations.length === 0){
                            this.setState({
                                operations: [this.state.result.toString()],
                                result: ""
                            });
                        }
                        this.addOperator("*");
                    } else {
                        this.addNumber("8");
                    }
                    break;

                case 191:
                    if(this.state.result !== "" && this.state.operations.length === 0){
                        this.setState({
                            operations: [this.state.result.toString()],
                            result: ""
                        });
                    }
                    this.addOperator("/");
                    break;

                case 190:
                    this.addNumber(".");
                    break;

                case 189:
                    if(this.state.result !== "" && this.state.operations.length === 0){
                        this.setState({
                            operations: [this.state.result.toString()],
                            result: ""
                        });
                    }
                    this.addOperator("-");
                    break;

                case 187:
                    if(event.shiftKey){
                        if(this.state.result !== "" && this.state.operations.length === 0){
                            this.setState({
                                operations: [this.state.result.toString()],
                                result: ""
                            });
                        }
                        this.addOperator("+");
                    }
                    break;

                case 54:
                    if(event.shiftKey) {
                        if(this.state.result !== "" && this.state.operations.length === 0){
                            this.setState({
                                operations: [this.state.result.toString()],
                                result: ""
                            });
                        }
                        this.addOperator("^");
                    } else {
                        this.addNumber("6");
                    }
                    break;

                case 57:
                    if(event.shiftKey) {
                        this.addOperator("(");
                    } else {
                        this.addNumber("9");
                    }
                    break;

                case 48:
                    if(event.shiftKey) {
                        this.addOperator(")");
                    } else {
                        this.addNumber("0");
                    }
                    break;

                case 49:
                    if(!event.shiftKey){
                        this.addNumber("1");
                    }
                    break;
                
                case 50:
                    if(!event.shiftKey){
                        this.addNumber("2");
                    }
                    break;

                case 51:
                    if(!event.shiftKey){
                        this.addNumber("3");
                    }
                    break;

                case 52:
                    if(!event.shiftKey){
                        this.addNumber("4");
                    }
                    break;

                case 53:
                    if(!event.shiftKey){
                        this.addNumber("5");
                    }
                    break;
                
                case 55:
                    if(!event.shiftKey){
                        this.addNumber("7");
                    }
                    break;

                case 13:
                    this.calculate(this.state.operations);
                    break;

                default:
                    break;
            }
        }.bind(this));

        document.addEventListener("keyup", function(event) {
            if(event.which !== 13){
                this.resetBenny();
            }
        }.bind(this))
    };

    addDecimal(array, x) {
        if(array[array.length-1].includes(".") || array[array.length-1].includes("x")){
            return;
        } else {
            var initialString = array[array.length - 1];
            array[array.length - 1] = initialString + x; //if it is a number, add x to it as a string
        }
    }

    addParentheses(array, x){
        var prevEntry = array[array.length-1];
        if(prevEntry !== undefined && prevEntry.charAt(prevEntry.length - 1) === "."){
            return;
        } else {
            if(prevEntry !== undefined && ((array[array.length-1] === ")" && x === "(") || (((!isNaN(parseFloat(array[array.length-1])) || array[array.length-1].includes("x")) && x === "(")))){
                array.push("*");
                array.push(x);
            } else {
                array.push(x);
            }
        }
    }

    addSqrt(array, x) {
        var prevEntry = array[array.length-1];
        if(prevEntry !== undefined && prevEntry.charAt(prevEntry.length -1) === "."){
            return;
        } else {
        if(prevEntry !== undefined && (prevEntry === ")" || !isNaN(parseFloat(prevEntry)) || prevEntry.includes("x"))) {
            array.push("*");
            array.push(x);
            array.push("(");
        } else {
            array.push(x);
            array.push("(");
        }
        }
    }

    isNegative(array){
        if(array[array.length-1] === "-" && (isNaN(parseFloat(array[array.length-2])) && !array[array.length-2].includes("x"))){
            return true;
        } else {
            return false;
        }
    }

    addOperator(x) {
        $("#bennyScript").remove();
        clearInterval(this.state.responseWrite);
        $("#noResult").text("");
        var benny = document.getElementById("benny");
        benny.src = "assets/images/bennyMouthOpen.png";
        let newOperations = this.state.operations;
        let arrayLength = newOperations.length;
        var prevEntry = newOperations[arrayLength-1];
        if(prevEntry !== undefined && prevEntry.charAt(prevEntry.length -1) === "."){
            return;
        } else {
        if(x === "√"){
            this.addSqrt(newOperations, x);
        } else {
        if(x === "(" || newOperations[arrayLength-1] === ")"){
            this.addParentheses(newOperations, x);
        } else {
            if(arrayLength < 1 || (isNaN(parseFloat(newOperations[arrayLength - 1])) && !newOperations[arrayLength-1].includes("x"))) { //checks if array is empty or recent entry is not a number
                if(x === "-") {
                    newOperations.push(x);
                } else {
                return; //if so, function does nothing
                }
            } else {
                newOperations.push(x);
            }
        }
        }
        this.setState({
            operations: newOperations
        });
        }
    };

    addNumber(x) {
        $("#bennyScript").remove();
        clearInterval(this.state.responseWrite);
        $("#noResult").text("");
        var benny = document.getElementById("benny");
        benny.src = "assets/images/bennyMouthOpen.png";
        let newOperations = this.state.operations;
        let arrayLength = newOperations.length;
        if(newOperations.length !== 0 && newOperations[arrayLength-1].includes("x") && x !== "x") {
            return;
        }
        if(arrayLength < 1) {
            var input = "";
            input = x;
            if(x === "."){
                input = "0" + x;
            }
            newOperations.push(input);
        } else {
            let lastValue = parseFloat(newOperations[arrayLength - 1]);
            if(isNaN(lastValue) && x !== ".") {
                if(this.isNegative(newOperations)){
                    var prevString = newOperations[arrayLength - 1];
                    newOperations[arrayLength - 1] = prevString + x;
                } else {
                if(newOperations[arrayLength - 1] === ")") {
                    newOperations.push("*");
                }
                newOperations.push(x); //last value is not a number
            }
            } else {
                if(x === "."){
                    this.addDecimal(newOperations, x);
                } else {
                    var initialString = newOperations[arrayLength - 1];
                    newOperations[arrayLength - 1] = initialString + x; //if it is a number, add x to it as a string
                }
            }
        }
        this.setState({
            operations: newOperations
        })
    }

    resetBenny() {
        var benny = document.getElementById("benny");
        benny.src = "assets/images/benny.png";
    }

    calculateSquareRoot(array, rootIndex) {
        var num = parseFloat(array[rootIndex+1]);
        if(array[rootIndex+1] !== "-"){
        var result = Math.sqrt(num);
        array.splice(rootIndex, 2, result);
        } else {
            //number is negative
            return;
        }
    }

    calculateMultiDiv(array, opIndex) {
        var num1 = parseFloat(array[opIndex - 1]);
        var num2 = parseFloat(array[opIndex + 1]);
        var result = 0;

        switch(array[opIndex]) {
            case "*":
                var product = num1 * num2;
                result += product;
                break;
            case "/":
                var quotient = num1 / num2;
                result += quotient;
                break;
            default:
                break;
        }
        array.splice(opIndex-1, 3, result);

    }

    calculatePower(array, expIndex) {
        var num1 = parseFloat(array[expIndex-1]);
        var num2 = parseFloat(array[expIndex+1]);
        var result = Math.pow(num1, num2);
        array.splice(expIndex-1, 3, result);
    }

    calculateWithin(array, start, end){
        let result = 0;
        let finish = end;
        
        for(var l = start;l < finish;l++){
            if(array[l] === "/" && array[l+1] === "0") {
                return;
            }
            if(array[l] === "("){
                continue;
            } else {
                if(array[l] === "^"){
                    this.calculatePower(array, l);
                    l--;
                    finish -= 2;
                }
            }
        }
        for(var n = start;n < finish;n++){
            if(array[n] === "("){
                continue;
            } else {
                if(array[n] === "√"){
                    this.calculateSquareRoot(array, n);
                    n--;
                    finish--;
                }
            }
        }
        for(var j = start;j < finish;j++){
            if(array[j] === "("){
                continue;
            } else {
                if(array[j] === "*" || array[j] === "/"){
                    this.calculateMultiDiv(array, j);
                    j--;
                    finish -= 2;
                }
            }
        }
        for(var k = start;k < finish;k++){
            if(array[k] === "("){
                continue;
            } else {
                if(!isNaN(parseFloat(array[k]))){
                    result += parseFloat(array[k]);
                } else {
                    switch(array[k]){
                        case "+":
                            result += parseFloat(array[k+1]);
                            k++;
                            break;
                        
                        case "-":
                            result -= parseFloat(array[k+1]);
                            k++;
                            break;
    
                        default:
                            break;
                    }
                }
            }
        }
        array.splice(start, end-start+1, result);
    }

    howMany(array, element){
        var count = 0;
        for(var i = 0;i < array.length;i++){
            if(array[i] === element){
                count++;
            }
        }
        return count;
    }



    calculate(ops) {
        let newResult = "0";
        if((this.howMany(ops, "(") !== this.howMany(ops, ")")) || (ops.lastIndexOf("(") > ops.lastIndexOf(")"))){
            newResult = "Please make sure to close your parentheses and place them in the correct order!";
        } else {
        for(var m = 0;m < ops.length;m++){
            if(ops[m] === "("){
                this.calculateWithin(ops, ops.lastIndexOf("("), ops.indexOf(")", ops.lastIndexOf("(")));
                m--;
            }
        }
        for(var ii = 0;ii < ops.length;ii++){
            if(ops[ii] === "√" && (ops[ii+1] === "-" || parseFloat(ops[ii+1]) < 0)){
                if(newResult === "0"){
                    newResult = "Negative numbers cannot have (non-imaginary) square roots!";
                }
            }
        }
        for(var i = 0;i < ops.length;i++){
            if((ops[i] === "/" && (ops[i+1] === "0" || ops[i+1] === 0))){
                if(newResult === "0"){
                    newResult = "You cannot divide by 0!";
                }
            }
        }
        this.calculateWithin(ops, 0, ops.length);
        }
        if(isNaN(parseFloat(newResult))) {
            var benny = document.getElementById("benny");
            var prompt = newResult.split("");
            var promptArrayIndex = 0;
            benny.src = "assets/images/bennyTalking.gif";
            this.setState({
                operations: [],
                result: "",
                responseWrite: setInterval(function() {
                    if(promptArrayIndex < prompt.length){
                        $("#noResult").text($("#noResult").text() + prompt[promptArrayIndex]);
                        promptArrayIndex++;
                        
                    } else {
                        clearInterval(this.responseWrite);
                        benny.src = "assets/images/benny.png";
                    }
                }, 62)
            });
            return;
        }
        if(this.state.hasVariable){
            return;
        } else {
            newResult = "Your answer is " + ops[0] + "!";
            this.setState({
                operations: [],
                result: ops[0]
            });
        }
    }

    graph(ops){
        var hasVariable = false;
        for(var i = 0;i < ops.length;i++){
            if(ops[i].includes("x")){
                hasVariable = true;
            }
        }
        if(!hasVariable){
            var noVariable = "I cannot plot a graph without a variable!"
            var benny = document.getElementById("benny");
            var prompt = noVariable.split("");
            var promptArrayIndex = 0;
            benny.src = "assets/images/bennyTalking.gif";
            this.setState({
                operations: [],
                result: "",
                responseWrite: setInterval(function() {
                    if(promptArrayIndex < prompt.length){
                        $("#noResult").text($("#noResult").text() + prompt[promptArrayIndex]);
                        promptArrayIndex++;
                        
                    } else {
                        clearInterval(this.responseWrite);
                        benny.src = "assets/images/benny.png";
                    }
                }, 62)
            });
            return;
        }
        var graphPicture = document.getElementById("graphCanvas");
        var graphEdit = graphPicture.getContext("2d");
        for(var xVar = 0;xVar < graphPicture.width;xVar++){
            var x = xVar;
            var myFunction = [];
            for(var john = 0;john < this.state.operations.length;john++){
                myFunction[john] = this.state.operations[john];
            }
            var y = this.solveX(myFunction, x);
            graphEdit.beginPath();
            graphEdit.arc(xVar, (-1*y) + (graphPicture.height/2),3,0,2*Math.PI);
            graphEdit.stroke();
        }

    }

    solveX(ops, x) {
        for(var i = 0;i < ops.length;i++){
            if(ops[i].includes("x")){
                var y = ops[i].replace("x", x);
                ops[i] = y;
            }
        }
        this.calculate(ops);
        return parseFloat(ops[0]);
    }

    annoyedBenny() {
        var benny = document.getElementById("benny");
        benny.src = "assets/images/bennyAnnoyed.png";
        var responses = ["Benny: Hey!", "Benny: Please do not touch.", "Benny: ...", "Benny stares at you disapprovingly."];
        var responseChance = Math.floor(Math.random() * 8);
        if(responseChance <= (responses.length - 1)){
            console.log(responses[responseChance]);
        }
    }

    neutralBenny() {
        var benny = document.getElementById("benny");
        benny.src = "assets/images/benny.png";
    }

    happyBenny() {
        var benny = document.getElementById("benny");
        benny.src = "assets/images/bennyEyesClosed.png";
        var responses = ["Benny hums a song to herself.", "Benny: Ha ha ha!", "Benny: I hope your day is going wonderfully."];
        var responseChance = Math.floor(Math.random() * 8);
        if(responseChance <= (responses.length - 1)){
            console.log(responses[responseChance]);
        }
    }

    

    render() {
        return (
            <div className="container" style={{backgroundColor: "black", color: "lightgreen"}}>
                <div className="row">
                    <div className="col-md-4" id="details">
                        <h1>
                            {this.state.operations.map (operand => (
                                operand + " "
                            ))}
                        </h1>
                        <h2 id="bennyScript"> </h2>
                    </div>
                    <div className="col-md-4" id="icon">
                        <img src="" id="benny" alt="Benny" style={{width:"100%", height:"auto"}} onMouseOver={() => this.happyBenny()} onMouseOut={() => this.neutralBenny()} onMouseDown={() => this.annoyedBenny()} onMouseUp={() => this.neutralBenny()}/>
                    </div>
                    <div className="col-md-4" id="results">
                        <h1>{this.state.result}</h1>
                        <h1 id="noResult"> </h1>
                    </div>
                </div>
                <div className="row" id="operatiorRow">
                    <div className="col-md-9">
                        <div className="row">
                            {this.state.operators.map(operator => (
                                <div className="col-md-3" key={this.state.operators.indexOf(operator)} style={{padding:"0"}}>
                                    <button style={{width: "100%", height: "auto"}} value={operator} onMouseDown={() => this.addOperator(operator)} onMouseUp={() => this.resetBenny()}>{operator}</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <br />
                <div className="row" id="numbersAndEqual">
                    <div className="col-md-9">
                        <div className="row" id="numbersRow">
                            {this.state.numbers.map(number => (
                                <div className="col-md-4" key={this.state.numbers.indexOf(number)} style={{padding:"0"}}>
                                    <button style={{width: "100%", height: "auto"}} value={number} onMouseDown={() => this.addNumber(number)} onMouseUp={() => this.resetBenny()}>{number}</button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="col-md-3" id="equalSign">
                        <div style={{height: "50%"}}></div>
                        <button style={{width: "100%", height: "50%"}} value="=" onMouseDown={() => this.calculate(this.state.operations)}>=</button>
                        {/*<button style={{width: "100%", height: "50%"}} value="graph" onMouseDown={() => this.graph(this.state.operations)}>Graph</button>*/}
                    </div>
                </div>
                <br/>
            </div>
        )
    }
}

export default Calculator;