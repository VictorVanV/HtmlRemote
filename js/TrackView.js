HtmlRemote.TrackView = (function()
{
    "use strict";
    
    var a, d, h, t, p = [0, 0], ply, pos;
    
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
        this.trackRotation = 0;
        this.path = new HtmlRemote.LfsPath();
        this.pathCv = document.createElement('canvas');
        this.showPath = true;
        this.players = null;
        this.showRacePos = true;
        this.ctrlShift = false;
        this.followPlayer = null;

        this.cvMouseDownFn = HtmlRemote.bind(this.onCvMouseDown, this);
        this.cvMouseUpFn = HtmlRemote.bind(this.onCvMouseUp, this);
        this.cvMouseMoveFn = HtmlRemote.bind(this.onCvMouseMove, this);
        this.cvMouseWheelFn = HtmlRemote.bind(this.onCvMouseWheel, this);
        this.trackImgLoadFn = HtmlRemote.bind(this.onTrackLoaded, this);
        this.trackImgLoadErrorFn = HtmlRemote.bind(this.onTrackLoadError, this);
        this.keyDownFn = HtmlRemote.bind(this.onKeyDown, this);
        this.keyUpFn = HtmlRemote.bind(this.onKeyUp, this);

        HtmlRemote.addEvent(this.div, 'mousedown', this.cvMouseDownFn);
        HtmlRemote.addEvent(window, 'DOMMouseScroll', this.cvMouseWheelFn);   // FF
        HtmlRemote.addEvent(window, 'mousewheel', this.cvMouseWheelFn);
        HtmlRemote.addEvent(document, 'keydown', this.keyDownFn);
        HtmlRemote.addEvent(document, 'keyup', this.keyUpFn);
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
        this.trackName = track;
        if (!this.trackImg) {
            this.trackImg = new Image();
        }
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

        HtmlRemote.removeEvent(a, 'load', this.trackImgLoadFn);
        HtmlRemote.removeEvent(a, 'error', this.trackImgLoadErrorFn);
        
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
    
    TrackView.prototype.loadPath = function(track)
    {
        this.path.load(track);
        this.path.onLoad = HtmlRemote.bind(this.onPathLoaded, this);
        this.path.clear(this.pathCv);
    };
    
    TrackView.prototype.onPathLoaded = function()
    {
        this.path.onLoad = null;
        this.pathCv.width = 2560;
        this.pathCv.height = 2560;
        this.path.generate(this.pathCv, this.zoom);
    };
    
    TrackView.prototype.drawPath = function()
    {
        this.pathCv.width = 2560;
        this.pathCv.height = 2560;
        this.path.generate(this.pathCv, this.zoom);
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
    
    TrackView.prototype.draw = function(time)
    {
        d = new Date().getTime();
        
        this.setFollowTrackPos(d);
        
        this.ctx.save();

        // Clear screen
        this.ctx.fillStyle = this.trackCol;
        this.ctx.fillRect(0, 0, this.div.width, this.div.height);
        
        // Whole track rotation
        this.ctx.translate(this.div.width / 2, this.div.height / 2);
        this.ctx.rotate(this.trackRotation);
        this.ctx.translate(-this.div.width / 2, -this.div.height / 2);
        
        // Track position
        this.ctx.translate(this.trackPos[0], this.trackPos[1]);
        this.ctx.scale(this.zoom, this.zoom);
        
        // Draw track + path
        this.ctx.drawImage(this.trackImg, -1280, -1280, 2560, 2560);
        if (this.showPath) {
            this.ctx.drawImage(this.pathCv, -1280, -1280, 2560, 2560);
        }
        
        // Draw player / cars
        if (this.players)
        {
            for (a = 0; a < this.players.length; a++)
            {
                ply = this.players[a];
                if (!ply || ply.inPits) { continue; }
                pos = ply.getPos(d);
                if (pos[0] === 0 && pos[1] === 0) { continue; }
                h = -ply.getHeading(d);

                this.ctx.save();
                this.ctx.translate(pos[0], pos[1]);
                this.ctx.rotate(h);
                this.ctx.translate(-pos[0], -pos[1]);
                this.ctx.fillStyle = 'rgb(0, 0, 255)';
                this.ctx.fillRect(pos[0] - 1.2, pos[1] - 2, 2.4, 4);
                this.ctx.restore();
                
                t = '';
                if (this.showRacePos) {
                    t += ply.racePos + '. ';
                }
                if (this.ctrlShift) {
                    t += ply.userName;
                } else {
                    t += ply.playerNameUcs2;
                }

                this.ctx.save();
                this.ctx.translate(pos[0], pos[1]);
                this.ctx.rotate(-this.trackRotation);
                this.ctx.translate(-pos[0], -pos[1]);
                this.ctx.scale(1 / this.zoom, 1 / this.zoom);
                this.ctx.font = '14px Arial';
                this.ctx.fillStyle = 'black';
                this.ctx.fillText(t, pos[0] * this.zoom, pos[1] * this.zoom);
                this.ctx.restore();
            }
        }
        
        this.ctx.restore();
    };
    
    TrackView.prototype.nextFollowPlayer = function()
    {
        // arf, have to do sorting ... let's just test this natural order for now.
        
        h = (this.followPlayer) ? 0 : 1;
        if (this.players)
        {
            for (a = 0; a < this.players.length; a++)
            {
                ply = this.players[a];
                if (!ply || ply.inPits) { continue; }
                
                if (h)
                {
                    this.followPlayer = ply;
                    return;
                }
                else if (this.followPlayer.plId == ply.plId)
                {
                    h = 1;
                }
            }
        }
        
        if (h < 2) {
            this.followPlayer = null;
        }
    };
    
    TrackView.prototype.removeFollowPlayer = function(plId)
    {
        if (!this.followPlayer) { return; }
        if (!plId ||
            this.followPlayer.plId == plId)
        {
            this.followPlayer = null;
        }
    };
    
    TrackView.prototype.setFollowTrackPos = function(time)
    {
        if (!this.followPlayer) { return; }
        
        p = this.followPlayer.getPos(time);
        this.trackPos[0] = -p[0] * this.zoom + this.div.width * 0.5;
        this.trackPos[1] = -p[1] * this.zoom + this.div.height * 0.5;
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
        if (e.ctrlKey)
        {
            this.trackRotation -= p[0] / 360;
            this.sPos[0] = e.clientX;
            this.sPos[1] = e.clientY;
        }
        else
        {
            if (this.followPlayer && (Math.abs(p[0]) > 5 || Math.abs(p[1]) > 5))
            {
                this.followPlayer = null;
                this.sPos[0] = e.clientX;
                this.sPos[1] = e.clientY;
                this.trackPosB[0] = this.trackPos[0];
                this.trackPosB[1] = this.trackPos[1];
                p[0] = 0;
                p[1] = 0;
            }
            this.trackPos[0] = this.trackPosB[0] + (p[0] * Math.cos(-this.trackRotation) - p[1] * Math.sin(-this.trackRotation));
            this.trackPos[1] = this.trackPosB[1] + (p[0] * Math.sin(-this.trackRotation) + p[1] * Math.cos(-this.trackRotation));
        }
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
    
    TrackView.prototype.onKeyDown = function(e)
    {
        this.ctrlShift = (e.ctrlKey && e.shiftKey);
        switch (e.keyCode)
        {
            case 80:
                this.showPath = !this.showPath;
                break;
        }
    };
    
    TrackView.prototype.onKeyUp = function(e)
    {
        this.ctrlShift = (e.ctrlKey && e.shiftKey);
    };
    
    return TrackView;
})();