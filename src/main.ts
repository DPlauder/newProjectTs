
/**
 * 
 * @param _ //not used
 * @param _2 //not used
 * @param descriptor 
 */
function Autobind(_: any, _2: string, descriptor: PropertyDescriptor){
    const originalMethod = descriptor.value;
    const adjDescriptor = {
        get(){
            const boundFn = originalMethod.bind(this);
            return boundFn
        },
    };
    return adjDescriptor;
}

interface Validateable{
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

function validate(validateInput: Validateable): boolean{
    let isValid = true;
    const {value, required, minLength, maxLength, min, max} = validateInput;
    //TODO: Try exit Code when false;
    if(required){
        isValid = isValid && value.toString().trim().length !== 0;
    }
    if(minLength !== null && typeof value === "string" && typeof minLength != "undefined"){
        isValid = isValid && value.trim().length >= minLength;
    }
    if(maxLength !== null && typeof value === "string" && typeof maxLength != "undefined"){
        isValid = isValid && value.trim().length <= maxLength;
    }
    if( min != null && typeof value === "number"){
        isValid = isValid && value >= min;
    }
    if( max != null && typeof value === "number"){
        isValid = isValid && value <= max;
    }
    return isValid;
}

enum ProjectStatus{
    ACTIVE,
    FINISHED
}

class Project{
    constructor
    (public id: string, 
        public title: string, 
        public description: string, 
        public people: number, 
        public status: ProjectStatus,
    ){}
}

type Listener = (items: Project[]) => void;

//Global State Kasse nach Singelton Pattern
class ProjectState{
    private listeners: Listener[] = [];
    private projects: Project[] = [];
    private static instance: ProjectState;

    private constructor(){
    }
    static getInstance() {
        if(this.instance){
            return this.instance;
        }
        this.instance = new ProjectState;
        return this.instance;
    }
    addListener(listenerFn: Listener){
        this.listeners.push(listenerFn);
    }

    addProject(title: string, description: string, numOfpeople: number){
        const newProject = new Project(Math.random().toString(), title, description, numOfpeople, ProjectStatus.ACTIVE);   
        
        this.projects.push(newProject);
        //alle Funkitione  durchgehen und alle einzelnen Projekte jeder Funktion übergeben
        for(const listenerFn of this.listeners) {
            listenerFn(this.projects.slice());
        }
    }
}



// Klasse Formular Input
class ProjectInput {
    templateElement: HTMLTemplateElement;
    parentElement: HTMLDivElement;
    element: HTMLFormElement;

    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor(){
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.parentElement = document.getElementById('app')! as HTMLDivElement;
        

        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild as HTMLFormElement;

        this.attache();
        
        this.titleInputElement = document.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = document.querySelector('#description') as HTMLInputElement;
        this.peopleInputElement = document.querySelector('#people') as HTMLInputElement;

        this.configure()

    }

    private saveUserInput(): [string,string, number] | void{
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;

        const titleValidateable: Validateable = {
            value: enteredTitle,
            required: true,
        };

        const descriptionValidateable: Validateable = {
            value: enteredDescription,
            required: true,
            minLength: 5,
        };

        const peopleValidate: Validateable = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 10,
        }

        if(
        !validate(titleValidateable) || 
        !validate(descriptionValidateable) || 
        !validate(peopleValidate)){
            alert("Invalid Input");
            return;
        }
        return [enteredTitle, enteredDescription, +enteredPeople];
    }

    private clearInput(){
        this.titleInputElement.value = "";
        this.descriptionInputElement.value = "";
        this.peopleInputElement.value = "";
    }


    private attache(){
        this.parentElement.insertAdjacentElement("afterbegin", this.element);
    }


    @Autobind
    private submitHandler(event: Event){
        event.preventDefault();
        const userInput = this.saveUserInput();
        if(Array.isArray(userInput)){
            const [title, description, people] = userInput;
            console.log(title, description, people);
        }
        this.clearInput()
        
    }
    private configure(){
        this.element.addEventListener('submit', this.submitHandler)
    }


}

// Klasse Projects List(finished, active)

class ProjectList{
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLElement;

    assignedProjects: Project[] = [];

    constructor(private type: "active" | "finished"){
        this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;
        
        const importedNode = document.importNode(this.templateElement.content, true);

        this.element = importedNode.firstElementChild as HTMLElement;
        this.element.id = `${this.type}-projects`;
        projectState.addListener((projects: Project[]) => {
            this.assignedProjects = projects;
            this.renderProjects();
        })
        this.attach();
        this.renderContent();
    }
    renderProjects(){
        const listEl = document.getElementById(`${this.type}-project-list`)! as HTMLUListElement;
        this.assignedProjects.forEach(prjItem => {
            const listItem = document.createElement('li');
            listItem.textContent = prjItem.title;
            listEl.appendChild(listItem);
        })
    }
    private renderContent(){
        const listId = `${this.type}-project-list`;
        this.element.querySelector("ul")!.id = listId;
        this.element.querySelector("h2")!.textContent = `${this.type.toUpperCase()} PROJEKTS`;
    }

    attach(){
        this.hostElement.insertAdjacentElement("beforeend", this.element);
    }
}

const projectState = ProjectState.getInstance()
const myState = ProjectState.getInstance();
projectState.addProject("Hello World", "My first Project", 3)
console.log(projectState);


new ProjectInput();
new ProjectList("finished");
new ProjectList("active");

