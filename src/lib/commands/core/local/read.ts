import { AppFileCreate } from "../../../../types/AppFileCreate.js";
import inquirer from "inquirer";
import fs from "fs";

export async function readLocalNote(pObjAppFile:AppFileCreate) {
    return new Promise((resolve, reject) => {
        fs.readFile(pObjAppFile.pathfile, "utf8", (err, content) => {
            if (err) {
                reject(err);
            } else {
                resolve(content);
            }
        })
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