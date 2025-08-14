import fs from "fs";
import path from "path";

import { AppFileCreate } from "../../../../types/AppFileCreate.js";

export async function createLocalNote(pObjAppFile:AppFileCreate) {
    let mStrFullPath = path.join(pObjAppFile.pathfile, `${pObjAppFile.filename}.${pObjAppFile.extension}`);

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