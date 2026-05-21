import { autobind } from "../decorator/autobind";
import { projectState } from "../state/project-state";
import { Validatable, validate } from "../util/validation";
import { Component } from "./base-component";

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
      !validate(validTitle) ||
      !validate(validDescription) ||
      !validate(validPeople)
    ) {
      alert("Invalid input data");
      return;
    }

    return [title, description, +people];
  }

  private clearInputs() {
    this.inputTitleElement.value = "";
    this.inputDescriptionElement.value = "";
    this.inputPeopleElement.value = "";
  }
  renderContent(): void {}
}
