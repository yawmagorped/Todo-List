import "./style.css";

function todoObj(c, g, d, gn) {
    let content = c;
    let date = d;
    let groupName = gn;

    return {content, date, groupName};
}

function group() {
    let groupName;
    let todoObjLst = [];

    const addMember = (todoObj) => {
        todoObjLst.push(todoObj);
    }
}

function groupManager() {
    let groupLst = [];

    const addGroup = (group) => {
        groupLst.push(group);
    }
}
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
    const cleanElements = () => {
        todoTxt.value = "";
        date.value = "";
    }
}