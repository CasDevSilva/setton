import figlet from "figlet";

export function welcomeMessage (pStrMessage:string) {
    return new Promise<string>((resolve, reject) => {
        figlet(pStrMessage, (err, info) => {
            if (err) {
                reject(err)
            } else {
                resolve(info)
            }
        })
    })
}