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
class ProjectInput {
    constructor() {
        this.templateElement = document.getElementById("project-input");
        this.hostElement = document.getElementById("app");
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = "user-input";
        this.inputTitleElement = this.element.querySelector("#title");
        this.inputDescriptionElement = this.element.querySelector("#description");
        this.inputPeopleElement = this.element.querySelector("#people");
        this.configure();
        this.attach();
    }
    configure() {
        this.element.addEventListener("submit", this.submitHandler);
    }
    submitHandler(e) {
        e.preventDefault();
        const userInput = this.gatherInput();
        if (Array.isArray(userInput)) {
            console.log(userInput);
        }
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
    attach() {
        this.hostElement.insertAdjacentElement("afterbegin", this.element);
    }
}
__decorate([
    autobind
], ProjectInput.prototype, "submitHandler", null);
class ProjectList {
    constructor(type) {
        this.type = type;
        this.templateElement = document.getElementById("project-list");
        this.hostElement = document.getElementById("app");
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = `${type}-projects`;
        this.renderContent();
        this.attach();
    }
    renderContent() {
        this.element.querySelector("ul").id = `${this.type}-projects-list`;
        this.element.querySelector("h2").textContent =
            `${this.type.toUpperCase()} PROJECTS`;
    }
    attach() {
        this.hostElement.insertAdjacentElement("beforeend", this.element);
    }
}
const projectInput = new ProjectInput();
const activePrjList = new ProjectList("active");
const finishedPrjList = new ProjectList("finished");
//# sourceMappingURL=app.js.map