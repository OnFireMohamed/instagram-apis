const axios = require("axios");
const newInboxAPIs = require("./newInboxAPIs.js");
var bigint = require( 'big-integer' )

var lower = 'abcdefghijklmnopqrstuvwxyz';
var upper = lower.toUpperCase();
var numbers = '0123456789'
var ig_alphabet =  upper + lower + numbers + '-_'
var bigint_alphabet = numbers + lower
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
    // https://stackoverflow.com/a/68497086/14779443
    fromShortcode( shortcode )
    {
        var o = shortcode.replace( /\S/g, m =>
        {
        var c = ig_alphabet.indexOf( m )
        var b = bigint_alphabet.charAt( c ) 
        return ( b != "" ) ? b : `<${c}>`
        } ) 
        return bigint( o, 64 ).toString( 10 )
    }
    async getMediaIdFromPostUrl(url) {
        const re = new RegExp("https://www.instagram.com/.*?/(.*?)/");
        let shortcode = url.match(re);
        if (shortcode) {
            let id = this.fromShortcode(shortcode[1]);
            let { data } = await axios.get(`https://i.instagram.com/api/v1/media/${id}/info/`, {headers: this.headers})
            return data.items[0].id;
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