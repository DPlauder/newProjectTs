import { Project, ProjectStatus } from "../models/project.js";

//Global State Kasse nach Singelton Pattern



type Listener<T> = (items: Project[])=> void;

class State<T>{
    protected listeners: Listener<T>[] = [];
    addListener(listenerFn: Listener<T>){
        this.listeners.push(listenerFn);
    }
}

class ProjectState extends State<Project>{
    private projects: Project[] = [];
    private static instance: ProjectState;

    private constructor(){
        super();
    }
    static getInstance() {
        if(this.instance){
            return this.instance;
        }
        this.instance = new ProjectState;
        return this.instance;
    }
    private updateListener(){
        for(const listenerFn of this.listeners) {
            listenerFn(this.projects.slice());
        }
    }

    moveProject(projectId: string, newStatus: ProjectStatus){
        const project = this.projects.find(prj => prj.id === projectId);
        if(project && project.status !== newStatus){
            project.status = newStatus;
            this.updateListener();
        }
    }

    addProject(title: string, description: string, numOfpeople: number){
        const newProject = new Project(Math.random().toString(), title, description, numOfpeople, ProjectStatus.ACTIVE);          
        
        this.projects.push(newProject);
        this.updateListener();
    }
}



export const projectState = ProjectState.getInstance()