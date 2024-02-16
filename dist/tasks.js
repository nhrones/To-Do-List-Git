import { todoCount, taskInput, todoList } from './dom.js';
import { saveTasks } from './db.js';
import { taskTemplate } from './templates.js';
import { DEV, ctx, on } from './context.js';
export function addTask(newTask, topics = false) {
    if (topics)
        newTask = `${newTask}
      newTopic, newKey`;
    if (DEV)
        console.log('added task ', newTask);
    ctx.tasks.unshift({ text: newTask, disabled: false });
    saveTasks(topics);
    taskInput.value = "";
    taskInput.focus();
    refreshDisplay();
}
export function refreshDisplay() {
    todoList.innerHTML = "";
    if (ctx.tasks && ctx.tasks.length > 0) {
        ctx.tasks.forEach((item, index) => {
            const p = document.createElement("p");
            p.innerHTML = taskTemplate(index, item);
            on(p, 'click', (e) => {
                if (e.target.type === 'checkbox')
                    return;
                if (e.target.type === 'textarea')
                    return;
                const todoItem = e.target;
                const existingText = ctx.tasks[index].text;
                const editElement = document.createElement("textarea");
                editElement.setAttribute("rows", "6");
                editElement.setAttribute("cols", "62");
                editElement.setAttribute("wrap", "hard");
                editElement.setAttribute("autocorrect", "on");
                editElement.value = existingText;
                todoItem.replaceWith(editElement);
                editElement.focus();
                on(editElement, "blur", function () {
                    const updatedText = editElement.value.trim();
                    if (updatedText.length > 0) {
                        ctx.tasks[index].text = updatedText;
                        saveTasks((ctx.currentTopic === 'topics'));
                    }
                    refreshDisplay();
                });
            });
            on(p.querySelector(".todo-checkbox"), "change", (e) => {
                e.preventDefault();
                const index = e.target.dataset.index;
                ctx.tasks[index].disabled = !ctx.tasks[index].disabled;
                saveTasks(false);
            });
            todoList.appendChild(p);
        });
    }
    todoCount.textContent = "" + ctx.tasks.length;
}
