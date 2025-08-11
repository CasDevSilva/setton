import fs from "fs";
import inquirer from "inquirer";
import path from "path";

import { AppFileCreate } from "../../../../types/AppFileCreate";

export async function createLocalNote(pObjAppFile:AppFileCreate) {
    let mStrExtension = pObjAppFile.extension == ""
        ? "txt"
        : pObjAppFile.extension;
    let mStrFullPath = path.join(pObjAppFile.pathfile, `${pObjAppFile.filename}.${mStrExtension}`);

    return new Promise((resolve, reject) => {
        fs.writeFile(mStrFullPath, pObjAppFile.content, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve(mStrFullPath);
            }
        });
    })
}

export async function readContentToWrite() {
    let mObjResponse:AppFileCreate = {
        filename : "",
        content  : "",
        pathfile : "",
        extension: ""
    };

    let mObjInputNote = await inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "Nombre de la nota: "
        },
        {
            name: "extension",
            type: "input",
            message: "Extension de fichero: "
        },
        {
            name: "content",
            type: "editor",
            message: "Contenido: "
        },
        {
            name: "path",
            type: "input",
            message: "Ruta a almacenar: "
        }
    ])

    mObjResponse.filename  = mObjInputNote.name;
    mObjResponse.extension = mObjInputNote.extension;
    mObjResponse.content   = mObjInputNote.content;
    mObjResponse.pathfile  = mObjInputNote.path;

    return mObjResponse;
}