var auth = null;
var authUser = {};

function Auth() {

    var self = this;

    this.authInit = function() { 
        try 
        {
            self.authGetLogin();
        } 
        catch (ex) {
            console.log(ex.message);
        }
    }
    this.authGetLogin = function(callback) { 
        try 
        {
            $.ajax({
                url: "http://haloshare.org/inc/api/isLogged.api" + '?callback=?',
                type: "GET",
                dataType: "jsonp",
                crossDomain: true,
                jsonp: 'json_callback',
                success: function (data) {
                    if (!data || !data.uname) {
                        self.authSetLogin(null);
                        if (callback) callback(false);
                    }
                    else {
                        self.authSetLogin({
                            name:    (data.uname)       ? data.uname  : "",
                            nick:    (data.alias)       ? data.alias  : "",
                            puid:    (data.id)          ? data.id     : "",
                            slogan:  (data.slogan)      ? data.slogan : "",
                            avatar:  (data.avatar)      ? data.avatar : null,
                            lastLog: (data.last_action) ? getDayFromDate(new Date(data.last_action)) : ""
                        });
                        if (callback) callback(true);
                    }
                },
                error: function (error) {
                    self.authSetLogin(null);
                    if (callback) callback(false);
                }
            });
        } 
        catch (ex) {
            console.log(ex.message);
            self.authSetLogin(null);
            if (callback) callback(false);
        }
    }
    this.authSetLogin = function(data) { 
        try 
        {
            if (!data) {

                authUser = {};

                $(".content_login").addClass("logged");

                $(".content_login_header")
                $(".content_login_header_avatar").attr("src", "site/src/images/icons/ico-avatar.gif");
                $(".content_login_header_container").empty();
                $(".content_login_header_container").append("<span class='content_login_header_title'>Not Logged In</span>");
                $(".content_login_header_container").append("<a class='content_login_header_login' href='javascript:void(0)'>Login</a>");
                $(".content_login_header_container").addClass("logged");
                $(".content_login_header_container").off().on("click", ".content_login_header_login", self.authLogin);

                return false;

            }
            else {

                authUser = data;

                $(".content_login").addClass("logged");

                $(".content_login_header")
                $(".content_login_header_avatar").attr("src", authUser.avatar);
                $(".content_login_header_container").empty();
                $(".content_login_header_container").append('<span class="content_login_header_title">' + authUser.name + '</span>');
                $(".content_login_header_container").append('<a class="content_login_header_login"" title=' + authUser.lastLog + ' href="javascript:void(0)">Logout</a>');
                $(".content_login_header_container").addClass("logged");
                $(".content_login_header_container").off().on("click", ".content_login_header_login", self.authLogout);

                $(".content_login_dropdown").removeClass("active");

                return true;

            }
        } 
        catch (ex) {
            console.log(ex.message);
            return false;
        }
    }

    this.authLogin = function() {
        try 
        {
            self.authGetLogin(function(result) {
                if (result == false) {
                    $(".content_login_dropdown").addClass("active");
                }
            });
        } 
        catch (ex) {
            console.log(ex.message);
        }
    }
    this.authLogout = function() {
        try 
        {
            self.authSetLogin(null);
        } 
        catch (ex) {
            console.log(ex.message);
        }
    }
    this.authAvatarMouse = function(event) { 
        try 
        {
            switch (event.type) {
                case "mouseenter": 
                    $(".content_login_dropdown").addClass("active");
                    break;
                case "mouseleave": 
                    $(".content_login_dropdown").removeClass("active");
                    break;
                default: break;
            }
        } 
        catch (ex) {
            
        }
    }

};

$(document).ready(function () {

    auth = new Auth();
    if (auth)
        auth.authInit();

});