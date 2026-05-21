var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { autobind } from "../decorator/autobind";
import { projectState } from "../state/project-state";
import { validate } from "../util/validation";
import { Component } from "./base-component";
export class ProjectInput extends Component {
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
        if (!validate(validTitle) ||
            !validate(validDescription) ||
            !validate(validPeople)) {
            alert("Invalid input data");
            return;
        }
        return [title, description, +people];
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
//# sourceMappingURL=project-input.js.map