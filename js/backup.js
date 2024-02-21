import { restoreCache, todoCache } from './dbCache.js';

/**NEW
 * export data from persitence
 * @returns void - calls saveDataFile()
 */
export function backupData() {
   // get all todo records
   const jsonData = JSON.stringify(Array.from(todoCache.entries()));
   const link = document.createElement("a");
   const file = new Blob([jsonData], { type: 'application/json' });
   link.href = URL.createObjectURL(file);
   link.download = "backup.json";
   link.click();
   URL.revokeObjectURL(link.href);
}

/**
 * Restore data
 *
 * @export
 */
export function restoreData() {
   
   /** @type {HTMLInputElement} */
   // @ts-ignore
   const fileload = document.getElementById('fileload');
   fileload?.click();
   fileload?.addEventListener('change', function () {
      const reader = new FileReader();
      reader.onload = function () {
         console.log('backup -> restoring')
         // @ts-ignore
         restoreCache(reader.result);
         window.location.reload();
      };
      if( fileload && fileload.files ) {
         reader.readAsText(fileload.files[0]);
      }
   });
}
