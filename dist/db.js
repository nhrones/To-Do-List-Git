import { addOptionGroup, resetTopicSelect } from './selectBuilder.js';
import { refreshDisplay } from './tasks.js';
import { popupText, popupDialog } from './dom.js';
import { initCache, getFromCache, setCache } from './kvCache.js';
import { DEV, ctx } from './context.js';
export async function initDB() {
    await initCache();
}
export function getTasks(key = "") {
    ctx.thisKeyName = key;
    if (key.length) {
        let data = getFromCache(key) ?? [];
        if (data === null) {
            if (DEV)
                console.log(`No data found for ${ctx.thisKeyName}`);
            data = [];
        }
        ctx.tasks = data;
        refreshDisplay();
    }
}
export function buildTopics() {
    const data = getFromCache("topics");
    resetTopicSelect();
    for (let i = 0; i < data.length; i++) {
        const parsedTopics = parseTopics(data[i]);
        addOptionGroup(parsedTopics.group, parsedTopics.entries);
    }
}
function parseTopics(topics) {
    const topicObject = { group: "", entries: [] };
    const thisTopic = topics;
    const txt = thisTopic.text;
    const lines = txt.split('\n');
    topicObject.group = lines[0].trim();
    for (let i = 1; i < lines.length; i++) {
        const newObj = { title: "", key: "" };
        const element = lines[i];
        const items = element.split(',');
        const title = items[0];
        const keyName = items[1].trim();
        newObj.title = title;
        newObj.key = keyName;
        topicObject.entries[i - 1] = newObj;
    }
    return topicObject;
}
export function saveTasks(topicChanged) {
    setCache(ctx.thisKeyName, ctx.tasks, topicChanged);
}
export function deleteCompleted() {
    const savedtasks = [];
    let numberDeleted = 0;
    ctx.tasks.forEach((task) => {
        if (task.disabled === false) {
            savedtasks.push(task);
        }
        else {
            numberDeleted++;
        }
    });
    ctx.tasks = savedtasks;
    saveTasks((ctx.currentTopic === 'topics'));
    popupText.textContent = `Removed ${numberDeleted} tasks!`;
    popupDialog.showModal();
}
