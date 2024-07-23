const screen = document.querySelector(".calculator-screen");
const keys = document.querySelector(".calculator-keys");
const first = ["/" , "*"];
const second = ["+" , "-"];
const operators = ["+" , "-" , "/" , "*"];
const opButton = document.querySelector(".operator")
let numIn = "";
let calculator = {
    stack: [], //a stack for pioretizing operations
    prevNum: "", 
    currentNum: "",
    prevOp: "",
    currentOp: "",
    expectNum: false, //flag for knowing to expext what
    wait: false
};
/* 
    
    this code is for a calculater app for web.

*/


keys.addEventListener("click" ,(element) => {
    let clicked = element.target //what element was clicked
    console.log(element.target.value);
    
    if (screen.value == "" && clicked.className != "numbers" ){ // if an operater was pressed before a number return
        return;
    }
    Handle(clicked.value ,clicked.className); // call main handle for everything

} )


// main handle
let Handle = (value , className) => {
    console.log("Handle entered," , calculator);
    let { currentNum ,prevNum , prevOp , currentOp, current } = calculator
    if (className == "operator"){ // if input is operater

        if (calculator.expectNum == true){
            return;                         // if operater expected or not
        }
        calculator.expectNum = true // flag to expect a number
        numHandle(numIn)
        return opHandle(value);
    }
    else if (className == "numbers"){
        calculator.expectNum = false;
        numIn += value;
        screen.value += value;
        console.log("number pressed, current num input is:", numIn);
        
    }
    else if (className == "all-clear"){
        return clearCalc();
    }
    else if (className == "decimal"){
        deciamlHandle(value)
    }
    else if (className == "equal-sign"){
        if (calculator.expectNum){
            return;
        }
        let finalNum = stackHandle(true);
        clearCalc();
        calculator.currentNum= finalNum;
        screen.value += finalNum;
        numIn = "";
        numIn += finalNum;
        console.log("= pressed, calc cleared and summed", calculator);
    }


}

let numHandle = (num) => {
    numIn = "";
    /*
        if there is no current and prev num
        means it's is the first number to be inputted
    */
    if (!calculator.currentNum && !calculator.prevNum){ 
        calculator.currentNum += num;
        calculator.expectNum = false; // to set the flag for expecting an operater
        console.log("current input moved to current num");
        console.log(calculator);    
    }
    /*
        if there is no prev or there is both nums we move the current to the prev
    */
    else{
        calculator.prevNum = calculator.currentNum;
        calculator.currentNum = "";
        calculator.currentNum += num;
        calculator.expectNum = false;
        console.log("current num move to prev, and current input moved to current num");
        console.log(calculator);
    }   
    
}

let deciamlHandle = () =>{
    if(numIn.includes(num)){
        console.log("decimal flag is true, and one is already in current num");
        console.log(calculator);
        return; // if there's a decimal alredy return
    }
    else {
        numIn += num; // else append it
        console.log("deciaml flage true, and there is no decimal in current num");
        console.log(calculator);
    }
    calculator.expectNum = true;
    
}

let opHandle = (op) => {

    calculator.expectNum = true; // set flag for next input
    let {currentOp , prevOp} = calculator;
    
    /* 
        if there is a prev operater
    */
    if (prevOp){
        console.log("there is prev op registred");
        screen.value += op
        stackHandle();
        console.log(calculator);
        return;
    }
    /*
        if there's a current op only, we move it to prev operater,
        and append it to screen and call stackhandle to hanlde priority
     */
    else if (currentOp){
        
        calculator.prevOp = calculator.currentOp;
        calculator.currentOp = op;
        screen.value += op
        console.log("there is only a current op registred");
        console.log(calculator);
        return stackHandle();
    }
    /*
        else means it is first op input
        we move it to current and append it to screen
    */
    else{
        calculator.currentOp = op;
        screen.value += op
        console.log(calculator);
        console.log("first op input, nothing else registred");
        return ;
    }
    
}

// cleanB (cleanBuffer) a flag to indicate if = is pressed
stackHandle = (cleanB) => {
    let {prevOp , prevNum, wait , currentNum , currentOp , stack} = calculator;
    console.log("entered stack handle");
    let result =0;
    let stackNum , stackOp;
    
    if (cleanB){
        if (calculator.stack)
            [stackNum , stackOp] = calcStack();
        console.log("= flag is true, evaluating all");
        if (first.includes(currentOp)){
           
            currentOp == "*" ? result = Number(currentNum) * Number(numIn): result = Number(currentNum) / Number(numIn)
        }
        else{
            currentOp == "+" ? result = Number(currentNum) + Number(numIn): result = Number(currentNum) - Number(numIn)
        }
       if (stackNum){
            stackOp == "+" ? result += Number(stackNum): result -= Number(stackNum);
        }
        return result;
        
    }
    /*
        if the prev op have less priority than current like this : x+y*,
        we push the prev op and prev num to stack,to handle after priority breaks.
    */
    if (first.includes(currentOp) && second.includes(prevOp)){ 
        wait = true; // i actully have no idea what is this
        calculator.stack.push(prevNum);
        calculator.stack.push(prevOp);
        calculator.prevNum = "";
        calculator.prevOp = "";
        console.log("prev op have less priority than current, prev op and num pushed to stack");
        console.log(calculator);
        return;
    }
    /*
        if prev op have more priority than current op, like this : x*y+,
        we calc what's in the stack, then plus or minus the current,
        then put what we calc in the current num, and remove all prev num and prev op
    */
    else if(second.includes(currentOp) && first.includes(prevOp)){
        wait = false; // again i have no idea what is this
        let result = 0;
        let stackNum , stackOp;
        if (calculator.stack)
            [stackNum , stackOp] = calcStack();
        prevOp == "*" ? result = Number(prevNum) * Number(currentNum) : result = Number(prevNum) / Number(currentNum);
        stackOp == "+" ? result += Number(stackNum): result -= Number(stackNum);
        calculator.currentNum = result.toString();
        calculator.prevNum = "";
        calculator.prevOp = "";
        console.log("prev have more priority than current, stack calced, and other things done.");
        console.log(calculator);
        return;
    }
    /*
        if they all have less priority, just like above ^ ^ ^
    */
    else if (second.includes(prevOp) && second.includes(currentOp)){
        prevOp == "+" ? result = Number(prevNum) + Number(currentNum) : result = Number(prevNum) - Number(currentNum);
        let stackNum , stackOp;
        if (calculator.stack)
            [stackNum , stackOp] = calcStack();
        stackOp == "+" ? result += Number(stackNum): result -= Number(stackNum);
        calculator.currentNum = result.toString();
        calculator.prevNum = ""
        calculator.prevOp = ""
        console.log("prev and current have same priority, stack calced, and other things done.");
        console.log(calculator);
        return;
    }
    /*
        if they all have higher priority
    */
    else if (first.includes(currentOp) && first.includes(prevOp)){
        wait = false; // again i have no idea what is this
        let result = 0;
        prevOp == "*" ? result = Number(prevNum) * Number(currentNum) : result = Number(prevNum) / Number(currentNum);
        calculator.currentNum = result.toString();
        calculator.prevNum = "";
        calculator.prevOp = "";
        console.log("prev have more priority than current");
        console.log(calculator);
        return;

    }
}

calcStack = () => {
    let opreator = "";
    let number = 0;
    calculator.stack.map((key,index)=>{
        if (key && !operators.includes(key)){
            if(index  == 0){
                number = key                
            }else if(opreator == "+" ){
                number += key;
            }else{
                number -= key;
            }
        }else{
            opreator = key;
        }
    })
    calculator.stack = []; // to empty stack
    console.log("stack calced, stack emptied");
    return [number, opreator];
}

clearCalc = () => {
    calculator = {
        stack: [],
        prevNum: "",
        currentNum: "",
        prevOp: "",
        currentOp: "",
        expectNum: false,
        wait: false
    };
    screen.value = "";
    return;
}

