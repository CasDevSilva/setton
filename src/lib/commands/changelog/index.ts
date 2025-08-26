import { Command } from "commander";

export function changelogCommand(program:Command) {
    program.command("changelog")
        .description("")
        .option("-g, --generate", "generate")
        .option("-s, --status", "status")
        .option("-i, --init", "init")
        .option("-r, --release", "release")
        .action(async opts => {
        });
}