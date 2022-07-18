const axios = require("axios");
const newInboxAPIs = require("./newInboxAPIs.js");
const bigint = require('big-integer');
const lower = 'abcdefghijklmnopqrstuvwxyz';
const upper = lower.toUpperCase();
const numbers = '0123456789';
const ig_alphabet =  upper + lower + numbers + '-_';
const bigint_alphabet = numbers + lower;


module.exports = class mediaAPIs extends newInboxAPIs {
    initialize(headers) {
        this.headers = headers;
        super.initialize(headers);
    }

	getShortcodeFromURL(url) {
		const regex = /(?:(?:http|https):\/\/)?(?:www.)?(?:instagram.com|instagr.am|instagr.com)\/(?:\w+)\/(\w+)/i;
		const instagramLink = regex.exec(url);
		if (!instagramLink) return false;
		return instagramLink[1];
	}

	shortcodeToMediaId(shortcode) {
		const o = shortcode.replace(/\S/g, m => {
			const c = ig_alphabet.indexOf(m);
			const b = bigint_alphabet.charAt(c);
			return (b != '') ? b : `<${c}>`;
		});
		return bigint(o, 64).toString(10);
	}

// left here on purpose, in case instagram changes something in their shortcodes
/*    async getMediaIdFromURL(url) {
        try {
            let { data } = await axios.get(url, {headers: this.headers});
            let mediaId = JSON.stringify(data).replace("\\\"", "\"").match(/\\\"media_id\\\":\\\"(.*?)\\\"/);
            if (mediaId) return mediaId[1];
            else throw new Error("Unvalid url")
        } catch ({response: {data}}) {
            throw new Error(data);
        }
    }
*/
	getMediaIdFromURL(url) {
		try {
			const shortcode = this.getShortcodeFromURL(url);
			if (!shortcode) throw new Error('Unvalid url');
			return this.shortcodeToMediaId(shortcode);
		} catch (err) {
			throw new Error(err);
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