var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// Klasse Projects List(finished, active)
import { projectState } from "../state/project-state.js";
import { ProjectStatus } from "../models/project.js";
import { Component } from "./base-component.js";
import { Autobind } from "../decorators/autobind.js";
import { ProjectItem } from "./project-item.js";
class ProjectList extends Component {
    constructor(type) {
        super("project-list", "app", false, `${type}-projects`);
        this.type = type;
        this.assignedProjects = [];
        this.configure();
        this.renderContent();
    }
    dragOverHandler(event) {
        if (event.dataTransfer && event.dataTransfer.types[0] == 'text/plain') {
            event === null || event === void 0 ? void 0 : event.preventDefault();
            const listElement = this.element.querySelector('ul');
            listElement === null || listElement === void 0 ? void 0 : listElement.classList.add('droppable');
        }
    }
    dragLeaveHandler(_) {
        const listElement = this.element.querySelector('ul');
        listElement === null || listElement === void 0 ? void 0 : listElement.classList.remove('droppable');
    }
    dropHandler(event) {
        var _a;
        const itemId = (_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData('text/plain');
        projectState.moveProject(itemId, this.type === "active" ? ProjectStatus.ACTIVE : ProjectStatus.FINISHED);
    }
    configure() {
        this.element.addEventListener("dragover", this.dragOverHandler);
        this.element.addEventListener("dragleave", this.dragLeaveHandler);
        this.element.addEventListener("drop", this.dropHandler);
        projectState.addListener((projects) => {
            const relevantProjects = projects.filter((prj) => {
                if (this.type === "active") {
                    return prj.status === ProjectStatus.ACTIVE;
                }
                return prj.status === ProjectStatus.FINISHED;
            });
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        });
    }
    renderProjects() {
        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);
        const listEl = document.getElementById(`${this.type}-project-list`);
        listEl.innerHTML = "";
        this.assignedProjects.forEach(prjItem => {
            new ProjectItem(this.element.querySelector('ul').id, prjItem);
        });
    }
    renderContent() {
        const listId = `${this.type}-project-list`;
        this.element.querySelector("ul").id = listId;
        this.element.querySelector("h2").textContent = `${this.type.toUpperCase()} PROJECTS`;
    }
}
__decorate([
    Autobind
], ProjectList.prototype, "dragOverHandler", null);
__decorate([
    Autobind
], ProjectList.prototype, "dragLeaveHandler", null);
__decorate([
    Autobind
], ProjectList.prototype, "dropHandler", null);
export { ProjectList };
//# sourceMappingURL=project-list.js.map