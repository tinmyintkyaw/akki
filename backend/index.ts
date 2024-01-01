import { express } from "@/configs/express.js";

express.listen(3300, () => console.log("Listening on port 3300"));
