import { autobind } from "../decorator/autobind";
import { DragTarget } from "../model/drag-drop";
import { Project, ProjectStatus } from "../model/project";
import { projectState } from "../state/project-state";
import { Component } from "./base-component";
import { ProjectItem } from "./project-item";

export class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    this.assignedProjects = [];
    this.configure();
    this.renderContent();
  }

  @autobind
  dragOverHandler(event: DragEvent): void {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault();
      const listEl = this.element.querySelector("ul")!;
      listEl.classList.add("droppable");
    }
  }
  @autobind
  dropHandler(event: DragEvent): void {
    const projectId = event.dataTransfer!.getData("text/plain");
    projectState.moveProject(
      projectId,
      this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished,
    );
    this.removeDroppable();
  }
  @autobind
  dragLeaveHandler(_: DragEvent): void {
    this.removeDroppable();
  }

  renderContent() {
    this.element.querySelector("ul")!.id = `${this.type}-projects-list`;
    this.element.querySelector("h2")!.textContent =
      `${this.type.toUpperCase()} PROJECTS`;
  }
  configure(): void {
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("drop", this.dropHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);
    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((pr) => {
        if (this.type === "active") {
          return pr.status === ProjectStatus.Active;
        } else {
          return pr.status === ProjectStatus.Finished;
        }
      });
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`,
    ) as HTMLUListElement;
    listEl.innerHTML = "";
    for (const prj of this.assignedProjects) {
      new ProjectItem(this.element.querySelector("ul")!.id, prj);
    }
  }

  private removeDroppable() {
    const listEl = this.element.querySelector("ul")!;
    listEl.classList.remove("droppable");
  }
}
