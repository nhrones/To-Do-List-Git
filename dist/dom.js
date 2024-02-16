import { addTask, refreshDisplay } from './tasks.js';
import { deleteCompleted, initDB, getTasks } from './db.js';
import { backupData, restoreData } from './backup.js';
import { DEV, ctx, on, $ } from './context.js';
export const backupBtn = $("backupbtn");
export const restoreBtn = $("restorebtn");
export const taskInput = $("taskInput");
export const todoCount = $("todoCount");
export const todoList = $("todoList");
export const deleteCompletedBtn = $("deletecompleted");
export const topicSelect = $('topicselect');
export const dbSelect = $('dbselect');
export const closebtn = $('closebtn');
export const popupDialog = $('popupDialog');
export const popupText = $("popup_text");
export async function initDom() {
    await initDB();
    on(taskInput, "keydown", function (evt) {
        const { key } = evt;
        if (key === "Enter") {
            evt.preventDefault();
            const tc = taskInput.value;
            if (tc.length > 0) {
                addTask(tc, ctx.currentTopic === 'topics');
            }
        }
    });
    on(topicSelect, 'change', () => {
        ctx.currentTopic = topicSelect.value.toLowerCase();
        getTasks(ctx.currentTopic);
    });
    on(dbSelect, 'change', async () => {
        ctx.DbKey = [dbSelect.value];
        ctx.TopicKey = "topics";
        await initDB();
    });
    on(closebtn, 'click', () => {
        if (DEV)
            console.log('closebtn clicked');
        self.open(location.href, "_self", "");
        self.close();
    });
    on(deleteCompletedBtn, "click", () => {
        deleteCompleted();
        refreshDisplay();
    });
    on(popupDialog, 'click', (event) => {
        event.preventDefault();
        popupDialog.close();
    });
    on(popupDialog, 'close', (event) => {
        event.preventDefault();
    });
    on(popupDialog, "keyup", (evt) => {
        evt.preventDefault();
        popupDialog.close();
    });
    on(backupBtn, 'click', () => {
        backupData();
    });
    on(restoreBtn, 'click', () => {
        restoreData();
    });
    refreshDisplay();
}
