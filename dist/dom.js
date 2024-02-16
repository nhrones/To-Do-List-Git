/// <reference lib="dom" />
import { addTask, refreshDisplay } from './tasks.js';
import { deleteCompleted, initDB, getTasks } from './db.js';
import { backupData, restoreData } from './backup.js';
import { DEV, ctx, on, $ } from './context.js';
/* create references for all UI elements */
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
/** initialize all UI and event handlers */
export async function initDom() {
    // initialize the local DB cache
    await initDB();
    // input keydown handler
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
    // topic select change handler
    on(topicSelect, 'change', () => {
        ctx.currentTopic = topicSelect.value.toLowerCase();
        getTasks(ctx.currentTopic);
    });
    // db select change handler
    on(dbSelect, 'change', async () => {
        ctx.DbKey = [dbSelect.value];
        ctx.TopicKey = "topics";
        await initDB();
    });
    // close button click handler
    on(closebtn, 'click', () => {
        if (DEV)
            console.log('closebtn clicked');
        self.open(location.href, "_self", "");
        self.close();
    });
    // delete completed button click handler
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
    // backup button click handler
    on(backupBtn, 'click', () => {
        backupData();
    });
    // restore button click handler
    on(restoreBtn, 'click', () => {
        restoreData();
    });
    // initial display refresh
    refreshDisplay();
}
