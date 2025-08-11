import { AppFileCreate } from "../../types/AppFileCreate";
import { getFileInformation, readLocalNote } from "./core/local/read";

export async function read() {
    try {
        let mObjAppFile:AppFileCreate = await getFileInformation();
        let mObjContent = await readLocalNote(mObjAppFile);

        console.log("Contenido del fichero: ")
        console.log("============================================================================")
        console.log(mObjContent);
        console.log("============================================================================")
    } catch(err) {
        console.log("Hubo un error al leer el fichero");
    }
}