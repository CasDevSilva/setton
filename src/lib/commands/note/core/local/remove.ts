import fs from "fs";

import { AppFileCreate } from "../../../../../types/AppFileCreate.js";
import { existFile } from "../../../../utils/stats.js";

export async function removeLocalFile(pObjAppFile: AppFileCreate) {
    try {
        let mObjResponse = await existFile(pObjAppFile.pathfile);

        if (mObjResponse) {
            fs.unlink(pObjAppFile.pathfile, (err) => {
                if (err) {
                    console.log("Hubo un error al eliminar el fichero");
                } else {
                    console.log("El fichero fue eliminado correctamente");
                }
            })
        }
    } catch(err) {
        console.log("El fichero no existe")
    }
}