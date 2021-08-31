var tipMessage = null;
var tipContent = null;
var tipCanFlow = false;
var tipOffsetX = 50;
var tipOffsetY = 20;
var tipToggled = false;

function setTooltip(e, p) {
    try {
        if (e && p) {
            var tooltip = getTooltip(p);
            if (tooltip) {
                var mOffsetX = parseInt(mouseX + 30);
                var mOffsetY = parseInt(mouseY + 30);
                var wOffsetX = parseInt($(window).width());
                var wOffsetY = parseInt($(window).height());
                if ((mOffsetY + 275 + tipOffsetY) >= wOffsetY) {
                    $(tooltip).css({ left: mOffsetX, top: mOffsetY - 335 });
                    if ((mOffsetX + 400 + tipOffsetX) >= wOffsetX) {
                        $(tooltip).css({ left: mOffsetX - 460, top: mOffsetY - 335 });
                    }
                }
                else if ((mOffsetX + 400 + tipOffsetX) >= wOffsetX) {
                    $(tooltip).css({ left: mOffsetX - 460, top: mOffsetY });
                    if ((mOffsetY + 275 + tipOffsetY) >= wOffsetY) {
                        $(tooltip).css({ left: xmoffsetX, top: mOffsetY - 335 });
                    }
                }
                else {
                    $(tooltip).css({ top: mOffsetY, left: mOffsetX });
                }
            }
        }
    }
    catch (e) {
        tipContent = null;
        tipCanFlow = false;
    }
};
function getTooltip(p) {
    if (p)
        return $(p).children('.tooltip')[0];
    return null;
};
function getTooltipDesc(p) {
    if (p)
        return $(p).children('.tooltipContent').children('.tooltip_description_container')[0];
    return null;
};
function getTooltipMessage(p) {
    if (p)
        return $(p).children('.tooltipContent').children('.tooltipMessage')[0];
    return null;
};

function onTooltipLeave(e) {
    try
    {
        tipToggled = false;
        onTooltipMouseLeave(e);
    }
    catch (e)
    {
        tipContent = null;
        tipCanFlow = false;
        tipToggled = false;
    }
};
function onTooltipMouseMove(e) {
    try {
        var t = $(e.target)[0];
        var p = $(t).parents('.content_slot')[0];
        if (t && p) {
            setTooltip(e, p);
        }
    }
    catch (e) {
        tipContent = null;
        tipCanFlow = false;
    }
};
function onTooltipMouseEnter(e) {
    try {
        var t = $(e.target)[0];
        var p = $(t).parents('.content_slot')[0];
        var c = getTooltip(p);
        var d = getTooltipDesc(c);
        if (t && p && c && d) {
            if ($(d).hasOverflow()) {
                tipContent = $(d);
                tipCanFlow = true;
            }
            if (!$(c).hasClass("active"))
                $(c).addClass("active");
        }
    }
    catch (e) {
        tipContent = null;
        tipCanFlow = false;
    }
};
function onTooltipMouseLeave(e) {
    try {
        var t = $(e.target)[0];
        var p = $(t).parents('.content_slot')[0];
        var c = getTooltip(p);
        if (t && p && c) {
            if ($(c).hasClass("active"))
                $(c).removeClass("active");
            tipContent = null;
            tipCanFlow = false;
        }
    }
    catch (e) {
        tipContent = null;
        tipCanFlow = false;
    }
};

var mouseX;
var mouseY;

$(document).ready(function () {

    var scroll = "onwheel" in document.createElement("div")
        ? "wheel"
        : document.onmousewheel !== undefined
            ? "mousewheel"
            : "DOMMouseScroll";

    $(window).on(scroll, function (event) {
        var prevent = function () {
            event.stopPropagation();
            event.preventDefault
                ? event.preventDefault()
                : event.returnValue = false;
            return false;
        }
        if (tipCanFlow && tipContent) {
            var c = $(tipContent).scrollTop();
            var e = event.originalEvent;
            var d = e.deltaY ? e.deltaY * -1 : e.wheelDelta;
            if (d > 0)
                $(tipContent).scrollTop(c - 10.5);
            else
                $(tipContent).scrollTop(c + 10.5);
            return prevent();
        }
        return true;
    });

    $(window).keyup(function (event) {
        if (event.which === 17) {
            if (tipMessage)
                tipMessage.innerHTML = '<span><i>Hint:</i> Hold \'ctrl\' and move your mouse to interact</span>';
            tipToggled = false;
        }
    });
    $(window).keydown(function (event) {
        if (event.which === 17) {
            if (tipMessage)
                tipMessage.innerHTML = '<span>(Toggled) <i>Hint:</i> While holding \'ctrl\' move your mouse into the tooltip</span>';
            tipToggled = true;
        }
    });
    $(window).mousemove(function (e) {
        mouseX  = parseInt(e.clientX);
        mouseY  = parseInt(e.clientY);
    });

});