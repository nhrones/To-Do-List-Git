import { DEV, KV_URL, ctx } from './context.js';
import { buildTopics } from './db.js';
export let todoCache = new Map();
const callbacks = new Map();
export let socket;
export function initCache() {
    const wsProtocol = window.location.protocol === "http:" ? "ws" : "wss";
    const local = (window.location.hostname === "localhost");
    const socketURL = (local)
        ? `${wsProtocol}://localhost:8765`
        : `${wsProtocol}://${KV_URL}/`;
    if (DEV)
        console.log('socket url = ', socketURL);
    socket = new WebSocket(socketURL);
    socket.onopen = async () => {
        return await hydrate();
    };
    socket.onmessage = (evt) => {
        const { txID, error, result } = JSON.parse(evt.data);
        if (!callbacks.has(txID))
            return;
        const callback = callbacks.get(txID);
        callbacks.delete(txID);
        if (callback)
            callback(error, result);
    };
}
export function restoreCache(records) {
    const tasksObj = JSON.parse(records);
    todoCache = new Map(tasksObj);
    persist();
}
export function removeFromCache(key) {
    const result = todoCache.delete(key);
    if (result === true)
        persist();
    return result;
}
export const getFromCache = (key) => {
    return todoCache.get(key);
};
export function setCache(key, value, topicChanged = false) {
    todoCache.set(key, value);
    persist();
    if (topicChanged)
        window.location.reload();
}
async function hydrate() {
    const result = await request({ procedure: 'GET', key: ctx.DbKey, value: '' });
    if (result === 'NOT FOUND')
        console.log(`kvCache.hydrate -- result = 'NOT FOUND'!`);
    todoCache = new Map(result.value);
    buildTopics();
}
async function persist() {
    const todoArray = Array.from(todoCache.entries());
    await request({ procedure: 'SET', key: ctx.DbKey, value: todoArray });
}
function request(newRequest) {
    const txID = ctx.nextTxId++;
    return new Promise((resolve, reject) => {
        if (socket.readyState === WebSocket.OPEN) {
            callbacks.set(txID, (error, result) => {
                if (error)
                    reject(new Error(error.message));
                resolve(result);
            });
            socket.send(JSON.stringify({ txID: txID, payload: newRequest }));
        }
        else {
            console.log('Socket not yet open!');
        }
    });
}
