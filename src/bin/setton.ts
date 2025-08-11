#!/usr/bin/env node
import { program } from "commander";
import { init, deployMainMenu, manageCommands } from "../lib/commands/init";
import { AppInfo } from "../types/AppInfo";
import { AppOptions } from "../types/AppOptions";

program.name("setton")
    .option("-c, --create"  , "create")
    .option("-r, --read"    , "read")
    .option("-u, --update"  , "update")
    .option("-d, --remove"  , "delete")
    .option("-e, --setup"   , "setup")
    .option("-l, --list"    , "list")
    .option("-a, --archive" , "archive")
    .option("-o, --restore" , "restore")
    .option("-s, --search"  , "search")
    .option("-t, --tag"     , "tag")
    .option("-n, --sync"    , "sync")
    .option("-g, --config"  , "config")
    .action(async opts => {
        let mObjAppInfo:AppInfo = await init();

        if (mObjAppInfo.error.trim()) {
            throw mObjAppInfo.error;
        } else {
            if (Object.keys(opts).length) {
                let mObjOptions: AppOptions = {
                    create  : false,
                    read    : false,
                    update  : false,
                    delete  : false,
                    setup   : false,
                    list    : false,
                    archive : false,
                    restore : false,
                    search  : false,
                    tag     : false,
                    sync    : false,
                    config  : false
                };

                Object.assign(mObjOptions, opts);
                manageCommands(mObjAppInfo, mObjOptions);
            } else {
                deployMainMenu(mObjAppInfo);
            }
        }
    })

program.parse(process.argv);