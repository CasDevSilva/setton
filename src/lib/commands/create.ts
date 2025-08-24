import { AppFileCreate } from "../../types/AppFileCreate.js";
import { inquirer_db_option, inquirer_local_option } from "../utils/inquirer_prompts.js";
import { getCategories } from "../utils/tables/categories.js";
import { createDBNote } from "./core/database/create.js";
import { createLocalNote } from "./core/local/create.js";
import inquirer from "inquirer";

async function readContentToWrite(pBoolDatabaseDeployed:boolean) {
    let mObjResponse:AppFileCreate = {
        filename : "",
        content  : "",
        pathfile : "",
        extension: "",
        categorie: 0
    };
    let mBoolSavePc = false;
    let mObjInputGeneralNote = await inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "Nombre de la nota: "
        },
        {
            name: "content",
            type: "editor",
            message: "Contenido: "
        },
        {
            name: "extension",
            type: "input",
            message: "Extension de fichero: ",
            default: "txt"
        }
    ])

    mObjResponse.filename  = mObjInputGeneralNote.name;
    mObjResponse.content   = mObjInputGeneralNote.content;
    mObjResponse.extension = mObjInputGeneralNote.extension;

    if (pBoolDatabaseDeployed) {
        let mObjDBOptions = await inquirer_db_option("Almacenar en Base de Datos?");

        if (mObjDBOptions.exec_db == "Si") {
            let mArrCategories = [];
            let mArrObjCategories = getCategories(false);

            mArrObjCategories.forEach(mRowCategorie => {
                mArrCategories.push(mRowCategorie.name);
            });

            let mObjDBInputNote = await inquirer.prompt([
                {
                    name: "categorie",
                    type: "list",
                    message: "Categoria: ",
                    choices: mArrCategories
                }
            ])

            let mObjLocalOptions = await inquirer_local_option("Almacenar en computador?");

            let mObjCategorie = mArrObjCategories.find(mRowCategorie => mRowCategorie.name == mObjDBInputNote.categorie);
            mObjResponse.categorie = mObjCategorie.id;

            mBoolSavePc = mObjLocalOptions.save_pc == "Si" ? true: false;
        } else {
            mBoolSavePc = true;
        }
    }

    if (!pBoolDatabaseDeployed || mBoolSavePc) {
        let mObjFileInputNote = await inquirer.prompt([
            {
                name: "path",
                type: "input",
                message: "Ruta a almacenar: "
            }
        ])

        mObjResponse.pathfile  = mObjFileInputNote.path;
    }

    return mObjResponse;
}

export async function create (pBoolDatabaseDeployed:boolean) {
    try {
        let mObjAppFile:AppFileCreate = await readContentToWrite(pBoolDatabaseDeployed);

        if (mObjAppFile.categorie > 0) {
            let mIntResponse = createDBNote(mObjAppFile);
            if (mIntResponse) {
                console.log(`La nota se registro correctamente`);
            }
        }

        if (mObjAppFile.pathfile) {
            let mStrResponse = await createLocalNote(mObjAppFile);
            console.log(`El archivo fue creado. Ruta: "${mStrResponse}".`);
        }
    } catch(err) {
        console.log("Hubo un error al crear el fichero");
    }
}