function Slot() {

    var self = this;
    var slotType = [
        "map",
        "file",
    ];

    this.slotParse = function(type, cache) {
        try
        {
            type = parseInt(type);
            switch (type) {
                case 0:
                    return { 
                        id: (cache.id) ? cache.id : null,
                        link: (cache.url) ? cache.url : null,
                        type: (type >= 0) ? slotType[type] : null,
                        stats: { 
                            views: (cache.views) ? cache.views : null,
                            votes: (cache.votes) ? cache.votes : null,
                            replies: (cache.replies) ? cache.replies : null,
                            downloads: (cache.downloads) ? cache.downloads : null
                        },
                        info: {
                            map: (cache.map) ? cache.map : null,
                            title: (cache.title) ? cache.title : null,
                            gametype: (cache.gametype) ? cache.gametype : null,
                            updated: (cache.updated) ? new Date(Date.parse(cache.updated)).toLocaleDateString() : "",
                            edited: (cache.edited) ? new Date(Date.parse(cache.edited)).toLocaleDateString() : "",
                            submitted: (cache.date) ? new Date(Date.parse(cache.date)).toLocaleDateString() : "",
                            activity: (cache.edited) ? 'Modified: ' + new Date(Date.parse(cache.edited)).toLocaleDateString() : 'Submitted: ' + new Date(Date.parse(cache.date)).toLocaleDateString(),
                            description: (cache.cleanInfo) ? cache.cleanInfo : null,
                            variantSub: (cache.variantName) ? "variantName" : "",
                            variantName: (cache.variantName) ? cache.variantName : ""
                        },
                        images: { 
                            thumbnail: (cache.img) ? cache.img : null,
                            //mapThumbnail: (cache.map) ? getMapImage(true, cache.map) : null,
                            mapThumbnail: (cache.img) ? cache.thumbnail : null,
                            variantThumbnail: (cache.gametype) ? getVariantImage(cache.gametype) : null,
                        },
                        creator: { 
                            uid: (cache.uid) ? cache.uid : null,
                            name: (cache.creator) ? cache.creator : null,
                            profile: (cache.uid) ? "http://haloshare.org/users.php?id=" + cache.uid : null
                        },
                        submitter: { 
                            uid: (cache.uid) ? cache.uid : null,
                            name: (cache.submitter) ? cache.submitter : null,
                            profile: (cache.uid) ? "http://haloshare.org/users.php?id=" + cache.uid : null
                        }
                    }
                case 1: 
                    return { 
                        id: (cache.id) ? cache.id : null,
                        link: (cache.url) ? cache.url : null,
                        type: (type >= 0) ? slotType[type] : null,
                        fileType: (cache.type) ? cache.type : null,
                        stats: { 
                            views: (cache.views) ? cache.views : null,
                            votes: (cache.votes) ? cache.votes : null,
                            replies: (cache.replies) ? cache.replies : null,
                            downloads: (cache.downloads) ? cache.downloads : null
                        },
                        info: {
                            title: (cache.title) ? cache.title : null,
                            submitted: (cache.date) ? new Date(Date.parse(cache.date)).toLocaleDateString() : "",
                            updated: (cache.updated) ? new Date(Date.parse(cache.updated)).toLocaleDateString() : "",
                            edited: (cache.edited) ? new Date(Date.parse(cache.edited)).toLocaleDateString() : "",
                            activity: (cache.edited) ? 'Modified: ' + new Date(Date.parse(cache.edited)).toLocaleDateString() : 'Submitted: ' + new Date(Date.parse(cache.date)).toLocaleDateString(),
                            description: (cache.cleanInfo) ? cache.cleanInfo : "",
                            typeDescription: (cache.typeDesc) ? cache.typeDesc : "",
                            support: (cache.support) ? cache.support : ""
                        },
                        images: {
                            icon: (cache.fileIcon) ? cache.fileIcon : null
                        },
                        creator: { 
                            uid: (cache.uid) ? cache.uid : null,
                            name: (cache.creator) ? cache.creator : null,
                            profile: (cache.uid) ? "http://haloshare.org/users.php?id=" + cache.uid : null
                        },
                        submitter: { 
                            uid: (cache.uid) ? cache.uid : null,
                            name: (cache.submitter) ? cache.submitter : null,
                            profile: (cache.uid) ? "http://haloshare.org/users.php?id=" + cache.uid : null
                        }
                    }
                default: return null;
            }
            return null;
        }
        catch (ex) {
            console.log(ex.message);
            return null;
        }
    }
    this.slotCreate = function(type, cache, target) {
        try
        {
            var data = self.slotParse(type, cache);
            var flag = self.slotValidate(type, data);
            if (flag) {
                var slot = self.slotElement(type, data);
                if (slot && target) {
                    target.appendChild(slot);
                }
            }
        }
        catch (ex) {
            console.log(ex.message);
            return false;
        }
    }
    this.slotElement = function(type, data) {
        try
        {
            type = parseInt(type);
            var slot = document.createElement("div");
            if (slot) {
                slot.setAttribute("class", "content_slot " + data.type);
                slot.innerHTML = '';
                switch (type) {
                    case 0: 
                        slot.innerHTML =
                            '<div class="content_slot_outer">' +
                            '<div class="content_slot_inner ' + data.info.variantSub + '">' +
                                    '<div class="content_slot_type ' + data.info.variantSub + '">' +
                                        '<p>' + data.info.variantName + '</p>' +
                                    '</div>' +
                                    '<div class="content_slot_header">' +
                                        '<ul class="content_slot_header_content">' +
                                            '<li class="right">Votes: ' + data.stats.votes + '</li>' +
                                            '<li name="slot_header_title">' +
                                                '<a href="' + data.link + '">' + data.info.title + '</a>' +
                                            '</li>' +
                                            '<li class="right">' +
                                                '<a title="Upvote this content" href="http://haloshare.org/forge.php?id=' + data.id + '&upvote"><img class="icon" src="http://halo.bungie.net/images/halo3stats/fileshareicons/bungiefavorite_icon.gif" /></a>' +
                                                '<a title="' + data.submitter.name + ' submitted this: click to view profile" href="' + data.submitter.profile + '"><img class="icon" src="http://halo.bungie.net/images/halo3stats/fileshareicons/linkedfile_icon.gif" /></a>' +
                                            '</li>' +
                                            '<li name="slot_header_author">' +
                                                '<span>By <a href="//haloshare.org/search.php?find=' + data.creator.name + '">' + data.creator.name + '</a></span>' +
                                            '</li>' +
                                        '</ul>' +
                                    '</div>' +
                                    '<div class="content_slot_middle">' +
                                        '<a href="' + data.link + '">' +
                                            '<img class="content_slot_middle_thumb ' + data.type + '" src="' + data.images.mapThumbnail + '" />' +
                                            '<img class="content_slot_middle_thumb_overlay ' + data.type + '" />' +
                                        '</a>' +
                                        '<ul class="content_slot_middle_content">' +
                                            '<li class="visible">Views: '           + data.stats.views     + '</li>' +
                                            '<li class="visible">Downloads: '       + data.stats.downloads + '</li>' +
                                            '<li class="visible">Map: <a href="#">' + data.info.map        + '</a></li>' +
                                            '<li class="visible">'       + data.info.activity  + '</li>' +
                                            '<li class="invisible"><a href="#">Report</a></li>' +
                                        '</ul>' +
                                        '<img class="content_slot_middle_variant ' + data.type + '" src="' + data.images.variantThumbnail + '" />' +
                                    '</div>' +
                                    '<div class="content_slot_footer ' + data.type + '">' +
                                        '<p><i>' + data.info.description + '</i></p>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            '<div class="tooltip">' +
                                '<div class="tooltipHeader ' + data.info.variantSub + '">' +
                                    '<div class="tooltipVariant ' + data.info.variantSub + '">' + data.info.variantName + '</div>' +
                                    '<div class="tooltipTitle">' + data.info.title + '</div>' +
                                    '<div class="tooltipAuthor">' + data.creator.name + '</div>' +
                                '</div>' +
                                '<div class="tooltipContent">' +
                                    '<div class="tooltip_thumb_container">' +
                                        '<img id="tooltipThumb" src="' + data.images.thumbnail + '" />' +
                                    '</div>' +
                                    '<div class="tooltip_variant_container">' +
                                        '<img id="tooltipVariant" src="' + data.images.variantThumbnail + '" />' +
                                    '</div>' +
                                    '<div class="tooltip_description_container">' +
                                        '<p id="tooltipDescription">' + data.info.description + '</p>' +
                                    '</div>' +
                                '</div>' +
                            '</div>';
                        return (slot.innerHTML) ? slot : null;
                    case 1: 
                        slot.innerHTML =
                            '<div class="content_slot_outer">' +
                                '<div class="content_slot_inner">' +
                                    '<div class="content_slot_header">' +
                                        '<ul class="content_slot_header_content">' +
                                            '<li class="right">Votes: ' + data.stats.votes + '</li>' +
                                            '<li name="slot_header_title">' +
                                                '<a href="' + data.link + '">' + data.info.title + '</a>' +
                                            '</li>' +
                                            '<li class="right">' +
                                                '<a title="Upvote this content" href="http://haloshare.org/forge.php?id=' + data.id + '&upvote"><img class="icon" src="http://halo.bungie.net/images/halo3stats/fileshareicons/bungiefavorite_icon.gif" /></a>' +
                                                '<a title="View ' + data.submitter.name + '\'s' + ' profile" href="' + data.submitter.profile + '"><img class="icon" src="http://halo.bungie.net/images/halo3stats/fileshareicons/linkedfile_icon.gif" /></a>' +
                                            '</li>' +
                                            '<li name="slot_header_author">' +
                                                '<span>By <a href="' + data.creator.profile + '">' + data.creator.name + '</a></span>' +
                                            '</li>' +
                                        '</ul>' +
                                    '</div>' +
                                    '<div class="content_slot_middle">' +
                                        '<a href="#">' +
                                            '<img class="content_slot_middle_thumb ' + data.type + '" src="' + data.images.icon + '" />' +
                                        '</a>' +
                                        '<ul class="content_slot_middle_content">' +
                                            '<li class="visible">Views: '           + data.stats.views     + '</li>' +
                                            '<li class="visible">Downloads: '       + data.stats.downloads + '</li>' +
                                            '<li class="visible">Map: <a href="#">' + data.info.map        + '</a></li>' +
                                            '<li class="visible">'       + data.info.activity  + '</li>' +
                                            '<li class="invisible"><a href="#">Report</a></li>' +
                                        '</ul>' +
                                        '<img class="content_slot_middle_variant ' + data.type + '" src="' + data.images.variantThumbnail + '" />' +
                                    '</div>' +
                                    '<div class="content_slot_footer ' + data.type + '">' +
                                        '<p>' + data.info.description + '</p>' +
                                    '</div>' +
                                '</div>' +
                            '</div>';
                        return (slot.innerHTML) ? slot : null;
                    default: return null;
                }
            }
        }
        catch (ex) {
            console.log(ex.message);
            return null;
        }
    }
    this.slotValidate = function(type, data) { 
        try 
        {
            if (!data) return false;
            switch (type) {
                case 0: 
                    if (data.id &&
                        data.link &&
                        data.type)
                        if (data.stats && 
                            data.images &&
                            data.info &&
                            data.submitter &&
                            data.creator)
                            if (data.images.thumbnail &&
                                data.images.mapThumbnail &&
                                data.images.variantThumbnail &&
                                data.info.map &&
                                data.info.title &&
                                data.info.gametype &&
                                data.info.description &&
                                data.submitter.uid &&
                                data.submitter.name &&
                                data.submitter.profile &&
                                data.creator.uid &&
                                data.creator.name &&
                                data.creator.profile)
                                return true;
                    return false;
                case 1: 
                    if (data.id &&
                        data.link &&
                        data.type &&
                        data.fileType)
                        if (data.stats && 
                            data.images &&
                            data.info &&
                            data.submitter &&
                            data.creator)
                            if (data.images.icon &&
                                data.info.title &&
                                data.info.description &&
                                data.info.typeDescription &&
                                data.submitter.uid &&
                                data.submitter.name &&
                                data.submitter.profile &&
                                data.creator.uid &&
                                data.creator.name &&
                                data.creator.profile)
                                return true;
                    return false;
                default: return false;
            }
        } 
        catch (ex) {
            console.log(ex.message);
            return false;
        }
    }

}