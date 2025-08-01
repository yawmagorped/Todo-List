import "./style.css";

function todoObj(c, g, d, gn) {
    let content = c;
    let date = d;
    let groupName = gn;

    return {content, date, groupName};
}

function group(name) {
    let groupName = name;
    let todoObjLst = [];

    const addMember = (todoObj) => {
        todoObjLst.push(todoObj);
    }
    const getThisGroup = () => {
        return this;
    }
    return {getThisGroup, addMember, groupName, todoObjLst};
}

const groupManager = ( () => { //IIFE
    let groupLst = [];
    let isCopy;

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
        groupLst.push(g); // new keyword?
        return true;
    }
    return {addGroup, groupLst};
})();

elementManager();
function elementManager() {
    let todoTxt = document.querySelector("#todo-text");
    let selectedGroup = document.querySelector("select#groups");
    let groupAdder = document.querySelector(".add-button");
    let date = document.querySelector("#todo-date");

    const readElement = (state) => {
        state.content = todoTxt.value;
        state.date = selectedGroup.value;
        state.groupName = date.value;
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


    let projectHolder = document.querySelector(".project-selector-holder");
    let groupSelect = document.querySelector("select#groups");

    groupAdder.addEventListener('click', () => {
        projectHolder.appendChild(groupInputBox);
    }); 
    
    groupInputBox.addEventListener('keydown', (element) => {
        if(element.key == "Enter") {
            if(groupManager.addGroup(groupInputBox.value)) {
                groupSelect.appendChild(newOption(groupInputBox.value));
                
                groupInputBox.classList.remove("false");
                projectHolder.removeChild(groupInputBox);
                groupInputBox.value = "";
            } else {
                groupInputBox.classList.add("false");
            }
        }
    });

    const cleanElements = () => {
        todoTxt.value = "";
        date.value = "";
    }
}