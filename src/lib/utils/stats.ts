import fs, { Stats } from "fs";

export async function existFile(pStrPathFile:string) : Promise<Stats | null> {
    return new Promise((resolve, reject)=>{
        fs.stat(pStrPathFile, (err, stats) => {
            if (err) {
                reject(err);
            } else {
                resolve(stats);
            }
        })
    })
}