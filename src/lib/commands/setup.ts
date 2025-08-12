import { buildDatabase } from "../utils/database.js";

export async function setup() {
    try {
        await buildDatabase();
        console.log("Base de datos desplegada correctamente.")
    } catch(err) {
        console.log("Hubo un error al desplegar la Base de Datos.");
    }
}