import pkg from "better-sqlite3";
import fs from "fs/promises";
import { dbFolder, dbFile } from "../../constants/config.js";

const Database = pkg;
const mObjTables = {
    categories: {
        id          : "INTEGER PRIMARY KEY AUTOINCREMENT",
        name        : "VARCHAR(50) NOT NULL",
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
        })

        db.close();
    } catch(err) {
        console.log(err)
        console.log("Hubo un error al montar la base de Datos")
    }
}

function createTables(pStrTableName:string, pObjTableColumns) {
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