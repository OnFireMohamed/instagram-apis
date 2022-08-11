const data = require("./_constants.js");
const axios = require("axios");
const chattingAPIs = require("./chattingAPIs.js");
const myError = require("./myError.js");


module.exports = class profileAPIs extends chattingAPIs {
    wantedValues = [
        "username",
        "id",
        "full_name",
        "biography",
        "is_private",
        "followed_by_viewer",
        "follows_viewer",
        "profile_pic_url_hd",
        "is_verified",
    ];
    initialize(cookie) {
        let { main_headers } = data();
        this.headers = main_headers;
        this.headers.Cookie = cookie;
        super.initialize(cookie);
    }
    async getUsernameInfo(username) {
        try {
            let {
                data: {
                    data: { user },
                },
            } = await axios.get(
                `https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`,
                { headers: this.headers }
            );
            return user;
        } catch ({ response: { data } }) {
            throw new myError(data);
        }
    }
    async getInfoByUserId(id) {
        try {
            let {
                data: { user },
            } = await axios.get(
                `https://i.instagram.com/api/v1/users/${id}/info/`,
                { headers: this.headers }
            );
            return user;
        } catch ({ response: { data } }) {
            throw new myError(data);
        }
    }
    async followByUserId(userid) {
        try {
            let {
                data: {
                    status,
                    friendship_status: { following },
                },
            } = await axios.post(
                `https://i.instagram.com/api/v1/friendships/create/${userid}/`,
                "",
                { headers: this.headers }
            );
            return {
                following,
                follow_request_sent:
                    status == "ok" && !following ? true : false,
                status,
            };
        } catch ({ response: { data } }) {
            throw new myError(data);
        }
    }
    async followByUsername(username) {
        let {
            info: { id },
        } = await this.getUsernameInfo(username);
        return await this.followByUserId(id);
    }
    async blockByUsername(username) {
        let {
            info: { id },
        } = await this.getUsernameInfo(username);
        await this.blockByUserId(id);
    }
    async blockByUserId(id) {
        try {
            let { data } = await axios.post(
                `https://i.instagram.com/api/v1/friendships/block/${id}/`,
                "",
                { headers: this.headers }
            );
            return data;
        } catch ({ response: { data } }) {
            throw new myError(data);
        }
    }
    async unfollowByUsername(username) {
        let {
            info: { id },
        } = await this.getUsernameInfo(username);
        await this.unfollowByUserId(id);
    }
    async unfollowByUserId(id) {
        try {
            let { data } = await axios.post(
                `https://i.instagram.com/api/v1/friendships/destroy/${id}/`,
                "",
                { headers: this.headers }
            );
            return data;
        } catch ({ response: { data } }) {
            throw new myError(data);
        }
    }
    async getAccountStoriesDataByUserId(userid) {
        try {
            let { data } = await axios.get(
                `https://i.instagram.com/api/v1/feed/user/${userid}/story/`,
                { headers: this.headers }
            );
            return data.reel.items;
        } catch ({ response: { data } }) {
            throw new myError(data);
        }
    }
    async changeUsername(username) {
        try {
            let { data } = await axios.post(
                "https://i.instagram.com/api/v1/accounts/set_username/",
                `username=${username}`,
                { headers: this.headers }
            );
            return data;
        } catch ({ response: { data } }) {
            throw new myError(data);
        }
    }
    async changeBiography(biography) {
        try {
            let { data } = await axios.post(
                "https://i.instagram.com/api/v1/accounts/set_biography/",
                `raw_text=${biography}`,
                { headers: this.headers }
            );
            return data;
        } catch ({ response: { data } }) {
            throw new myError(data);
        }
    }
    async changeFirstName(name) {
        try {
            let { data } = await axios.post(
                "https://i.instagram.com/api/v1/accounts/set_phone_and_name/",
                `first_name=${name}`,
                { headers: this.headers }
            );
            return data;
        } catch ({ response: { data } }) {
            throw new myError(data);
        }
    }
};
