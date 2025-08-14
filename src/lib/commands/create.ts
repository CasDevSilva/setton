import { AppFileCreate } from "../../types/AppFileCreate.js";
import { getAllCategories } from "../utils/tables/categories.js";
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
        let mObjDBOptions = await inquirer.prompt([
            {
                name: "exec_db",
                type: "list",
                message: "Almacenar en Base de Datos?",
                choices: ["Si", "No"]
            }
        ])

        if (mObjDBOptions.exec_db == "Si") {
            let mArrCategories = [];
            let mArrObjCategories = getAllCategories();

            mArrObjCategories.forEach(mRowCategorie => {
                mArrCategories.push(mRowCategorie.name);
            });

            let mObjDBInputNote = await inquirer.prompt([
                {
                    name: "categorie",
                    type: "list",
                    message: "Categoria: ",
                    choices: mArrCategories
                },
                {
                    name: "save_pc",
                    type: "list",
                    message: "Almacenar en computador?",
                    choices: ["Si", "No"]
                }
            ])

            let mObjCategorie = mArrObjCategories.find(mRowCategorie => mRowCategorie.name == mObjDBInputNote.categorie);
            mObjResponse.categorie = mObjCategorie.id;

            mBoolSavePc = mObjDBInputNote.save_pc == "Si" ? true: false;
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