import { Project, ProjectStatus } from "../model/project";
import { State } from "./base-state";
class ProjectState extends State {
    constructor() {
        super();
        this.projects = [];
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }
    addProject(title, description, numOfPeople) {
        const project = new Project(Math.random().toString().slice(1), title, description, numOfPeople, ProjectStatus.Active);
        this.projects.push(project);
        this.renderProjects();
    }
    moveProject(id, newStatus) {
        const project = this.projects.find((prj) => prj.id === id);
        if (newStatus !== project.status) {
            project.status = newStatus;
            this.renderProjects();
        }
    }
    renderProjects() {
        for (const lstnr of this.listeners) {
            lstnr(this.projects);
        }
    }
}
export const projectState = ProjectState.getInstance();
//# sourceMappingURL=project-state.js.map