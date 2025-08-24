import { NoteTag } from "../../../models/NoteTag.js";
import { Tag } from "../../../models/Tag.js";
import { connectDatabase, insertIntoTable } from "../database.js";

export function insertTag(pObjTag:Tag) {
    return insertIntoTable("tags", pObjTag);
}

export function addTagToNote(pObjNoteTag:NoteTag) {
    return insertIntoTable("note_tags", pObjNoteTag);
}

export function getTags(pBoolExistsNotes: boolean) {
    try {
        const db = connectDatabase();
        let mStrSQLCond = pBoolExistsNotes
            ? `id IN (
                SELECT id_tag
                  FROM note_tags
                 WHERE
                    id_note IN (
                        SELECT id
                          FROM notes
                         WHERE
                            status = 'C'
                    )
                )`
            : "1 = 1";

        let mArrObjTags = db.prepare(`
            SELECT *
              FROM tags
             WHERE
                ${mStrSQLCond}
        `).all();

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