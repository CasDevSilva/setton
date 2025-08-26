import fs from "fs";
import { AppFileCreate } from "../../../../../types/AppFileCreate.js";

export async function readLocalNote(pObjAppFile:AppFileCreate) {
    try {
        let mIntTtlColumns = process.stdout.columns || 80;

        fs.readFile(pObjAppFile.pathfile, "utf8", (err, content) => {
            if (err) {
                throw err;
            } else {
                console.log(" Contenido de la nota ".padStart(mIntTtlColumns, "="));
                console.log(content);
                console.log(" Fin de la nota ".padStart(mIntTtlColumns, "="));
            }
        })
    } catch (err) {
        console.log("Hubo un error al leer el fichero");
    }
}