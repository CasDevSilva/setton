import { AppFileCreate } from "../../types/AppFileCreate.js";
import { getFileInformation, removeLocalFile } from "./core/local/remove.js";

export async function remove() {
    try {
        let mObjAppFile:AppFileCreate = await getFileInformation();
        let mObjContent = await removeLocalFile(mObjAppFile);

        console.log("El fichero fue eliminado correctamente.");
    } catch(err) {
        console.log("Hubo un error al eliminar el fichero");
    }
}