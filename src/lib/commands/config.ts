import { dbFile } from "../../constants/config.js";
import { existFile } from "../utils/stats.js";

export async function config() {
    try {
        let mObjStats = await existFile(dbFile);

        console.log("==============================================")
        console.log("Path File: ", dbFile);
        console.log("Size: ", mObjStats.size);
        console.log("Date created: ", new Date(mObjStats.birthtime).toUTCString());
        console.log("Last updated: ", new Date(mObjStats.mtime).toUTCString());
        console.log("==============================================")
    } catch(err) {
        console.log("Error al obtener informacion de la Base de Datos.");
    }
}