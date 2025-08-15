import inquirer from "inquirer";

export function inquirer_db_option(pStrMessage:string) {
    return inquirer.prompt([
        {
            name: "exec_db",
            type: "list",
            message: pStrMessage,
            choices: ["Si", "No"]
        }
    ]);
}

export function inquirer_local_option (pStrMessage:string) {
    return inquirer.prompt([
        {
            name: "save_pc",
            type: "list",
            message: pStrMessage,
            choices: ["Si", "No"]
        }
    ]);
}