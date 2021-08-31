var navigation = null;

function Navigation() {

    var navSelf   = this;
    var navPager  = $('.content_pagination')[0];
    var navSlots  = $('.content_slots_container')[0];
    var navHeader = $('.content_navigation_header')[0];
    var navFooter = $('.content_navigation_footer')[0];
    var navCurrentType = -1;

    var navPages = [
        "http://haloshare.org",
        "https://www.reddit.com"
    ];
    var navVaultFilters = { 
        page: 1,
        results: 26,
        uid: "",
        map: "",
        type: "",
        gtype: "",
        search: "",
        creator: "",
        author: "",
        flair: ""
    };
    var navRedditFilters = { };

    this.navGetPage = function(type, init) { 
        try 
        {
            switch (navSelf.navCurrentType) {
                case 0:
                    navSelf.navVaultLoadPage(type, init);
                    break;
            }
        }
        catch (ex) {
            console.log(ex.message);
        }
    }
    this.navSetPage = function(type, init) { 
        try 
        {
            type = parseInt(type);
            switch (type) {

                //Headers
                case 0: navHeader.innerHTML =
                    '<li data-filter="0" class="nav_header_item selected"><i class="nav_header_item_arrow fa fa-chevron-down" aria-hidden="true"></i>DewShare</li>' +
                    '<li data-filter="1" class="nav_header_item">Reddit</li>';
                    navSelf.navCurrentType = 0;
                    navSelf.navSetPage(2, init);
                    break;
                case 1: navHeader.innerHTML =
                    '<li data-filter="0" class="nav_header_item">DewShare</li>' +
                    '<li data-filter="1" class="nav_header_item selected"><i class="nav_header_item_arrow fa fa-chevron-down" aria-hidden="true"></i>Reddit</li>';
                    navSelf.navCurrentType = 1;
                    navSelf.navSetPage(5, init);
                    break;

                case 2: navFooter.innerHTML =
                    '<li data-filter="2" class="nav_footer_item selected"><i class="nav_header_item_arrow fa fa-chevron-down" aria-hidden="true"></i>Forge</li>' +
                    '<li data-filter="3" class="nav_footer_item">Files</li>' +
                    '<li data-filter="4" class="nav_footer_item">Community</li>';
                    navSelf.navGetPage(0, true);
                    break;
                case 3: navFooter.innerHTML =
                    '<li data-filter="2" class="nav_footer_item">Forge</li>' +
                    '<li data-filter="3" class="nav_footer_item selected"><i class="nav_header_item_arrow fa fa-chevron-down" aria-hidden="true"></i>Files</li>' +
                    '<li data-filter="4" class="nav_footer_item">Community</li>';
                    break;
                case 4: navFooter.innerHTML =
                    '<li data-filter="2" class="nav_footer_item">Forge</li>' +
                    '<li data-filter="3" class="nav_footer_item">Files</li>' +
                    '<li data-filter="4" class="nav_footer_item selected"><i class="nav_header_item_arrow fa fa-chevron-down" aria-hidden="true"></i>Community</li>';
                    break;
                case 5: navFooter.innerHTML =
                    '<li data-filter="5" class="nav_footer_item selected"><i class="nav_header_item_arrow fa fa-chevron-down" aria-hidden="true"></i>Screenshots</li>' +
                    '<li data-filter="6" class="nav_footer_item">Videos</li>';
                    break;
                case 6: navFooter.innerHTML =
                    '<li data-filter="5" class="nav_footer_item">Screenshots</li>' +
                    '<li data-filter="6" class="nav_footer_item selected"><i class="nav_header_item_arrow fa fa-chevron-down" aria-hidden="true"></i>Videos</li>';
                    break;
            }
        } 
        catch (ex) {
            console.log(ex.message);
        }
    }
    this.navClearResults = function() {
        try 
        {
            $(".content_pagination").empty();
            $(".content_slots_results").empty();
            $(".content_slots_container").empty();
        } 
        catch (ex) {
            console.log(ex.message);
        }
    }
    this.navSetLoadState = function(state) {
        var load = $(".content_slots_loader");
        try 
        {
            switch (state) {
                case 0: 
                    $(load).addClass("visible");
                    break;
                case 1: 
                    $(load).removeClass("visible");
                    break;
                default: break;
            }
        } 
        catch (ex) {
            console.log(ex.message);
            if (load)
                $(load).removeClass("visible");
        }
    }

    //=====================================================//
    //= HALO VAULT FUNCTIONS                              =//
    //=====================================================//
    //TODO:
    //
    //

    this.navVaultInit = function() {
        try 
        {
            navSelf.navSetPage(0, true);
        } 
        catch (ex) {
            console.log(ex.message);
        }
    }
    this.navVaultLoadPage = function(type, init) {
        try 
        {
            var page = navSelf.navVaultBuildPage(type, init);
            if (page) {
                navSelf.navSetLoadState(0);
                getRequest(page, function (callback) {
                    var results = navSelf.navVaultBuildResults(type, callback);
                    if (results) {
                        navSelf.navVaultLoadPagination(results);
                        for (var index in results.slots) {
                            var slot = new Slot();
                            if (slot.slotCreate(results.slotType, results.slots[index], navSlots))
                            {
                                console.log(slot.title);
                            }
                        }
                        if (navSlots.innerHTML) {
                            $('.content_slot_middle').on('mousemove', '.content_slot_middle_thumb_overlay ', {}, onTooltipMouseMove);
                            $('.content_slot_middle').on('mouseenter', '.content_slot_middle_thumb_overlay ', {}, onTooltipMouseEnter);
                            $('.content_slot_middle').on('mouseleave', '.content_slot_middle_thumb_overlay ', {}, onTooltipMouseLeave);
                        }
                    }
                    navSelf.navSetLoadState(1);
                });
            }
        } 
        catch (ex) {
            console.log(ex.message);
            navSelf.navSetLoadState(1);
        }
    }
    this.navVaultBuildPage = function(type, init) {
        try 
        {
            var page = navPages[0];
            switch (type) {
                case 2: return ""; //TODO: RECENT
                case 3: return page + "/inc/api/listMaps.api?p={0}&r={1}&uid={2}&creator={3}&map={4}&gtype={5}&search={6}"
                    .format((init) ? 1 : navVaultFilters.page, 
                            navVaultFilters.results, 
                            navVaultFilters.uid, 
                            navVaultFilters.creator,
                            navVaultFilters.map, 
                            navVaultFilters.gtype, 
                            navVaultFilters.search);
                case 4: return page + "/inc/api/listFiles.api?p={0}&r={1}&uid={2}&creator={3}&type={4}&search={5}"
                    .format((init) ? 1 : navVaultFilters.page, 
                            navVaultFilters.results, 
                            navVaultFilters.uid, 
                            navVaultFilters.creator,
                            navVaultFilters.type,
                            navVaultFilters.search);
                case 5: return page + "/inc/api/listTopics.api?p={0}&r={1}&uid={2}&author={3}&flair={4}&search={5}"
                    .format((init) ? 1 : navVaultFilters.page, 
                            navVaultFilters.results, 
                            navVaultFilters.uid, 
                            navVaultFilters.author,
                            navVaultFilters.flair,
                            navVaultFilters.search);
                default: return "";
            }
        } 
        catch (ex) {
            console.log(ex.message);
            return "";
        }
    }
    this.navVaultBuildResults = function(type, results) {
        try
        {
            var data = {
                page: (results && results.PAGE_RESULTS.currentPage)   ? results.PAGE_RESULTS.currentPage   : null,
                pages: (results && results.PAGE_RESULTS.pagesPossible) ? results.PAGE_RESULTS.pagesPossible : null,
                total: 0,
                results: 0,
                prefix: "Showing ({0}) of ({1}) total {2}",
                slots: {},
                slotType: -1
            }
            switch (type) {
                case 3:
                    data.total   = (results && results.PAGE_RESULTS.totalMaps)  ? results.PAGE_RESULTS.totalMaps  : 0;
                    data.results = (results && results.PAGE_RESULTS.mapsOnPage) ? results.PAGE_RESULTS.mapsOnPage : 0;
                    data.prefix  = "Showing ({0}) of ({1}) total maps".format(data.results, data.total);
                    data.slots   = (results && results.MAP_RESULTS) ? results.MAP_RESULTS : {};
                    data.slotType = 0;
                    break;
                case 4:
                    data.total   = (results && results.PAGE_RESULTS.totalFiles)  ? results.PAGE_RESULTS.totalFiles  : 0;
                    data.results = (results && results.PAGE_RESULTS.filesOnPage) ? results.PAGE_RESULTS.filesOnPage : 0;
                    data.prefix  = "Showing ({0}) of ({1}) total files".format(data.results, data.total);
                    data.slots   = (results && results.FILE_RESULTS) ? results.FILE_RESULTS : {};
                    data.slotType = 1;
                    break;
                case 5:
                    data.total   = (results && results.PAGE_RESULTS.totalThreads)  ? results.PAGE_RESULTS.totalThreads  : 0;
                    data.results = (results && results.PAGE_RESULTS.threadsOnPage) ? results.PAGE_RESULTS.threadsOnPage : 0;
                    data.prefix  = "Showing ({0}) of ({1}) total threads".format(data.results, data.total);
                    data.slots   = (results && results.COMMUNITY_RESULTS) ? results.COMMUNITY_RESULTS : {};
                    data.slotType = 2;
                    break;
                default: return null;
            }
            return data;
        }
        catch (ex) {
            console.log(ex.message);
            return null;
        }
    }
    this.navVaultLoadPagination = function(results) { 
        try 
        {
            if (results) {
                if (results.page === null)  return;
                if (results.pages === null) return;
                else {
                    navSelf.navClearResults();
                    var page = parseInt(results.page);
                    var cunt = parseInt(results.pages); //<< LUL
                    if (cunt > 1) {

                        var pageFrst = 1;
                        var pagePrev = (page <= 1) ? 1 : page - 1;
                        var pageNext = (page + 1 >= cunt) ? cunt : page + 1;
                        var pageLast = (cunt);
                        var pageD1   = (page <= 1)    ? "disabled" : "";
                        var pageD2   = (page >= cunt) ? "disabled" : "";

                        $(".content_pagination").append('<a data-page="' + pageFrst + '" class="pager ' + pageD1 + '">First</a>');
                        $(".content_pagination").append('<a data-page="' + pagePrev + '" class="pager ' + pageD1 + '">Prev</a>');

                        for (var i = 1; i <= cunt; i++)
                            if (i != page) $(".content_pagination").append('<a data-page="' + i + '" class="pager direct">' + i + '</a>');
                            else           $(".content_pagination").append('<a data-page="' + page + '" class="direct disabled">' + page + '</a>');

                        $(".content_pagination").append('<a data-page="' + pageNext + '" class="pager ' + pageD2 + '">Next</a>');
                        $(".content_pagination").append('<a data-page="' + pageLast + '" class="pager ' + pageD2 + '">Last</a>');

                    }
                }
                if (results.results && results.total)
                    $(".content_slots_results").append('<p>{0}</p>'.format(results.prefix));
            }
        }
        catch (ex) {
            console.log(ex.message);
        }
    }

    //=====================================================//
    //= NAVIGATION EVENTS                                 =//
    //=====================================================//
    //TODO:
    //
    //

    this.navPagerClick = function (event) {
        try {
            var page = -1;
            var targ = $(event.target);
            if (targ && targ.hasClass("disabled") === false) {
                page = targ.attr("data-page");
                if (page)
                {
                    navSelf.navVaultFilters.page = page;
                    navSelf.navVaultLoadPage(navSelf.navCurrentType, true);
                }
            }
        }
        catch (ex) {
            console.log(ex.message);
        }
    }
    this.navHeaderClick = function(event) {
        try 
        {
            var type = -1;
            var targ = $(event.target);
            if (targ && targ.hasClass("selected") === false) { 
                type = targ.attr("data-filter");
                navSelf.navSetPage(type, true);
            }
        } 
        catch (ex) {
            console.log(ex.message);
        }
    }
    this.navFooterClick = function(event) {
        try 
        {
            var page = -1;
            var targ = $(event.target);
            if (targ && targ.hasClass("selected") === false) {
                page = parseInt(targ.attr("data-filter"));
                navSelf.navSetPage(page);
                navSelf.navGetPage(page, true);
            }
        } 
        catch (ex) {
            console.log(ex.message);
        }
    }

}

$(document).ready(function(){

    navigation = new Navigation();
    if (navigation) {
        navigation.navVaultInit();
        $('.content_pagination').on('click', '.pager', {}, navigation.navPagerClick);
        $('.content_navigation_header').on('click', '.nav_header_item', {}, navigation.navHeaderClick);
        $('.content_navigation_footer').on('click', '.nav_footer_item', {}, navigation.navFooterClick);
    }

})