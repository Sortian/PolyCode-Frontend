// ──────────────────────────────────────────────
//  PolyCode — OOP in C++ Curriculum Data
//  Enhanced with quiz, diagram, and stepthrough block types
// ──────────────────────────────────────────────

export const CHAPTERS = [
  {
    id: "intro",
    title: "What is OOP?",
    icon: "🧠",
    color: "#b8ff00",
    lessons: [
      {
        id: "intro-1",
        title: "Procedural vs Object-Oriented",
        xp: 10,
        theory: [
          {
            type: "text",
            content:
              "In **procedural programming**, you write a sequence of instructions. In **OOP**, you model your program as a collection of *objects* — each bundling data and behavior together.",
          },
          {
            type: "callout",
            variant: "info",
            content:
              "Think of an object like a vending machine: it has *state* (what's inside, how much money is inserted) and *behavior* (dispense item, return change).",
          },
          {
            type: "diagram",
            title: "Procedural vs OOP",
            nodes: [
              {
                id: "proc",
                label: "Procedural",
                color: "#ff6b6b",
                items: ["Data (variables)", "Functions", "Separate concerns"],
              },
              {
                id: "oop",
                label: "OOP",
                color: "#b8ff00",
                items: ["Object = Data + Methods", "Encapsulated", "Reusable"],
              },
            ],
          },
          {
            type: "code",
            lang: "cpp",
            label: "Procedural style",
            content: `// Procedural — data and logic are separate
string name = "Alice";
int age = 25;

void greet(string n, int a) {
    cout << "Hi " << n << ", age " << a << endl;
}`,
          },
          {
            type: "code",
            lang: "cpp",
            label: "OOP style",
            content: `// OOP — data and logic live together
class Person {
public:
    string name;
    int age;

    void greet() {
        cout << "Hi " << name << ", age " << age << endl;
    }
};`,
          },
          {
            type: "quiz",
            question: "Which OOP principle bundles data and behavior together?",
            options: [
              "Inheritance",
              "Encapsulation",
              "Polymorphism",
              "Abstraction",
            ],
            answer: 1,
            explanation:
              "Encapsulation is the principle of wrapping data and the methods that operate on that data into a single unit (class).",
          },
        ],
        challenge: {
          title: "Define Your First Class",
          description:
            'Define a `Car` class with two public attributes: `brand` (string) and `speed` (int). In `main()`, create a Car object, set `brand` to `"Tesla"` and `speed` to `200`, then print both.',
          starterCode: `#include <iostream>
using namespace std;

// TODO: Define the Car class here


int main() {
    // TODO: Create a Car object and print its brand and speed
    return 0;
}`,
          solutionCode: `#include <iostream>
using namespace std;

class Car {
public:
    string brand;
    int speed;
};

int main() {
    Car c;
    c.brand = "Tesla";
    c.speed = 200;
    cout << c.brand << " - " << c.speed << " km/h" << endl;
    return 0;
}`,
          tests: [
            {
              id: 1,
              label: "Car class is defined",
              hint: "Use the `class` keyword",
            },
            {
              id: 2,
              label: "brand is set to Tesla",
              hint: 'c.brand = "Tesla"',
            },
            { id: 3, label: "speed is set to 200", hint: "c.speed = 200" },
            {
              id: 4,
              label: "Output contains Tesla and 200",
              hint: "Use cout to print",
            },
          ],
        },
      },
    ],
  },

  {
    id: "classes",
    title: "Classes & Objects",
    icon: "📦",
    color: "#00d4ff",
    lessons: [
      {
        id: "classes-1",
        title: "Constructors",
        xp: 15,
        theory: [
          {
            type: "text",
            content:
              "A **constructor** is a special method called automatically when an object is created. It *initializes* the object's data.",
          },
          {
            type: "callout",
            variant: "tip",
            content:
              "Constructor name = Class name. No return type — not even `void`.",
          },
          {
            type: "stepthrough",
            title: "How Object Creation Works",
            steps: [
              {
                label: "Memory allocated",
                code: "Rectangle r2(5, 3);",
                desc: "The runtime allocates memory for all member variables of Rectangle.",
              },
              {
                label: "Constructor called",
                code: "Rectangle(int w, int h) {\n  width = w; height = h;\n}",
                desc: "The parameterized constructor runs and sets width=5, height=3.",
              },
              {
                label: "Object ready",
                code: "r2.area(); // returns 15",
                desc: "The object is fully initialized and ready to use.",
              },
            ],
          },
          {
            type: "code",
            lang: "cpp",
            label: "Default & Parameterized constructors",
            content: `class Rectangle {
public:
    int width, height;

    // Default constructor
    Rectangle() {
        width = 0;
        height = 0;
    }

    // Parameterized constructor
    Rectangle(int w, int h) {
        width = w;
        height = h;
    }

    int area() { return width * height; }
};

int main() {
    Rectangle r1;          // calls default ctor
    Rectangle r2(5, 3);   // calls parameterized ctor
    cout << r2.area();    // 15
}`,
          },
          {
            type: "callout",
            variant: "warning",
            content:
              "If you define any constructor, the compiler stops generating a default one for you. Always be explicit.",
          },
          {
            type: "quiz",
            question:
              "What is printed by: `Rectangle r(4, 5); cout << r.area();`",
            options: ["9", "20", "45", "Compiler error"],
            answer: 1,
            explanation: "area() returns width * height = 4 * 5 = 20.",
          },
        ],
        challenge: {
          title: "Build a BankAccount Constructor",
          description:
            "Create a `BankAccount` class with `owner` (string) and `balance` (double). Add a parameterized constructor to set both. Add a method `display()` that prints: `Alice: $1500.00`. Create one account in main and call display.",
          starterCode: `#include <iostream>
#include <iomanip>
using namespace std;

// TODO: Define BankAccount class


int main() {
    // Create BankAccount("Alice", 1500.0) and call display()
    return 0;
}`,
          solutionCode: `#include <iostream>
#include <iomanip>
using namespace std;

class BankAccount {
public:
    string owner;
    double balance;

    BankAccount(string o, double b) {
        owner = o;
        balance = b;
    }

    void display() {
        cout << owner << ": $" << fixed << setprecision(2) << balance << endl;
    }
};

int main() {
    BankAccount acc("Alice", 1500.0);
    acc.display();
    return 0;
}`,
          tests: [
            { id: 1, label: "BankAccount class defined" },
            { id: 2, label: "Parameterized constructor exists" },
            { id: 3, label: "display() method exists" },
            { id: 4, label: "Output: Alice: $1500.00" },
          ],
        },
      },
      {
        id: "classes-2",
        title: "Access Specifiers",
        xp: 15,
        theory: [
          {
            type: "text",
            content:
              "C++ has three access specifiers that control *who* can see a class member:",
          },
          {
            type: "table",
            headers: ["Specifier", "Accessible From", "Use Case"],
            rows: [
              ["public", "Anywhere", "Interface methods, public data"],
              ["private", "Class only", "Internal data (default)"],
              ["protected", "Class + subclasses", "Inheritance scenarios"],
            ],
          },
          {
            type: "code",
            lang: "cpp",
            label: "Encapsulation with private data",
            content: `class Student {
private:
    int grade;  // hidden from outside

public:
    void setGrade(int g) {
        if (g >= 0 && g <= 100) grade = g;  // validation!
    }
    int getGrade() { return grade; }
};

// Outside the class:
Student s;
s.setGrade(95);   // ✅ OK
// s.grade = 95;  // ❌ compile error`,
          },
          {
            type: "quiz",
            question:
              "Which access specifier lets subclasses (but NOT outside code) access a member?",
            options: ["public", "private", "protected", "internal"],
            answer: 2,
            explanation:
              "`protected` members are accessible within the class and any derived class, but not from outside code.",
          },
        ],
        challenge: {
          title: "Encapsulate Temperature",
          description:
            "Create a `Thermometer` class. The temperature should be **private**. Add `setTemp(double t)` — only accept values between -100 and 150. Add `getTemp()` to return it. In main, set temp to 36.6 and print it.",
          starterCode: `#include <iostream>
using namespace std;

// TODO: Thermometer class


int main() {
    // set temp 36.6 and print
    return 0;
}`,
          solutionCode: `#include <iostream>
using namespace std;

class Thermometer {
private:
    double temp;
public:
    void setTemp(double t) {
        if (t >= -100 && t <= 150) temp = t;
    }
    double getTemp() { return temp; }
};

int main() {
    Thermometer th;
    th.setTemp(36.6);
    cout << th.getTemp() << endl;
    return 0;
}`,
          tests: [
            { id: 1, label: "temp is private" },
            { id: 2, label: "setTemp() validates range" },
            { id: 3, label: "getTemp() returns temperature" },
            { id: 4, label: "Output: 36.6" },
          ],
        },
      },
    ],
  },

  {
    id: "inheritance",
    title: "Inheritance",
    icon: "🧬",
    color: "#ff6b6b",
    lessons: [
      {
        id: "inherit-1",
        title: "Single Inheritance",
        xp: 20,
        theory: [
          {
            type: "text",
            content:
              "**Inheritance** lets a class *inherit* attributes and methods from another class. The parent is called the **base class**; the child is the **derived class**.",
          },
          {
            type: "callout",
            variant: "info",
            content: "Syntax: `class Child : public Parent { ... };`",
          },
          {
            type: "diagram",
            title: "Inheritance Chain",
            nodes: [
              {
                id: "animal",
                label: "Animal",
                color: "#ff6b6b",
                items: ["name: string", "breathe()"],
              },
              {
                id: "dog",
                label: "Dog : Animal",
                color: "#ffaa00",
                items: ["← inherits name, breathe()", "bark()"],
                parent: "animal",
              },
            ],
          },
          {
            type: "code",
            lang: "cpp",
            label: "Animal → Dog",
            content: `class Animal {
public:
    string name;
    void breathe() { cout << name << " breathes." << endl; }
};

class Dog : public Animal {
public:
    void bark() { cout << name << " says Woof!" << endl; }
};

int main() {
    Dog d;
    d.name = "Rex";
    d.breathe();   // inherited!
    d.bark();      // Dog-specific
}`,
          },
          {
            type: "quiz",
            question:
              "In `class Dog : public Animal`, what does `public` control?",
            options: [
              "Whether Dog's members are public",
              "The access level of inherited members in Dog",
              "Whether Animal can access Dog",
              "Nothing — it's always required",
            ],
            answer: 1,
            explanation:
              "The `public` inheritance mode means public/protected members of Animal remain public/protected in Dog. With `private` inheritance they'd all become private.",
          },
        ],
        challenge: {
          title: "Vehicle Hierarchy",
          description:
            "Create a base class `Vehicle` with `brand` (string) and method `move()` that prints `'<brand> is moving'`. Create `ElectricCar` inheriting from Vehicle, adding `batteryLevel` (int) and method `charge()` printing `'Charging <brand>...'`. In main, create an ElectricCar, set brand to `\"Rivian\"`, batteryLevel to 80, and call both methods.",
          starterCode: `#include <iostream>
using namespace std;

// TODO: Vehicle and ElectricCar classes


int main() {
    // Create ElectricCar, call move() and charge()
    return 0;
}`,
          solutionCode: `#include <iostream>
using namespace std;

class Vehicle {
public:
    string brand;
    void move() { cout << brand << " is moving" << endl; }
};

class ElectricCar : public Vehicle {
public:
    int batteryLevel;
    void charge() { cout << "Charging " << brand << "..." << endl; }
};

int main() {
    ElectricCar ec;
    ec.brand = "Rivian";
    ec.batteryLevel = 80;
    ec.move();
    ec.charge();
    return 0;
}`,
          tests: [
            { id: 1, label: "Vehicle class with move()" },
            { id: 2, label: "ElectricCar inherits Vehicle" },
            { id: 3, label: "Output contains 'Rivian is moving'" },
            { id: 4, label: "Output contains 'Charging Rivian'" },
          ],
        },
      },
    ],
  },

  {
    id: "polymorphism",
    title: "Polymorphism",
    icon: "🎭",
    color: "#a855f7",
    lessons: [
      {
        id: "poly-1",
        title: "Virtual Functions & Overriding",
        xp: 25,
        theory: [
          {
            type: "text",
            content:
              "**Polymorphism** means 'many forms'. A base class pointer can call different implementations depending on the *actual* object type at runtime.",
          },
          {
            type: "callout",
            variant: "warning",
            content:
              "Without `virtual`, calling through a base pointer will always use the base version — even if the derived class overrides it.",
          },
          {
            type: "stepthrough",
            title: "Runtime Dispatch with virtual",
            steps: [
              {
                label: "Base pointer assigned",
                code: "Shape* s = new Circle(5);",
                desc: "A Shape* is pointing to a Circle object on the heap.",
              },
              {
                label: "Virtual table lookup",
                code: "s->area();",
                desc: "Because area() is virtual, C++ looks up the actual type (Circle) in the vtable at runtime.",
              },
              {
                label: "Correct override runs",
                code: "// Circle::area() → 78.5",
                desc: "Circle's override executes, not Shape's default. This is dynamic dispatch.",
              },
            ],
          },
          {
            type: "code",
            lang: "cpp",
            label: "Runtime polymorphism",
            content: `class Shape {
public:
    virtual double area() { return 0; }  // virtual!
};

class Circle : public Shape {
    double r;
public:
    Circle(double r) : r(r) {}
    double area() override { return 3.14159 * r * r; }
};

class Square : public Shape {
    double s;
public:
    Square(double s) : s(s) {}
    double area() override { return s * s; }
};

int main() {
    Shape* shapes[] = { new Circle(5), new Square(4) };
    for (auto* sh : shapes)
        cout << sh->area() << endl;  // different result, same call!
}`,
          },
          {
            type: "quiz",
            question:
              "What happens if you call `s->area()` where `s` is a `Shape*` pointing to a `Circle`, but `area()` is NOT virtual?",
            options: [
              "Circle::area() is called (correct result)",
              "Shape::area() is called (wrong result)",
              "Compile error",
              "Undefined behavior",
            ],
            answer: 1,
            explanation:
              "Without `virtual`, the call is resolved at compile-time based on the pointer type (Shape), so Shape::area() runs regardless of what the pointer actually points to.",
          },
        ],
        challenge: {
          title: "Speak Polymorphically",
          description:
            "Create a base class `Animal` with a `virtual` method `speak()` that prints `'...'`. Create `Cat` (prints `'Meow'`) and `Dog` (prints `'Woof'`). In main, create an array of 2 `Animal*` pointers, one Cat and one Dog, and call `speak()` on each.",
          starterCode: `#include <iostream>
using namespace std;

// TODO: Animal, Cat, Dog


int main() {
    // Animal* arr[2] — one Cat, one Dog
    // call speak() on each
    return 0;
}`,
          solutionCode: `#include <iostream>
using namespace std;

class Animal {
public:
    virtual void speak() { cout << "..." << endl; }
};

class Cat : public Animal {
public:
    void speak() override { cout << "Meow" << endl; }
};

class Dog : public Animal {
public:
    void speak() override { cout << "Woof" << endl; }
};

int main() {
    Animal* arr[2] = { new Cat(), new Dog() };
    for (auto* a : arr) a->speak();
    return 0;
}`,
          tests: [
            { id: 1, label: "speak() is virtual in Animal" },
            { id: 2, label: "Cat overrides speak() → Meow" },
            { id: 3, label: "Dog overrides speak() → Woof" },
            { id: 4, label: "Both called via Animal*" },
          ],
        },
      },
    ],
  },

  {
    id: "abstraction",
    title: "Abstraction",
    icon: "🔷",
    color: "#f59e0b",
    lessons: [
      {
        id: "abstract-1",
        title: "Abstract Classes & Pure Virtual",
        xp: 25,
        theory: [
          {
            type: "text",
            content:
              "An **abstract class** is a blueprint you can't instantiate directly. It uses **pure virtual functions** (syntax: `= 0`) to *force* derived classes to implement them.",
          },
          {
            type: "diagram",
            title: "Abstract Class Pattern",
            nodes: [
              {
                id: "payment",
                label: "Payment (abstract)",
                color: "#f59e0b",
                items: [
                  "processPayment() = 0",
                  "getMethod() = 0",
                  "❌ Cannot instantiate",
                ],
              },
              {
                id: "cc",
                label: "CreditCard",
                color: "#00d4ff",
                items: ["processPayment() ✓", "getMethod() ✓", "✅ Concrete"],
                parent: "payment",
              },
              {
                id: "crypto",
                label: "Crypto",
                color: "#b8ff00",
                items: ["processPayment() ✓", "getMethod() ✓", "✅ Concrete"],
                parent: "payment",
              },
            ],
          },
          {
            type: "code",
            lang: "cpp",
            label: "Pure virtual function",
            content: `class Shape {
public:
    virtual double area() = 0;    // pure virtual
    virtual string name() = 0;    // pure virtual

    void describe() {             // can still have concrete methods
        cout << name() << " area: " << area() << endl;
    }
};

class Triangle : public Shape {
    double b, h;
public:
    Triangle(double b, double h) : b(b), h(h) {}
    double area() override { return 0.5 * b * h; }
    string name() override { return "Triangle"; }
};

// Shape s;  // ❌ Error! Can't instantiate abstract class`,
          },
          {
            type: "quiz",
            question:
              "Which syntax makes a function purely virtual (abstract)?",
            options: [
              "virtual void foo() {}",
              "abstract void foo();",
              "virtual void foo() = 0;",
              "void foo() override;",
            ],
            answer: 2,
            explanation:
              "The `= 0` suffix makes a virtual function pure virtual. The class becomes abstract and cannot be instantiated.",
          },
        ],
        challenge: {
          title: "Payment Gateway Interface",
          description:
            "Create an abstract class `Payment` with pure virtual `processPayment(double amount)` and `getMethod()`. Implement `CreditCard` (method: `\"Credit Card\"`, prints `'Processing $X via Credit Card'`) and `Crypto` (method: `\"Crypto\"`, prints `'Broadcasting $X to blockchain'`). Test both.",
          starterCode: `#include <iostream>
using namespace std;

// TODO: Payment, CreditCard, Crypto


int main() {
    // test both payment types with amount 99.99
    return 0;
}`,
          solutionCode: `#include <iostream>
using namespace std;

class Payment {
public:
    virtual void processPayment(double amount) = 0;
    virtual string getMethod() = 0;
};

class CreditCard : public Payment {
public:
    string getMethod() override { return "Credit Card"; }
    void processPayment(double amount) override {
        cout << "Processing $" << amount << " via Credit Card" << endl;
    }
};

class Crypto : public Payment {
public:
    string getMethod() override { return "Crypto"; }
    void processPayment(double amount) override {
        cout << "Broadcasting $" << amount << " to blockchain" << endl;
    }
};

int main() {
    Payment* p1 = new CreditCard();
    Payment* p2 = new Crypto();
    p1->processPayment(99.99);
    p2->processPayment(99.99);
    return 0;
}`,
          tests: [
            { id: 1, label: "Payment is abstract (pure virtual)" },
            { id: 2, label: "CreditCard implements both methods" },
            { id: 3, label: "Crypto implements both methods" },
            { id: 4, label: "Both work via Payment*" },
          ],
        },
      },
    ],
  },
];

// flat list of all lessons for quick lookup
export const ALL_LESSONS = CHAPTERS.flatMap((ch) =>
  ch.lessons.map((l) => ({
    ...l,
    chapterId: ch.id,
    chapterTitle: ch.title,
    chapterColor: ch.color,
  })),
);

export const TOTAL_XP = ALL_LESSONS.reduce((s, l) => s + l.xp, 0);
