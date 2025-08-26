import { Command } from "commander";

export function seedCommand(program:Command) {
    program.command("seed")
        .option("-g, --generate", "generate")
        .option("-r, --run", "run")
        .option("-i, --init", "init")
        .option("-p, --preview", "preview")
        .option("-s, --reset", "reset")
        .action(async opts => {
        });

}
