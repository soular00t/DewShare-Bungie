function Flair(cache) {

    this.Id = null;
    this.Link = null;
    this.Domain = null;
    this.Logo = null;
    this.Stats = {
        Ups: null,
        Downs: null,
        Score: null,
        Reports: null
    };
    this.Author = {
        Name: null,
        Proifle: null
    };
    this.Media = {
        Url: null,
        Type: null,
        Host: null,
        Title: null,
        Domain: null,
        Length: null,
        Submitted: null,
        Thumb_Embed: null,
        Thumb_Preview: null,
        Thumb_Default: null
    };

    this.Parse = function (c) {
        try
        {
            if (c) {

                this.Id = (c.data.id) ? c.data.id : null;
                this.Link = (c.data.permalink) ? "https://www.reddit.com" + c.data.permalink : null;
                this.Domain = (c.data.domain) ? c.data.domain : null;
                this.Stats  = {
                    Ups: (c.data.ups) ? c.data.ups : 0,
                    Downs: (c.data.downs) ? c.data.downs : 0,
                    Score: (c.data.score) ? c.data.score : 0,
                    Reports: (c.data.num_reports) ? c.data.num_reports : 0
                };
                this.Author = {
                    Name: (c.data.author) ? c.data.author : null,
                    Proifle: (c.data.author) ? "https://www.reddit.com/user/" + c.data.author : null
                };

                var t = getTypeFromDomain(this.Domain);
                var h = getHostFromDomain(this.Domain);
                if (t && h) {
                    this.Media = {
                        Type: t,
                        Host: h,
                        Url: (c.data.url) ? decodeURIComponent(c.data.url) : null,
                        Title: (c.data.title) ? c.data.title : null,
                        Domain: this.Domain,
                        Length: "00:00:00",
                        Submitted: (c.data.created_utc) ? getDateFromUTC(c.data.created_utc) : null,
                        Thumb_Embed: '',
                        Thumb_Preview: '',
                        Thumb_Default: ''
                    };
                    if (c.data.media)
                        this.Media.Thumb_Embed = (c.data.media.oembed.thumbnail_url) ? decodeURIComponent(c.data.media.oembed.thumbnail_url) : '';
                    if (c.data.preview)
                        this.Media.Thumb_Preview = (c.data.preview.images[0].source.url) ? decodeURIComponent(c.data.preview.images[0].source.url) : '';
                    if (c.data.thumbnail)
                        this.Media.Thumb_Default = (c.data.thumbnail) ? decodeURIComponent(c.data.thumbnail) : '';
                    this.Logo = getLogoFromHost(h);
                }

            }
        }
        catch (e) {
            this.Id = null;
            this.Link = null;
            this.Stats = null;
            this.Author = null;
            this.Media = null;
            console.log(e.message);
        }
    };
    this.Create = function (p)
    {
        try
        {
            if (p) {
                var flag = this.Validate();
                if (flag) {
                    var s = this.CreateElement();
                    if (s) {
                        s.innerHTML = 
                            '<div class="content_slot_outer">' +
                                '<div class="content_slot_inner">' +
                                    '<div class="content_slot_header">' +
                                        '<div class="' + this.Logo + '"></div>' +
                                        '<ul class="content_slot_header_content">' +
                                            '<li name="slot_header_title">' +
                                                '<a href="' + this.Link + '">' + this.Media.Title + '</a>' +
                                            '</li>' +
                                            '<li name="slot_header_author">' +
                                                '<span>By <a href="' + this.Author.Proifle + '">' + this.Author.Name + '</a></span>' +
                                            '</li>' +
                                        '</ul>' +
                                    '</div>' +
                                    '<div class="content_slot_middle">' +
                                        '<a href="' + this.Media.Url + '">' +
                                            '<img id="' + this.id + '" class="content_slot_middle_thumb ' + this.Media.Type + '" />' +
                                            '<img class="content_slot_middle_thumb_overlay ' + this.Media.Type + '" />' +
                                        '</a>' +
                                        '<ul class="content_slot_middle_content ' + this.Media.Type + '"></ul>' +
                                    '</div>' +
                                '</div>' +
                            '</div>';
                        if (s.innerHTML) {
                            var t = $(s).find('.content_slot_middle_thumb')[0];
                            var o = $(s).find('.content_slot_middle_thumb_overlay')[0];
                            var c = $(s).find('.content_slot_middle_content')[0];
                            if (t && o && c) {
                                c.innerHTML = (this.Media.Type === "video")
                                    ? '<li class="visible"><a class="video" href="' + this.Media.Url + '">Watch Now</a></li>' +
                                      '<li class="visible"><i class="upvote fa fa-angle-up" aria-hidden="true"></i> ' + this.Stats.Ups + '</li>' +
                                      '<li class="visible"><i class="downvote fa fa-angle-down" aria-hidden="true"></i> ' + this.Stats.Downs + '</li>' +
                                      '<li class="visible">Submitted: ' + this.Media.Submitted + '</li>' +
                                      '<li class="visible duration">Length: ' + this.Media.Length + '</li>' +
                                      '<li class="invisible"><a href="' + this.Link + '">Report</a></li>'
                                    : '<li class="visible"><a class="screenshot" href="' + this.Media.Url + '">View High Res</a></li>' +
                                      '<li class="visible"><i class="upvote fa fa-angle-up" aria-hidden="true"></i> ' + this.Stats.Ups + '</li>' +
                                      '<li class="visible"><i class="downvote fa fa-angle-down" aria-hidden="true"></i> ' + this.Stats.Downs + '</li>' +
                                      '<li class="visible">Submitted: ' + this.Media.Submitted + '</li>' +
                                      '<li class="invisible"><a href="' + this.Link + '">Report</a></li>';
                                if (c.innerHTML)
                                {
                                    var m = this.Media;
                                    if (this.Media.Type === "screenshot") {
                                        $(t).attr('src',
                                            (this.Media.Thumb_Default) ? this.Media.Thumb_Default :
                                            (this.Media.Thumb_Preview) ? this.Media.Thumb_Preview :
                                            (this.Media.Thumb_Embed)   ? this.Media.Thumb_Embed : "");
                                    }
                                    if (this.Media.Type === "video") {
                                        getMediaThumbsFromDomain(this, function (callback) {
                                            try {
                                                if (callback) {
                                                    $(t).attr('data-key', JSON.stringify([{ Type: m.Type, Data: callback, Domain: m.Host }]));
                                                    switch (m.Host.toLowerCase()) {
                                                        case "gcat":
                                                            $(t).attr('src', callback[1] ? callback[1] : '');
                                                            break;
                                                        case "youtube":
                                                            $(t).attr('src', callback[3] ? callback[3] : '');
                                                            break;
                                                        case "streamable":
                                                            $(t).attr('src', callback[0] ? callback[0] : '');
                                                            break;
                                                        default: $(t).attr('src', '');
                                                    }
                                                    if ($(t).attr('src')) {
                                                        $(o).on('mouseenter', {}, animations.showScrub);
                                                        $(o).on('mouseleave', {}, animations.hideScrub);
                                                    }
                                                }
                                            }
                                            catch (e) {
                                                console.log(e.message);
                                            }
                                        });
                                        getMediaLengthFromDomain(this, function (callback) {
                                            try
                                            {
                                                if (callback) {
                                                    var l = $(c).find('.duration')[0];
                                                    if (l) {
                                                        $(l).html('Length: ' + callback);
                                                    }
                                                }
                                            }
                                            catch (e)
                                            {
                                                console.log(e.message);
                                            }
                                        });
                                    }
                                    p.appendChild(s);
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
            return false;
        }
        catch (e) {
            console.log(e.message);
            return false;
        }
    };
    this.Validate = function ()
    {
        try
        {
            if (this.Id &&
                this.Link &&
                this.Domain &&
                this.Logo)
                if (this.Author)
                    if (this.Author.Name &&
                        this.Author.Proifle)
                            if (this.Media)
                                if (this.Media.Type === "video" || this.Media.Type === "screenshot" &&
                                    this.Media.Url &&
                                    this.Media.Host &&
                                    this.Media.Title &&
                                    this.Media.Domain &&
                                    this.Media.Length &&
                                    this.Media.Submitted)
                                    return true;
            return false;
        }
        catch (e) {
            return false;
        }
    };
    this.CreateElement = function () {
        try
        {
            var e = document.createElement('div');
            if (e) {
                e.setAttribute('class', 'content_slot');
                e.innerHTML = '';
                return (e) ? e : null;
            }
            return null;
        }
        catch (e) {
            console.log(e.message);
            return null;
        }
    };

    if (cache)
        this.Parse(cache);

};

$(document).ready(function () {

    //ANY INIT CODE HERE

});