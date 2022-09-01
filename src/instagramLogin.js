const axios = require("axios");
const { v4 } = require("uuid");
const readLine = require("readline-sync");
const data = require("./_constants.js");
const myError = require("./myError.js");

module.exports = class {
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.login_headers = data().login_headers;
    }

    async start() {
        let { headers } = await axios.get(
            "https://i.instagram.com/api/v1/si/fetch_headers/?challenge_type=signup"
        );
        this.cookie = await this.filterCookie(headers["set-cookie"]);
        this.login_headers.Cookie = this.cookie;
        return await this.login();
    }

    async login() {
        try {
            let { data, headers } = await axios.post(
                "https://i.instagram.com/api/v1/accounts/login/",
                `username=${this.username}&password=${
                    this.password
                }&device_id=${v4()}&login_attempt_count=0`,
                { headers: this.login_headers }
            );
            return await this.filterCookie(headers["set-cookie"]);
        } catch ({ response: { data } }) {
            if (data.message === "challenge_required") {
                let apiPath = data.challenge.api_path;
                return await this.postChoice(apiPath);
            }
        }
        throw new myError("Error In Login");
    }

    async postChoice(path) {
        let answer = readLine.question(
            "Enter Your Choice, 0 to Send Code to Your Phone, 1 to Email : "
        );
        while (answer !== "0" && answer !== "1") {
            console.log("Not a Choice !");
            await new Promise((param) => setTimeout(param, 2000));
            console.clear();
            answer = readLine.question(
                "Enter Your Choice, 0 to Send Code to Your Phone, 1 to Email : "
            );
        }
        try {
            let {
                data: {
                    status,
                    step_data: { contact_point },
                },
            } = await axios.post(
                `https://i.instagram.com/api/v1${path}`,
                `choice=${answer}`,
                { headers: this.login_headers }
            );
            return await this.postCode(path, contact_point);
        } catch (error) {
            console.log("Not a Valid Choice !");
            await new Promise((param) => setTimeout(param, 2000));
            console.clear();
            return await this.postChoice(path);
        }
    }

    async postCode(path, sentWhere) {
        let code = readLine.question(
            `Enter Code which sent to ${sentWhere} : `
        );
        while (code === "") {
            console.log("Enter A Valid Code !");
            await new Promise((param) => setTimeout(param, 2000));
            console.clear();
            code = readLine.question(
                `Enter Code which sent to ${sentWhere} : `
            );
        }
        try {
            let { data, headers } = await axios.post(
                `https://i.instagram.com/api/v1${path}`,
                `security_code=${code}`,
                { headers: this.login_headers }
            );
            return await this.filterCookie(headers["set-cookie"]);
        } catch ({
            response: {
                data: { message },
            },
        }) {
            if (message.includes("check the code we sent you and try again")) {
                console.log("Error Code, Wait to Try Again.");
                await new Promise((param) => setTimeout(param, 2000));
                console.clear();
                return await this.postCode(path, sentWhere);
            }
        }
    }
    async filterCookie(cookieArray) {
		if (!cookieArray) return '';
        let val = cookieArray.map((cookie) => {
            return cookie.split(";")[0];
        });
        return val.join("; ");
    }
};
