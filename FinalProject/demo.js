"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
class TaskManager {
    constructor() {
        this.tasks = [];
        this.nextId = 1;
    }
    // Add a new task
    addTask(description) {
        const task = { id: this.nextId++, description, completed: false };
        this.tasks.push(task);
        console.log(`Task added: "${task.description}"`);
    }
    // Print all tasks
    printTasks() {
        if (this.tasks.length === 0) {
            console.log("No tasks available.");
            return;
        }
        console.log("\nHere are your tasks:");
        this.tasks.forEach((task) => console.log(`ID: ${task.id}, Description: "${task.description}", Completed: ${task.completed}`));
    }
    // Search for tasks containing a substring
    searchTask(description) {
        const foundTasks = this.tasks.filter((task) => task.description.includes(description));
        if (foundTasks.length > 0) {
            console.log("\nFound tasks:");
            foundTasks.forEach((task) => console.log(`ID: ${task.id}, Description: "${task.description}"`));
        }
        else {
            console.log(`No tasks found containing: "${description}"`);
        }
    }
    // Mark a task as completed
    completeTask(id) {
        const task = this.tasks.find((task) => task.id === id);
        if (task) {
            task.completed = true;
            console.log(`Task ID ${id} marked as completed.`);
        }
        else {
            console.log(`Task ID ${id} not found.`);
        }
    }
    // Add tasks in parallel using worker threads
    addTasksInParallel(tasks, batchSize) {
        return __awaiter(this, void 0, void 0, function* () {
            const numBatches = Math.ceil(tasks.length / batchSize);
            const workerPromises = [];
            for (let i = 0; i < numBatches; i++) {
                const batch = tasks.slice(i * batchSize, (i + 1) * batchSize);
                const workerPromise = new Promise((resolve, reject) => {
                    const worker = new worker_threads_1.Worker(__filename, {
                        workerData: { batch },
                    });
                    worker.on('message', (message) => {
                        console.log(message);
                    });
                    worker.on('error', reject);
                    worker.on('exit', (code) => {
                        if (code !== 0) {
                            reject(new Error(`Worker stopped with exit code ${code}`));
                        }
                        else {
                            resolve();
                        }
                    });
                });
                workerPromises.push(workerPromise);
            }
            yield Promise.all(workerPromises);
        });
    }
}
// Worker thread logic (this only runs in the worker thread)
if (!worker_threads_1.isMainThread) {
    const { batch } = worker_threads_1.workerData; // Explicit type for 'batch'
    const taskManager = new TaskManager();
    batch.forEach((description) => {
        taskManager.addTask(description);
    });
    worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage(`Batch of ${batch.length} tasks added.`);
}
function demoTaskManager() {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}
// Demo function for parallelism
function demoTaskManagerParallelism() {
    return __awaiter(this, void 0, void 0, function* () {
        const taskManager = new TaskManager();
        // Define a large number of tasks
        const tasks = Array.from({ length: 100 }, (_, i) => `Task ${i + 1}`);
        // Add tasks in parallel
        yield taskManager.addTasksInParallel(tasks, 10);
        // Print tasks
        taskManager.printTasks();
    });
}
// Run both demos in sequence (only in the main thread)
if (worker_threads_1.isMainThread) {
    demoTaskManager()
        .then(() => {
        console.log("\nNow running parallelism test...\n");
        return demoTaskManagerParallelism();
    })
        .catch((error) => {
        console.error("Error in demo:", error);
    });
}
