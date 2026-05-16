interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
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
class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  inputTitleElement: HTMLInputElement;
  inputDescriptionElement: HTMLInputElement;
  inputPeopleElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById(
      "project-input",
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;
    const importedNode = document.importNode(
      this.templateElement.content,
      true,
    );
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = "user-input";

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
    this.attach();
  }

  private configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  @autobind
  private submitHandler(e: Event) {
    e.preventDefault();
    const userInput = this.gatherInput();
    if (Array.isArray(userInput)) {
      console.log(userInput);
    }
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
  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

class ProjectList {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;

  constructor(private type: "active" | "finished") {
    this.templateElement = document.getElementById(
      "project-list",
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;
    const importedNode = document.importNode(
      this.templateElement.content,
      true,
    );
    this.element = importedNode.firstElementChild as HTMLElement;
    this.element.id = `${type}-projects`;

    this.renderContent();
    this.attach();
  }

  private renderContent() {
    this.element.querySelector("ul")!.id = `${this.type}-projects-list`;
    this.element.querySelector("h2")!.textContent =
      `${this.type.toUpperCase()} PROJECTS`;
  }

  private attach() {
    this.hostElement.insertAdjacentElement("beforeend", this.element);
  }
}

const projectInput = new ProjectInput();
const activePrjList = new ProjectList("active");
const finishedPrjList = new ProjectList("finished");
