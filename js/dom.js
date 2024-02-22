
import { addTask, refreshDisplay } from './tasks.js';
import { deleteCompleted, initDB, getTasks } from './db.js';
import { backupData, restoreData } from './backup.js';
// @ts-ignore
import { DEV } from './gitContext.js'


/** @type {string} */
export let currentTopic = "topics"

/**
 * @param {string} topic
 */
export function setCurrentTopic(topic){
   currentTopic = topic
}

/** Shortcut for document.getElementById */
const $ = (/** @type {string} */ id) => document.getElementById(id)

/** on - adds an event handler to an htmlElement */
const on = ( 
   /** @type {HTMLElement | null} */ elem, 
   /** @type {string} */ event, 
   /** @type {{ (evt: any): void; (): void; (): void; (event: any): void; (event: any): void; (evt: any): void; (event: any): void; (): void; (): void; }} */ listener) => {
   return elem?.addEventListener(event, listener)
}

/* create references for all UI elements */
export const backupBtn = $("backupbtn");
export const restoreBtn = $("restorebtn");
export const taskInput = $("taskInput");
export const todoCount = $("todoCount");
export const todoList = $("todoList");
export const deleteCompletedBtn = $("deletecompleted");
export const topicSelect = $('topicselect');

export const popupDialog = $('popupDialog');
export const pinInput = $('pin');   
export const myDialog = $('myDialog');
export const popupText = $("popup_text");

let pinOK = false
let pinTryCount = 0

/** initialize all UI and event handlers */
export async function initDom() {
   // initialize the local DB cache
   await initDB();
   // input keydown handler
   on(taskInput, "keydown", function (evt) {
      const { key } = evt;
      if (key === "Enter") {
         evt.preventDefault();
         // @ts-ignore
         const tc = taskInput.value;
         if (tc.length > 0) {
            addTask(tc, currentTopic === 'topics');
         }
      }
   });
   // topic select change handler
   on(topicSelect, 'change', () => {
      // @ts-ignore
      setCurrentTopic( topicSelect.value.toLowerCase());
      getTasks(currentTopic);
   });

   // delete completed button click handler
   on(deleteCompletedBtn, "click", () => {
      deleteCompleted();
      refreshDisplay();
   });

   on(popupDialog, 'click', (event) => {
      event.preventDefault();
      // @ts-ignore
      popupDialog.close();
   });

   on(popupDialog, 'close', (event) => {
      console.log('popupDialog close')
      event.preventDefault();
      // @ts-ignore
      if (!pinOK) myDialog.showModal()
   });

   // @ts-ignore
   on(popupDialog, "keyup", (evt) => {
      // @ts-ignore
      event.preventDefault()
      // @ts-ignore
      popupDialog.close()
      // @ts-ignore
      if (!pinOK) myDialog.showModal()
   });

   // pin input keyup handler
   on(pinInput, 'keyup', (event) => {
      event.preventDefault()
      pinTryCount += 1
      console.log('pinInput key:', event.key)
      // @ts-ignore
      if (event.key === "Enter" || pinInput.value === "1313") {
         // @ts-ignore
         console.log('pinInput.value = ', pinInput.value)
         // @ts-ignore
         if (pinInput.value === "1313") {
            // @ts-ignore
            pinInput.value = ""
            pinOK = true
            // @ts-ignore
            myDialog.close()
         } else {
            // @ts-ignore
            myDialog.close()
            // @ts-ignore
            pinInput.value = ""
            pinOK = false
            // @ts-ignore
            popupText.textContent = (pinTryCount === 3)
               ?`Incorrect pin entered ${pinTryCount} times!
 Please close this Page!`
               : `Incorrect pin entered!`

             if  (pinTryCount === 3) {
               document.body.innerHTML = `
               <h1>Three failed PIN attempts!</h1>
               <h1>Please close this page!</h1>`
             } else {
               // @ts-ignore
               popupDialog.showModal()
               
             }
         }
      }
   })
   
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

   if (window.location.search !== '?ndh') {
      // initial pin input
      // @ts-ignore
      myDialog.showModal()
      // @ts-ignore
      pinInput.focus({ focusVisible: true })
   } else {
      pinOK = true
   }
}
