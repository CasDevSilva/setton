import inquirer from "inquirer";
import inquirerPrompt from 'inquirer-autocomplete-prompt';
import { archiveNote, getNotes } from "../../../../utils/tables/notes.js";

inquirer.registerPrompt('autocomplete', inquirerPrompt);

export async function removeArchiveDBNote(pBoolDelete) {
    try {
        let mArrObjNotes = getNotes();
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
        ]);

        let mObjNote = mArrObjNotes.find(mRowNote => mRowNote.name.toLowerCase().includes(
            mObjDataNote.name.toLowerCase()
        ));

        archiveNote(mObjNote.id, pBoolDelete);
    } catch(err) {
        console.log("Error al eliminar la nota de la Base de Datos.");
    }
}