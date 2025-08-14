import inquirer from 'inquirer';

import { welcomeMessage } from "../utils/messages.js";
import { existFile } from "../utils/stats.js";
import { dbFile } from "../../constants/config.js";

import { AppInfo } from "../../types/AppInfo.js";
import { AppOptions } from "../../types/AppOptions.js";

import { create } from "../commands/create.js";
import { read } from "../commands/read.js";
import { update } from "../commands/update.js";
import { remove } from "../commands/remove.js";
import { setup } from "../commands/setup.js";
import { list } from "../commands/list.js";
import { archive } from "../commands/archive.js";
import { restore } from "../commands/restore.js";
import { search } from "../commands/search.js";
import { tag } from "../commands/tag.js";
import { sync } from "../commands/sync.js";
import { config } from "../commands/config.js";

async function buildObject () {
    let mObjAppInfo:AppInfo = {
        deploy_database: false,
        choices: [
            "create",
            "read",
            "update",
            "delete"
        ],
        error: ""
    };

    try {
        let mObjStats = await existFile(dbFile);
        if (mObjStats) {
            mObjAppInfo.deploy_database = true;
        }
    } catch (err) {
        mObjAppInfo.deploy_database = false;
    }

    if (mObjAppInfo.deploy_database) {
        mObjAppInfo.choices.push("list", "archive", "restore", "search", "tag", "sync", "config");
    } else {
        mObjAppInfo.choices.push("setup");
    }

    return mObjAppInfo;
}

export async function init () {
    let mObjAppInfo:AppInfo = {
        deploy_database: false,
        choices: [],
        error: ""
    };

    try {
        let mStrMessage:string = await welcomeMessage("SetTon.js");
        console.log(mStrMessage)

        mObjAppInfo = await buildObject();
    } catch(err) {
        mObjAppInfo.error = err.message;
    }

    return mObjAppInfo;
}

export function deployMainMenu(pObjAppInfo: AppInfo) {

    let mObjDescOptions = {
        "create" : "Create note",
        "read"   : "Read note",
        "update" : "Update note",
        "delete" : "Delete note",
        "list"   : "List notes",
        "archive": "Archive note",
        "restore": "Restore note",
        "search" : "Search notes",
        "tag"    : "Tag note",
        "sync"   : "Sync note",
        "setup"  : "Deploy database",
        "config" : "View config database"
    }

    let mArrChoices:Array<string> = [];

    pObjAppInfo.choices.forEach(mRowChoice => {
        mArrChoices.push(mObjDescOptions[mRowChoice]);
    })

    inquirer.prompt([
        {
            name: "action_execute",
            type: "list",
            message: "What do you want to do?",
            choices: mArrChoices
        }
    ])
    .then(answer => {
        console.log(answer)
    })
    .catch(err => console.log(err));
}

export async function manageCommands (pObjAppInfo: AppInfo, pObjOpts: AppOptions) {
    let mObjExecOpts = {
        create  : create,
        read    : read,
        update  : update,
        remove  : remove,
        setup   : setup,
        list    : list,
        archive : archive,
        restore : restore,
        search  : search,
        tag     : tag,
        sync    : sync,
        config  : config
    }

    let mArrOptFinded = Object.entries(pObjOpts).find(mRowOption => mRowOption[1]);

    if (!pObjAppInfo.deploy_database) {
        if (["list","archive","restore","search","tag","sync","config"].includes(mArrOptFinded[0])) {
            console.log("No puedes ejecutar el comando porque no cuentas con la db");
            return;
        }
    }

    if (mArrOptFinded) {
        try {
            await mObjExecOpts[mArrOptFinded[0]](pObjAppInfo.deploy_database)
        } catch(err) {
            throw err;
        }
    } else {
        console.log("No se encontro un comando para ejecutar.");
    }
}