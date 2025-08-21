import { Categorie } from "../../models/Categorie.js";
import inquirer from "inquirer";
import { insertCategorie } from "../utils/tables/categories.js";

export async function categorie() {
    try {
        let mIntTtlCategories = 0;
        let mBoolAddCategorie = true;

        while(mBoolAddCategorie) {
            let mObjCategorie:Categorie = {
                name: "",
                date_created: new Date().toISOString(),
                date_updated: new Date().toISOString(),
            };

            let mObjInput = await inquirer.prompt([
                {
                    name: "name",
                    type: "input",
                    message: "Nombre de la categoria: ",
                }
            ])

            mObjCategorie.name = mObjInput.name;

            insertCategorie(mObjCategorie);
            mIntTtlCategories += 1;

            let mObjTagOpt = await inquirer.prompt([
                {
                    name: "add",
                    type: "list",
                    message: "Quieres agregar otra categoria?",
                    choices: [
                        "Si",
                        "No"
                    ]
                }
            ]);

            if (mObjTagOpt.add == "No") {
                mBoolAddCategorie = false;
            }
        }

        if (mIntTtlCategories > 0) {
            console.log(mIntTtlCategories > 1
                ? `Se crearon ${mIntTtlCategories} correctamente`
                : `Se creó el tag correctamente`
            );
        }
    } catch(err) {
        console.log("Hubo un error al ejecutar el comando");
    }
}