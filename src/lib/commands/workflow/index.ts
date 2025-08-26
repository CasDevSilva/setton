import { Command } from "commander";

export function workflowCommand(program:Command) {
    program.command("workflow")
        .description("")
        .option("-i, --init", "init")
        .option("-a, --add", "add")
        .option("-l, --list", "list")
        .option("-m, --move", "move")
        .option("-n, --next", "next")
        .option("-c, --complete", "complete")
        .option("-r, --remove", "remove")
        .option("-s, --status", "status")
        .action(async opts => {

        });
}
