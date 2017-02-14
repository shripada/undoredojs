//A simple stack implementation using JavaScript's 
//Array data structure. 
let stack = function() {
    var top = -1;
    var items = [];

    return {
        pop: function () {
  
            return items[top--]; 
        },

        push: function (item) {
            items[++top] = item;
        },

        capacity: function () {
            return top + 1; 
        },

        removeAll: function () {
            top = -1; 
            items = []; 
        },

        rawItems: function () {
            return items; 
        }
    }
}

//APP object encapsulates all the target actions, and managing undo/redo
//operations needed. 
let APP = function () {

    var canvasElement = document.getElementById("myCanvas");
    var colorPicker = document.getElementById("colorpicker")
    let undoButton = document.getElementById("undo");
    let redoButton = document.getElementById("redo")

    var undoStack = stack();
    var redoStack = stack(); 

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
        redoStack.removeAll();

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
        if (undoStack.capacity() == 0) {
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
        if (redoStack.capacity() == 0) {
            redoButton.disabled = true; 
        }

        displayStacks();
    }

    function buildStackUI(stack, list, undo) {
        let items = stack.rawItems().slice().reverse();
        let listItemsHtml = "";

        for (i = 0; i < stack.capacity(); i++) {
            let element = items[i]; 
            let data = undo? element.undoData : element.redoData; 
            let li = `<li style = \"background-color:${data}; width: 50px;\"> </li>`;
            listItemsHtml += li;
        }
         
         console.log(listItemsHtml);

         list.innerHTML = listItemsHtml; 
    }

    function displayStacks() {
        buildStackUI(undoStack, document.getElementById("undoList"), true);
        buildStackUI(redoStack, document.getElementById("redoList"), false);
 
    }
    
}; 



APP(); 



