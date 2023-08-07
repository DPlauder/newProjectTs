import { Project, ProjectStatus } from "../models/project.js";
class State {
    constructor() {
        this.listeners = [];
    }
    addListener(listenerFn) {
        this.listeners.push(listenerFn);
    }
}
class ProjectState extends State {
    constructor() {
        super();
        this.projects = [];
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState;
        return this.instance;
    }
    updateListener() {
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice());
        }
    }
    moveProject(projectId, newStatus) {
        const project = this.projects.find(prj => prj.id === projectId);
        if (project && project.status !== newStatus) {
            project.status = newStatus;
            this.updateListener();
        }
    }
    addProject(title, description, numOfpeople) {
        const newProject = new Project(Math.random().toString(), title, description, numOfpeople, ProjectStatus.ACTIVE);
        this.projects.push(newProject);
        this.updateListener();
    }
}
export const projectState = ProjectState.getInstance();
//# sourceMappingURL=project-state.js.map