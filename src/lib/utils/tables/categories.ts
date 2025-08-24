import { Categorie } from "../../../models/Categorie.js";
import { connectDatabase, insertIntoTable } from "../database.js";

export function verifyExistCategorie(pStrCategorieName:string) {
    try {
        let db = connectDatabase();

        let mObjCategorie = db.prepare(`
            SELECT *
              FROM categories
             WHERE name = ?
        `).get(pStrCategorieName);

        db.close();

        if (mObjCategorie?.name) {
            return true;
        } else {
            return false;
        }
    } catch(err) {
        console.log(err);
        console.log(`Error al buscar la categoria "${pStrCategorieName}"`);
    }
}

export function getCategorie(pStrCategorieName: string) {
    try {
        let db = connectDatabase();

        let mObjCategorie = db.prepare(`
            SELECT *
              FROM categories
             WHERE
                name = ?
        `).get(pStrCategorieName);

        db.close();

        return mObjCategorie;
    } catch(err) {
        console.log(`Error al obtener la categoria ${pStrCategorieName}`);
    }
}

export function getCategories(pBoolExistsNotes: boolean) {
    try {
        let db = connectDatabase();
        let mStrSQLCond = pBoolExistsNotes
            ? `id IN (SELECT category_id FROM notes WHERE status = 'C')`
            : `1 = 1`;

        let mArrCategories = db.prepare(`
            SELECT *
              FROM categories
             WHERE
                ${mStrSQLCond}
        `).all();

        db.close();

        return mArrCategories;
    } catch(err) {
        console.log(`Error al obtener la categorias.`);
    }
}

export function insertCategorie (pObjCategorie:Categorie) {
    insertIntoTable("categories", pObjCategorie);
}