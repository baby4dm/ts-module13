import { Project, ProjectStatus } from "../model/project";
import { State } from "./base-state";

class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addProject(title: string, description: string, numOfPeople: number) {
    const project = new Project(
      Math.random().toString().slice(1),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active,
    );
    this.projects.push(project);
    this.renderProjects();
  }

  moveProject(id: string, newStatus: ProjectStatus) {
    const project = this.projects.find((prj) => prj.id === id)!;
    if (newStatus !== project.status) {
      project.status = newStatus;
      this.renderProjects();
    }
  }

  private renderProjects() {
    for (const lstnr of this.listeners) {
      lstnr(this.projects);
    }
  }
}
export const projectState = ProjectState.getInstance();
