import { Note } from "../../../models/Note.js";
import { insertIntoTable } from "../database.js";

export function insertNote(pObjNote:Note) {
    return insertIntoTable("notes", pObjNote);
}