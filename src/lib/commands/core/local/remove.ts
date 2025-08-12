import { AppFileCreate } from "../../../../types/AppFileCreate.js";
import fs from "fs";
import inquirer from "inquirer";
import { existFile } from "../../../utils/stats.js";

export async function removeLocalFile(pObjAppFile: AppFileCreate) {
    return new Promise(async (resolve, reject) => {
        try {
            let mObjResponse = await existFile(pObjAppFile.pathfile);

            if (mObjResponse) {
                fs.unlink(pObjAppFile.pathfile, (err) => {
                    if (err) {
                        console.log(err)
                        reject(err);
                    } else {
                        resolve(true);
                    }
                })
            }
        } catch(err) {
            console.log("El fichero no existe")
            reject(err);
        }
    })
}

export async function getFileInformation () {
    let mObjResponse:AppFileCreate = {
        filename : "",
        content  : "",
        pathfile : "",
        extension: ""
    };

    let mObjInputNote = await inquirer.prompt([
        {
            name: "path",
            type: "input",
            message: "Ruta del fichero: "
        }
    ])

    mObjResponse.pathfile = mObjInputNote.path;

    return mObjResponse;
}