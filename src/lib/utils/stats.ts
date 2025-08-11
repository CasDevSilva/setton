import fs from "fs";

export async function existFile(pStrPathFile:string) {
    return new Promise((resolve, reject)=>{
        fs.stat(pStrPathFile, (err, stats) => {
            if (err) {
                reject(err) ;
            } else {
                resolve(stats);
            }
        })
    })
}