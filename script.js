
//APP object encapsulates all the target actions, and managing undo/redo
//operations needed. 
let APP = function () {

    var canvasElement = document.getElementById("myCanvas");
    var colorPicker = document.getElementById("colorpicker")
    let undoButton = document.getElementById("undo");
    let redoButton = document.getElementById("redo")

    //Javascript's Array supports push and pop methods and thus serves
    //as a stack data structure. 
    var undoStack = [];
    var redoStack = []; 

    undoButton.disabled = true;
    redoButton.disabled = true;

    //Command object template. Functions are a beautiful way to introduce
    //necessary structures like Command in this case. Command encapsulates
    //doing and undoing an operation. 
    let command = function () {
        return {
            redo : undefined,
            undo : undefined,
            name: "action name",
            undoData: undefined,
            redoData: undefined
        }
    }

    colorPicker.onchange  = function () {

         let currentColor = canvasElement.style.backgroundColor; 

        //Capture the color that is set just now 
        let color = function () {
                return "#" + colorPicker.value;
            }();

        //Build the command object that performs setting/unsetting color
        let cmd = command();
        cmd.redoData = color
        cmd.undoData = currentColor; 
        cmd.redo = function() {
            console.log("color selected = " + color);
            canvasElement.style.backgroundColor = color; 
           
         }

        cmd.undo = function () {
            canvasElement.style.backgroundColor = currentColor; 
            
         }
        cmd.name = "set color #" + colorPicker.value; 



        //Flush out any pending redo's as we are recording a new action. 
        redoStack = [];

        //Push the command into undo stack, so that we can undo this action. 
        undoStack.push(cmd);

        //Perform the setting of the color. 
        cmd.redo(); 

        //Button status update 
        redoButton.disabled = true; 
        undoButton.disabled = false; 

        displayStacks();
    }
    
    undoButton.onclick = function () {
        //Pop the command, perform undo. 
        //push the same into redo stack 
        let cmd  = undoStack.pop();
        cmd.undo(); 
        redoStack.push(cmd)

        //Udate redo button status 
        redoButton.disabled = false; 
        if (undoStack.length == 0) {
            undoButton.disabled = true; 
        }

        displayStacks();
    }

    redoButton.onclick = function () {

        //Pop the command from Redo stack. 
        //Perform redo on the command, then push it back into 
        //undo stack. 
        let cmd  = redoStack.pop();
        cmd.redo(); 
        undoStack.push(cmd); 

        //Update status of undo button 
        undoButton.disabled = false; 
        if (redoStack.length == 0) {
            redoButton.disabled = true; 
        }

        displayStacks();
    }

    function buildStackUI(stack, list, undo) {
        let items = stack.slice();
        let listItemsHtml = "";
         
        items.forEach( element => {
            let data = undo? element.undoData : element.redoData; 
            let li = `<li style = \"background-color:${data}; width: 50px;\"> </li>`;
            listItemsHtml += li;
        })
       
        list.innerHTML = listItemsHtml; 
    }

    function displayStacks() {
        buildStackUI(undoStack, document.getElementById("undoList"), true);
        buildStackUI(redoStack, document.getElementById("redoList"), false);
 
    }
    
}; 



APP(); 



