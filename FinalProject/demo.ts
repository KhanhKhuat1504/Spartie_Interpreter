interface Task {
  id: number;
  description: string;
  completed: boolean;
}

class TaskManager {
  private tasks: Task[] = [];
  private nextId: number = 1;

  // Add a new task
  addTask(description: string): void {
    const task: Task = { id: this.nextId++, description, completed: false };
    this.tasks.push(task);
    console.log(`Task added: "${task.description}"`);
  }

  // Print all tasks
  printTasks(): void {
    if (this.tasks.length === 0) {
      console.log("No tasks available.");
      return;
    }
    console.log("\nHere are your tasks:");
    this.tasks.forEach((task) =>
      console.log(
        `ID: ${task.id}, Description: "${task.description}", Completed: ${task.completed}`
      )
    );
  }

  // Search for tasks containing a substring
  searchTask(description: string): void {
    const foundTasks = this.tasks.filter((task) =>
      task.description.includes(description)
    );
    if (foundTasks.length > 0) {
      console.log("\nFound tasks:");
      foundTasks.forEach((task) =>
        console.log(`ID: ${task.id}, Description: "${task.description}"`)
      );
    } else {
      console.log(`No tasks found containing: "${description}"`);
    }
  }

  // Mark a task as completed
  completeTask(id: number): void {
    const task = this.tasks.find((task) => task.id === id);
    if (task) {
      task.completed = true;
      console.log(`Task ID ${id} marked as completed.`);
    } else {
      console.log(`Task ID ${id} not found.`);
    }
  }
}

// Demo function
async function demoTaskManager() {
  console.log("Welcome to Task Manager 3000!");

  const taskManager = new TaskManager();

  // Add tasks
  taskManager.addTask("Learn TypeScript");
  taskManager.addTask("Write a TypeScript Task Manager");

  // Print tasks
  taskManager.printTasks();

  // Search for a task
  taskManager.searchTask("TypeScript");

  // Mark a task as completed
  taskManager.completeTask(1);

  // Print updated tasks
  taskManager.printTasks();
}

// Run the demo
demoTaskManager();