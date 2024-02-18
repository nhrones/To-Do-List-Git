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
 * import data from backup file
 */
export function restoreData() {
   const fileload = document.getElementById('fileload');
   fileload.click();
   fileload.addEventListener('change', function () {
      const reader = new FileReader();
      reader.onload = function () {
         console.log('backup -> restoring')
         restoreCache(reader.result);
         window.location.reload();
      };
      reader.readAsText(fileload.files[0]);
   });
}
