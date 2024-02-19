
import { addTask, refreshDisplay } from './tasks.js';
import { deleteCompleted, initDB, getTasks } from './db.js';
import { backupData, restoreData } from './backup.js';
import { DEV } from './gitContext.js'

export let currentTopic = "topics"
export function setCurrentTopic(topic){
   currentTopic = topic
}

/** Shortcut for document.getElementById */
const $ = (id) => document.getElementById(id)

/** on - adds an event handler to an htmlElement */
const on = ( elem, event, listener) => {
   return elem.addEventListener(event, listener)
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
         const tc = taskInput.value;
         if (tc.length > 0) {
            addTask(tc, currentTopic === 'topics');
         }
      }
   });
   // topic select change handler
   on(topicSelect, 'change', () => {
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
      popupDialog.close();
   });

   on(popupDialog, 'close', (event) => {
      console.log('popupDialog close')
      event.preventDefault();
      if (!pinOK) myDialog.showModal()
   });

   on(popupDialog, "keyup", (evt) => {
      event.preventDefault()
      popupDialog.close()
      if (!pinOK) myDialog.showModal()
   });

   // pin input keyup handler
   on(pinInput, 'keyup', (event) => {
      event.preventDefault()
      pinTryCount += 1
      console.log('pinInput key:', event.key)
      if (event.key === "Enter" || pinInput.value === "1313") {
         console.log('pinInput.value = ', pinInput.value)
         if (pinInput.value === "1313") {
            pinInput.value = ""
            pinOK = true
            myDialog.close()
         } else {
            myDialog.close()
            pinInput.value = ""
            pinOK = false
            popupText.textContent = (pinTryCount === 3)
               ?`Incorrect pin entered ${pinTryCount} times!
 Please close this Page!`
               : `Incorrect pin entered!`

             if  (pinTryCount === 3) {
               document.body.innerHTML = `
               <h1>Three failed PIN attempts!</h1>
               <h1>Please close this page!</h1>`
             } else {
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
      myDialog.showModal()
      pinInput.focus({ focusVisible: true })
   } else {
      pinOK = true
   }
}
