#!/usr/bin/env node
import { program } from "commander";
import { init, deployMainMenu, manageCommands } from "../lib/commands/init.js";
import { AppInfo } from "../types/AppInfo.js";
import { AppOptions } from "../types/AppOptions.js";

program.name("setton")
    .description("Development Manager");

program.command("note")
    .option("-c, --create"   , "create")
    .option("-r, --read"     , "read")
    .option("-u, --update"   , "update")
    .option("-d, --remove"   , "delete")
    .option("-e, --setup"    , "setup")
    .option("-l, --list"     , "list")
    .option("-a, --archive"  , "archive")
    .option("-o, --restore"  , "restore")
    .option("-s, --search"   , "search")
    .option("-t, --tag"      , "tag")
    .option("-q, --categorie", "categorie")
    .option("-n, --sync"     , "sync")
    .option("-g, --config"   , "config")
    .action(async opts => {
        let mObjAppInfo:AppInfo = await init();

        if (mObjAppInfo.error.trim()) {
            throw mObjAppInfo.error;
        } else {
            if (Object.keys(opts).length) {
                let mObjOptions: AppOptions = {
                    create   : false,
                    read     : false,
                    update   : false,
                    remove   : false,
                    setup    : false,
                    archive  : false,
                    restore  : false,
                    list     : false,
                    search   : false,
                    tag      : false,
                    categorie: false,
                    sync     : false,
                    config   : false,
                };

                Object.assign(mObjOptions, opts);
                await manageCommands(mObjAppInfo, mObjOptions);
            } else {
                await deployMainMenu(mObjAppInfo);
            }
        }
    });

program.command("project")
    .description("")
    .option("-a, --add", "")
    .option("-l, --list", "")
    .option("-u, --use", "")
    .action(async opts => {
    })

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

program.command("changelog")
    .description("")
    .option("-g, --generate", "generate")
    .option("-s, --status", "status")
    .option("-i, --init", "init")
    .option("-r, --release", "release")
    .action(async opts => {
    });

program.command("seed")
    .option("-g, --generate", "generate")
    .option("-r, --run", "run")
    .option("-i, --init", "init")
    .option("-p, --preview", "preview")
    .option("-s, --reset", "reset")
    .action(async opts => {
    });

program.parse(process.argv);