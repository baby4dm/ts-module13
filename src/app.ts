interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}
interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

interface DragTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      return originalMethod.bind(this);
    },
  };
  return adjDescriptor;
}

enum ProjectStatus {
  Active,
  Finished,
}

type Listener<T> = (items: T[]) => void;

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus,
  ) {}
}
class State<T> {
  protected listeners: Listener<T>[] = [];
  addListener(listener: Listener<T>) {
    this.listeners.push(listener);
  }
}

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

const projectState = ProjectState.getInstance();

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateElementId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string,
  ) {
    this.templateElement = document.getElementById(
      templateElementId,
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId)! as T;
    const importedNode = document.importNode(
      this.templateElement.content,
      true,
    );
    this.element = importedNode.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }

    this.attach(insertAtStart);
  }

  private attach(insertAtStart: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtStart ? "afterbegin" : "beforeend",
      this.element,
    );
  }

  abstract configure(): void;
  abstract renderContent(): void;
}

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  inputTitleElement: HTMLInputElement;
  inputDescriptionElement: HTMLInputElement;
  inputPeopleElement: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");
    this.inputTitleElement = this.element.querySelector(
      "#title",
    ) as HTMLInputElement;
    this.inputDescriptionElement = this.element.querySelector(
      "#description",
    ) as HTMLInputElement;
    this.inputPeopleElement = this.element.querySelector(
      "#people",
    ) as HTMLInputElement;

    this.configure();
  }

  configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  @autobind
  private submitHandler(e: Event) {
    e.preventDefault();
    const userInput = this.gatherInput();
    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput;
      projectState.addProject(title, description, people);
    }
    this.clearInputs();
  }

  private gatherInput(): [string, string, number] | void {
    const title = this.inputTitleElement.value;
    const description = this.inputDescriptionElement.value;
    const people = this.inputPeopleElement.value;

    const validTitle: Validatable = {
      value: title,
      required: true,
    };

    const validDescription: Validatable = {
      value: description,
      required: true,
      minLength: 5,
    };

    const validPeople: Validatable = {
      value: +people,
      required: true,
      min: 1,
      max: 5,
    };

    if (
      !this.validate(validTitle) ||
      !this.validate(validDescription) ||
      !this.validate(validPeople)
    ) {
      alert("Invalid input data");
      return;
    }

    return [title, description, +people];
  }
  private validate(validInput: Validatable) {
    let isValid = true;
    if (validInput.required) {
      isValid = isValid && validInput.value.toString().trim().length > 0;
    }
    if (validInput.minLength != null && typeof validInput.value === "string") {
      isValid =
        isValid && validInput.value.trim().length >= validInput.minLength;
    }
    if (validInput.maxLength != null && typeof validInput.value === "string") {
      isValid =
        isValid && validInput.value.trim().length <= validInput.maxLength;
    }
    if (validInput.min != null && typeof validInput.value === "number") {
      isValid = isValid && validInput.value >= validInput.min;
    }
    if (validInput.max != null && typeof validInput.value === "number") {
      isValid = isValid && validInput.value <= validInput.max;
    }

    return isValid;
  }

  private clearInputs() {
    this.inputTitleElement.value = "";
    this.inputDescriptionElement.value = "";
    this.inputPeopleElement.value = "";
  }
  renderContent(): void {}
}

class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  project: Project;
  constructor(hostId: string, prj: Project) {
    super("single-project", hostId, false, prj.id);
    this.project = prj;

    this.configure();
    this.renderContent();
  }

  get persons() {
    if (this.project.people === 1) {
      return "1 person";
    } else {
      return `${this.project.people} persons`;
    }
  }
  @autobind
  dragStartHandler(event: DragEvent): void {
    event.dataTransfer!.setData("text/plain", this.project.id);
    event.dataTransfer!.effectAllowed = "move";
  }
  dragEndHandler(_: DragEvent): void {}

  configure(): void {
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndHandler);
  }

  renderContent(): void {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = this.persons + " assigned";
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}
class ProjectList
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

const projectInput = new ProjectInput();
const activePrjList = new ProjectList("active");
const finishedPrjList = new ProjectList("finished");
