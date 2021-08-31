var domainNames = {
    Videos: [
        "gaming.youtube.com",
        "youtube.com",
        "youtu.be",
        "streamable.com",
        "gfycat.com"
    ],
    Images: [
        "imgur.com",
        "i.imgur.com"
    ]
};
var domainMatches = {
    0: /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/,
    1: /[^/]+(?=$|$)/,
};

function getTypeFromDomain(d) {
    try
    {
        if (d) {
            var flag = (domainNames.Videos.includes(d.toLowerCase()) ||
                        domainNames.Images.includes(d.toLowerCase()));
            if (flag) {
                switch (d.toLowerCase()) {
                    case "youtu.be":
                    case "youtube.com":
                    case "gaming.youtube.com":
                    case "gfycat.com":
                    case "streamable.com":
                        return "video";
                    case "imgur.com":
                    case "i.imgur.com":
                        return "screenshot";
                    default:
                        return "";
                }
            }
        }
        return "";
    }
    catch (e) {
        return "";
    }
};
function getHostFromDomain(d) {
    try
    {
        if (d) {
            var flag = (domainNames.Videos.includes(d.toLowerCase()) ||
                        domainNames.Images.includes(d.toLowerCase()));
            if (flag) {
                switch (d.toLowerCase()) {
                    case "youtu.be":
                    case "youtube.com":
                    case "gaming.youtube.com":
                        return "youtube";
                    case "streamable.com":
                        return "streamable";
                    case "gfycat.com":
                        return "gcat";
                    case "imgur.com":
                    case "i.imgur.com":
                        return "imgur";
                    default:
                        return "";
                }
            }
        }
        return "";
    }
    catch (e) {
        consile.log(e.message);
        return "";
    }
};

function getDateFromFMT(d) {
    try
    {
        return (d)
            ? new Date(Date.parse(d)).toLocaleDateString()
            : new Date().toLocaleDateString();
    }
    catch (e) {
        return new Date().toLocaleDateString();
    }
};
function getDateFromUTC(d) {
    try
    {
        var s = parseInt(d);
        var r = new Date(0);
            r.setUTCSeconds(s);
        return (r)
            ? r.toLocaleDateString()
            : new Date().toLocaleDateString();
    }
    catch (e) {
        return new Date().toLocaleDateString();
    }
};

function getTimeFromISO(t) {
    try
    {
        var o = [];
        var d = 0;
        var m = t.match(/P(?:(\d*)Y)?(?:(\d*)M)?(?:(\d*)W)?(?:(\d*)D)?T(?:(\d*)H)?(?:(\d*)M)?(?:(\d*)S)?/i);
        var p = [
          { // years
              pos: 1,
              multiplier: 86400 * 365
          },
          { // months
              pos: 2,
              multiplier: 86400 * 30
          },
          { // weeks
              pos: 3,
              multiplier: 604800
          },
          { // days
              pos: 4,
              multiplier: 86400
          },
          { // hours
              pos: 5,
              multiplier: 3600
          },
          { // minutes
              pos: 6,
              multiplier: 60
          },
          { // seconds
              pos: 7,
              multiplier: 1
          }
        ];
        for (var i = 0; i < p.length; i++) {
            if (typeof m[p[i].pos] != 'undefined') {
                d += parseInt(m[p[i].pos]) * p[i].multiplier;
            }
        }
        if (d > 3599) {
            output.push(parseInt(d / 3600));
            d %= 3600;
        }
        o.push(('0' + parseInt(d / 60)).slice(-2));
        o.push(('0' + d % 60).slice(-2));
        if (o.length === 1) return '00:00:' + o.join(':');
        if (o.length === 2) return '00:' + o.join(':');   
        if (o.length === 3) return o.join(':');           
        return '00:00:00';
    }
    catch (e) {
        return '00:00:00';
    }
};
function getTimeFromSEC(t) {
    try
    {
        if (t)
            return new Date(t * 1000).toISOString().substr(11, 8);
        return '00:00:00';
    }
    catch (e) {
        return '00:00:00';
    }
};

function getDataFromURL(i, u) {
    try
    {
        var r = domainMatches[i];
        if (r) {
            var m = u.match(r);
            return (m) ? m : [];
        }
        return [];
    }
    catch (e) {
        console.log(e.message);
        return [];
    }
};

function getLogoFromHost(h)
{
    try
    {
        if (h) {
            switch (h.toLowerCase()) {
                case "youtube":    return "logo_youtube";
                case "streamable": return "logo_streamable";
                case "gcat":       return "logo_gfycat";
                case "imgur":      return "logo_imgur";
                default: return "logo_reddit";
            }
        }
        return "logo_reddit";
    }
    catch (e) {
        return "logo_reddit";
    }
};

function getMediaThumbsFromDomain(f, callback) {
    try
    {
        var u = f.Media.Url;
        var h = f.Media.Host;
        if (u && h) {
            var a = null;
            var m = null;
            switch (h.toLowerCase())  {
                case "gcat": {

                    m = getDataFromURL(1, u);
                    if (m && m[0] && m[0].length >= 1)
                        getRequest('https://api.gfycat.com/v1test/gfycats/' + m[0], function (cb) {
                            var d1 = getCallbackData('gfyItem.max1mbGif', cb);
                            var d2 = getCallbackData('gfyItem.thumb100PosterUrl', cb);
                            var d3 = getCallbackData('Media.Thumb_Preview', f);
                            var d4 = getCallbackData('Media.Thumb_Embed', f);
                            var d5 = getCallbackData('Media.Thumb_Default', f);
                            if (d1 && d2)
                                callback([d1, d2]);
                            else if (d3) {
                                if (d4) callback([d4, d3]);
                                else callback([d3]);
                            }
                            else if (d5) {
                                if (d4) callback([d4, d5]);
                                else callback([d4]);
                            }
                        });
                    else
                        callback([]);
                    break;

                };
                case "youtube": {

                    m = getDataFromURL(0, u);
                    if (m && m[7] && m[7].length === 11)
                        callback([
                            'https://i.ytimg.com/vi/' + m[7] + '/1.jpg',
                            'https://i.ytimg.com/vi/' + m[7] + '/2.jpg',
                            'https://i.ytimg.com/vi/' + m[7] + '/3.jpg',
                            'https://i.ytimg.com/vi/' + m[7] + '/mqdefault.jpg',
                        ]);
                    else
                        callback([]);
                    break;

                };
                case "streamable": {

                    m = getDataFromURL(1, u);
                    if (m && m[0] && m[0].length >= 1)
                        getRequest('https://api.streamable.com/videos/' + m[0], function (cb) {
                            var d1 = getCallbackData('source', cb);
                            var d2 = getCallbackData('thumbnail_url', cb);
                            if (d1) {
                                m = getDataFromURL(0, d1);
                                if (m && m[7] && m[7].length === 11)
                                    callback([
                                        'https://i.ytimg.com/vi/' + m[7] + '/1.jpg',
                                        'https://i.ytimg.com/vi/' + m[7] + '/2.jpg',
                                        'https://i.ytimg.com/vi/' + m[7] + '/3.jpg',
                                        'https://i.ytimg.com/vi/' + m[7] + '/mqdefault.jpg',
                                    ]);
                            }
                            else if (d2) {
                                callback([d2]);
                            }
                        });
                    else
                        callback([]);
                    break;

                };
                default:
                    callback([]);
            }
        }
    }
    catch (e) {
        console.log(e.message);
        callback([]);
    }
};
function getMediaLengthFromDomain(f, callback) {
    try
    {
        var u = f.Media.Url;
        var h = f.Media.Host;
        if (u && h) {

            var l = null;
            var m = null;
            var flag = false;
            switch (h.toLowerCase()) {
                case "gcat": {

                    m = getDataFromURL(1, u);
                    if (m && m[0] && m[0].length >= 1)
                        getRequest('https://api.gfycat.com/v1test/gfycats/' + m[0], function (cb) {
                            var d1 = getCallbackData('gfyItem.numFrames', cb);
                            var d2 = getCallbackData('gfyItem.frameRate', cb);
                            if (d1 && d2) {
                                var n = parseInt(d1);
                                var r = parseInt(d2);
                                if (n && r) {
                                    if (n === 0) n = 1;
                                    if (r === 0) r = 1;
                                    l = getTimeFromSEC((n / r));
                                    callback(l ? l : "00:00:00");
                                }
                            }
                        });
                    break;

                }
                case "youtube": {

                    m = getDataFromURL(0, u);
                    if (m && m[7] && m[7].length === 11)
                        getRequest('https://www.googleapis.com/youtube/v3/videos?id=' + m[7] + '&part=contentDetails&key=AIzaSyCjkl45hTHT5YS8jjjuwz2aHbI_vnBloIg', function (cb) {
                            var d = getCallbackData('items.0.contentDetails.duration', cb);
                            if (d !== undefined) {
                                l = getTimeFromISO(d);
                                callback(l ? l : "00:00:00");
                            }
                        });
                    break;

                }
                case "streamable": {

                    m = getDataFromURL(1, u);
                    if (m && m[0] && m[0].length >= 1)
                        getRequest('https://api.streamable.com/videos/' + m[0], function (cb) {
                            var d = getCallbackData('files.mp4.duration', cb);
                            if (d) {
                                l = getTimeFromSEC(d);
                                callback(l ? l : "00:00:00");
                            }
                        });
                    break;

                }
                default:
                    callback("00:00:00");
            }
        }
    }
    catch (e) {
        console.log(e.message);
        callback("00:00:00");
    }
};

var animationsTimer;
var animations = {

    showScrub: function (e) {
        try {
            var t = $(e.target)[0];
            var p = $(t.parentNode)[0];
            var c = $(p).children('.content_slot_middle_thumb')[0];
            if (c) {
                var d = $(c).data('key')[0];
                if (d && d.Type && d.Data && d.Domain) {
                    switch (d.Type.toLowerCase()) {
                        case "video": {
                            if (d.Data.length <= 1)
                                break;
                            else {
                                var scrubAnimate = null;
                                switch (d.Domain.toLowerCase()) {
                                    case "gcat": {

                                        scrubAnimate = function () {
                                            if (d.Data[0]) {
                                                animationsTimer = setTimeout(function () {
                                                    $(c).attr("src", d.Data[0]);
                                                }, 1000);                                                
                                            }
                                        };
                                        scrubAnimate();
                                        break;

                                    }
                                    case "youtube":
                                    case "streamable": {
                                        if (!d.Data[0] && !d.Data[1] && !d.Data[2])
                                            break;
                                        else
                                        {
                                            scrubAnimate = function () {
                                                if (d.Data[0] && d.Data[1] && d.Data[2]) {
                                                    animationsTimer = setTimeout(function () {
                                                        $(c).attr("src", d.Data[0]);
                                                        animationsTimer = setTimeout(function () {
                                                            $(c).attr("src", d.Data[1]);
                                                            animationsTimer = setTimeout(function () {
                                                                $(c).attr("src", d.Data[2]);
                                                                scrubAnimate();
                                                            }, 1000);
                                                        }, 1000);
                                                    }, 1000);
                                                }
                                            };
                                            scrubAnimate();
                                            break;
                                        }
                                    }
                                    default: break;
                                }
                            }
                            break;
                        }
                        case "image": break;
                        default: break;
                    }
                }
            }
        }
        catch (e) {
            clearTimeout(animationsTimer);
        }
    },
    hideScrub: function (e) {
        try {
            var t = $(e.target)[0];
            var p = $(t.parentNode)[0];
            var c = $(p).children('.content_slot_middle_thumb')[0];
            if (c) {
                var d = $(c).data('key')[0];
                if (d && d.Type && d.Data) {
                    switch (d.Type.toLowerCase()) {
                        case "video": {
                            if (d.Data.length <= 1)
                                break;
                            else {
                                switch (d.Domain.toLowerCase()) {
                                    case "gcat": {
                                        $(c).attr("src", d.Data[1] ? d.Data[1] : "");
                                        break;
                                    }
                                    case "youtube":
                                    case "streamable": {
                                        $(c).attr("src", d.Data[3] ? d.Data[3] : "");
                                        break;
                                    }
                                    default: break;
                                }
                            }
                            break;
                        }
                        case "image": break;
                        default: break;
                    }
                }
            }
            clearTimeout(animationsTimer); //Clear Timeout Regardless
        }
        catch (e) {
            clearTimeout(animationsTimer);
        }
    },

};