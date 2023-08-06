"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 *
 * @param _ //not used
 * @param _2 //not used
 * @param descriptor
 */
function Autobind(_, _2, descriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor = {
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        },
    };
    return adjDescriptor;
}
function validate(validateInput) {
    let isValid = true;
    const { value, required, minLength, maxLength, min, max } = validateInput;
    //TODO: Try exit Code when false;
    if (required) {
        isValid = isValid && value.toString().trim().length !== 0;
    }
    if (minLength !== null && typeof value === "string" && typeof minLength != "undefined") {
        isValid = isValid && value.trim().length >= minLength;
    }
    if (maxLength !== null && typeof value === "string" && typeof maxLength != "undefined") {
        isValid = isValid && value.trim().length <= maxLength;
    }
    if (min != null && typeof value === "number") {
        isValid = isValid && value >= min;
    }
    if (max != null && typeof value === "number") {
        isValid = isValid && value <= max;
    }
    return isValid;
}
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["ACTIVE"] = 0] = "ACTIVE";
    ProjectStatus[ProjectStatus["FINISHED"] = 1] = "FINISHED";
})(ProjectStatus || (ProjectStatus = {}));
class Project {
    constructor(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
}
//Global State Kasse nach Singelton Pattern
class ProjectState {
    constructor() {
        this.listeners = [];
        this.projects = [];
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState;
        return this.instance;
    }
    addListener(listenerFn) {
        this.listeners.push(listenerFn);
    }
    addProject(title, description, numOfpeople) {
        const newProject = new Project(Math.random().toString(), title, description, numOfpeople, ProjectStatus.ACTIVE);
        this.projects.push(newProject);
        //alle Funkitione  durchgehen und alle einzelnen Projekte jeder Funktion übergeben
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice());
        }
    }
}
// Klasse Formular Input
class ProjectInput {
    constructor() {
        this.templateElement = document.getElementById('project-input');
        this.parentElement = document.getElementById('app');
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.attache();
        this.titleInputElement = document.querySelector('#title');
        this.descriptionInputElement = document.querySelector('#description');
        this.peopleInputElement = document.querySelector('#people');
        this.configure();
    }
    saveUserInput() {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;
        const titleValidateable = {
            value: enteredTitle,
            required: true,
        };
        const descriptionValidateable = {
            value: enteredDescription,
            required: true,
            minLength: 5,
        };
        const peopleValidate = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 10,
        };
        if (!validate(titleValidateable) ||
            !validate(descriptionValidateable) ||
            !validate(peopleValidate)) {
            alert("Invalid Input");
            return;
        }
        return [enteredTitle, enteredDescription, +enteredPeople];
    }
    clearInput() {
        this.titleInputElement.value = "";
        this.descriptionInputElement.value = "";
        this.peopleInputElement.value = "";
    }
    attache() {
        this.parentElement.insertAdjacentElement("afterbegin", this.element);
    }
    submitHandler(event) {
        event.preventDefault();
        const userInput = this.saveUserInput();
        if (Array.isArray(userInput)) {
            const [title, description, people] = userInput;
            console.log(title, description, people);
        }
        this.clearInput();
    }
    configure() {
        this.element.addEventListener('submit', this.submitHandler);
    }
}
__decorate([
    Autobind
], ProjectInput.prototype, "submitHandler", null);
// Klasse Projects List(finished, active)
class ProjectList {
    constructor(type) {
        this.type = type;
        this.assignedProjects = [];
        this.templateElement = document.getElementById('project-list');
        this.hostElement = document.getElementById('app');
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = `${this.type}-projects`;
        projectState.addListener((projects) => {
            this.assignedProjects = projects;
            this.renderProjects();
        });
        this.attach();
        this.renderContent();
    }
    renderProjects() {
        const listEl = document.getElementById(`${this.type}-project-list`);
        this.assignedProjects.forEach(prjItem => {
            const listItem = document.createElement('li');
            listItem.textContent = prjItem.title;
            listEl.appendChild(listItem);
        });
    }
    renderContent() {
        const listId = `${this.type}-project-list`;
        this.element.querySelector("ul").id = listId;
        this.element.querySelector("h2").textContent = `${this.type.toUpperCase()} PROJEKTS`;
    }
    attach() {
        this.hostElement.insertAdjacentElement("beforeend", this.element);
    }
}
const projectState = ProjectState.getInstance();
const myState = ProjectState.getInstance();
projectState.addProject("Hello World", "My first Project", 3);
console.log(projectState);
new ProjectInput();
new ProjectList("finished");
new ProjectList("active");
//# sourceMappingURL=main.js.map