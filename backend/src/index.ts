import { env } from "./config/env.js";
import app from "./app/index.js";

app.listen(env.PORT, () => {
  console.log(`Server listening on port ${env.PORT}`);
});
