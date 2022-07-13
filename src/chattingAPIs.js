const data = require("./_constants.js");
const randomString = require("randomstring");
const { v4 } = require("uuid");
const axios = require("axios");
const request = require("request");
const mediaAPIs = require("./mediaAPIs.js");

module.exports = class chattingAPIs extends mediaAPIs {
    initialize(cookie) {
        let { main_headers } = data();
        this.headers = main_headers;
        this.headers.Cookie = cookie;
        super.initialize(this.headers);
    }

    async sendMessageToUserIds({ userIds, message }) {
        let context = `6794371${randomString.generate({
            length: 12,
            charset: "numeric",
        })}`;
        if (!(typeof userIds == "object"))
            throw new Error("userIds parameter should be array");
        let postdata = `recipient_users=[${JSON.stringify(
            userIds
        )}]&action=send_item&is_shh_mode=0&send_attribution=inbox_new_message&client_context=${context}&text=${message}&device_id=android-8cd32a1ba6669cbe&mutation_token=${context}&_uuid=${v4()}&offline_threading_id=${context}`;
        try {
            let { data } = await axios.post(
                "https://i.instagram.com/api/v1/direct_v2/threads/broadcast/text/",
                postdata,
                { headers: this.headers }
            );
            return data;
        } catch ({ response: { data } }) {
            throw new Error(data);
        }
    }
    async makeSeen({threadId, threadItemId}) {
        try {
            await axios.post(
                `https://i.instagram.com/api/v1/direct_v2/threads/${threadId}/items/${threadItemId}/seen/`,
                `_uuid=${v4()}&use_unified_inbox=true&action=mark_seen&thread_id=${threadId}&item_id=${threadItemId}`,
                {headers: this.headers}
            );
        } catch ({ response: { data } }) {
            throw new Error(data);
        }
    }
    async getThreadIdByUserId(userid) {
        try {
            let {
                data: { thread_id },
            } = await axios.post(
                "https://i.instagram.com/api/v1/direct_v2/create_group_thread/",
                `recipient_users=["${userid}"]`,
                { headers: this.headers }
            );
            return thread_id;
        } catch ({ response: { data } }) {
            throw new Error(data);
        }
    }
    async getChatMessages({ thread_id, cursor = "" }) {
        try {
            let url = `https://i.instagram.com/api/v1/direct_v2/threads/${thread_id}/${(() => {
                return cursor == "" ? "" : `?cursor=${cursor}`;
            })()}`;
            let { data } = await axios.get(url, { headers: this.headers });
            return data.thread;
        } catch ({ response: { data } }) {
            throw new Error(data);
        }
    }
    async getChats(cursor = "") {
        try {
            let url = `https://i.instagram.com/api/v1/direct_v2/inbox/?persistentBadging=true&folder=&limit=20&thread_message_limit=20${(() => {
                return cursor == "" ? "" : `&cursor=${cursor}`;
            })()}`;
            let { data } = await axios.get(url, { headers: this.headers });
            return data.inbox;
        } catch ({ response: { data } }) {
            throw new Error(data);
        }
    }
    async getLastMessagingRequests() {
        try {
            let { data } = await axios.get(
                "https://i.instagram.com/api/v1/direct_v2/pending_inbox/",
                { headers: this.headers }
            );
            return data.inbox.threads;
        } catch ({ response: { data } }) {
            throw new Error(data);
        }
    }
    async acceptMessageRequest(thread_id) {
        try {
            let { data } = await axios.post(
                `https://i.instagram.com/api/v1/direct_v2/threads/${thread_id}/approve/`,
                `filter=DEFAULT&_uuid=${v4()}`,
                { headers: this.headers }
            );
            return data;
        } catch ({ response: { data } }) {
            throw new Error(data);
        }
    }
    async restirectChatByUserId(userid) {
        try {
            let { data } = await axios.post(
                "https://i.instagram.com/api/v1/restrict_action/restrict_many/",
                `user_ids=${userid}&_uuid=${v4()}&container_module=restrict_half_sheet`,
                { headers: this.headers }
            );
            return data;
        } catch ({ response: { data } }) {
            throw new Error(data);
        }
    }

    async unRestirectChatByUserId(userid) {
        try {
            let { data } = await axios.post(
                "https://i.instagram.com/api/v1/restrict_action/unrestrict/",
                `_uuid=${v4()}&target_user_id=${userid}&container_module=direct_thread`,
                { headers: this.headers }
            );
            return data;
        } catch ({ response: { data } }) {
            throw new Error(data);
        }
    }
    async deleteChat(thread_id) {
        try {
            let { data } = await axios.post(
                `https://i.instagram.com/api/v1/direct_v2/threads/${thread_id}/hide/`,
                "",
                { headers: this.headers }
            );
            return data;
        } catch ({ response: { data } }) {
            throw new Error(data);
        }
    }
    async unSendMessage({ thread_id, item_id }) {
        try {
            let { data } = await axios.post(
                `https://i.instagram.com/api/v1/direct_v2/threads/${thread_id}/items/${item_id}/delete/`,
                "",
                { headers: this.headers }
            );
            return data;
        } catch ({ response: { data } }) {
            throw new Error(data);
        }
    }
    async sendPhotoToChat({ url, thread_id }) {
        let obj = new photoSend(this.headers.Cookie);
        await obj.send({ url, thread_id });
    }
    async sendVideoToChat({ url, thread_id }) {
        let obj = new videoSend(this.headers.Cookie);
        return await obj.send({ url, thread_id });
    }
};

class photoSend {
    constructor(cookie) {
        this.cookie = cookie;
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
    async send({ url, thread_id }) {
        var time = `1619${randomString.generate({
            length: 12,
            charset: "numeric",
        })}`;
        await this.upload({ url, time });
        return await this.sendPhoto({ thread_id, time });
    }
    async upload({ url, time }) {
        let path = `${time}_0_${randomString.generate({
            length: 10,
            charset: "numeric",
        })}`;
        let bytes = await this.getStream(url);

        let headers = {
            "User-Agent": data().main_userAgent,
            Cookie: this.cookie,
            "Content-Type": "application/octet-stream",
            X_FB_PHOTO_WATERFALL_ID: v4(),
            Host: "i.instagram.com",
            "X-Instagram-Rupload-Params": `{\"retry_context\":\"{\\\"num_step_auto_retry\\\":0,\\\"num_reupload\\\":0,\\\"num_step_manual_retry\\\":0}\",\"media_type\":\"1\",\"upload_id\":\"${time}\",\"xsharing_user_ids\":\"[]\",\"image_compression\":\"{\\\"lib_name\\\":\\\"moz\\\",\\\"lib_version\\\":\\\"3.1.m\\\",\\\"quality\\\":\\\"0\\\"}\"}`,
            "X-Entity-Type": "image/jpeg",
            Offset: "0",
            "X-Entity-Name": path,
            "X-Entity-Length": `${bytes.length}`,
            "Accept-Language": "en-US",
        };
        try {
            let { data } = await axios.post(
                `https://i.instagram.com/rupload_igphoto/${path}`,
                bytes,
                { headers }
            );
        } catch ({ response: { data } }) {
            throw new Error(data);
        }
    }
    async sendPhoto({ thread_id, time }) {
        try {
            let postData = `action=send_item&is_shh_mode=0&thread_ids=[${thread_id}]&send_attribution=inbox&_uuid=${v4()}&allow_full_aspect_ratio=true&upload_id=${time}`;
            let headers = {
                "User-Agent": "Instagram 177.0.0.30.119 Android",
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept-Language": "en-US,en;q=0.9",
                Cookie: this.cookie,
            };
            let { data } = await axios.post(
                "https://i.instagram.com/api/v1/direct_v2/threads/broadcast/configure_photo/",
                postData,
                { headers }
            );
            return data;
        } catch (data) {
            throw new Error(data);
        }
    }
}

class videoSend {
    constructor(cookie) {
        this.cookie = cookie;
        this.uuid = v4();
        this.time = `1619${randomString.generate({
            length: 12,
            charset: "numeric",
        })}`;
        this.mainHeaders = {
            "Segment-Start-Offset": "0",
            "X-Instagram-Rupload-Params": `{\"upload_media_height\":\"540\",\"direct_v2\":\"1\",\"rotate\":\"0\",\"xsharing_user_ids\":\"[]\",\"upload_media_width\":\"540\",\"hflip\":\"false\",\"upload_id\":\"${this.time}\",\"retry_context\":\"{\\\"num_step_auto_retry\\\":0,\\\"num_reupload\\\":0,\\\"num_step_manual_retry\\\":0}\",\"media_type\":\"2\"}`,
            X_FB_VIDEO_WATERFALL_ID: this.uuid,
            "Segment-Type": "3",
            "X-Entity-Name": this.uuid,
            "X-Entity-Length": "",
            Offset: "0",
            "User-Agent": "Instagram 177.0.0.30.119 Android",
            "Accept-Language": "en-US",
            "Content-Type": "application/octet-stream",
            "X-Entity-Type": "video/mp4",
            Host: "i.instagram.com",
            "X-FB-HTTP-Engine": "Liger",
            Cookie: this.cookie,
        };
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
    async send({ url, thread_id }) {
        await this.upload();
        await this.upload1(url);
        await this.upload2();
        return await this.sendVideo(thread_id);
    }
    async upload() {
        try {
            let { data } = await axios.get(
                `https://i.instagram.com/rupload_igvideo/${this.uuid}`,
                { headers: this.mainHeaders }
            );
        } catch ({ response: { data } }) {
            throw new Error(data);
        }
    }
    async upload1(url) {
        try {
            let bytes = await this.getStream(url);
            this.mainHeaders["X-Entity-Length"] = `${bytes.length}`;
            let { data } = await axios.post(
                `https://i.instagram.com/rupload_igvideo/${this.uuid}`,
                bytes,
                { headers: this.mainHeaders }
            );
        } catch ({ response: { data } }) {
            throw new Error(data);
        }
    }

    async upload2() {
        var postdata = `signed_body=SIGNATURE.{\"filter_type\":\"0\",\"timezone_offset\":\"28800\",\"_csrftoken\":\"${
            this.cookie.split("csrftoken=")[1].split(";")[0]
        }\",\"source_type\":\"4\",\"video_result\":\"\",\"_uid\":\"${
            this.uuid
        }\",\"device_id\":\"android-8cd32a1ba6669cbe\",\"_uuid\":\"${v4()}\",\"upload_id\":\"${
            this.time
        }\",\"device\":{\"manufacturer\":\"Asus\",\"model\":\"ASUS_Z01QD\",\"android_version\":25,\"android_release\":\"7.1.2\"},\"audio_muted\":false,\"poster_frame_index\":0}`;
        let headers = {
            "X-Bloks-Is-Panorama-Enabled": "true",
            Cookie: this.cookie,
            "User-Agent": "Instagram 177.0.0.30.119 Android",
            "Accept-Language": "en-US",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            Host: "i.instagram.com",
            "X-FB-HTTP-Engine": "Liger",
        };
        try {
            let { data } = await axios.post(
                `https://i.instagram.com/api/v1/media/upload_finish/?video=1`,
                postdata,
                { headers }
            );
            return data;
        } catch ({ response: { data } }) {
            throw new Error(data);
        }
    }
    async sendVideo(thread_id) {
        let context = randomString.generate({ length: 19, charset: "numeric" });
        var postdata = `action=send_item&is_shh_mode=0&thread_ids=[${thread_id}]&send_attribution=direct_thread&client_context=${context}&_csrftoken=${
            this.cookie.split("csrftoken=")[1].split(";")[0]
        }&video_result=&device_id=android-8cd32a1ba6669cbe&mutation_token=${context}&_uuid=${v4()}&upload_id=${
            this.time
        }&offline_threading_id=${context}`;
        let headers = {
            Cookie: this.cookie,
            "User-Agent": "Instagram 177.0.0.30.119 Android",
            "Accept-Language": "en-US",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            Host: "i.instagram.com",
            "X-FB-HTTP-Engine": "Liger",
        };
        try {
            let { data } = await axios.post(
                `https://i.instagram.com/api/v1/direct_v2/threads/broadcast/configure_video/`,
                postdata,
                { headers }
            );
            return data;
        } catch ({ response: { data } }) {
            throw new Error(data);
        }
    }
}
