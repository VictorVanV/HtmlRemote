"use strict";

var TrackView = (function()
{
    var a;
    
    function TrackView(container)
    {
        this.container = container;
        this.div = document.createElement('canvas');
        this.div.className = 'trackView';
        this.div.width = this.container.offsetWidth;
        this.div.height = this.container.offsetHeight;
        this.container.appendChild(this.div);
        
        this.ctx = this.div.getContext('2d');
        
        this.trackName = '';
        this.trackImg = null;
        this.trackCol = [100, 100, 100];
        this.pth = null;
        this.cars = [];
    }
    
    TrackView.prototype.destroy = function()
    {
        this.container.removeChild(this.div);
        this.container = null;
    };
    
    TrackView.prototype.onResize = function(w, h)
    {
        this.div.width = w;
        this.div.height = h;
        this.draw();
    };
    
    TrackView.prototype.loadTrack = function(track)
    {
        console.log('Gonna load track "' + track + '" into the track view');
        this.trackName = track;
        this.trackImg = new Image();
        this.trackImg.loading = true;
        this.trackImg.trackName = track;
        this.trackImg.src = 'http://img.lfs.net/remote/maps/' + track + '.jpg';
        HtmlRemote.addEvent(this.trackImg, 'load', HtmlRemote.bind(this.onTrackLoaded, this));
        HtmlRemote.addEvent(this.trackImg, 'error', HtmlRemote.bind(this.onTrackLoadError, this));
    };
    
    TrackView.prototype.onTrackLoaded = function(e)
    {
        a = HtmlRemote.getETarget(e);
        a.loading = false;
        if (this.trackImg.trackName != a.trackName) { return; }
        
        this.draw();
    };
    
    TrackView.prototype.onTrackLoadError = function(e)
    {
        console.log('Error loading track map', e);
        this.trackImg = null;
    };
    
    TrackView.prototype.loadPth = function(track)
    {
        console.log('Loading pth http://img.lfs.net/remote/pth/' + track + '.pth.gz');
    };
    
    TrackView.prototype.draw = function()
    {
        // Clear screen
        this.ctx.fillStyle = 'rgb(' + this.trackCol.join(',') + ')';
        this.ctx.fillRect(0, 0, this.div.width, this.div.height);
        this.ctx.save();
        
        // Draw track (temp test)
        var x = this.div.width * 0.5;
        var y = this.div.height * 0.5;
        
        this.ctx.translate(x, y);
        
        this.ctx.drawImage(this.trackImg, -1280, -1280, 2560, 2560);
        
        this.ctx.restore();
    };
    
    return TrackView;
})();