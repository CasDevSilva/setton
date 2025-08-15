import { AppFileCreate } from "../../types/AppFileCreate.js";
import inquirer from "inquirer";

export async function getFileInformation () {
    let mObjResponse:AppFileCreate = {
        filename : "",
        content  : "",
        pathfile : "",
        extension: "",
        categorie: 0
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