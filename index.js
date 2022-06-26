const instagramLogin = require("./src/instagramLogin.js");
const fs = require("fs");
const profileAPIs = require("./src/profileAPIs.js");
const profileAPIs2 = require("./src/profileAPIs.js");


class client extends profileAPIs {
    async init(param) {
        console.log("Inside")
        this.username = param.username;
        this.password = param.password;
        this.cookie =
            param.cookie == "" || param.cookie === undefined
                ? await new instagramLogin(this.username, this.password).start()
                : param.cookie;
        let filePath = "./sessions.json";
        let fileWorker =
            fs.existsSync(filePath) && param.cookie === undefined
                ? () => {
                      try {
                          let data = JSON.parse(
                              fs.readFileSync(filePath, "utf-8")
                          );
                          if (!data[`${this.username}`]) {
                              !data[`${this.username}`].includes(this.cookie)
                                  ? data[`${this.username}`].push(this.cookie)
                                  : fs.writeFileSync(
                                        filePath,
                                        JSON.stringify(data)
                                    );
                          }
                      } catch (error) {
                        console.log(error)
                      }
                  }
                : () => {
                      try {
                          let data = { [this.username]: [] };
                          data[`${this.username}`].push(this.cookie);
                          fs.writeFileSync(filePath, JSON.stringify(data));
                      } catch (error) {}
                  };
        super.initialize(this.cookie);
        fileWorker();
        console.log("Logged In..");
    }
}
module.exports = client;
