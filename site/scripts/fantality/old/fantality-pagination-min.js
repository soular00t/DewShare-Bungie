
var pagination = null;

function Pagination() {

    var filters = {

        //HaloVault


        //Reddit

    };

    var animationsTimer;
    var animations = {

        showScrub: function (e) {
            try
            {
                var t = $(e.target)[0];
                var p = $(t.parentNode)[0];
                var c = $(p).children('.content_slot_middle_thumb')[0];
                if (c) {
                    var d = $(c).data('key')[0];
                    if (d && d.type && d.animData) {
                        switch (d.type.toLowerCase()) {
                            case "video":
                                if (d.animData.length <= 1)
                                    break;
                                else {
                                    var scrubAnimate = function () {
                                        if (d.animData[0] && d.animData[1] && d.animData[2]) {
                                            animationsTimer = setTimeout(function () {
                                                $(c).attr("src", d.animData[0]);
                                                animationsTimer = setTimeout(function () {
                                                    $(c).attr("src", d.animData[1]);
                                                    animationsTimer = setTimeout(function () {
                                                        $(c).attr("src", d.animData[2]);
                                                        scrubAnimate();
                                                    }, 1000);
                                                }, 1000);
                                            }, 1000);
                                        }
                                    };
                                    scrubAnimate();
                                }
                                break;
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
            try
            {
                var t = $(e.target)[0];
                var p = $(t.parentNode)[0];
                var c = $(p).children('.content_slot_middle_thumb')[0];
                if (c) {
                    var d = $(c).data('key')[0];
                    if (d && d.type && d.animData) {
                        switch (d.type.toLowerCase()) {
                            case "video":
                                if (d.animData.length <= 1)
                                    break;
                                else {
                                    $(c).attr("src", d.animData[3] ? d.animData[3] : "");
                                }
                                break;
                            case "image": break;
                            default: break;
                        }
                    }
                }
                clearTimeout(animationsTimer);
            }
            catch (e) {
                clearTimeout(animationsTimer);
            }
        },
        clearScrub: function () {
            clearTimeout(animationsTimer);
        }

    };

    var self           = this;
    var pageCurrent    = 0;
    var pageCount      = 0;
    var pageTotalFiles = 0;
    var pageTotalPages = 0;
    var pageFilters    = {

        hvSort: "",
        hvType: "",
        hvMap: "",
        hvSearch: "",

        redType: "",
        redPrev: "",
        redNext: "",
        redImages: "https://www.reddit.com/search.json?q=subreddit:HaloOnline+flair_text:Media+site:(Imgur.com)&sort=new&t=all&syntax=lucene&limit=26",
        redVideos: "https://www.reddit.com/search.json?q=subreddit:HaloOnline+flair_text:Media+site:(Youtube.com+OR+Youtu.be+OR+Streamable.com+OR+gfycat.com)&sort=new&t=all&syntax=lucene&limit=26",

        reset: function () {

            //HaloVault Filters
            this.hvSort = "";
            this.hvType = "";
            this.hvMap = "";
            this.hvSearch = "";

            //Reddit Filters
            this.redType = "";
            this.redPrev = "";
            this.redNext = "";

        }

    };

    var pageSlotList   = $('.content_slots_container')[0];
    var pageNavigation = $('.content_pagination')[0];
    var pageLoader     = $('.content_slots_loader')[0];
    var pageResults    = $('.content_slots_results')[0];

    //Navigation Variables
    var navigationHeader = $('.content_navigation_header')[0];
    var navigationFooter = $('.content_navigation_footer')[0];
    $('.content_navigation_header').on('click', '.nav_header_item', {}, function (e) {
        var t = $(e.target)[0];
        var p = $(t.parentNode)[0];
        if (t && p) {
            if ($(t).hasClass("selected"))
                return;
            else {
                var filter = parseInt($(t).attr("data-filter"));
                if (filter) {
                    pageFilters.reset();
                    self.clearPageResults();
                    if (navigationFooter) {
                        $(navigationFooter).empty();
                        switch (filter) {
                            case 1:
                                navigationFooter.innerHTML =
                                    '<li data-filter="all" class="nav_footer_item">All</li>' +
                                    '<li data-filter="media" class="nav_footer_item selected"><i class="nav_header_item_arrow fa fa-chevron-down" aria-hidden="true"></i>Forge</li>' +
                                    '<li data-filter="files" class="nav_footer_item">Files</li>' +
                                    '<li data-filter="mapvar" class="nav_footer_item">Media</li>' +
                                    '<li data-filter="mapvar" class="nav_footer_item">Community</li>';
                                self.loadVaultPage(1);
                                break;
                            case 2:
                                navigationFooter.innerHTML =
                                    '<li data-filter="recent" class="nav_footer_item">Recent</li>' +
                                    '<li data-filter="screenshots" class="nav_footer_item">Screenshots</li>' +
                                    '<li data-filter="videos" class="nav_footer_item selected"><i class="nav_header_item_arrow fa fa-chevron-down" aria-hidden="true"></i>Videos</li>';
                                pageFilters.redType = "video";
                                self.loadRedditPage(true, "");
                                break;
                            default: return;
                        }
                        $(p).children('.selected').each(function (i, v) {
                            $(v).removeClass("selected");
                            $(v).children().remove();
                        });
                        $(t).addClass("selected");
                        $(t).prepend('<i class="nav_header_item_arrow fa fa-chevron-down" aria-hidden="true"></i>');
                    }
                }
            }
        }
    })
    $('.content_navigation_footer').on('click', '.nav_footer_item', {}, function (e) {
        var t = $(e.target)[0];
        var p = $(t.parentNode)[0];
        if (t && p) {
            if ($(t).hasClass("selected"))
                return;
            else {
                var filter = $(t).attr("data-filter");
                if (filter) {
                    pageFilters.reset();
                    self.clearPageResults();
                    var flag = (filter.toLowerCase() === "all");
                    switch (filter) {

                        case "all":
                            break;
                        case "media":
                            break;
                        case "files":
                            break;
                        case "mapvar":
                            break;
                        case "gamevar":
                            self.loadVaultPage(1);
                            break;

                        case "recent": break;
                        case "screenshots":
                            pageFilters.redType = "image";
                            self.loadRedditPage(true, ""); break;
                        case "videos":
                            pageFilters.redType = "video";
                            self.loadRedditPage(true, ""); break;
                        default: return;
                    }
                    $(p).children('.selected').each(function (i, v) {
                        $(v).removeClass("selected");
                        $(v).children().remove();
                    });
                    $(t).addClass("selected");
                    $(t).prepend('<i class="nav_header_item_arrow fa fa-chevron-down" aria-hidden="true"></i>');
                }
            }
        }
    })

    //Pagination Variables
    $('.content_pagination').on('click', '.pager', {}, function (e) {
        var t = $(e.target)[0];            //(Target)
        var page = $(t).attr("data-page"); //(Page Number)
        var flag = $(t).hasClass("disabled");
        if (page && !flag) {
            self.loadVaultPage(page);
        }
    })
    $('.content_pagination').on('click', '.pager_reddit', {}, function (e) {
        var t = $(e.target)[0];
        var flag = $(t).hasClass("disabled");
        var page = $(t).hasClass("next") ? pageFilters.redNext : $(t).hasClass("prev") ? pageFilters.redPrev : "";
        if (page && !flag) {
            self.loadRedditPage(false, page);
        }
    })

    this.load = function () {
        try
        {
            self.loadVaultPage(1);
            //self.loadRedditPage(true, "", 0);
        }
        catch (e)
        {
        }
    };

    this.loadVaultPage = function(p) {
        try 
        {
            var a = "/site/scripts/shared/listMaps.php?p=" + p + "&r=26&map=" + pageFilters.hvMap + "&gtype=" + pageFilters.hvType + "&search=" + pageFilters.hvSearch;
            getRequest(a, function (cb) {
                var pr = getCallbackData('PAGE_RESULTS', cb);
                var mr = getCallbackData('MAP_RESULTS', cb);
                if (pr && mr) {
                    pageCurrent    = getCallbackData('currentPage', pr);
                    pageTotalFiles = getCallbackData('totalMaps', pr);
                    pageTotalPages = getCallbackData('pagesPossible', pr);
                    if (pageCurrent === 0 || pageTotalPages === 0 || pageTotalPages === 0)
                        return;
                    else {
                        self.clearPageResults();
                        self.loadPagination(pageTotalPages);
                        if (pageNavigation.innerHTML)
                        {
                            for (var i = 0; i < mr.length; i++) {
                                var slot = new Slot(mr[i], "gametype");
                                if (slot.Create(pageSlotList)) {
                                    pageCount++;
                                }
                            }
                            if (pageSlotList.innerHTML) {
                                $('.content_slot_middle_thumb_overlay').on('mousemove', {}, onTooltipMouseMove);
                                $('.content_slot_middle_thumb_overlay').on('mouseenter', {}, onTooltipMouseEnter);
                                $('.content_slot_middle_thumb_overlay').on('mouseleave', {}, onTooltipMouseLeave);
                                if (pageResults)
                                    pageResults.innerHTML = '<p>Showing (' + pageCount + ') of (' + pageTotalFiles + ') total results</p>';
                            }
                        }
                    }
                }
            });
        } 
        catch (e) {    
        }
    };
    this.loadRedditPage = function (flag, page) {
        try
        {
            var a = (pageFilters.redType === "video") 
                ? pageFilters.redVideos + page 
                : pageFilters.redImages + page;
            if (a) {
                getRequest(a, function (cb) {
                    var d = getCallbackData('data.children', cb);
                    var n = getCallbackData('data.after', cb);
                    var p = getCallbackData('data.children.0.data.name', cb);
                    if (d && (n || p)) {

                        pageFilters.redPrev = (p && !flag) ? '&before=' + p : ""; //Pagination (Prev)
                        pageFilters.redNext = (n)          ? '&after=' + n  : ""; //Pagination (Next)
                        self.clearPageResults();
                        self.loadRedditPagination(pageFilters.redPrev, pageFilters.redNext);

                        if (pageNavigation.innerHTML) {
                            for (var i = 0; i <= d.length; i++) {
                                var flair = new Flair(d[i]);
                                if (flair.Create(pageSlotList))
                                    pageCount++;
                            }
                            if (pageResults)
                                pageResults.innerHTML = '<p>Showing (' + pageCount + ') results</p>';
                        }
                    }
                });
            }
        }
        catch (e)
        {
        }
    };

    this.loadPagination = function (count) {
        try
        {
            if (count <= 0) return;
            if (pageNavigation === null)
                return;
            else
            {
                pageNavigation.innerHTML = '';
                var c = parseInt(pageCurrent);
                var p1 = (count - (count - 1));
                var p2 = (c <= 1) ? 1 : c - 1;
                var d1 = (c <= 1) ? "disabled" : "";
                var p3 = (c + 1 >= count) ? count : c + 1;
                var p4 = (count);
                var d2 = (c >= count) ? "disabled" : "";
                pageNavigation.innerHTML = "";
                pageNavigation.innerHTML += '<a data-page="' + p1 + '" class="pager ' + d1 + '" title="First">First</a>';
                pageNavigation.innerHTML += '<a data-page="' + p2 + '" class="pager ' + d1 + '" title="Previous">Prev</a>';
                for (var i = 1; i <= count; i++)
                    if (i != c)
                        pageNavigation.innerHTML += '<a data-page="' + i + '" class="pager direct" href="javascript:void(0)">' + i + '</a>';
                    else
                        pageNavigation.innerHTML += '<a data-page="' + c + '" class="direct disabled" href="javascript:void(0)">' + c + '</a>';
                pageNavigation.innerHTML += '<a data-page="' + p3 + '" class="pager ' + d2 + '" title="Next">Next</a>';
                pageNavigation.innerHTML += '<a data-page="' + p4 + '" class="pager ' + d2 + '" title="Last">Last</a>';
            }
        }
        catch (e) {
            pageNavigation.innerHTML = '';
        }
    };
    this.loadRedditPagination = function (p, n) {
        try
        {
            if (!p && !n) return;
            if (pageNavigation === null)
                return;
            else
            {
                var p1 = (p) ? p : "";
                var p2 = (n) ? n : "";
                var d1 = (p) ? "" : "disabled";
                var d2 = (n) ? "" : "disabled";
                pageNavigation.innerHTML = '';
                pageNavigation.innerHTML += '<span class="pager_reddit prev' + d1 + '" title="Previous">Prev</span>';
                pageNavigation.innerHTML += '<span class="pager_reddit next' + d2 + '" title="Next">Next</span>';
            }
        }
        catch (e)
        {
            pageNavigation.innerHTML = '';
        }
    };

    this.clearPageResults = function () {
        try
        {
            if (pageNavigation)
                pageNavigation.innerHTML = "";
            if (pageResults)
                pageResults.innerHTML = "<p>Showing (0) of (0) total results</p>";
            if (pageSlotList)
                pageSlotList.innerHTML = "";
            pageCount = 0;
        }
        catch (e)
        {

        }
    };

    this.setPageFilter = function (target, filter) {
    };
    this.setResultFilter = function (target, filter) {
    };

    this.load();

};

$(document).ready(function () {

    //pagination = new Pagination();

});