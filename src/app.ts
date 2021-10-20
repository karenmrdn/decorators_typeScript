// decorator factory: Logger
function Logger(logString: string) {
  console.log("LOGGER decorator factory");
  // actual decorator: anonymous function below
  return (constructor: Function) => {
    console.log(logString);
    console.log(constructor);
  };
}

function WithTemplate(template: string, hookId: string) {
  console.log("TEMPLATE decorator factory");
  return function (constructor: any) {
    console.log("Rendering template");
    const hookElement = document.getElementById(hookId);
    const person = new constructor();
    if (hookElement) {
      hookElement.innerHTML = template;
      hookElement.querySelector("h1")!.textContent = person.name;
    }
  };
}

// !!! Decorators execute from bottom to up, but
// decorator factories execute from top to bottom
@Logger("LOGGING")
@WithTemplate("<h1>My Person Object</h1>", "app")
class Person {
  name = "Lara";

  constructor() {
    console.log("Creating person object...");
  }
}

const person = new Person();

console.log(person);
