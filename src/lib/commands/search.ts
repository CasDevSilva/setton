import inquirer from "inquirer";
import inquirerPrompt from 'inquirer-autocomplete-prompt';
import { getNotes, getNotesByCategorie, getNotesByTag } from "../utils/tables/notes.js";
import { getTags } from "../utils/tables/tags.js";
import { getCategories } from "../utils/tables/categories.js";
import Table from 'cli-table3';

inquirer.registerPrompt('autocomplete', inquirerPrompt);

export async function search() {
    try {
        let mObjDataSource = {
            content: {
                description: "Contenido o nombre",
                data: getNotes(),
                message: "Escribe el contenido o nombre de la nota: "
            },
            categorie: {
                description: "Categoria",
                data: getCategories(),
                message: "De que 'categoria' quieres ver las notas?"
            },
            tag: {
                description: "Tag",
                data: getTags(),
                message: "De que 'tag' quieres ver las notas?"
            }
        };

        let mObjOption = await inquirer.prompt([
            {
                name: "type_search",
                type: "list",
                message: "Quieres buscar notas por:",
                choices: Object.keys(mObjDataSource).map(key => mObjDataSource[key].description)
            }
        ])

        let mStrKey = Object.keys(mObjDataSource).find(key => mObjDataSource[key].description == mObjOption.type_search)

        let mObjSearched = await inquirer.prompt([
            {
                name: "optchoice",
                type: "autocomplete",
                message: mObjDataSource[mStrKey].message,
                source: (answers: any, input:string) => {
                    input = input || '';

                    if (["categorie", "tag"].includes(mStrKey)) {
                        return mObjDataSource[mStrKey].data.filter(mRowData => mRowData.name.toLowerCase().includes(input.toLowerCase()))
                    } else {
                        return mObjDataSource[mStrKey].data.filter(mRowNote => mRowNote.name.toLowerCase().includes(input.toLowerCase()) || mRowNote.content.toLowerCase().includes(input.toLowerCase()))
                    }
                }
            }
        ])

        if (["categorie", "tag"].includes(mStrKey)) {
            let mObjFilter = mStrKey == "categorie"
                ? mObjDataSource[mStrKey].data.find(mRowCategorie => mRowCategorie.name == mObjSearched.optchoice)
                : mObjDataSource[mStrKey].data.find(mRowTag => mRowTag.name == mObjSearched.optchoice);

            let mArrData = mStrKey == "categorie"
                ? getNotesByCategorie(mObjFilter.id)
                : getNotesByTag(mObjFilter.id);

            const table = new Table({
                head: ["Nombre", "Extension", "Fecha de Creacion", "Ultima actualizacion"]
            });

            mArrData.forEach(mRowNote => {
                table.push([
                    mRowNote.name,
                    mRowNote.extension,
                    mRowNote.date_created,
                    mRowNote.date_updated
                ])
            })

            console.log(table.toString());
        }

        if (mStrKey == "content") {
            let mObjNote = mObjDataSource[mStrKey].data.find(mRowNote => mRowNote.name == mObjSearched.optchoice);

            let mIntTtlColumns = process.stdout.columns || 80;
            console.log(" Contenido de la nota ".padStart(mIntTtlColumns, "="));
            console.log(mObjNote.content);
            console.log(" Fin de la nota ".padStart(mIntTtlColumns, "="));
        }
    } catch(err) {
        console.log("Hubo un error al ejecutar el comando");
    }
}