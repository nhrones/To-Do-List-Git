export const KV_URL = 'kv-ws-rpc.deno.dev';
export const DEV = true;
/** app context object */
export const ctx = {
    currentTopic: "topics",
    TopicKey: 'topics',
    DbKey: ['TODOS'],
    nextTxId: 0,
    thisKeyName: '',
    tasks: [],
};
/** Shortcut for document.getElementById */
export const $ = (id) => document.getElementById(id);
/** on - adds an event handler to an htmlElement */
export const on = (elem, event, listener) => elem.addEventListener(event, listener);
