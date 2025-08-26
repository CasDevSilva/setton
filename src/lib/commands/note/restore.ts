import inquirer from "inquirer";
import inquirerPrompt from 'inquirer-autocomplete-prompt';

import { getArchivedNotes, restoreNote } from "../../utils/tables/notes.js";

inquirer.registerPrompt('autocomplete', inquirerPrompt);

export async function restore() {
    try {
        let mArrObjNotes = getArchivedNotes();
        let mObjInput = await inquirer.prompt([
            {
                name: "name",
                type: "autocomplete",
                message:"Nombre de la nota: ",
                source: (answers: any, input:string) => {
                    input = input || '';
                    return mArrObjNotes.filter(mRowNote => mRowNote.name.toLowerCase().includes(input.toLowerCase()))
                }
            }
        ]);

        let mObjNote = mArrObjNotes.find(mRowNote => mRowNote.name.toLowerCase().includes(
            mObjInput.name.toLowerCase()
        ));

        restoreNote(mObjNote.id);
    } catch(err) {
        console.log("Hubo un error al ejecutar el comando");
    }
}