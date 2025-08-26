import { Command } from "commander";

export function projectCommand(program: Command) {
    program.command("project")
        .description("")
        .option("-a, --add", "")
        .option("-l, --list", "")
        .option("-u, --use", "")
        .action(async opts => {
        })
}