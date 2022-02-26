class TaskStorage {
    constructor(counterIndex) {
        this._counterIndex = counterIndex;
        let counter = this.getCounter();
        if (counter === null) {
            counter = 0;
        }
        this._setCounter(counter);
    }

    getCounter() {
        return Number(localStorage.getItem(this._counterIndex));
    }

    _setCounter(value) {
        localStorage.setItem(this._counterIndex, value);
    }

    _incrementCounter() {
        let counter = this.getCounter();
        counter += 1;
        this._setCounter(counter);
    }

    getLength(){
        return Number(localStorage.length) - 1;
    }

    setTask(taskContent, taskStatus) {
        let task = {
            content: taskContent,
            status: taskStatus
        };
        let taskJson = JSON.stringify(task);
        localStorage.setItem(this.getCounter(), taskJson);
        this._incrementCounter();
    }

    setTaskById(id, taskContent, taskStatus) {
        let task = {
            content: taskContent,
            status: taskStatus
        };
        let taskJson = JSON.stringify(task);
        localStorage.setItem(id, taskJson);
    }

    getTask(id) {
        let taskJson = localStorage.getItem(id);
        return JSON.parse(taskJson);
    }

    remove(id) {
        localStorage.removeItem(id);
    }

    getTaskList() {
        let ids = []
        for (let i = 0; i < localStorage.length; i++) {
            let id = localStorage.key(i);
            if (id === this._counterIndex){
                continue;
            }
            ids.push(id);
        }
        ids = ids.sort();
        let tasksWithIds = [];
        for (let i = 0; i < this.getLength(); i++) {
            let taskWithId = {
                task: this.getTask(ids[i]),
                id: ids[i]
            };
            tasksWithIds.push(taskWithId);
        }
        return tasksWithIds;
    }
}

class TodoList {
    static currentTodoList;

    static init() {
        let todoList = new TodoList();
        TodoList.currentTodoList = todoList;

        TodoList.currentTodoList.printTaskList();

        return todoList;
    }

    constructor() {
        this.storage = new TaskStorage("-1");
        this.todoListHtml = document.getElementsByClassName("todo-item-list")[0];
        this.startListenInputTasks();
        this.startListenClicksOnTasks()
    }

    addNewTask(content) {
        try {
            this.storage.setTask(content, "undone");
        } catch (error) {
            alert('невозможно выполнить операцию сохранения задачи!');
        }
    }

    printTaskList() {
        this.todoListHtml.innerHTML = "";
        let taskList
        try {
            taskList = this.storage.getTaskList();
        } catch (error) {
            alert('невозможно спарсить задачи!');
        }
        for (let i = 0; i < this.storage.getLength(); i++){
            let taskWithId = taskList[i];
            let taskHtml = this.createTaskHtml(taskWithId.task.content, taskWithId.task.status, taskWithId.id);
            this.todoListHtml.appendChild(taskHtml);
        }
    }

    createTaskHtml(content, status, id){
        let li = document.createElement("li");
        li.id = id;
        li.innerText = content;
        let deleteButton = document.createElement("button");
        deleteButton.innerHTML = '&#10008;';
        deleteButton.id = id;
        deleteButton.classList.add("delete-item-button");
        deleteButton.classList.add("delete-item-button-not-displayed");
        if (status === "undone"){
            li.classList.add("todo-item__undone");
        } else {
            li.classList.add("todo-item__undone");
            li.classList.add("todo-item__done");
            deleteButton.classList.remove("delete-item-button-not-displayed");
            this.setListener(deleteButton);
        }
        li.appendChild(deleteButton);
        return li;
    }

    startListenInputTasks() {
        function listen() {
            let input = document.getElementById("todo-list-input");
            TodoList.currentTodoList.addNewTask(input.value.toString())
            TodoList.currentTodoList.printTaskList();
            return false;
        }

        let form = document.getElementById("todo-list-form");
        form.onsubmit = listen;
    }

    startListenClicksOnTasks() {
        function listener (e) {
            let li = e.target
            let task
            try {
                task = TodoList.currentTodoList.storage.getTask(li.id)
            } catch (error) {
                alert('невозможно спарсить задачу!');
            }

            if (task.status === "undone"){
                task.status = "done";
            }
            else {
                task.status = "undone";
            }
            try {
                TodoList.currentTodoList.storage.setTaskById(li.id, task.content, task.status);
            } catch (error) {
                alert('невозможно выполнить операцию сохранения задачи!');
            }
            TodoList.currentTodoList.printTaskList();
        }
        this.todoListHtml.addEventListener('click',listener);
    }

    setListener(button) {
        button.onclick = function (){
            TodoList.currentTodoList.storage.remove(this.id);
            TodoList.currentTodoList.printTaskList();
        }
    }
}

TodoList.init()