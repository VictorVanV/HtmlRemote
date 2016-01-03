"use strict";

function start()
{
//    var div = document.getElementById('htmlRemoteDiv');
//    new HtmlRemote(div).start();
    var divs = document.getElementsByClassName('htmlRemote');
    for (var a = 0; a < divs.length; a++)
    {
        new HtmlRemote(divs[a]).start();
    }
}

(function()
{
    var x, lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (x = 0; x < vendors.length && !window.requestAnimationFrame; ++x)
    {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
    {
        window.requestAnimationFrame = function(callback, element)
        {
            var curTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (curTime - lastTime));
            var id = window.setTimeout(function() { callback(curTime + timeToCall); }, timeToCall);
            lastTime = curTime + timeToCall;
            return id;
        };
    }
    
    if (!window.cancelAnimationFrame)
    {
        window.cancelAnimationFrame = function(id)
        {
            clearTimeout(id);
        };
    }
}());
