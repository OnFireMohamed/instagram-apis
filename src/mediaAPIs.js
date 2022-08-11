const axios = require("axios");
const newInboxAPIs = require("./newInboxAPIs.js");
const {generate} = require("randomstring");
const { v4 } = require("uuid");
const { getVideoDurationInSeconds } = require('get-video-duration');
const myError = require("./myError.js");


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
            throw new myError(data);
        }
    }
    async getMediaInfoFromMediaId(media_id) {
        try {
            let {data: {items} } = await axios.get(`https://i.instagram.com/api/v1/media/${media_id}/info/`, {headers: this.headers})
            return items;
        } catch ({response: {data}}) {
            throw new myError(data);
        }
    }
    async getMediaInfoFromURL(url) {
        try {
            let media_id = await this.getMediaIdFromURL(url);
            let items = await this.getMediaInfoFromMediaId(media_id);
            return items;
        } catch (err) {
            throw new myError(err);
        }
    }
    async likePostByMediaId(media_id) {
        try {
            let { data } = await axios.post(`https://i.instagram.com/api/v1/media/${media_id}/like/`, "", {headers: this.headers})
            return data;
        } catch ({response : { data }}) {
            throw new myError(data);
        }
    }
    async unLikePostByMediaId(media_id) {
        try {
            let { data } = await axios.post(`https://i.instagram.com/api/v1/media/${media_id}/unlike/`, "", {headers: this.headers})
            return data;
        } catch ({response : { data }}) {
            throw new myError(data);
        }
    }
    async deletePost(media_id) {
        try {
            let { data } = await axios.post(`https://i.instagram.com/api/v1/media/${media_id}/delete/`, "", {headers: this.headers})
            return data;
        } catch ({response : { data }}) {
            throw new myError(data);
        }
    }
    async getPostComments(media_id) {
        try {
            let { data } = await axios.get(`https://i.instagram.com/api/v1/media/${media_id}/comments/`, {headers: this.headers})
            return data;
        } catch ({response: { data }}) {
            throw new myError(data);
        }
    }
    async uploadVideoToStory(url) {
        let name = new uploadVideoToStory(this.headers);
        await name.send(url);
    }
}

class uploadVideoToStory {
    constructor(headers) {
        this.upload_id = `1881${generate({charset: "numeric", length: 9})}`
        this.cookie = headers["Cookie"];
        this.uuid = v4()
        this.path = `${generate({length: 32}).toLowerCase()}-0-4146567-lessO-${Date.now()}000`
        console.log(this.path)
        this.mainHeaders = {
            "Segment-Start-Offset": "0",
            "X-Instagram-Rupload-Params": "",
            "Segment-Type": "3",
            "Offset": "0",
            "User-Agent": "Instagram 177.0.0.30.119 Android",
            "Accept-Language": "en-US",
            "Host": "i.instagram.com",
            "X-FB-HTTP-Engine": "Liger",
            "Cookie": this.cookie,
        }
    }
    async getVideoDuration(url) {
        let duration = await getVideoDurationInSeconds(url);
        return parseInt(duration * 1000)
    }
    async getStream(url) {
        return new Promise((resolve, reject) => {
            request.get(
                {
                    uri: url,
                    encoding: null,
                    gzip: true,
                },
                (err, resp, body) => {
                    if (err) reject(err);
                    else resolve(body);
                }
            );
        });
    }
    async send(url) {
        this.mainHeaders["X-Instagram-Rupload-Params"] = `{"upload_media_height":"1280","extract_cover_frame":"1","xsharing_user_ids":"[]","upload_media_width":"720","upload_media_duration_ms":"${(await this.getVideoDuration(url))}","content_tags":"use_default_cover","upload_id":"${this.upload_id}","for_album":"1","retry_context":"{\"num_step_auto_retry\":0,\"num_reupload\":0,\"num_step_manual_retry\":0}","media_type":"2"}`
        await this.upload()
    }
    async upload() {
        let headers = {...this.mainHeaders};
        headers["X_fb_video_waterfall_id"] = `1966${generate({charset: "numeric", length: 8})}_${generate({length: 12}).toUpperCase()}_Mixed_0`
        // console.log(headers)
    }
}