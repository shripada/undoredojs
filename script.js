//In JavaScript, Array itself supports stack data structure. It supports push and pop methods
var stack = function () {
    return []; 
}



//APP object encapsulates all the target actions, and managing undo/redo
//operations needed. 
let APP = function () {

    var canvas = document.getElementById("myCanvas");
    var colorPicker = document.getElementById("colorpicker")
    var undoButton = document.getElementById("undo");
    var redoButton = document.getElementById("redo")

    //Javascript's Array supports push and pop methods and thus serves
    //as a stack data structure. 
    var undoStack = stack();
    var redoStack = stack(); 

    undoButton.disabled = true;
    redoButton.disabled = true;

    //Command object. Functions are a beautiful way to introduce
    //necessary structures like Command in this case. Command encapsulates
    //in this case, setting up of background color of our canvas. 
    var command = function (data) {
        var commandData = data; //Data that might be needed by the execute method.    
        
        return {
            execute : function() {
                canvas.style.backgroundColor = commandData;  
            },

            data: function () {
                return commandData; 
            }()
        }
    }

    //Currently being executed command
    var currentCommand = undefined; 

    colorPicker.onchange  = function () {

        //Capture the color that is set just now 
        var color = function () {
                return "#" + colorPicker.value;
            }();


        //Build the command object that performs setting/unsetting color
        currentCommand = command(color);

        //Also prepare command that will undo the above command. 
        var undoCommand = command(canvas.style.backgroundColor);

        //Flush out any pending redo's as we are recording a new action. 
        redoStack = stack();

        //Push the command into undo stack, so that we can undo this action. 
        undoStack.push(undoCommand);

        //Perform the current operation. 
        currentCommand.execute(); 

        updateUI(); 
    }

    function rotateCommands(fromStack, toStack){
        //Push the current command into the toStack
        toStack.push(currentCommand); 
        
        //Pop from fromStack and set it as the current command.
        currentCommand = fromStack.pop(); 

        //Execute the current command
        currentCommand.execute();
    }
    
    undoButton.onclick = function () {
        //Pop from undo stack and execute, then push the reverse command into redo stack 
        rotateCommands(undoStack, redoStack);
        updateUI();
    }

    redoButton.onclick = function () {
        //Pop from redo stack and execute, then push the reverse command into undo stack 
        rotateCommands(redoStack, undoStack);
        updateUI();
    }

    function updateUI() {
        undoButton.disabled = undoStack.length === 0; 
        redoButton.disabled = redoStack.length === 0; 
        displayStacks();
    }

    function buildStackUI(stack, list) {
        let items = stack.slice();
        let listItemsHtml = "";
         
        items.forEach( element => {
            let data = element.data; 
            let li = `<li style = \"background-color:${data}; width: 50px;\"> </li>`;
            listItemsHtml += li;
        })
       
        list.innerHTML = listItemsHtml; 
    }

    function displayStacks() {
        buildStackUI(undoStack, document.getElementById("undoList"));
        buildStackUI(redoStack, document.getElementById("redoList"));
 
    }
    
}; 



APP(); 



