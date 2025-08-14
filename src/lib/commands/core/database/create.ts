import { Note } from "../../../../models/Note.js";
import { AppFileCreate } from "../../../../types/AppFileCreate.js";
import { getCategorie } from "../../../utils/tables/categories.js";
import { insertNote } from "../../../utils/tables/notes.js";

export function createDBNote(pObjAppFile:AppFileCreate) {
    let mObjCategorie = getCategorie("General");

    let mObjNote:Note = {
        name        : pObjAppFile.filename,
        content     : pObjAppFile.content,
        category_id : pObjAppFile.categorie > 0
            ? pObjAppFile.categorie
            : mObjCategorie.id,
        extension   : pObjAppFile.extension,
        status      : 'C',
        date_created: new Date().toISOString(),
        date_updated: new Date().toISOString()
    };

    return insertNote(mObjNote);
}