import { Note } from "../../../models/Note.js";
import { connectDatabase, insertIntoTable } from "../database.js";

export function insertNote(pObjNote:Note) {
    return insertIntoTable("notes", pObjNote);
}

export function getNotes() {
    try {
        const db = connectDatabase();

        let mArrObjNotes = db.prepare(`SELECT * FROM notes WHERE status = 'C' ORDER BY date_created ASC`).all();

        db.close();

        return mArrObjNotes;
    } catch(err) {
        console.log("Error al obtener las notas");
    }
}

export function getNoteByName() {}
export function getNoteByID() {}