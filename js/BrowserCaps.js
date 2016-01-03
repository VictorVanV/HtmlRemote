(function(global)
{
	global.BrowserCaps = function(){};

    var a, b;
    var canOption;
    var elem, elem2;

    canOption = false;
	try
	{
	    elem = new XMLHttpRequest();
	    canOption = true;
	}
	catch(e)
	{
    	try
    	{
    	    elem = new ActiveXObject("Microsoft.XMLHTTP");
    	    canOption = true;
    	}
    	catch(e)
    	{
        	try
        	{
        	    elem = new ActiveXObject("Msxml2.XMLHTTP");
        	    canOption = true;
        	}
        	catch(e) {}
    	}
	}
    global.BrowserCaps.AJAX = canOption;
    elem = null;
    
    global.BrowserCaps.WEBSOCKET = ("WebSocket" in window);

    //alert(typeof(DataView));
    //global.BrowserCaps.ARRAYBUFFER = (typeof(ArrayBuffer) == "function" && typeof(ArrayBuffer.prototype) == "object");
    //global.BrowserCaps.DATAVIEW = (typeof(DataView) == "function" && typeof(DataView.prototype) == "object");
    global.BrowserCaps.ARRAYBUFFER = (typeof(ArrayBuffer) != "undefined" && typeof(ArrayBuffer.prototype) == "object");
    global.BrowserCaps.DATAVIEW = (typeof(DataView) != "undefined" && typeof(DataView.prototype) == "object");
    
    canOption = false;
    elem = document.createElement("canvas");
    if (elem && elem.getContext)
    {
        try
        {
            elem2 = elem.getContext("2d");
            canOption = (elem2 !== null);
        }
        catch(e)
        {
            canOption = false;
        }
    }
    global.BrowserCaps.CANVAS2D = canOption;
    elem = null;
    elem2 = null;
    
    canOption = false;
    elem = document.createElement("canvas");
    if (elem && elem.getContext)
    {
        try
        {
            elem2 = elem.getContext("webgl") || elem.getContext("experimental-webgl");
            canOption = (elem2 !== null);
        }
        catch(e)
        {
            canOption = false;
        }
    }
    global.BrowserCaps.CANVAS3D = canOption;
    elem = null;
    elem2 = null;
    
    global.BrowserCaps.WEBCL = (window.WebCL != undefined);
    var clPlatforms = [];
    if (BrowserCaps.WEBCL)
    {
        try
        {
            var plat, devType, clDevices, devices;
            var platforms = WebCL.getPlatformIDs();
            for (a in platforms)
            {
                clDevices = [];
                plat = platforms[a];
                devices = plat.getDeviceIDs(WebCL.CL_DEVICE_TYPE_ALL);
                for (b in devices)
                {
                    switch(devices[b].getDeviceInfo(WebCL.CL_DEVICE_TYPE))
                    {
                        case WebCL.CL_DEVICE_TYPE_CPU:
                            devType = "cpu";
                            break;
                        case WebCL.CL_DEVICE_TYPE_GPU:
                            devType = "gpu";
                            break;
                        case WebCL.CL_DEVICE_TYPE_ACCELERATOR:
                            devType = "accelerator";
                            break;
                        case WebCL.CL_DEVICE_TYPE_DEFAULT:
                            devType = "default";
                            break;
                        default:
                            devType = "unknown";
                            break;
                    }
                    clDevices.push({index: b,
                                    type: devType,
                                    name: devices[b].getDeviceInfo(WebCL.CL_DEVICE_NAME)});
                }
                clPlatforms.push({index: a,
                                  name: plat.getPlatformInfo(WebCL.CL_PLATFORM_NAME), 
                                  devices: clDevices});
            }
        }
        catch (e) { alert("webcl error : " + e.message); }
    }
    global.BrowserCaps.WEBCLPLATFORMNAMES = clPlatforms;

    elem = document.createElement("video");
    global.BrowserCaps.VIDEO = (elem != undefined && elem !== null && elem.play);
    
    var support;
    var vidCaps = [];
    var vidTypes = [
        'mp4; codecs="avc1.42E01E, mp4a.40.2"',
        'mp4; codecs="avc1.58A01E, mp4a.40.2"', 
        'mp4; codecs="avc1.4D401E, mp4a.40.2"', 
        'mp4; codecs="avc1.64001E, mp4a.40.2"', 
        'mp4; codecs="mp4v.20.8, mp4a.40.2"', 
        'mp4; codecs="mp4v.20.240, mp4a.40.2"', 
        'webm; codecs=vorbis', 
        'webm; codecs=vp8', 
        'webm; codecs=vp8.0', 
        'webm; codecs="vp8, vorbis"', 
        '3gpp; codecs="mp4v.20.8, samr"', 
        'ogg; codecs="theora, vorbis"',
        'ogg; codecs="theora, speex"',
        'ogg; codecs=vorbis',
        'ogg; codecs=speex',
        'ogg; codecs="dirac, vorbis"',
        'x-matroska; codecs="theora, vorbis"'
    ];
    
    if (!BrowserCaps.VIDEO || !elem.canPlayType)
    {
        vidCaps.push("unknown");
    }
    else
    {
        for (a = 0; a < vidTypes.length; a++)
        {
            support = elem.canPlayType("video/" + vidTypes[a]);
            if (support === "") { continue; }
            //if (support === "") { support = "no"; }
            vidCaps.push({"Type" : vidTypes[a], "Support" : support});
        }
    }
    global.BrowserCaps.ENUMVIDEOCAPS = vidCaps;
    elem = null;
}(this));
