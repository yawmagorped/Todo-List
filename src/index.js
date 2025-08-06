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

    const getGroupObjList = () => groupObjLst;

    return {addMember, groupName, getGroupObjList};
}

const groupManager = ( () => { //IIFE
    let groupLst = [];
    let isCopy;
    
    const addGroupMember = (todoObj, groupName) => {
        let groupObj = findGroupObj(groupName);
        groupObj.addMember(todoObj);
    }

    const findGroupObj = (name) => {
        return groupLst.find( (element) => element.groupName == name);
    }

    const verifyGroup = (name) => {
        isCopy = false;
        groupLst.forEach(element => {
            if(element.groupName == name) {
                isCopy = true;
                return;
            }
        });
        if(isCopy) return false;
        
        return true;
    }
    
    const addGroup = (name) => {
        let g = new group(name);
        groupLst.push(g);
    }

    return {addGroupMember, addGroup, verifyGroup, findGroupObj, groupLst};
})();


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
        
        lst.addEventListener('click', () => {
            showAllInGroup(groupManager.findGroupObj(txt));
        })
        
        return lst;
    }
    
    groupAdder.addEventListener('click', () => {
        projectHolder.appendChild(groupInputBox);
        groupInputBox.focus();
    }); 
    
    const addGroupElements = (val) => {
        groupManager.addGroup(val);
        groupSelect.appendChild(newOption(val));
        sideBarProjects.appendChild(newList(val));
    }
    addGroupElements("Personal");
    addGroupElements("Work");
    addGroupElements("Other");
    
    groupInputBox.addEventListener('keydown', () => {
        if(element.key == "Enter") {
            if(groupManager.verifyGroup(groupInputBox.value)) {
                addGroupElements(groupInputBox.value);
                groupInputBox.classList.remove("false");
                projectHolder.removeChild(groupInputBox);
                groupInputBox.value = "";
            }
            else {
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

    const showAllInGroup = (groupObj) => {
        cleanTodoList();
        let objLst = groupObj.getGroupObjList();
        objLst.forEach(element => {
            addTodoItem(element);
        });
    }

    const cleanTodoList = () => {
        while (todoContainer.firstChild) {
            todoContainer.removeChild(todoContainer.lastChild);
        }
    }



    let enterIcon = document.querySelector(".enter-icon");
    
    enterIcon.addEventListener('click', sendTodo);
    todoTxtInput.addEventListener('keydown', (element) => {
        if(element.key == "Enter") 
            sendTodo();
    });

}