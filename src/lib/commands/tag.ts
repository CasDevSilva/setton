import inquirer from "inquirer";
import { addTagToNote, getNotesNotTags, getTags, insertTag } from "../utils/tables/tags.js";
import { Tag } from "../../models/Tag.js";
import inquirerPrompt from 'inquirer-autocomplete-prompt';
import { getNotes } from "../utils/tables/notes.js";
import { NoteTag } from "../../models/NoteTag.js";

inquirer.registerPrompt('autocomplete', inquirerPrompt);

export async function tag(){
    try {
        let mArrObjTags = getTags();
        let mArrTagOptions = mArrObjTags.length
            ? ["Crear un tag", "Agregar tag a nota"]
            : ["Crear un tag"];

        let mObjOptions = await inquirer.prompt([
            {
                name: "opt_tag",
                type: "list",
                message: "Que quieres realizar?",
                choices: mArrTagOptions
            }
        ])

        if (mObjOptions.opt_tag == "Crear un tag") {
            let mIntTtlTags = 0;
            let mObjTag:Tag = {
                name: ""
            };

            console.log("Si quieres agregar mas de un tag, separalos con ','.")
            let mObjInput = await inquirer.prompt([
                {
                    name: "opt_tag",
                    type: "input",
                    message: "Nombre del tag: ",
                }
            ])

            mObjInput.opt_tag.trim().split(",").forEach(rowTag => {
                mObjTag.name = rowTag.trim();
                let mIntResponse = insertTag(mObjTag);
                if (mIntResponse) {
                    mIntTtlTags += 1;
                }
            })

            if (mIntTtlTags > 0) {
                console.log(mIntTtlTags > 1
                    ? `Se crearon ${mIntTtlTags} correctamente`
                    : `Se creó el tag correctamente`
                );
            }
        } else {
            let mArrObjNotes = getNotes();
            let mBoolAddTag = true;

            let mObjDataNote = await inquirer.prompt([
                {
                    name: "name",
                    type: "autocomplete",
                    message: "Que nota quieres clasificar?",
                    source: (answers: any, input:string) => {
                        input = input || '';
                        return mArrObjNotes.filter(mRowNote => mRowNote.name.toLowerCase().includes(input.toLowerCase()))
                    }
                }
            ]);

            let mObjNote = mArrObjNotes.find(mRowNote => mRowNote.name.toLowerCase().includes(
                mObjDataNote.name.toLowerCase()
            ));

            mArrObjTags = getNotesNotTags(mObjNote.id);

            if (mArrObjTags.length) {
                while(mBoolAddTag) {
                    let mObjDataTag = await inquirer.prompt([
                        {
                            name: "name",
                            type: "autocomplete",
                            message: "Que tag quieres agregar?",
                            source: (answers:any, input:string) => {
                                input = input || '';
                                return mArrObjTags.filter(mRowTag => mRowTag.name.toLowerCase().includes(input.toLowerCase()))
                            }
                        }
                    ])

                    let mObjTag = mArrObjTags.find(mRowTag => mRowTag.name.toLowerCase().includes(
                        mObjDataTag.name.toLowerCase()
                    ));

                    let mObjNoteTag:NoteTag = {
                        id_note: mObjNote.id,
                        id_tag : mObjTag.id
                    };

                    addTagToNote(mObjNoteTag);

                    let mObjTagOpt = await inquirer.prompt([
                        {
                            name: "add",
                            type: "list",
                            message: "Quieres agregar otro tag?",
                            choices: [
                                "Si",
                                "No"
                            ]
                        }
                    ]);

                    if (mObjTagOpt.add == "No") {
                        mBoolAddTag = false;
                    } else {
                        mArrObjTags = getNotesNotTags(mObjNote.id);

                        if (!mArrObjTags.length) {
                            console.log("No existen tags disponibles para asignar a la nota actual.");
                            break;
                        }
                    }
                }
            } else {
                console.log("No existen tags disponibles para asignar a la nota actual.");
            }
        }
    } catch(err) {
        console.log("Hubo un error al ejecutar el comando");
    }
}