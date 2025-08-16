import pkg from "better-sqlite3";
import fs from "fs/promises";
import { dbFolder, dbFile } from "../../constants/config.js";
import { insertCategorie, verifyExistCategorie } from "./tables/categories.js";

const Database = pkg;
const mObjTables = {
    categories: {
        id          : "INTEGER PRIMARY KEY AUTOINCREMENT",
        name        : "VARCHAR(50) NOT NULL UNIQUE",
        date_created: "DATETIME DEFAULT (datetime('now','localtime')) NOT NULL",
        date_updated: "DATETIME DEFAULT (datetime('now','localtime')) NOT NULL"
    },
    tags: {
        id  : "INTEGER PRIMARY KEY AUTOINCREMENT",
        name: "VARCHAR(50) NOT NULL UNIQUE"
    },
    notes: {
        id          : "INTEGER PRIMARY KEY AUTOINCREMENT",
        name        : "VARCHAR(50) NOT NULL",
        content     : "TEXT NOT NULL",
        status      : "CHAR(1) NOT NULL",
        category_id : "INTEGER NOT NULL",
        extension   : "VARCHAR(25) NOT NULL",
        date_created: "DATETIME DEFAULT (datetime('now','localtime')) NOT NULL",
        date_updated: "DATETIME DEFAULT (datetime('now','localtime')) NOT NULL",
        sql_restrictions: `
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
        `
    },
    note_tags: {
        id_note:     "INTEGER NOT NULL",
        id_tag:      "INTEGER NOT NULL",
        sql_restrictions: `
            PRIMARY KEY (id_note, id_tag),
            FOREIGN KEY (id_note) REFERENCES notes(id) ON DELETE CASCADE,
            FOREIGN KEY (id_tag) REFERENCES tags(id) ON DELETE CASCADE
        `
    }
};

function createTables (pStrTableName:string, pObjTableColumns) {
    let mArrSQLFormat: Array<string> = [];

    Object.keys(pObjTableColumns).forEach(mRowColumn => {
        if (mRowColumn == "sql_restrictions") {
            mArrSQLFormat.push(pObjTableColumns[mRowColumn]);
            return;
        }
        mArrSQLFormat.push(`${mRowColumn} ${pObjTableColumns[mRowColumn]}`);
    });

    let mStrSQLSentence = `
        CREATE TABLE IF NOT EXISTS ${pStrTableName} (
            ${mArrSQLFormat.join(', ')}
        )
    `;

    try {
        let db = connectDatabase();

        db.exec(mStrSQLSentence);
        db.close();
    } catch(err) {
        throw new Error(`ERROR to create the table '${pStrTableName}'`);
    }
}

function getLimitOffset (pIntPage:number, pIntLimitPage:number) {
    return (pIntPage - 1) * pIntLimitPage;
}

export function connectDatabase() {
    let db = new Database(dbFile);
    return db;
}

export async function buildDatabase () {
    try {
        await fs.mkdir(dbFolder, { recursive: true });

        let db = new Database(dbFile);

        Object.keys(mObjTables).forEach(mRowTable => {
            createTables(mRowTable, mObjTables[mRowTable]);

            if (mRowTable == "categories") {
                if (!verifyExistCategorie("General")) {
                    insertCategorie("General");
                }
            }
        })

        db.close();
    } catch(err) {
        console.log(err)
        console.log("Hubo un error al montar la base de Datos")
    }
}

export function insertIntoTable(pStrTable:string, pObjIntoData) {
    try {
        let db = connectDatabase();

        let mStrStatement = db.prepare(`
            INSERT INTO ${pStrTable} (${Object.keys(pObjIntoData).join(',')})
            VALUES (${Object.keys(pObjIntoData).map(key => `:${key}`).join(',')})
        `);

        mStrStatement.run(pObjIntoData)

        db.close();

        return 1;
    } catch(err) {
        console.log(err);
        console.log(`Error al insertar en la tabla ${pStrTable}`);
        return 0;
    }
}

export function getTotalRows(pStrTable:string, pStrCond:string) {
    try {
        const db = connectDatabase();

        let mObjResponse = db.prepare(`
            SELECT COUNT(*) counted
            FROM ${pStrTable}
            WHERE
                ${pStrCond}
        `).get();

        db.close();

        return mObjResponse.counted;
    } catch(err) {
        console.log("Hubo un error al obtener la informacion");
    }
}

export function getListNotes(pStrTable:string, pStrSQLCond:string, pIntPage:number, pIntLimitPage:number) {
    try {
        const db = connectDatabase();
        let mIntOffset = getLimitOffset(pIntPage, pIntLimitPage);

        let mArrRows = db.prepare(`
            SELECT *
              FROM ${pStrTable}
             WHERE
                ${pStrSQLCond}
             LIMIT ${pIntLimitPage}
             OFFSET ${mIntOffset}
        `).all();

        db.close();

        return mArrRows;
    } catch(err) {
        console.log("Hubo un error al obtener los registros");
    }
}