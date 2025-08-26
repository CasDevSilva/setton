import fs from "fs/promises";
import path from "path";
import inquirer from "inquirer";
import inquirerPrompt from 'inquirer-autocomplete-prompt';

import { existFile } from "../../utils/stats.js";
import { AppFileCreate } from "../../../types/AppFileCreate.js";
import { createDBNote } from "./core/database/create.js";
import { getNotes, getNotesByCategorie, getNotesByTag } from "../../utils/tables/notes.js";
import { getCategories } from "../../utils/tables/categories.js";
import { getTags } from "../../utils/tables/tags.js";
import { createLocalNote } from "./core/local/create.js";

inquirer.registerPrompt('autocomplete', inquirerPrompt);

export async function sync() {
    try {
        let mObjSyncPhase = await inquirer.prompt([
            {
                name: "origin_sync",
                type: "list",
                message: "Sincronizar de:",
                choices: ["Local", "Base de datos"]
            }
        ])

        if (mObjSyncPhase.origin_sync == "Local") {
            let mObjLocal = await inquirer.prompt([
                {
                    name: "path",
                    type: "input",
                    message: "Ruta del fichero|carpeta a sincronizar: "
                }
            ])

            let mObjStats = await existFile(mObjLocal.path);

            if (mObjStats.isFile()) {
                let mObjFile = path.parse(mObjLocal.path);
                let mStrContent = await fs.readFile(mObjLocal.path, "utf8");
                let mObjAppFile:AppFileCreate = {
                    filename: mObjFile.name,
                    content: mStrContent,
                    pathfile: "",
                    extension: mObjFile.ext,
                    categorie: 0
                };

                createDBNote(mObjAppFile);
                console.log("Fichero sincronizado correctamente");
            }

            if (mObjStats.isDirectory()) {
                let mArrFiles = await fs.readdir(mObjLocal.path);

                mArrFiles.forEach(async (mRowFile) => {
                    let mStrPathFile = path.join(mObjLocal.path, mRowFile);
                    let mObjFileStat = await existFile(mStrPathFile);
                    let mObjFile = path.parse(mRowFile);

                    if (mObjFileStat.isFile()) {
                        let mStrContent = await fs.readFile(mStrPathFile, "utf8");
                        let mObjAppFile:AppFileCreate = {
                            filename: mObjFile.name,
                            content: mStrContent,
                            pathfile: "",
                            extension: mObjFile.ext,
                            categorie: 0
                        };

                        createDBNote(mObjAppFile);
                    }
                })

                console.log("Directorio sincronizado correctamente");
            }
        } else {
            let mObjInformation = {
                note: {
                    choice: "Nota individual",
                    message: "Nombre de la nota: ",
                    list: getNotes()
                },
                category: {
                    choice: "Toda una Categoria",
                    message: "Categoria: ",
                    list: getCategories(true)
                },
                tag: {
                    choice: "Grupo de Notas con Tag",
                    message: "Tag: ",
                    list: getTags(true)
                }
            };

            let mObjSyncTable = await inquirer.prompt([
                {
                    name: "sync_db_table",
                    type: "list",
                    message: "Quieres sincronizar: ",
                    choices: Object.keys(mObjInformation).map(mRowChoice => mObjInformation[mRowChoice].choice)
                }
            ])

            let mStrChoice = Object.keys(mObjInformation).find(mRowChoice => mObjInformation[mRowChoice].choice == mObjSyncTable.sync_db_table);
            let mObjChoice = mObjInformation[mStrChoice];

            let mObjDataFilter = await inquirer.prompt([
                {
                    name: 'name',
                    type: 'autocomplete',
                    message: mObjChoice.message,
                    source: (answers: any, input:string) => {
                        input = input || '';
                        return mObjChoice.list.filter(mRowData => mRowData.name.toLowerCase().includes(input.toLowerCase()))
                    }
                },
                {
                    name: "path",
                    type: "input",
                    message: "Ruta a almacenar: "
                }
            ]);

            let mArrNotes = [];

            if (["category", "tag"].includes(mStrChoice)) {
                let mObjFilter = mStrChoice == "category"
                    ? mObjChoice.list.find(mRowCategory => mRowCategory.name == mObjDataFilter.name)
                    : mObjChoice.list.find(mRowTag => mRowTag.name == mObjDataFilter.name);

                let mArrObjNotes = mStrChoice == "category"
                    ? getNotesByCategorie(mObjFilter.id)
                    : getNotesByTag(mObjFilter.id);

                mArrObjNotes.forEach(mRowNote => {
                    let mObjCreateNote:AppFileCreate = {
                        filename: mRowNote.name,
                        content: mRowNote.content,
                        pathfile: mObjDataFilter.path,
                        extension: mRowNote.extension,
                        categorie: mRowNote.category_id
                    }

                    mArrNotes.push(mObjCreateNote);
                });
            } else {
                let mObjFindNote = mObjChoice.list.find(mRowNote => mRowNote.name == mObjDataFilter.name);

                let mObjCreateNote:AppFileCreate = {
                    filename: mObjFindNote.name,
                    content: mObjFindNote.content,
                    pathfile: mObjDataFilter.path,
                    extension: mObjFindNote.extension,
                    categorie: mObjFindNote.category_id
                }

                mArrNotes.push(mObjCreateNote);
            }

            mArrNotes.forEach(async (mRowNote) => {
                await createLocalNote(mRowNote);
            })

            console.log(`Archivos sincronizados en la ruta "${mObjDataFilter.path}".`)
        }
    } catch(err) {
        console.log("Error al ejecutar el comando");
    }
}