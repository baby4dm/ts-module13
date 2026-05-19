"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function autobind(_, _2, descriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor = {
        configurable: true,
        get() {
            return originalMethod.bind(this);
        },
    };
    return adjDescriptor;
}
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
    ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
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
class State {
    constructor() {
        this.listeners = [];
    }
    addListener(listener) {
        this.listeners.push(listener);
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
        this.instance = new ProjectState();
        return this.instance;
    }
    addProject(title, description, numOfPeople) {
        const project = new Project(Math.random().toString().slice(1), title, description, numOfPeople, ProjectStatus.Active);
        this.projects.push(project);
        for (const lstnr of this.listeners) {
            lstnr(this.projects);
        }
    }
}
const projectState = ProjectState.getInstance();
class Component {
    constructor(templateElementId, hostElementId, insertAtStart, newElementId) {
        this.templateElement = document.getElementById(templateElementId);
        this.hostElement = document.getElementById(hostElementId);
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        if (newElementId) {
            this.element.id = newElementId;
        }
        this.attach(insertAtStart);
    }
    attach(insertAtStart) {
        this.hostElement.insertAdjacentElement(insertAtStart ? "afterbegin" : "beforeend", this.element);
    }
}
class ProjectInput extends Component {
    constructor() {
        super("project-input", "app", true, "user-input");
        this.inputTitleElement = this.element.querySelector("#title");
        this.inputDescriptionElement = this.element.querySelector("#description");
        this.inputPeopleElement = this.element.querySelector("#people");
        this.configure();
    }
    configure() {
        this.element.addEventListener("submit", this.submitHandler);
    }
    submitHandler(e) {
        e.preventDefault();
        const userInput = this.gatherInput();
        if (Array.isArray(userInput)) {
            const [title, description, people] = userInput;
            projectState.addProject(title, description, people);
        }
        this.clearInputs();
    }
    gatherInput() {
        const title = this.inputTitleElement.value;
        const description = this.inputDescriptionElement.value;
        const people = this.inputPeopleElement.value;
        const validTitle = {
            value: title,
            required: true,
        };
        const validDescription = {
            value: description,
            required: true,
            minLength: 5,
        };
        const validPeople = {
            value: +people,
            required: true,
            min: 1,
            max: 5,
        };
        if (!this.validate(validTitle) ||
            !this.validate(validDescription) ||
            !this.validate(validPeople)) {
            alert("Invalid input data");
            return;
        }
        return [title, description, +people];
    }
    validate(validInput) {
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
    clearInputs() {
        this.inputTitleElement.value = "";
        this.inputDescriptionElement.value = "";
        this.inputPeopleElement.value = "";
    }
    renderContent() { }
}
__decorate([
    autobind
], ProjectInput.prototype, "submitHandler", null);
class ProjectItem extends Component {
    constructor(hostId, prj) {
        super("single-project", hostId, false, prj.id);
        this.project = prj;
        this.configure();
        this.renderContent();
    }
    configure() { }
    renderContent() {
        this.element.querySelector("h2").textContent = this.project.title;
        this.element.querySelector("h3").textContent =
            this.project.people.toString();
        this.element.querySelector("p").textContent = this.project.description;
    }
}
class ProjectList extends Component {
    constructor(type) {
        super("project-list", "app", false, `${type}-projects`);
        this.type = type;
        this.assignedProjects = [];
        this.configure();
        this.renderContent();
    }
    renderContent() {
        this.element.querySelector("ul").id = `${this.type}-projects-list`;
        this.element.querySelector("h2").textContent =
            `${this.type.toUpperCase()} PROJECTS`;
    }
    configure() {
        projectState.addListener((projects) => {
            const relevantProjects = projects.filter((pr) => {
                if (this.type === "active") {
                    return pr.status === ProjectStatus.Active;
                }
                else {
                    return pr.status === ProjectStatus.Finished;
                }
            });
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        });
    }
    renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`);
        listEl.innerHTML = "";
        for (const prj of this.assignedProjects) {
            new ProjectItem(this.element.querySelector("ul").id, prj);
        }
    }
}
const projectInput = new ProjectInput();
const activePrjList = new ProjectList("active");
const finishedPrjList = new ProjectList("finished");
//# sourceMappingURL=app.js.map