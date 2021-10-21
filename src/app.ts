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

/* ____________________________ */
console.log("____________________________");

// !!! Property decorator
function Log(target: any, propertyName: string | Symbol) {
  console.log("-----------Property decorator!");
  console.log(target, propertyName);
}

// !!! Accessor decorator
// target - prototype(if it is an instance method) or constructor-function(if it is static method)
function Log2(
  target: any,
  name: string | Symbol,
  descriptor: PropertyDescriptor
) {
  console.log("-----------Accessor decorator!");
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

// !!! Method decorator
// target - prototype(if it is an instance method) or constructor-function(if it is static method)
function Log3(
  target: any,
  name: string | Symbol,
  descriptor: PropertyDescriptor
) {
  console.log("-----------Method decorator!");
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

// !!! Parameter decorator
// name - name of the method where we use this parameter
// position - index of the argument in method arguments
function Log4(target: any, name: string | Symbol, position: number) {
  console.log("-----------Parameter decorator!");
  console.log(target);
  console.log(name);
  console.log(position);
}

class Product {
  @Log // this decorator executes when our class definition is registered by JS
  title: string;
  private _price: number;

  @Log2
  set price(val: number) {
    if (val > 0) {
      this._price = val;
    } else {
      throw new Error("Price must be positive.");
    }
  }

  constructor(title: string, price: number) {
    this.title = title;
    this._price = price;
  }

  @Log3
  getPriceWithTax(@Log4 tax: number) {
    return this._price * (1 + tax);
  }
}
