/**
 * flag for debug logging
 * @type {boolean}
 */
export const DEV = true

/** Standard option bag used by two Git-Requests */
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
