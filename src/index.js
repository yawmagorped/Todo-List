import "./style.css";


const todoObjManager = ( () => {
    let todoObjLst = [];
    
    const makeNewTodoObj = (todo) => {
        todoObjLst.push(todo);
        groupManager.addGroupMember(todo, todo.groupName);
    }

    const verifyObj = (state) => {
        //check date range...
        return true;
    }
    
    function todoObj(content, date, groupName) { 
        return {content, date, groupName};
    }

    return {makeNewTodoObj, verifyObj, todoObj, todoObjLst};
})();


function group(name) {
    let groupName = name;
    let groupObjLst = [];

    const addMember = (todoObj) => {
        groupObjLst.push(todoObj);
    }
    return {addMember, groupName, groupObjLst};
}

const groupManager = ( () => { //IIFE
    let groupLst = [];
    let isCopy;
    
    const addGroupMember = (todoObj, groupName) => {
        let groupObj = groupLst.find( (element) => element.groupName == groupName );
        groupObj.addMember(todoObj);
    }

    const addGroup = (name) => {
        isCopy = false;
        groupLst.forEach(element => {
            if(element.groupName == name) {
                isCopy = true;
                return;
            }
        });
        if(isCopy) return false;
        
        let g = new group(name);
        groupLst.push(g);
        return true;
    }
    return {addGroupMember, addGroup, groupLst};
})();

groupManager.addGroup("Personal");
groupManager.addGroup("Work");
groupManager.addGroup("Other");

elementManager();
function elementManager() {
    let todoTxtInput = document.querySelector("#todo-text");
    let selectedGroup = document.querySelector("select#groups");
    let groupAdder = document.querySelector(".add-button");
    let date = document.querySelector("#todo-date");
    
    let projectHolder = document.querySelector(".project-selector-holder");
    let groupSelect = document.querySelector("select#groups");
    
    let sideBarProjects = document.querySelector("ul.side-bar-projects");
    
    let todoContainer = document.querySelector(".todo-container");
    
    const readElements = () => {
        let state = todoObjManager.todoObj(todoTxtInput.value, date.value, selectedGroup.value);
        return state;
    }
    
    let groupInputBox = document.createElement("input");
    groupInputBox.id = "new-group";
    groupInputBox.type = "text";
    groupInputBox.name = "new-group";
    
    
    const newOption = (value) => {
        let opt = document.createElement("option");
        opt.value = value;
        opt.innerText = value;
        
        return opt;
    }
    
    const newList = (txt) => {
        let lst = document.createElement("li");
        lst.innerText = txt;
        
        return lst;
    }

    groupAdder.addEventListener('click', () => {
        projectHolder.appendChild(groupInputBox);
        groupInputBox.focus();
    }); 
    
    groupInputBox.addEventListener('keydown', (element) => {
        if(element.key == "Enter") {
            if(groupManager.addGroup(groupInputBox.value)) {
                groupSelect.appendChild(newOption(groupInputBox.value));
                sideBarProjects.appendChild(newList(groupInputBox.value));

                groupInputBox.classList.remove("false");
                projectHolder.removeChild(groupInputBox);
                groupInputBox.value = "";
            } else {
                groupInputBox.classList.add("false");
            }
        }
    });
    
    const cleanElements = () => {
        todoTxtInput.value = "";
        date.value = "";
    }
    
    const sendTodo = () => {
        let todo = readElements();
        if (todoObjManager.verifyObj(todo)) {
            todoObjManager.makeNewTodoObj(todo);
            addTodoItem(todo);
            cleanElements();
        }
    }

    
    const newItem = (todo) => {
        let todoItem = document.createElement("div");
        todoItem.classList.add("todo-item");
        todoItem.innerHTML = `<div class="first-row"><div class="todo-date">${todo.date}</div><div class="todo-group">${todo.groupName}</div></div><div class="second-row">${todo.content}</div>`
        return todoItem;
    }
    
    const addTodoItem = (todo) => {
        let todoItem = newItem(todo);
        todoContainer.appendChild(todoItem);
    }

    let enterIcon = document.querySelector(".enter-icon");
    
    enterIcon.addEventListener('click', sendTodo);
    todoTxtInput.addEventListener('keydown', (element) => {
        if(element.key == "Enter") 
            sendTodo();
    });

}