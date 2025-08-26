import { AppFileCreate } from "../../../types/AppFileCreate.js";
import { inquirer_db_option } from "../../utils/inquirer_prompts.js";
import { getFileInformation } from "../../utils/local.js";
import { removeArchiveDBNote } from "./core/database/remove.js";
import { removeLocalFile } from "./core/local/remove.js";

export async function remove(pBoolDatabaseDeployed:boolean) {
    try {
        let mBoolReadLocal = true;

        if (pBoolDatabaseDeployed) {
            let mObjDBOptions = await inquirer_db_option("Eliminar nota de base de Datos?");
            let mBoolSearchDB:boolean = mObjDBOptions.exec_db == "Si"
                ? true
                : false;

            if (mBoolSearchDB) {
                await removeArchiveDBNote(true);
                mBoolReadLocal = false;
            } else {
                mBoolReadLocal = true;
            }
        }

        if (mBoolReadLocal) {
            let mObjAppFile:AppFileCreate = await getFileInformation();
            await removeLocalFile(mObjAppFile);
        }
    } catch(err) {
        console.log("Hubo un error al eliminar el fichero");
    }
}