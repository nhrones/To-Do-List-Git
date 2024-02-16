export const KV_URL = 'kv-ws-rpc.deno.dev';
export const DEV = true;
export const ctx = {
    currentTopic: "topics",
    TopicKey: 'topics',
    DbKey: ['TODOS'],
    nextTxId: 0,
    thisKeyName: '',
    tasks: [],
};
export const $ = (id) => document.getElementById(id);
export const on = (elem, event, listener) => elem.addEventListener(event, listener);
