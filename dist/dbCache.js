// deno-lint-ignore-file no-explicit-any
import { buildTopics } from './db.js';
import * as Git from './gitFileIO.js'
import {ctx} from './gitContext.js'

// set the context for our json file update
// github.com/nhrones/TodoJson/blob/main/default2.json
//            owner    repo               file-path
ctx.owner = 'nhrones'
ctx.repo = 'TodoJson'
ctx.path = 'test.json'

export let todoCache = new Map();

/** db init - Hydrates the complete DB */
export async function initCache() { 
   return await hydrate();
}

/** restore our cache from a json backup */
export function restoreCache(records) {
    const tasksObj = JSON.parse(records);
    todoCache = new Map(tasksObj);
    //console.log(`restoreCache -> persit!`)
    persist();
}

/** The `remove` method mutates - will call the `persist` method. */
export function removeFromCache(key) {
    const result = todoCache.delete(key);
    if (result === true) persist();
    return result;
}

/** The `get` method will not mutate records */
export const getFromCache = (key) => {
    return todoCache.get(key);
};

/** The `set` method mutates - will call the `persist` method. */
export function setCache(key, value, topicChanged = false) {
    todoCache.set(key, value);
    persist();
    if (topicChanged)
        window.location.reload();
}
/** hydrate a dataset from a remote json file */
async function hydrate() {
    // make a call to get our json data
    const result = await Git.readFile(ctx)
    // load our local cache
    todoCache = new Map(JSON.parse(`${result}`));
    buildTopics();
}
/**
 * Persist the current todoCache to remote json file
 * This is called for any mutation of the todoCache (set/delete)
 */
async function persist() {
    // get the complete cache-Map
    const todoArray = Array.from(todoCache.entries());
    ctx.content = btoa(JSON.stringify(todoArray));
    //console.log(`persiting`)
    Git.writeFile(ctx)
}
