import { projectState } from "../state/project-state.js";
import { Component } from "./base-component.js";
import { Autobind } from "../decorators/autobind.js";
import { validate, Validateable } from "../util/valdations.js";

// Klasse Formular Input

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor(){
        super( "project-input", "app", true, "user-input");
       
        this.titleInputElement = document.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = document.querySelector('#description') as HTMLInputElement;
        this.peopleInputElement = document.querySelector('#people') as HTMLInputElement;
        this.configure();
    }
    renderContent(): void {
        
    }
    configure(): void {
        this.element.addEventListener("submit", this.submitHandler);
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

    @Autobind
    private submitHandler(event: Event){
        event.preventDefault();
        const userInput = this.saveUserInput();
        if(Array.isArray(userInput)){
            const [title, description, people] = userInput;
            projectState.addProject(title, description, people);
        }
        this.clearInput()
        
    }

}
export { ProjectInput }