import { env } from "~/env.js";
import { XataClient } from "./xata";

export const xata = new XataClient({
  apiKey: env.XATA_API_KEY,
  branch: env.XATA_BRANCH,
});
