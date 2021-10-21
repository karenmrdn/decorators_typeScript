// decorator factory: Logger
function Logger(logString: string) {
  console.log("LOGGER decorator factory");
  // actual decorator: anonymous function below
  return (constructor: Function) => {
    console.log(logString);
    console.log(constructor);
  };
}

// !!! Only some decorator can return something from-inside themselves,
// e.g. class, method and accessor decorators
function WithTemplate(template: string, hookId: string) {
  console.log("TEMPLATE decorator factory");
  return function <T extends { new (...args: any[]): { name: string } }>(
    originalConstructor: T
  ) {
    // by returning new class from-inside decorator (not decorator factory)
    // we will replace class that was originally created
    return class extends originalConstructor {
      constructor(..._: any[]) {
        super();
        console.log("Rendering template");
        const hookElement = document.getElementById(hookId);
        if (hookElement) {
          hookElement.innerHTML = template;
          hookElement.querySelector("h1")!.textContent = this.name;
        }
      }
    };
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

// !!! All these decorators execute when our class defined

// !!! Property decorator
function Log(target: any, propertyName: string | Symbol) {
  console.log("-----------Property decorator!");
  console.log(target, propertyName);
}

// !!! Accessor decorator
// target - prototype(if it is an instance method) or constructor-function(if it is static method)
// We can return only new propertyDescriptor from-inside accessor and parameter decorators
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
// !!! We can return only new propertyDescriptor from-inside accessor and parameter decorators
function Log4(target: any, name: string | Symbol, position: number) {
  console.log("-----------Parameter decorator!");
  console.log(target);
  console.log(name);
  console.log(position);
}

class Product {
  @Log
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

// Class instances creation does not affect decorators call
const prod1 = new Product("Book", 29);
const prod2 = new Product("Earbuds", 59);

/* Autobind decorator */
console.log("____________________________");

function Autobind(
  target: any,
  methodName: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}

class Printer {
  message = "This works!";

  @Autobind
  showMessage() {
    console.log(this.message);
  }
}

const printer = new Printer();

const button = document.querySelector("button")!;
button.addEventListener("click", printer.showMessage);
