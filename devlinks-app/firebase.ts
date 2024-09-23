import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { clientConfig } from "./config";

export const app = initializeApp(clientConfig);
export const auth = getAuth(app);