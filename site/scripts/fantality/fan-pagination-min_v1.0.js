var pagination = null;

function Pagination() {

    var pageSelf  = this;
    var pageSlots  = $('.content_slots_container')[0];
    var pageLoader = $(".content_slots_loader");
    var pageHeader = $('.content_navigation_header')[0];
    var pageFooter = $('.content_navigation_footer')[0];
    var pageCurrentType = -1;
    var pageVaultFilters = {
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
    var pageRedditFilters = { };

    //=====================================================//
    //= PAGINATION FUNCTIONS                              =//
    //=====================================================//
    //TODO:
    //
    //

    this.pageGetPageType = function(type) { 
        try 
        {
            pageType = parseInt(type);
            switch (pageType) {
                case 0: pageSelf.pageVaultLoadPage(0); break;
            }
        }
        catch (ex) {
            console.log(ex.message);
        }
    }
    this.pageSetPageType = function(type, init) { 
        try 
        {
            pageType = parseInt(type);
            switch (pageType) {
                //Menu Headers
                case 0:
                    pageHeader.innerHTML =
                        '<li data-filter="0" class="nav_header_item selected"><i class="nav_header_item_arrow fa fa-chevron-down" aria-hidden="true"></i>DewShare</li>' +
                        '<li data-filter="1" class="nav_header_item">Reddit</li>';
                    pageSelf.pageSetPageType(2, true); //Set to default Vault type (Forge)
                    break;
                case 1:
                    pageHeader.innerHTML =
                        '<li data-filter="0" class="nav_header_item">DewShare</li>' +
                        '<li data-filter="1" class="nav_header_item selected"><i class="nav_header_item_arrow fa fa-chevron-down" aria-hidden="true"></i>Reddit</li>';
                    pageSelf.pageSetPageType(5, true); //Set to default Reddit type (Videos)
                    break;

                //Menu Footers
                case 2:
                    pageFooter.innerHTML =
                        '<li data-filter="2" class="vault_nav_footer_item selected"><i class="nav_header_item_arrow fa fa-chevron-down" aria-hidden="true"></i>Forge</li>' +
                        '<li data-filter="3" class="vault_nav_footer_item">Files</li>' +
                        '<li data-filter="4" class="vault_nav_footer_item">Community</li>' + 
                        '<li class="vault_nav_footer_item_servers">Servers</li>';
                    pageCurrentType = 3;
                    if (init)
                        pageSelf.pageVaultLoadPage(3, init);
                    break;
                case 3:
                    pageFooter.innerHTML =
                        '<li data-filter="2" class="vault_nav_footer_item">Forge</li>' +
                        '<li data-filter="3" class="vault_nav_footer_item selected"><i class="nav_header_item_arrow fa fa-chevron-down" aria-hidden="true"></i>Files</li>' +
                        '<li data-filter="4" class="vault_nav_footer_item">Community</li>' +
                        '<li class="vault_nav_footer_item_servers">Servers</li>';
                    pageCurrentType = 4;
                    if (init)
                        pageSelf.pageVaultLoadPage(4, init);
                    break;
                case 4:
                    pageFooter.innerHTML =
                        '<li data-filter="2" class="vault_nav_footer_item">Forge</li>' +
                        '<li data-filter="3" class="vault_nav_footer_item">Files</li>' +
                        '<li data-filter="4" class="vault_nav_footer_item selected"><i class="nav_header_item_arrow fa fa-chevron-down" aria-hidden="true"></i>Community</li>' +
                        '<li class="vault_nav_footer_item_servers">Servers</li>';
                    pageCurrentType = 5;
                    if (init)
                        pageSelf.pageVaultLoadPage(5, init);
                    break;
                case 5:
                    pageFooter.innerHTML =
                        '<li data-filter="5" class="reddit_nav_footer_item selected"><i class="nav_header_item_arrow fa fa-chevron-down" aria-hidden="true"></i>Screenshots</li>' +
                        '<li data-filter="6" class="reddit_nav_footer_item">Videos</li>';
                    break;
                case 6:
                    pageFooter.innerHTML =
                        '<li data-filter="5" class="reddit_nav_footer_item">Screenshots</li>' +
                        '<li data-filter="6" class="reddit_nav_footer_item selected"><i class="nav_header_item_arrow fa fa-chevron-down" aria-hidden="true"></i>Videos</li>';
                    break;
            }
        } 
        catch (ex) {
            console.log(ex.message);
        }
    }

    this.pageClear = function() {
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
    this.pageState = function (state) {
        try {
            switch (state) {
                case 0: $(".content_slots_loader").addClass("visible");    break; //Show Loader
                case 1: $(".content_slots_loader").removeClass("visible"); break; //Hide Loader
            }
        }
        catch (ex) {
            console.log(ex.message);
            $(".content_slots_loader").removeClass("visible"); //Hide loader on exception
        }
    }

    //=====================================================//
    //= PAGINATION EVENTS                                 =//
    //=====================================================//
    //TODO:
    //
    //

    this.pageHeaderClick = function (event) {
        try {
            var type = -1;
            var targ = $(event.target);
            if (targ && targ.hasClass("selected") === false) {
                type = targ.attr("data-filter");
                pageSelf.pageSetPageType(type, true);
            }
        }
        catch (ex) {
            console.log(ex.message);
        }
    }

    //=====================================================//
    //= HALO VAULT FUNCTIONS                              =//
    //=====================================================//
    //TODO:
    //
    //

    this.pageVaultInit = function() {
        try 
        {
            pageSelf.pageSetPageType(0);
        } 
        catch (ex) {
            console.log(ex.message);
        }
    }
    this.pageVaultLoadPage = function(type, init) {
        try 
        {
            var page = pageSelf.pageVaultBuildPage(type, init);
            if (page) {
                pageSelf.pageClear();
                pageSelf.pageState(0);
                getRequest(page, function (callback) {
                    var results = pageSelf.pageVaultBuildResults(type, callback);
                    if (results) {
                        pageSelf.pageVaultLoadPagination(results);
                        for (var index in results.slots) {
                            var slot = new Slot();
                            if (slot.slotCreate(results.slotType, results.slots[index], pageSlots)) {
                                console.log(slot.title);
                            }
                        }
                        if (pageSlots.innerHTML) {
                            $('.content_slot_middle').on('mousemove', '.content_slot_middle_thumb_overlay ', {}, onTooltipMouseMove);
                            $('.content_slot_middle').on('mouseenter', '.content_slot_middle_thumb_overlay ', {}, onTooltipMouseEnter);
                            $('.content_slot_middle').on('mouseleave', '.content_slot_middle_thumb_overlay ', {}, onTooltipMouseLeave);
                        }
                    }
                    pageSelf.pageState(1);
                });
            }
        } 
        catch (ex) {
            console.log(ex.message);
        }
    }
    this.pageVaultBuildPage = function(type, init) {
        try 
        {
            switch (type) {
                case 3: return "http://haloshare.org/inc/api/listMaps.api?p={0}&r={1}&uid={2}"
                    .format((init) ? 1 : pageVaultFilters.page,
                    pageVaultFilters.results,
                    pageVaultFilters.uid,
                    pageVaultFilters.Author,
                    pageVaultFilters.map,
                    pageVaultFilters.gtype,
                    pageVaultFilters.search);
                case 4: return "http://haloshare.org/inc/api/listFiles.api?p={0}&r={1}&uid={2}&creator={3}&type={4}&search={5}"
                    .format((init) ? 1 : pageVaultFilters.page,
                    pageVaultFilters.results,
                    pageVaultFilters.uid,
                    pageVaultFilters.Author,
                    pageVaultFilters.type,
                    pageVaultFilters.search);
                case 5: return "http://haloshare.org/inc/api/listTopics.api?p={0}&r={1}&uid={2}&author={3}&flair={4}&search={5}"
                    .format((init) ? 1 : pageVaultFilters.page,
                    pageVaultFilters.results,
                    pageVaultFilters.uid,
                    pageVaultFilters.author,
                    pageVaultFilters.flair,
                    pageVaultFilters.search);
            }
        } 
        catch (ex) {
            console.log(ex.message);
            return "";
        }
    }
    this.pageVaultBuildResults = function(type, results) {
        try
        {
            var data = {
                page: (results && results.PAGE_RESULTS.currentPage)
                    ? results.PAGE_RESULTS.currentPage
                    : null,
                pages: (results && results.PAGE_RESULTS.pagesPossible)
                    ? results.PAGE_RESULTS.pagesPossible
                    : null,
                total: 0,
                results: 0,
                prefix: "Showing ({0}) of ({1}) total {2}",
                slots: {},
                slotType: -1
            }
            switch (type) {
                case 3:
                    data.total = (results && results.PAGE_RESULTS.totalMaps) ? results.PAGE_RESULTS.totalMaps : 0;
                    data.results = (results && results.PAGE_RESULTS.mapsOnPage) ? results.PAGE_RESULTS.mapsOnPage : 0;
                    data.prefix = "Showing ({0}) of ({1}) total maps".format(data.results, data.total);
                    data.slots = (results && results.MAP_RESULTS) ? results.MAP_RESULTS : {};
                    data.slotType = 0;
                    break;
                case 4:
                    data.total = (results && results.PAGE_RESULTS.totalFiles) ? results.PAGE_RESULTS.totalFiles : 0;
                    data.results = (results && results.PAGE_RESULTS.filesOnPage) ? results.PAGE_RESULTS.filesOnPage : 0;
                    data.prefix = "Showing ({0}) of ({1}) total files".format(data.results, data.total);
                    data.slots = (results && results.FILE_RESULTS) ? results.FILE_RESULTS : {};
                    data.slotType = 1;
                    break;
                case 5:
                    data.total = (results && results.PAGE_RESULTS.totalThreads) ? results.PAGE_RESULTS.totalThreads : 0;
                    data.results = (results && results.PAGE_RESULTS.threadsOnPage) ? results.PAGE_RESULTS.threadsOnPage : 0;
                    data.prefix = "Showing ({0}) of ({1}) total threads".format(data.results, data.total);
                    data.slots = (results && results.COMMUNITY_RESULTS) ? results.COMMUNITY_RESULTS : {};
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
    this.pageVaultLoadPagination = function(results) { 
        try 
        {
            if (results) {
                if (results.page === null)  return;
                if (results.pages === null) return;
                else {
                    var page = parseInt(results.page);
                    var cunt = parseInt(results.pages); //<< LUL
                    if (cunt > 1) {

                        var pageFrst = 1;
                        var pagePrev = (page <= 1) ? 1 : page - 1;
                        var pageNext = (page + 1 >= cunt) ? cunt : page + 1;
                        var pageLast = (cunt);
                        var pageD1   = (page <= 1)    ? "disabled" : "";
                        var pageD2   = (page >= cunt) ? "disabled" : "";

                        $(".content_pagination").append('<a data-page="' + pageFrst + '" class="vault_pager ' + pageD1 + '">First</a>');
                        $(".content_pagination").append('<a data-page="' + pagePrev + '" class="vault_pager ' + pageD1 + '">Prev</a>');

                        for (var i = 1; i <= cunt; i++)
                            if (i != page) $(".content_pagination").append('<a data-page="' + i + '" class="vault_pager direct">' + i + '</a>');
                            else           $(".content_pagination").append('<a data-page="' + page + '" class="direct disabled">' + page + '</a>');

                        $(".content_pagination").append('<a data-page="' + pageNext + '" class="vault_pager ' + pageD2 + '">Next</a>');
                        $(".content_pagination").append('<a data-page="' + pageLast + '" class="vault_pager ' + pageD2 + '">Last</a>');

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

    this.pageVaultPagerClick = function (event) {
        try {
            var page = -1;
            var targ = $(event.target);
            if (targ && targ.hasClass("disabled") === false) {
                page = targ.attr("data-page");
                if (page) {
                    pageVaultFilters.page = page;
                    pageSelf.pageVaultLoadPage(pageCurrentType, false);
                }
            }
        }
        catch (ex) {
            console.log(ex.message);
        }
    }
    this.pageVaultFooterClick = function(event) {
        try 
        {
            var type = -1;
            var targ = $(event.target);
            if (targ && targ.hasClass("selected") === false) {
                type = parseInt(targ.attr("data-filter"));
                pageSelf.pageSetPageType(type, true);
            }
        } 
        catch (ex) {
            console.log(ex.message);
        }
    }

    //=====================================================//
    //= REDDIT FUNCTIONS                                  =//
    //=====================================================//
    //TODO:
    //
    //

}

$(document).ready(function () {

    pagination = new Pagination();
    if (pagination) {

        pagination.pageVaultInit();

        //Hook Pagination Events
        $('.content_navigation_header').on('click', '.nav_header_item', {}, pagination.pageHeaderClick);

        //Hook Pagination Vault Events
        $('.content_pagination').on('click', '.vault_pager', {}, pagination.pageVaultPagerClick);        
        $('.content_navigation_footer').on('click', '.vault_nav_footer_item', {}, pagination.pageVaultFooterClick);
        $('.content_navigation_footer').on('click', '.vault_nav_footer_item_servers', {}, function () {
            location='//browser.haloshare.org'
        });

    }

})