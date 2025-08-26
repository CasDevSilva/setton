import { AppInfo } from "../../../types/AppInfo.js";
import { deployMainMenu, init, manageCommands } from "./init.js";
import { AppOptions } from "../../../types/AppOptions.js";
import { Command } from "commander";

export function noteCommand(program: Command) {
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
}