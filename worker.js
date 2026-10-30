import { httpServerHandler } from "cloudflare:node";
import app from "./app.js";

// Bind the Express app to the virtual port within the Workers isolate
app.listen(3000);

// Export Cloudflare Worker fetch handler mapped to that port
export default httpServerHandler({ port: 3000 });

