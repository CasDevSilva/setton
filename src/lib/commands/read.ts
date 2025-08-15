import { AppFileCreate } from "../../types/AppFileCreate.js";
import { inquirer_db_option, inquirer_local_option } from "../utils/inquirer_prompts.js";
import { getFileInformation } from "../utils/local.js";
import { readDBNote } from "./core/database/read.js";
import { readLocalNote } from "./core/local/read.js";

export async function read(pBoolDatabaseDeployed:boolean) {
    try {
        let mBoolReadLocal:boolean = true;

        if (pBoolDatabaseDeployed) {
            let mObjDBOptions = await inquirer_db_option("Leer nota en base de Datos?");
            let mBoolSearchDB:boolean = mObjDBOptions.exec_db == "Si" ? true: false;

            if (mBoolSearchDB) {
                await readDBNote();
                mBoolReadLocal = false;
            } else {
                mBoolReadLocal = true;
            }
        }

        if (mBoolReadLocal) {
            let mObjAppFile:AppFileCreate = await getFileInformation();
            await readLocalNote(mObjAppFile);
        }
    } catch(err) {
        console.log("Hubo un error al leer el fichero");
    }
}