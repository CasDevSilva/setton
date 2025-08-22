import { Note } from "../../../models/Note.js";
import { connectDatabase, insertIntoTable } from "../database.js";

// Operacion Create
export function insertNote(pObjNote:Note) {
    return insertIntoTable("notes", pObjNote);
}

// Operaciones Get
export function getNotes() {
    try {
        const db = connectDatabase();

        let mArrObjNotes = db.prepare(`
            SELECT *
              FROM notes
             WHERE
                status = 'C'
            ORDER BY
                date_created ASC
        `).all();

        db.close();

        return mArrObjNotes;
    } catch(err) {
        console.log("Error al obtener las notas");
    }
}

export function getArchivedNotes() {
    try {
        const db = connectDatabase();

        let mArrObjNotes = db.prepare(`
            SELECT *
              FROM notes
             WHERE
                status = 'A'
            ORDER BY
                date_created ASC
        `).all();

        db.close();

        return mArrObjNotes;
    } catch(err) {
        console.log("Error al obtener las notas");
    }
}

export function getNotesByCategorie(pIntCategorieID:number) {
    try {
        const db = connectDatabase();

        let mArrObjNotes = db.prepare(`
            SELECT *
              FROM notes
             WHERE
                    status = 'C'
                AND category_id = ?
            ORDER BY
                date_created ASC
        `).all(pIntCategorieID);

        db.close();

        return mArrObjNotes;
    } catch(err) {
        console.log("Error al obtener las notas");
    }
}

export function getNotesByTag(pIntTagID:number) {
    try {
        const db = connectDatabase();

        let mArrObjNotes = db.prepare(`
            SELECT *
              FROM notes
             WHERE
                    status = 'C'
                AND id IN (
                    SELECT id_note
                    FROM note_tags
                    WHERE id_tag = ?
                )
            ORDER BY
                date_created ASC
        `).all(pIntTagID);

        db.close();

        return mArrObjNotes;
    } catch(err) {
        console.log("Error al obtener las notas");
    }
}

// Operaciones Update

// Operaciones Delete - Archive
export function archiveNote(pIntIDNote:number, pBoolDelete:boolean) {
    try {
        const db = connectDatabase();

        let mStrStatement = db.prepare(`
            UPDATE notes
               SET status = 'A'
             WHERE
                id = ?
        `);

        mStrStatement.run(pIntIDNote);

        db.close();

        if (pBoolDelete) {
            console.log("La nota se elimino correctamente");
        } else {
            console.log("La nota se archivo correctamente");
        }
    } catch(err) {
        if (pBoolDelete) {
            console.log(`Hubo un error al eliminar la nota.`);
        } else {
            console.log(`Hubo un error al archivar la nota`);
        }
    }
}

export function restoreNote(pIntIDNote:number) {
    try {
        const db = connectDatabase();

        let mStrStatement = db.prepare(`
            UPDATE notes
               SET status = 'C'
             WHERE
                id = ?
        `)

        mStrStatement.run(pIntIDNote);

        db.close();

        console.log("La nota se restauro correctamente");
    } catch(err) {
        console.log("Hubo un error al restaurar la nota");
    }
}