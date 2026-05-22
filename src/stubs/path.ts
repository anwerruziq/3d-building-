// Browser stub for Node.js path module
export default { resolve: (...args: string[]) => args.join("/"), join: (...args: string[]) => args.join("/") };
export const resolve = (...args: string[]) => args.join("/");
export const join = (...args: string[]) => args.join("/");
export const dirname = (p: string) => p.split("/").slice(0, -1).join("/");
export const basename = (p: string) => p.split("/").pop() || "";
export const extname = (p: string) => { const m = p.match(/\.[^.]+$/); return m ? m[0] : ""; };
