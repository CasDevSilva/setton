import inquirer from "inquirer";
import Table from 'cli-table3';
import { getListNotes, getTotalRows } from "../utils/database.js";
import { Note } from "../../models/Note.js";
import { Categorie } from "../../models/Categorie.js";
import { Tag } from "../../models/Tag.js";

function showTable(pObjCurrentPageInformation, pIntPage:number, pIntLimitPage:number) {
    let mArrRows = getListNotes(pObjCurrentPageInformation.table, pObjCurrentPageInformation.sqlcond, pIntPage, pIntLimitPage);

    const table = new Table({
        head: Object.values(pObjCurrentPageInformation.columns)
    });

    mArrRows.forEach(row => {
        let mArrContent = [];
        Object.keys(pObjCurrentPageInformation.columns).forEach(rowColumn => {
            if (rowColumn == "date_created" || rowColumn == "date_updated") {
                mArrContent.push(new Date(row[rowColumn]).toUTCString());
            } else {
                mArrContent.push(row[rowColumn]);
            }
        });

        table.push(mArrContent);
    });

    console.log(table.toString());
}

export async function list() {
    try {
        const mIntMaxByPage:number = 1;

        let mObjTableInformation = {
            table: null,
            sqlcond: "1 = 1",
            columns: null
        };
        let mObjOption = await inquirer.prompt([
            {
                name: "list_type",
                type: "list",
                message: "Que deseas listar?",
                choices: [
                    "notas",
                    "notas archivadas|eliminadas",
                    "categorias",
                    "tags"
                ]
            }
        ])

        if (mObjOption.list_type == "categorias") {
            mObjTableInformation.table = "categories";
            let mObjCategorie:Categorie = {
                name        : "Nombre",
                date_created: "Fecha de creacion",
                date_updated: "Ultima actualizacion"
            }

            mObjTableInformation.columns = mObjCategorie;
            delete mObjTableInformation.columns.date_created;
            delete mObjTableInformation.columns.date_updated;
        }

        if (mObjOption.list_type == "tags") {
            mObjTableInformation.table = "tags";

            let mObjTag:Tag = {
                name: "Nombre"
            }

            mObjTableInformation.columns = mObjTag;
        }

        if (mObjOption.list_type == "notas" ||
            mObjOption.list_type == "notas archivadas|eliminadas"
        ) {
            mObjTableInformation.table = "notes";
            let mObjNote:Note = {
                name        : "Nombre",
                content     : "Contenido",
                category_id : 0,
                extension   : "Extension",
                status      : "Estado",
                date_created: "Fecha de creacion",
                date_updated: "Ultima actualizacion"
            };

            mObjTableInformation.columns = mObjNote;

            delete mObjTableInformation.columns.content;
            delete mObjTableInformation.columns.category_id;
            delete mObjTableInformation.columns.status;
        }

        if (mObjOption.list_type == "notas") {
            mObjTableInformation.sqlcond = "status = 'C'";
        }

        if (mObjOption.list_type == "notas archivadas|eliminadas") {
            mObjTableInformation.sqlcond = "status = 'A'";
        }

        let mIntTTlRows = getTotalRows(mObjTableInformation.table, mObjTableInformation.sqlcond);
        let mIntMaxIterations:number = mIntTTlRows/mIntMaxByPage <= 1
            ? 1
            : mIntTTlRows/mIntMaxByPage;
        let mIntCurrentPage = 1;

        if (mIntMaxIterations > 1) {
            while(mIntMaxIterations > 1) {
                let mArrOptions = null;
                showTable(mObjTableInformation, mIntCurrentPage, mIntMaxByPage);

                if (mIntCurrentPage > 1) {
                    mArrOptions = [
                        "Página anterior",
                        "Siguiente página",
                        "Salir"
                    ];
                }

                if (mIntCurrentPage == 1) {
                    mArrOptions = [
                        "Siguiente página",
                        "Salir"
                    ];
                }

                if (mIntCurrentPage >= mIntMaxIterations) {
                    mArrOptions = [
                        "Página anterior",
                        "Salir"
                    ];
                }

                let mObjOptPages = await inquirer.prompt([
                    {
                        name: "opt_page",
                        type: "list",
                        message: "Opciones",
                        choices: mArrOptions
                    }
                ]);

                if (mObjOptPages.opt_page == "Página anterior") {
                    mIntCurrentPage -= 1;
                }
                if (mObjOptPages.opt_page == "Siguiente página") {
                    mIntCurrentPage += 1;
                }
                if (mObjOptPages.opt_page == "Salir") {
                    break;
                }
            }
        } else {
            showTable(mObjTableInformation, mIntCurrentPage, mIntMaxByPage);
        }
    } catch(err) {
        console.log("Error al ejecutar el comando 'list'")
    }
}