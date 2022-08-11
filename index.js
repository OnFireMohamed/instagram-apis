const instagramLogin = require("./src/instagramLogin.js");
const fs = require("fs");
const profileAPIs = require("./src/profileAPIs.js");

class client extends profileAPIs {
    async init({username, password, cookie, saveCookie}) {
        this.username = username;
        this.password = password;
        this.cookie =
            cookie == "" || cookie === undefined
                ? await new instagramLogin(this.username, this.password).start()
                : cookie;
        let filePath = "./sessions.json";
        saveCookie?(
            () => {
                if (fs.existsSync(filePath)) {
                    let data = JSON.parse(fs.readFileSync(filePath, "utf8"));
                    !data[`${username}`].includes(cookie) ? data[`${username}`].push(cookie) : null;
                    fs.writeFileSync(filePath, JSON.stringify(data))
                }
                else {
                    let data = { [username]: [cookie] };
                    fs.writeFileSync(filePath, JSON.stringify(data))
                }
            }
        )() : null;

        super.initialize(this.cookie);
        console.log("Logged In..");
    }
}
module.exports = client;
