import { removeArchiveDBNote } from "./core/database/remove.js";

export async function archive(){
    await removeArchiveDBNote(false);
}