import "./style.css";
import { storageAvailable } from "./storageManagement.js";
import { formatDistanceStrict, isToday, startOfToday, isThisWeek } from "date-fns";

window.addEventListener('visibilitychange', (event) => {
    if (storageAvailable("localStorage"))
        localStorage.setItem("todoObjLst", JSON.stringify(todoObjManager.todoObjLst));
});
addEventListener("load", (event) => { 
    if (localStorage.getItem("todoObjLst")) {
        let todoObjLst =  JSON.parse(localStorage.getItem("todoObjLst"));
        todoObjLst.forEach(element => {
            todoObjManager.makeNewTodoObj(element);
            elementManager.addTodoItem(element);
        });
    }
});
const todoObjManager = ( () => {
    let todoObjLst = [];
    
    const makeNewTodoObj = (todo) => {
        todoObjLst.push(todo);

        groupManager.addGroupMember(todo, todo.groupName);
    }
    
    const verifyObj = (todo) => {
        if(todo.date != "")
            return true;
        else 
            return false;
    }
    
    function todoObj(content, date, groupName) { 
        return {content, date, groupName};
    }

    const fromTodayList = () => {
        return todoObjLst.filter((element) => isToday(element.date));
    }
    const fromThisWeekList = () => {
        return todoObjLst.filter((element) => isThisWeek(element.date));
    }

    const removeObj = (todoObj) => {
        let index = todoObjLst.indexOf(todoObj);
        todoObjLst.splice(index, 1);
        
        let group = groupManager.getGroupObj(todoObj.groupName);
        group.removeMember(todoObj);
    }

    return {makeNewTodoObj, verifyObj, todoObj, removeObj, fromTodayList, fromThisWeekList, todoObjLst};
})();


function group(name) {
    let groupName = name;
    let groupObjLst = [];

    const addMember = (todoObj) => {
        groupObjLst.push(todoObj);
    }
    
    const removeMember = (todoObj) => {
        let index2 = groupObjLst.indexOf(todoObj);
        groupObjLst.splice(index2, 1);
    }
    
    const getGroupObjList = () => groupObjLst;
    
    return {addMember, groupName, groupObjLst, getGroupObjList, removeMember};
}

const groupManager = ( () => { //IIFE
    let groupLst = [];
    let isCopy;
    
    const addGroupMember = (todoObj, groupName) => {
        let groupObj = getGroupObj(groupName);
        groupObj.addMember(todoObj);
    }

    const getGroupObj = (name) => {
        let g = groupLst.find( (element) => element.groupName == name);
        if (g) {
            return g;
        } else {
            elementManager.addGroupElements(name); // decoupling needed? idk... maybe custom events?
            return groupLst.find( (element) => element.groupName == name);
        }
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

    return {addGroupMember, addGroup, verifyGroup, getGroupObj, groupLst};
})();



const elementManager = ( () => {
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
            showAllInGroup(groupManager.getGroupObj(txt));
        })
        
        return lst;
    }
    
    groupAdder.addEventListener('click', () => {
        projectHolder.appendChild(groupInputBox);
        groupInputBox.focus();
    }); 
    
    const addGroupElements = (groupName) => {
        groupManager.addGroup(groupName);
        groupSelect.appendChild(newOption(groupName));
        sideBarProjects.appendChild(newList(groupName));
    }
    addGroupElements("Personal");
    addGroupElements("Work");
    addGroupElements("Other");
    
    groupInputBox.addEventListener('keydown', (element) => {
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
        todoItem.innerHTML = `<div class="todo-column"><div class="first-row"><div class="todo-date">${isToday(todo.date) ? "Today" : formatDistanceStrict(todo.date, startOfToday(), { addSuffix: true, unit:'day', roundingMethod:'floor'}) }</div><div class="todo-group">${todo.groupName}</div></div><div class="second-row">${todo.content}</div></div><div class="second-column"><button>remove</button></div>`
        return todoItem;
    }
    
    const addTodoItem = (todo) => {
        let todoItem = newItem(todo);
        
        let btn = todoItem.querySelector(".second-column button");
        btn.addEventListener('click', () => {
            todoItem.remove();
            todoObjManager.removeObj(todo);
        })
        
        todoContainer.prepend(todoItem);
    }

    const showAllInGroup = (groupObj) => {
        cleanTodoList();
        let objLst = groupObj.getGroupObjList();
        objLst.forEach(element => {
            addTodoItem(element);
        });
    }

    let todayProjects = document.querySelector(".side-bar-dates #today");
    let thisWeekProjects = document.querySelector(".side-bar-dates #this-week");
    let home = document.querySelector(".side-bar .home");

    todayProjects.addEventListener('click', () => {
        let objList = todoObjManager.fromTodayList();
        showAllInList(objList);
    })

    thisWeekProjects.addEventListener('click', () => {
        let objList = todoObjManager.fromThisWeekList();
        showAllInList(objList);
    })

    home.addEventListener('click', () => {showAllInList(todoObjManager.todoObjLst)});

    const showAllInList = (objList) => {
        cleanTodoList();
        objList.forEach(element => {
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

    return {addTodoItem, addGroupElements};
})();