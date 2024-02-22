/**
 * flag for debug logging
 * @type {boolean}
 */
export const DEV = true

/** 
 * @typedef {Object} GitContext Standard option bag used by two Git-Requests 
 * @property {string} owner The github repo owner
 * @property {string} repo The github repo name
 * @property {string} path The full path of the file to be mutated
 * @property {string} url Generic URL-template used for Git-requests
 * @property {string} method Request methos GET | SET -- must initially be GET
 * @property { { name: string; email: string; } } committer 
 * @property {string} message The Git-commit message to use
 * @property {string} content The base64-blob file content
 * @property {*} headers
 * @property {string} sha SHA-1 file-hash -- set in gitPush.js
 */

/**
 * @typedef {Object} TaskType
 * @property {boolean} disabled - is disabled (completed)
 * @property {string} text - the task text
 */


/**
 * Description placeholder
 * @date 2/21/2024 - 6:20:40 PM
 *
 * @type {GitContext}
 */
export const ctx = {
   /** The github repo owner */
   owner: '',
   /** The github repo name */
   repo: '',
   /** The full path of the file to be mutated */
   path: '',
   /** generic URL-template used for Git-requests */
   url: '/repos/{owner}/{repo}/contents/{path}',
   /** request methosGET | SET -- must initially be GET */
   method: "GET",
   /** committer info -- change as you like */
   committer: {
      name: 'Kitty Cat',
      email: 'octocat@github.com'
   },
   /** the Git-commit message to use */
   message: "new commit!",
   /** the base64-blob file content */
   content: "",
   /** a required version header */
   headers: { 'X-GitHub-Api-Version': '2022-11-28' },
   /** SHA-1 file-hash -- set in gitPush.js, line-15    
    * original hash is required before modifying content
   */
   sha: "",
}
