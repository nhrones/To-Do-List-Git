
export const DEV = true

export const tasks = []

export let currentTopic = "topics"
export function setCurrentTopic(topic) {
   currentTopic = topic
}
/** Shortcut for document.getElementById */
export const $ = (id) => document.getElementById(id)

/** on - adds an event handler to an htmlElement */
export const on = ( elem, event, listener) => {
   return elem.addEventListener(event, listener)
}

