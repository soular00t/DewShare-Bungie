function Slot(cache, type) {

    this.Id = null;
    this.Link = null;
    this.Type = null;
    this.Stats = {
        Views: null,
        Votes: null,
        Replies: null,
        Downloads: null
    };
    this.Images = {
        Thumb: null
    };
    this.Info = {
        Map: null,
        Title: null,
        Gametype: null,
        Submitted: null,
        Updated: null,
        
        Description: null,
        Variant: null,
        MapThumbnail: null,
        VariantThumbnail: null,
        variantName: null
    };
    this.Submitter = {
        Uid: null,
        Name: null,
        Profile: null
    };
    this.Creator = {
        Uid: null,
        Name: null,
        Profile: null
    };

    this.Parse = function (c) {
        try {
            if (c) {
                this.Id = (c.id) ? c.id : null;
                this.Link = (c.url) ? c.url : null;
                this.Type = (type) ? type : null;
                this.Stats = {
                    Views: (c.views) ? c.views : null,
                    Votes: (c.votes) ? c.votes : null,
                    Replies: (c.replies) ? c.replies : null,
                    Downloads: (c.downloads) ? c.downloads : null
                };
                this.Images = {
                    Thumb: (c.img) ? c.img : null
                };
                this.Info = {
                    Map: (c.map) ? "Map: " + c.map : null,
                    Title: (c.title) ? c.title : null,
                    Gametype: (c.gametype) ? c.gametype : null,
                    Submitted: (c.date) ? new Date(Date.parse(c.date)).toLocaleDateString() : new Date().toLocaleDateString(),
                    Updated: (c.updated) ? new Date(Date.parse(c.updated)).toLocaleDateString() : new Date().toLocaleDateString(),
                    Description: (c.cleanInfo) ? c.cleanInfo : null,
                    Variant: (c.variantName) ? c.variantName : null,
                    MapThumbnail: (c.map) ? getMapImage(true, c.map) : null,
                    VariantThumbnail: (c.gametype) ? getVariantImage(c.gametype) : null,
                    variantName: (c.variantName) ? "variantName" : "",
                    Creator: (c.creator) ? c.creator : null
                };
                this.Submitter = {
                    Uid: (c.uid) ? c.uid : null,
                    Name: (c.submitter) ? c.submitter : null,
                    Profile: (c.uid) ? "http://haloshare.org/users.php?id=" + c.uid : null
                };
                this.Creator = {
                    Uid: (c.uid) ? c.uid : null,
                    Name: (c.creator) ? c.creator : null,
                    Profile: (c.uid) ? "http://haloshare.org/users.php?id=" + c.uid : null
                };
            }
        }
        catch (e) {
            console.log(e.message);
        }
    };
    this.Create = function (p)
    {
        try
        {
            if (p)
            {
                var flag = this.Validate();
                if (flag) {
                    var s = this.CreateElement();
                    if (s) {
                        s.innerHTML =
                            '<div class="content_slot_outer">' +
                                '<div class="content_slot_inner ' + this.Info.variantName + '">' +
                                    '<div class="content_slot_type ' + this.Info.variantName + '">' +
                                        '<p>' + this.Info.Variant + '</p>' +
                                    '</div>' +
                                    '<div class="content_slot_header">' +
                                        '<ul class="content_slot_header_content">' +
                                            '<li class="right">Votes: ' + this.Stats.Votes + '</li>' +
                                            '<li name="slot_header_title">' +
                                                '<a href="' + this.Link + '">' + this.Info.Title + '</a>' +
                                            '</li>' +
                                            '<li class="right">' +
                                                '<a title="Upvote this content" href="http://haloshare.org/forge.php?id=' + this.Id + '&upvote"><img class="icon" src="http://halo.bungie.net/images/halo3stats/fileshareicons/bungiefavorite_icon.gif" /></a>' +
                                                '<a title="View ' + this.Submitter.Name + '\'s' + ' profile" href="' + this.Submitter.Profile + '"><img class="icon" src="http://halo.bungie.net/images/halo3stats/fileshareicons/linkedfile_icon.gif" /></a>' +
                                            '</li>' +
                                            '<li name="slot_header_author">' +
                                                '<span>By <a href="' + data.Creator.Profile + '">' + data.Creator.Name + '</a> on ' + data.Info.Submitted  + '</span>' +
                                            '</li>' +
                                        '</ul>' +
                                    '</div>' +
                                    '<div class="content_slot_middle">' +
                                        '<a href="#">' +
                                            '<img class="content_slot_middle_thumb ' + this.Type + '" src="' + this.Info.MapThumbnail + '" />' +
                                            '<img class="content_slot_middle_thumb_overlay ' + this.Type + '" />' +
                                        '</a>' +
                                        '<ul class="content_slot_middle_content">' +
                                            '<li class="visible">Views: '           + this.Stats.Views     + '</li>' +
                                            '<li class="visible">Downloads: '       + this.Stats.Downloads + '</li>' +
                                            '<li class="visible"><a href="#">'      + this.Info.Map        + '</a></li>' +
                                            '<li class="visible">Updated: '         + this.Info.Updated    + '</li>' +
                                            '<<li class="invisible"><a href="#">Report</a></li>' +
                                        '</ul>' +
                                        '<img class="content_slot_middle_variant ' + this.Type + '" src="' + this.Info.VariantThumbnail + '" />' +
                                    '</div>' +
                                    '<div class="content_slot_footer ' + this.Type + '">' +
                                        '<p><i>' + this.Info.Description + '</i></p>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            '<div class="tooltip">' +
                                '<div class="tooltipHeader ' + this.Info.variantName + '">' +
                                    '<div class="tooltipVariant ' + this.Info.variantName + '">' + this.Info.Variant + '</div>' +
                                    '<div class="tooltipTitle">' + this.Info.Title + '</div>' +
                                    '<div class="tooltipAuthor">' + this.Creator.Name + '</div>' +
                                '</div>' +
                                '<div class="tooltipContent">' +
                                    '<div class="tooltip_thumb_container">' +
                                        '<img id="tooltipThumb" src="' + this.Images.Thumb + '" />' +
                                    '</div>' +
                                    '<div class="tooltip_variant_container">' +
                                        '<img id="tooltipVariant" src="' + this.Info.VariantThumbnail + '" />' +
                                    '</div>' +
                                    '<div class="tooltip_description_container">' +
                                        '<p id="tooltipDescription">' + this.Info.Description + '</p>' +
                                    '</div>' +
                                '</div>' +
                            '</div>';
                        if (s.innerHTML) {
                            p.appendChild(s);
                            return true;
                        }
                        return false;
                    }
                }
            }
        }
        catch (e) {
            console.log(e.message);
            return false;
        }
    };
    this.Validate = function() { 
        try {
            if (this.Id &&
                this.Link &&
                this.Type)
                if (this.Stats && 
                    this.Images &&
                    this.Info &&
                    this.Submitter &&
                    this.Creator)
                    if (this.Images.Thumb &&
                        this.Info.Map &&
                        this.Info.Title &&
                        this.Info.Gametype &&
                        this.Info.Submitted &&
                        this.Info.Updated &&
                        this.Info.Description &&
                        this.Info.MapThumbnail &&
                        this.Info.VariantThumbnail &&
                        this.Submitter.Uid &&
                        this.Submitter.Name &&
                        this.Submitter.Profile &&
                        this.Creator.Uid &&
                        this.Creator.Name &&
                        this.Creator.Profile)
                        return true;
            return false;
        }
        catch (e) {
            return false;
        }
    };
    this.CreateElement = function() { 
        try {
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