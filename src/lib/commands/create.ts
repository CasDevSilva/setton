import { AppFileCreate } from "../../types/AppFileCreate.js";
import { createLocalNote, readContentToWrite } from "./core/local/create.js";

export async function create () {
    try {
        let mObjAppFile:AppFileCreate = await readContentToWrite();
        let mStrResponse = await createLocalNote(mObjAppFile);

        console.log(`El archivo fue creado. Ruta: "${mStrResponse}".`);
    } catch(err) {
        console.log("Hubo un error al crear el fichero");
    }
}