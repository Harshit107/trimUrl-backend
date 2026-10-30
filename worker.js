import { httpServerHandler } from "cloudflare:node";
import app from "./app.js";

// Bind the Express app to the internal virtual port within the Workers isolate
app.listen(3000);

const handler = httpServerHandler({ port: 3000 });

export default {
  async fetch(request, env, ctx) {
    if (env) {
      Object.assign(process.env, env);
    }
    return handler.fetch(request, env, ctx);
  },
};
