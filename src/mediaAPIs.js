const axios = require("axios");
const newInboxAPIs = require("./newInboxAPIs.js");

module.exports = class mediaAPIs extends newInboxAPIs {
    initialize(headers) {
        this.headers = headers;
        super.initialize(headers);
    }

    async getMediaIdFromURL(url) {
        try {
            let { data } = await axios.get(url, {headers: this.headers});
            let mediaId = JSON.stringify(data).replace("\\\"", "\"").match(/\\\"media_id\\\":\\\"(.*?)\\\"/);
            if (mediaId) return mediaId[1];
            else throw new Error("Unvalid url")
        } catch ({response: {data}}) {
            throw new Error(data);
        }
    }
    async getMediaInfoFromMediaId(media_id) {
        try {
            let {data: {items} } = await axios.get(`https://i.instagram.com/api/v1/media/${media_id}/info/`, {headers: this.headers})
            return items;
        } catch ({response: {data}}) {
            throw new Error(data);
        }
    }
    async getMediaInfoFromURL(url) {
        try {
            let media_id = await this.getMediaIdFromURL(url);
            let items = await this.getMediaInfoFromMediaId(media_id);
            return items;
        } catch (err) {
            throw new Error(err);
        }
    }
    async likePostByMediaId(media_id) {
        try {
            let { data } = await axios.post(`https://i.instagram.com/api/v1/media/${media_id}/like/`, "", {headers: this.headers})
            return data;
        } catch ({response : { data }}) {
            throw new Error(data);
        }
    }
    async unLikePostByMediaId(media_id) {
        try {
            let { data } = await axios.post(`https://i.instagram.com/api/v1/media/${media_id}/unlike/`, "", {headers: this.headers})
            return data;
        } catch ({response : { data }}) {
            throw new Error(data);
        }
    }
    async deletePost(media_id) {
        try {
            let { data } = await axios.post(`https://i.instagram.com/api/v1/media/${media_id}/delete/`, "", {headers: this.headers})
            return data;
        } catch ({response : { data }}) {
            throw new Error(data);
        }
    }
    async getPostComments(media_id) {
        try {
            let { data } = await axios.get(`https://i.instagram.com/api/v1/media/${media_id}/comments/`, {headers: this.headers})
            return data;
        } catch ({response: { data }}) {
            throw new Error(data);
        }
    }
}