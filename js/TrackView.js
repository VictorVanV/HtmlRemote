"use strict";

var TrackView = (function()
{
    var a, t, p = [0, 0], ply, pos;
    
    function TrackView(container)
    {
        this.container = container;
        this.div = document.createElement('canvas');
        this.div.className = 'trackView';
        this.div.width = this.container.offsetWidth;
        this.div.height = this.container.offsetHeight;
        this.container.appendChild(this.div);

        this.sPos = [0, 0];
        this.zoom = 1;
        
        this.ctx = this.div.getContext('2d');
        
        this.trackName = '';
        this.trackImg = null;
        this.trackCol = 'rgb(100, 100, 100)';
        this.trackPos = [this.div.width * 0.5 + 0.5, this.div.height * 0.5 + 0.5];
        this.trackPosB = [0, 0];
        this.pth = null;
        this.players = null;

        this.cvMouseDownFn = HtmlRemote.bind(this.onCvMouseDown, this);
        this.cvMouseUpFn = HtmlRemote.bind(this.onCvMouseUp, this);
        this.cvMouseMoveFn = HtmlRemote.bind(this.onCvMouseMove, this);
        this.cvMouseWheelFn = HtmlRemote.bind(this.onCvMouseWheel, this);
        this.trackImgLoadFn = HtmlRemote.bind(this.onTrackLoaded, this);
        this.trackImgLoadErrorFn = HtmlRemote.bind(this.onTrackLoadError, this);

        HtmlRemote.addEvent(this.div, 'mousedown', this.cvMouseDownFn);
        HtmlRemote.addEvent(window, 'DOMMouseScroll', this.cvMouseWheelFn);   // FF
        HtmlRemote.addEvent(window, 'mousewheel', this.cvMouseWheelFn);
    }
    
    TrackView.prototype.destroy = function()
    {
        HtmlRemote.removeEvent(this.div, 'mousedown', this.cvMouseDownFn);
        this.container.removeChild(this.div);
        this.players = null;
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
        
        this.setTrackBg();
        
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
    
    TrackView.prototype.setTrackBg = function()
    {
        switch (this.trackName)
        {
            case 'BL' :
                this.trackCol = '#2B2B2B';
                break;
            case 'SO' :
                this.trackCol = '#262E30';
                break;
            case 'FE' :
                this.trackCol = '#385158';
                break;
            case 'KY' :
                this.trackCol = '#303030';
                break;
            case 'WE' :
                this.trackCol = '#1F2729';
                break;
            case 'AS' :
                this.trackCol = '#2E2E2E';
                break;
            case 'AU' :
                this.trackCol = '#5F5F3B';
                break;
            case 'RO' :
                this.trackCol = '#2B2B2B';
                break;
        }
    };
    
    TrackView.prototype.loadPth = function(track)
    {
        console.log('Loading pth http://img.lfs.net/remote/pth/' + track + '.pth.gz');
    };
    
    TrackView.prototype.draw = function(time)
    {
        this.ctx.save();

        // Clear screen
        this.ctx.fillStyle = this.trackCol;
        this.ctx.fillRect(0, 0, this.div.width, this.div.height);
        
        this.ctx.translate(this.trackPos[0], this.trackPos[1]);
        this.ctx.scale(this.zoom, this.zoom);
        
        this.ctx.drawImage(this.trackImg, -1280, -1280, 2560, 2560);
        
        if (this.players)
        {
            for (a = 0; a < this.players.length; a++)
            {
                ply = this.players[a];
                if (!ply || ply.inPits) { continue; }
                pos = ply.getPos(time);
                if (pos[0] === 0 && pos[1] === 0) { continue; }
                
                this.ctx.fillStyle = 'rgb(0, 0, 255)';
                this.ctx.fillRect(pos[0] - 2, pos[1] - 2,
                                  4, 4);
            }
        }
        
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
        p[0] = e.clientX - this.sPos[0];
        p[1] = e.clientY - this.sPos[1];
        this.trackPos[0] = this.trackPosB[0] + p[0];
        this.trackPos[1] = this.trackPosB[1] + p[1];
    };
    
    TrackView.prototype.onCvMouseWheel = function(e)
    {
        // Traverse upwards, up to this.div, to see if there is a scrollable element
        a = false;
        t = HtmlRemote.getETarget(e);
        do
        {
            if (t === this.container)
            {
                a = true;
                break;
            }
            else if (t.scrollHeight > t.offsetHeight + 6)
            {
                return true;
            }
            
            t = t.parentNode;
        } while (t.parentNode);
        
        if (!a)
        {
            return true;
        }
        
        // Zoom
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))),
            oldZoom = this.zoom,
            contPos = HtmlRemote.getObAbsLoc(this.container);

        this.zoom = (delta > 0) ? Math.min(8, this.zoom * 1.25) : Math.max(0.25, this.zoom / 1.25);
        
        p[0] = (e.clientX - contPos[0] - this.trackPos[0]) / oldZoom;
        p[1] = (e.clientY - contPos[1] - this.trackPos[1]) / oldZoom;
        
        a = oldZoom / this.zoom;
        this.trackPos[0] -= (p[0] - (p[0] * a)) * this.zoom;
        this.trackPos[1] -= (p[1] - (p[1] * a)) * this.zoom;
        
        return false;
    };
    
    return TrackView;
})();