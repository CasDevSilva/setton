import inquirer from "inquirer";
import inquirerPrompt from 'inquirer-autocomplete-prompt';
import { getNotes } from "../../../../utils/tables/notes.js";

inquirer.registerPrompt('autocomplete', inquirerPrompt);

export async function readDBNote() {
    try {
        let mArrObjNotes = getNotes();
        let mIntTtlColumns = process.stdout.columns || 80;

        let mObjDataNote = await inquirer.prompt([
            {
                name: 'name',
                type: 'autocomplete',
                message: 'Name of your note: ',
                source: (answers: any, input:string) => {
                    input = input || '';
                    return mArrObjNotes.filter(mRowNote => mRowNote.name.toLowerCase().includes(input.toLowerCase()))
                }
            }
        ])

        let mObjNote = mArrObjNotes.find(mRowNote => mRowNote.name.toLowerCase().includes(
            mObjDataNote.name.toLowerCase()
        ));

        console.log(" Contenido de la nota ".padStart(mIntTtlColumns, "="));
        console.log(mObjNote.content);
        console.log(" Fin de la nota ".padStart(mIntTtlColumns, "="));
    } catch(err) {
        console.log("Error al leer la nota de la Base de Datos");
    }
}