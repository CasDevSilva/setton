#!/usr/bin/env node
import { program } from "commander";
import { noteCommand } from "../lib/commands/note/index.js";
import { changelogCommand } from "../lib/commands/changelog/index.js";
import { projectCommand } from "../lib/commands/project/index.js";
import { workflowCommand } from "../lib/commands/workflow/index.js";
import { seedCommand } from "../lib/commands/seed/index.js";

program.name("setton")
    .description("Development Manager");

noteCommand(program);
projectCommand(program);
workflowCommand(program);
changelogCommand(program);
seedCommand(program);

program.parse(process.argv);