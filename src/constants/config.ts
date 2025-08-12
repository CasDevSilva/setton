import path from "path";
import os from "os";
import { fileURLToPath } from 'url';

/**
 * Get Relative path Database Information;
*/
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const dbFolder = path.join(__dirname, "..", "..", "db");
export const dbFile = path.join(dbFolder, 'setton.db');