import { NoteTag } from "../../../models/NoteTag.js";
import { Tag } from "../../../models/Tag.js";
import { connectDatabase, insertIntoTable } from "../database.js";

export function createTag(pObjTag:Tag) {
    return insertIntoTable("tags", pObjTag);
}

export function addTagToNote(pObjNoteTag:NoteTag) {
    return insertIntoTable("note_tags", pObjNoteTag);
}

export function getTags() {
    try {
        const db = connectDatabase();

        let mArrObjTags = db.prepare(`SELECT * FROM tags`).all();

        db.close();

        return mArrObjTags;
    } catch(err) {
        console.log("Error al obtener los tags.");
    }
}

export function getNotesNotTags(pIntIdNote:number) {
    try {
        const db = connectDatabase();

        let mArrObjTags = db.prepare(`
            SELECT *
              FROM tags
             WHERE
                id NOT IN(
                    SELECT id_tag
                      FROM note_tags
                     WHERE id_note = ?
                )
            `).all(pIntIdNote);

        db.close();

        return mArrObjTags;
    } catch(err) {

    }
}