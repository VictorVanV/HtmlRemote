"use strict";

var TrackView = (function()
{
    var a, t, z;
    
    function TrackView(container)
    {
        this.container = container;
        this.div = document.createElement('canvas');
        this.div.className = 'trackView';
        this.div.width = this.container.offsetWidth;
        this.div.height = this.container.offsetHeight;
        this.container.appendChild(this.div);

        this.sPos = [0, 0];
        this.zoom = 128;
        
        this.ctx = this.div.getContext('2d');
        
        this.trackName = '';
        this.trackImg = null;
        this.trackCol = [100, 100, 100];
        this.trackPos = [this.div.width * 0.5 + 0.5, this.div.height * 0.5 + 0.5];
        this.trackPosB = [0, 0];
        this.pth = null;
        this.cars = [];

        this.cvMouseDownFn = HtmlRemote.bind(this.onCvMouseDown, this);
        this.cvMouseUpFn = HtmlRemote.bind(this.onCvMouseUp, this);
        this.cvMouseMoveFn = HtmlRemote.bind(this.onCvMouseMove, this);
        this.cvMouseWheelFn = HtmlRemote.bind(this.onCvMouseWheel, this);
        this.trackImgLoadFn = HtmlRemote.bind(this.onTrackLoaded, this);
        this.trackImgLoadErrorFn = HtmlRemote.bind(this.onTrackLoadError, this);

        HtmlRemote.addEvent(this.div, 'mousedown', this.cvMouseDownFn);

        if (window.addEventListener) {
            window.addEventListener('DOMMouseScroll', this.cvMouseWheelFn, false);
        } else {
            HtmlRemote.addEvent(this.div, 'mousewheel', this.cvMouseWheelFn);
        }
    }
    
    TrackView.prototype.destroy = function()
    {
        HtmlRemote.removeEvent(this.div, 'mousedown', this.cvMouseDownFn);
        this.container.removeChild(this.div);
        this.container = null;
        this.cvMouseUpFn = null;
        this.cvMouseMoveFn = null;
        this.trackImgLoadFn = null;
        this.trackImgLoadErrorFn = null;
    };
    
    TrackView.prototype.onResize = function(w, h)
    {
        this.div.width = w;
        this.div.height = h;
    };
    
    TrackView.prototype.loadTrack = function(track)
    {
        console.log('Gonna load track "' + track + '" into the track view');
        this.trackName = track;
        this.trackImg = new Image();
        this.trackImg.loading = true;
        this.trackImg.trackName = track;
        this.trackImg.src = 'http://img.lfs.net/remote/maps/' + track + '.jpg';
        HtmlRemote.addEvent(this.trackImg, 'load', this.trackImgLoadFn);
        HtmlRemote.addEvent(this.trackImg, 'error', this.trackImgLoadErrorFn);
    };
    
    TrackView.prototype.onTrackLoaded = function(e)
    {
        a = HtmlRemote.getETarget(e);
        a.loading = false;

        HtmlRemote.removeEvent(a, 'load', HtmlRemote.bind(this.onTrackLoaded, this));
        HtmlRemote.removeEvent(a, 'error', HtmlRemote.bind(this.onTrackLoadError, this));
        
        if (this.trackImg.trackName != a.trackName) { return; }
    };
    
    TrackView.prototype.onTrackLoadError = function(e)
    {
        a = HtmlRemote.getETarget(e);
        a.loading = false;

        HtmlRemote.removeEvent(a, 'load', this.trackImgLoadFn);
        HtmlRemote.removeEvent(a, 'error', this.trackImgLoadErrorFn);

        console.log('Error loading track map', e);
        this.trackImg = null;
    };
    
    TrackView.prototype.loadPth = function(track)
    {
        console.log('Loading pth http://img.lfs.net/remote/pth/' + track + '.pth.gz');
    };
    
    TrackView.prototype.draw = function(time)
    {
        // Clear screen
        this.ctx.fillStyle = 'rgb(' + this.trackCol.join(',') + ')';
        this.ctx.fillRect(0, 0, this.div.width, this.div.height);
        this.ctx.save();
        
        z = this.zoom / 128;
//        this.ctx.translate(this.div.width * 0.5, this.div.height * 0.5);
        this.ctx.scale(z, z);
//        this.ctx.translate((-this.div.width * 0.5) * 1/z, (-this.div.height * 0.5) * 1/z);
        this.ctx.translate(this.trackPos[0] * 1/z, this.trackPos[1] * 1/z);
        
        this.ctx.drawImage(this.trackImg, -1280, -1280, 2560, 2560);
        
        this.ctx.restore();
    };
    
    TrackView.prototype.onCvMouseDown = function(e)
    {
        HtmlRemote.blockSelect();
        this.sPos = [e.clientX, e.clientY];
        this.trackPosB[0] = this.trackPos[0];
        this.trackPosB[1] = this.trackPos[1];
        HtmlRemote.addEvent(window, 'mouseup', this.cvMouseUpFn);
        HtmlRemote.addEvent(window, 'mousemove', this.cvMouseMoveFn);
    };
    
    TrackView.prototype.onCvMouseUp = function(e)
    {
        HtmlRemote.unBlockSelect();
        HtmlRemote.removeEvent(window, 'mouseup', this.cvMouseUpFn);
        HtmlRemote.removeEvent(window, 'mousemove', this.cvMouseMoveFn);
    };
    
    TrackView.prototype.onCvMouseMove = function(e)
    {
        a = [e.clientX - this.sPos[0], e.clientY - this.sPos[1]];
        this.trackPos[0] = this.trackPosB[0] + a[0];
        this.trackPos[1] = this.trackPosB[1] + a[1];
    };
    
    TrackView.prototype.onCvMouseWheel = function(e)
    {
        t = HtmlRemote.getETarget(e);
        if (t !== this.div) { return; }
        
        var delta = 0;
        if (e.wheelDelta)
        {
            delta = e.wheelDelta / 120;
            if (window.opera) {
                delta = -delta;
            }
        }
        else if (e.detail)
        {
            delta = -e.detail / 3;
        }
        
        //var oldZoom = this.zoom;
        if (delta > 0)
        {
            this.zoom = Math.min(1024, this.zoom * 1.5);
        }
        else
        {
            this.zoom = Math.max(32, this.zoom / 1.5);
        }
    };
    
    return TrackView;
})();