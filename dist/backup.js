import { restoreCache, todoCache } from './kvCache.js';
export function backupData() {
    const jsonData = JSON.stringify(Array.from(todoCache.entries()));
    const link = document.createElement("a");
    const file = new Blob([jsonData], { type: 'application/json' });
    link.href = URL.createObjectURL(file);
    link.download = "backup.json";
    link.click();
    URL.revokeObjectURL(link.href);
}
export function restoreData() {
    const fileload = document.getElementById('fileload');
    fileload.click();
    fileload.addEventListener('change', function () {
        const reader = new FileReader();
        reader.onload = function () {
            restoreCache(reader.result);
            window.location.reload();
        };
        reader.readAsText(fileload.files[0]);
    });
}
