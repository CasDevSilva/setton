import inquirer from 'inquirer';

import { welcomeMessage } from '../../utils/messages.js';
import { existFile } from '../../utils/stats.js';
import { dbFile } from '../../../constants/config.js';

import { create } from './create.js';
import { read } from './read.js';
import { update } from './update.js';
import { remove } from './remove.js';
import { setup } from './setup.js';
import { list } from './list.js';
import { archive } from './archive.js';
import { restore } from './restore.js';
import { search } from './search.js';
import { tag } from './tag.js';
import { sync } from './sync.js';
import { config } from './config.js';
import { categorie } from './categorie.js';
import { AppNoteOptions } from '../../../types/AppNoteOptions.js';
import { AppNoteInfo } from '../../../types/AppNoteInfo.js';

async function buildObject () {
    let mObjAppInfo:AppNoteInfo = {
        deploy_database: false,
        choices: [
            "create",
            "read",
            "update",
            "remove"
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
        mObjAppInfo.choices.push(
            "archive",
            "restore",
            "list",
            "search",
            "tag",
            "categorie",
            "sync",
            "config"
        );
    } else {
        mObjAppInfo.choices.push("setup");
    }

    return mObjAppInfo;
}

export async function init () {
    let mObjAppInfo:AppNoteInfo = {
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

export async function deployMainMenu(pObjAppInfo: AppNoteInfo) {

    let mObjDescOptions = {
        "create"    : "Create note",
        "read"      : "Read note",
        "update"    : "Update note",
        "remove"    : "Remove note",
        "setup"     : "Build database",
        "archive"   : "Archive note",
        "restore"   : "Restore note",
        "list"      : "List by area",
        "search"    : "Search by area",
        "tag"       : "Tag options",
        "categorie" : "Create categorie",
        "sync"      : "Sync note",
        "config"    : "View config database"
    }

    let mArrChoices:Array<string> = [];
    let mObjOptions:AppNoteOptions = {
        create   : false,
        read     : false,
        update   : false,
        remove   : false,
        setup    : false,
        list     : false,
        archive  : false,
        restore  : false,
        search   : false,
        tag      : false,
        categorie: false,
        sync     : false,
        config   : false,
    };

    pObjAppInfo.choices.forEach(mRowChoice => {
        mArrChoices.push(mObjDescOptions[mRowChoice]);
    })

    let mObjOptSelected = await inquirer.prompt([
        {
            name: "action_execute",
            type: "list",
            message: "What do you want to do?",
            choices: mArrChoices
        }
    ])

    Object.keys(mObjDescOptions).forEach(mRowKey => {
        if (mObjDescOptions[mRowKey] == mObjOptSelected.action_execute) {
            mObjOptions[mRowKey] = true;
        } else {
            mObjOptions[mRowKey] = false;
        }
    })

    await manageCommands(pObjAppInfo, mObjOptions);
}

export async function manageCommands (pObjAppInfo: AppNoteInfo, pObjOpts: AppNoteOptions) {
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
        config  : config,
        categorie: categorie,
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