import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';

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

  // Add tasks in parallel using worker threads
  async addTasksInParallel(tasks: string[], batchSize: number): Promise<void> {
    const numBatches = Math.ceil(tasks.length / batchSize);
    const workerPromises: Promise<void>[] = [];

    for (let i = 0; i < numBatches; i++) {
      const batch: string[] = tasks.slice(i * batchSize, (i + 1) * batchSize);
      const workerPromise = new Promise<void>((resolve, reject) => {
        const worker = new Worker(__filename, {
          workerData: { batch },
        });

        worker.on('message', (message) => {
          console.log(message);
        });

        worker.on('error', reject);
        worker.on('exit', (code) => {
          if (code !== 0) {
            reject(new Error(`Worker stopped with exit code ${code}`));
          } else {
            resolve();
          }
        });
      });

      workerPromises.push(workerPromise);
    }

    await Promise.all(workerPromises);
  }
}

// Worker thread logic (this only runs in the worker thread)
if (!isMainThread) {
  const { batch }: { batch: string[] } = workerData;  // Explicit type for 'batch'
  const taskManager = new TaskManager();

  batch.forEach((description: string) => {
    taskManager.addTask(description);
  });

  parentPort?.postMessage(`Batch of ${batch.length} tasks added.`);
}

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

// Demo function for parallelism
async function demoTaskManagerParallelism() {
  const taskManager = new TaskManager();

  // Define a large number of tasks
  const tasks = Array.from({ length: 100 }, (_, i) => `Task ${i + 1}`);

  // Add tasks in parallel
  await taskManager.addTasksInParallel(tasks, 10);

  // Print tasks
  taskManager.printTasks();
}

// Run both demos in sequence (only in the main thread)
if (isMainThread) {
  demoTaskManager()
    .then(() => {
      console.log("\nNow running parallelism test...\n");
      return demoTaskManagerParallelism();
    })
    .catch((error) => {
      console.error("Error in demo:", error);
    });
}