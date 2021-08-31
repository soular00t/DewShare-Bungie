function nl2br (str, is_xhtml) {   
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';    
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
}
(function ($) {

    $.fn.hasOverflow = function () {
        return this.get(0) ? this.get(0).scrollHeight > this.innerHeight() : false;
    }

})(jQuery);

function getRequest(u, callback) {
    try {
        $.ajax({
            url: u,
            type: "GET",
            dataType: "json",
            error: function (error) {
                callback(null);
            },
            success: function (data) {
                if (data)
                    callback(data);
                else
                    callback(null);
            }
        });
    }
    catch (e) {
        callback(null);
    }
};

function getCallbackData(p, o) {
    try {
        if (!p || !o)
            return undefined;
        else {
            return p.split('.').reduce(function (prev, curr) {
                return prev ? prev[curr] : undefined
            }, o || self)
        }
    }
    catch (e) {
        return undefined;
    }
}

//function getPageRequest(address, callback) {
//    try
//    {
//        $.ajax({
//            url: address,
//            type: "GET",
//            dataType: "json",
//            error: function (error) {
//                callback(null);
//            },
//            success: function (data) {
//                callback(data);
//            }
//        });
//    }
//    catch (e) {
//        callback(null);
//    }
//};
//function getPageRequestYAPI(link, callback) {
//    try
//    {
//        var m = getDataYAPI(link);
//        if (m && m[7].length == 11) {
//            var address = 'https://www.googleapis.com/youtube/v3/videos?id=' + m[7] + '&part=contentDetails&key=AIzaSyCjkl45hTHT5YS8jjjuwz2aHbI_vnBloIg';
//            $.ajax({
//                url: address,
//                type: "GET",
//                dataType: "json",
//                error: function (error) {
//                    callback(null);
//                },
//                success: function (data) {
//                    callback(data);
//                }
//            });
//        }
//        callback(null);
//    }
//    catch (e)
//    {
//        callback(null);
//    }
//};
//function getPageRequestSAPI(link, callback) {
//    try {
//        var m = getDataSAPI(link);
//        if (m && m[0]) {
//            var address = 'https://api.streamable.com/videos/' + m[0];
//            $.ajax({
//                url: address,
//                type: "GET",
//                dataType: "json",
//                error: function (error) {
//                    callback(null);
//                },
//                success: function (data) {
//                    callback(data);
//                }
//            });
//        }
//        callback(null);
//    }
//    catch (e) {
//        callback(null);
//    }
//};
//function getDataYAPI(link) {
//    try
//    {
//        var r = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
//        var m = link.match(r);
//        if (m) {
//            return m;
//        }
//        return [];
//    }
//    catch (e) {
//        return [];
//    }
//};
//function getDataSAPI(link) {
//    try
//    {
//        var r = /[^/]+(?=$|$)/;
//        var m = link.match(r);
//        if (m) {
//            return m;
//        }
//        return [];
//    }
//    catch (e) {
//        return [];
//    }
//};

//function getMediaLengthFromDomainType(url, type, domain, callback) {
//    try
//    {
//        var h = getDomainType(type, domain);
//        if (h) {
//            var a = null;
//            var m = null;
//            var l = null;
//            switch (h.toLowerCase()) {
//                case "youtube":
//                    m = getDataYAPI(url);
//                    if (m && m[7].length == 11)
//                        a = 'https://www.googleapis.com/youtube/v3/videos?id=' + m[7] + '&part=contentDetails&key=AIzaSyCjkl45hTHT5YS8jjjuwz2aHbI_vnBloIg';
//                    break;
//                case "streamable":
//                    m = getDataSAPI(url);
//                    if (m && m[0])
//                        a = 'https://api.streamable.com/videos/' + m[0];
//                    break;
//                default: break;
//            }
//            if (a) {
//                $.ajax({
//                    url: a,
//                    type: "GET",
//                    dataType: "json",
//                    error: function (error) {
//                        callback(null);
//                    },
//                    success: function (data) {
//                        switch (h.toLowerCase()) {
//                            case "youtube":
//                                if (!data && !data.items[0].contentDetails.duration)
//                                    callback(null);
//                                else {
//                                    l = getDurationFromYAPI(data.items[0].contentDetails.duration);
//                                    if (l)
//                                        callback(l);
//                                }
//                                break;
//                            case "streamable":
//                                if (!data && !data.files.mp4.duration)
//                                    callback(null);
//                                else {
//                                    l = getDurationFromSAPI(data.files.mp4.duration);
//                                    if (l)
//                                        callback(l);
//                                }
//                                break;
//                            default:
//                                callback(null);
//                        }
//                    }
//                });
//            }
//        }
//    }
//    catch (e)
//    {
//        callback(null);
//    }
//};
//function getMediaThumbsFromDomainType(url, type, domain, callback) {
//    try
//    {
//        var h = getDomainType(type, domain);
//        if (h) {
//            var a = null;
//            var m = null;
//            var l = null;
//            switch (h.toLowerCase()) {
//                case "youtube":
//                    m = getDataYAPI(url);
//                    if (m && m[7].length == 11)
//                        callback([
//                            'http://img.youtube.com/vi/' + m[7] + '/1.jpg',
//                            'http://img.youtube.com/vi/' + m[7] + '/2.jpg',
//                            'http://img.youtube.com/vi/' + m[7] + '/3.jpg',
//                            'http://img.youtube.com/vi/' + m[7] + '/mqdefault.jpg',
//                        ]);
//                    break;
//                case "streamable":
//                    getPageRequestSAPI(url, function (data) {
//                        if (data) {
//                            var t = (data.thumbnail_url)
//                                ? data.thumbnail_url
//                                : null;
//                            var s = (data.source)
//                                ? getDataYAPI(data.source)
//                                : null;
//                            if (t && !s)
//                                callback([t]);
//                            else if (s && s[7] && s[7].length == 11)
//                                callback([
//                                    'http://img.youtube.com/vi/' + s[7] + '/1.jpg',
//                                    'http://img.youtube.com/vi/' + s[7] + '/2.jpg',
//                                    'http://img.youtube.com/vi/' + s[7] + '/3.jpg',
//                                    'http://img.youtube.com/vi/' + s[7] + '/mqdefault.jpg',
//                                ]);
//                            else
//                                callback(null);
//                        }
//                    });
//                    break;
//                default: break;
//            }
//        }
//    }
//    catch (e)
//    {
//        callback(null);
//    }
//};

//function getDomainType(type, domain) {
//    if (!isValidDomain(type, domain))
//        return "";
//    switch (domain.toLowerCase()) {
//        case "youtu.be":
//        case "youtube.com":
//            return "youtube";
//        case "streamable.com":
//            return "streamable";
//        default:
//            return "";
//    }
//};

//var Domains = {
//    videos: [
//        "youtube.com",
//        "youtu.be",
//        "streamable.com",
//        "gfycat.com"
//    ],
//    images: [
//        "imgur.com",
//        "i.imgur.com"
//    ]
//}
//function getTypeFromDomain(domain)
//{
//    try
//    {
//        var flag = (Domains.videos.includes(domain.toLowerCase()) ||
//                    Domains.images.includes(domain.toLowerCase()));
//        if (flag) {
//            switch (domain.toLowerCase()) {
//                case "youtu.be":
//                case "youtube.com":
//                case "gfycat.com":
//                case "streamable.com":
//                    return "video";
//                case "imgur.com":
//                case "i.imgur.com":
//                    return "screenshot";
//                default:
//                    return null;
//            }
//        }
//        return null;
//    }
//    catch (e)
//    {
//        return null;
//    }
//};

//function isValidDomain(type, domain) {
//    if (!type || !domain)
//        return false;
//    switch (type.toLowerCase()) {
//        case "video": return (Domains && Domains.videos.includes(domain.toLowerCase()));
//        case "screenshot": return (Domains && Domains.images.includes(domain.toLowerCase()));
//        default:      return false;
//    }
//};

//function getDate(date) {
//    try {
//        return (date)
//            ? new Date(Date.parse(date)).toLocaleDateString()
//            : new Date().toLocaleDateString();
//    }
//    catch (e) {
//        return new Date().toLocaleDateString();
//    }
//};
//function getDateUTC(date) {
//    try {
//        var s = parseInt(date);
//        var d = new Date(0);
//            d.setUTCSeconds(s);
//        if (d)
//            return d.toLocaleDateString();
//        return new Date().toLocaleDateString();
//    }
//    catch (e) {
//        return new Date().toLocaleDateString();
//    }
//};

//function getDateFromUTC(date) {
//    try
//    {
//        var s = parseInt(date);
//        if (s) {
//            var d = new Date(0);
//                d.setUTCSeconds(s);
//            return d.toLocaleDateString();
//        }
//        else
//            return new Date().toLocaleDateString();
//    }
//    catch (e) {
//        return new Date().toLocaleDateString();
//    }
//};

//function getDurationFromYAPI(time) {
//    try
//    {
//        var o = [];
//        var d = 0;
//        var m = time.match(/P(?:(\d*)Y)?(?:(\d*)M)?(?:(\d*)W)?(?:(\d*)D)?T(?:(\d*)H)?(?:(\d*)M)?(?:(\d*)S)?/i);
//        var p = [
//          { // years
//              pos: 1,
//              multiplier: 86400 * 365
//          },
//          { // months
//              pos: 2,
//              multiplier: 86400 * 30
//          },
//          { // weeks
//              pos: 3,
//              multiplier: 604800
//          },
//          { // days
//              pos: 4,
//              multiplier: 86400
//          },
//          { // hours
//              pos: 5,
//              multiplier: 3600
//          },
//          { // minutes
//              pos: 6,
//              multiplier: 60
//          },
//          { // seconds
//              pos: 7,
//              multiplier: 1
//          }
//        ];
//        for (var i = 0; i < p.length; i++) {
//            if (typeof m[p[i].pos] != 'undefined') {
//                d += parseInt(m[p[i].pos]) * p[i].multiplier;
//            }
//        }
//        if (d > 3599) {
//            output.push(parseInt(d / 3600));
//            d %= 3600;
//        }
//        o.push(('0' + parseInt(d / 60)).slice(-2));
//        o.push(('0' + d % 60).slice(-2));
//        if (o.length === 1) return '00:00:' + o.join(':'); //Returns 00:00:??
//        if (o.length === 2) return '00:' + o.join(':');    //Returns 00:??:??
//        if (o.length === 3) return o.join(':');            //Returns ??:??:??
//        return '00:00:00';                                 //Returns 00:00:00

//    }
//    catch (e) {
//        return '00:00:00';
//    }
//};
//function getDurationFromSAPI(time) {
//    try
//    {
//        if (time)
//            return new Date(time * 1000).toISOString().substr(11, 8);
//        return '00:00:00';
//    }
//    catch (e) {
//        return '00:00:00';
//    }
//};
//function getDurationFromGAPI(time) {
//    try {
//        if (time)
//            return new Date(time * 1000).toISOString().substr(11, 8);
//        return '00:00:00';
//    }
//    catch (e) {
//        return '00:00:00';
//    }
//};

//function getThumbnailsFromData(cache) {
//    try
//    {
//        if (cache)
//        {
//            var t = (cache.data.thumbnail) ? cache.data.thumbnail : null;
//            var m = (cache.data.media.oembed.thumbnail_url) ? cache.data.media.oembed.thumbnail_url : null;
//            if (m)
//                return [m];
//            if (t)
//                return [t];
//        }
//        return [];
//    }
//    catch (e)
//    {
//        return [];
//    }
//};

function getMapImage(thumb, name) {
    if (name) {
        var target = name.toLowerCase();
        var parent = (thumb)
            ? "maps"
            : "maps";
        if (target.includes("bunkerworld") || target.includes("standoff")      || target.includes("stand off"))    return "/site/src/images/" + parent + "/bunkerworld.png";
        if (target.includes("cyberdyne")   || target.includes("the pit")       || target.includes("thepit"))       return "/site/src/images/" + parent + "/cyberdyne.png";
        if (target.includes("deadlock")    || target.includes("high ground")   || target.includes("highground"))   return "/site/src/images/" + parent + "/deadlock.png";
        if (target.includes("turf")        || target.includes("s3d_turf")      || target.includes("icebox"))       return "/site/src/images/" + parent + "/turf.png";
        if (target.includes("zanzibar")    || target.includes("lastresort")    || target.includes("last resort"))  return "/site/src/images/" + parent + "/zanzibar.png";
        if (target.includes("avalanche")   || target.includes("s3d_avalanche") || target.includes("diamondback"))  return "/site/src/images/" + parent + "/avalanche.png";
        if (target.includes("chill")       || target.includes("narrows"))       return "/site/src/images/" + parent + "/chill.png";
        if (target.includes("edge")        || target.includes("s3d_edge"))      return "/site/src/images/" + parent + "/edge.png";
        if (target.includes("riverworld")  || target.includes("valhalla"))      return "/site/src/images/" + parent + "/riverworld.png";
        if (target.includes("shrine")      || target.includes("sandtrap"))      return "/site/src/images/" + parent + "/shrine.png";
        if (target.includes("hangem-high") || target.includes("hang"))          return "/site/src/images/" + parent + "/hangem-high.png";
        if (target.includes("reactor")     || target.includes("s3d_reactor"))   return "/site/src/images/" + parent + "/reactor.png";
        if (target.includes("flatgrass")) return "/site/src/images/" + parent + "/flatgrass.png";
        if (target.includes("guardian"))  return "/site/src/images/" + parent + "/guardian.png";
        if (target.includes("lockout"))   return "/site/src/images/" + parent + "/lockout.png";
        if (target.includes("mainmenu"))  return "/site/src/images/" + parent + "/mainmenu.png";
        if (target.includes("station"))   return "/site/src/images/" + parent + "/station.png";
        if (target.includes("unknown"))   return "/site/src/images/" + parent + "/unknown.png";
        return "/site/src/images/" + parent + "/unknown.png";
    }
    return "/site/src/images/" + parent + "/unknown.png";
};
function getVariantImage(name) {
    if (name) {
        var target = name.toLowerCase();
        if (target.includes("undefined") || target.includes("unknown"))  return "/site/src/images/gametypes/undefined.png";
        if (target.includes("zombiez")   || target.includes("zombies"))  return "/site/src/images/gametypes/zombiez.png";
        if (target.includes("slayer")    || target.includes("ffa"))      return "/site/src/images/gametypes/slayer.png";
        if (target.includes("forge")     || target.includes("multiple")) return "/site/src/images/gametypes/forge.png";
        if (target.includes("assault"))     return "/site/src/images/gametypes/assault.png";
        if (target.includes("ctf"))         return "/site/src/images/gametypes/ctf.png";
        if (target.includes("infection"))   return "/site/src/images/gametypes/infection.png";
        if (target.includes("juggernaut"))  return "/site/src/images/gametypes/juggernaut.png";
        if (target.includes("koth"))        return "/site/src/images/gametypes/koth.png";
        if (target.includes("oddball"))     return "/site/src/images/gametypes/oddball.png";
        if (target.includes("territories")) return "/site/src/images/gametypes/territories.png";
        if (target.includes("vip"))         return "/site/src/images/gametypes/vip.png";
        if (target.includes("none"))        return "/site/src/images/gametypes/none.png";
        return "/site/src/images/gametypes/none.png";
    }
    return "/site/src/images/gametypes/none.png";
};

function getDayFromDate(date) {
    var week = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ];
    var mnth = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
    var wday = week[date.getDay()];
    var mday = mnth[date.getMonth()];
    return "{0}, {1} {2} {3} {4}".format(wday, mday, date.getDate(), date.getFullYear(), date.toLocaleTimeString());
}

String.prototype.format = function () {
    var result = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp("\\{" + i + "\\}", "gi");
        result = result.replace(regexp, arguments[i]);
    }
    return result;
}