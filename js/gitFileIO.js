
import { Octokit } from "https://esm.sh/@octokit/rest";

import { DEV } from './gitContext.js'

const encoded = "5BfeT3Axkm6nMao99ag7oy4NiT2n7im8V5C9_phg"
function decode(str) {
   return str.split("").reverse().join("");
}

/** 
 * Our Github API instance using our authentication token.     
 * see: https://docs.github.com/en/authentication
 */
const octokit = new Octokit({
   auth: decode(encoded)
});

/** 
 * Returns the decoded string content of the target file.    
 * returns -- _github.com/Octocat/CatRepo/blob/main/cats.json_
 * @example 
 * ```js
 * ctx.owner = 'octocat'
 * ctx.repo = 'CatRepo'
 * ctx.path = 'cats.json'
 * const content = readFile(ctx)
 * // github.com/octocat/CatRepo/blob/main/cats.json
 * ```
 * @argument {ctx} Git-API context see: context.js
 */
export async function readFile(ctx) {

   // set the correct request method
   ctx.method = "GET"

   // make the git api request
   const { data } = await octokit.request(ctx);
   console.log(data.content)
   // return the file content
   return atob(data.content)
}

/** 
 * @example 
 * ```js
 *    // set the API context - see: context.js
 *    ctx.owner = 'octocat'
 *    ctx.repo = 'CatRepo'
 *    ctx.path = 'cats.json'
 *    // base64 encode the content to be writen
 *    ctx.content = btoa(JSON.stringify([{name:"kitty"}]))
 *    // git-push the new file contents
 *    Git.writeFile(ctx).then((result) => {
 *       console.log(`Write status = ${result.status}`)
 *    })
 * ```
 */
export async function writeFile(ctx, rawContent) {

   // update our Git-context with the original file hash     
   ctx.sha = await getCurrentHash(ctx)

   // first encode content to base64 blob
   ctx.content = btoa(rawContent);
 
   // change the Git-context request method to PUT
   ctx.method = "PUT"

   // PUT the new content in the target file (Git-Push)
   const result = await octokit.request(ctx)

   // return the new git-hash
   return result.data.content.sha
}

/** 
 * Get the current git-hash of todo.json. 
 */
export async function getCurrentHash(ctx) {
   
   // set the request method
   ctx.method = "GET"
    
   // get the original hash (sha) from the github file.
   const { data } = await octokit.request(ctx);

   // return this original git-hash     
   return data.sha
}
