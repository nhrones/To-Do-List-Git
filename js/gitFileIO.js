
import { Octokit } from "https://esm.sh/@octokit/rest";

const DEV = true

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
   ctx.method = "GET"
   const { data } = await octokit.request(ctx);
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
export async function writeFile(ctx) {

   // In order to write content, we first need to     
   // get the original hash (sha) from the target file.
   const { data } = await octokit.request(ctx);
   if (DEV) console.log(`original hash = ${data.sha}`)

   // update our Git-context with the original file hash     
   ctx.sha = data.sha

   // change the Git-context request method
   ctx.method = "PUT"

   // PUT the new content in the target file (Git-Push)
   const result = await octokit.request(ctx)
   if (DEV) console.log(`new-hash = ${result.data.content.sha}`)
   return result
}
