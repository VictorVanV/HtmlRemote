HtmlRemote.Viewer = (function()
{
    "use strict";
    
    function Viewer(div)
    {
        this.container = div;
        this.dim = [this.container.offsetWidth, this.container.offsetHeight];
        
        this.trackView = new HtmlRemote.TrackView(this.container);

        this.hostView = null;
        this.onHostNameClick = null;
        
        this.messageOvl = new HtmlRemote.MessageOverlay(this.container);
        
        this.playerView = new HtmlRemote.PlayerView(this.container);

        this.hostListOverlay = null;
        this.onHostSelect = null;
        
        this.running = false;
        
        this.tickFn = HtmlRemote.bind(this.tick, this);
        
        HtmlRemote.addEvent(window, 'resize', HtmlRemote.bind(this.handleWinResize, this));
    }
    
    Viewer.prototype.destroy = function()
    {
        HtmlRemote.removeEvent(window, 'resize', HtmlRemote.bind(this.handleWinResize, this));
        this.removeHostList();
        this.trackView.destroy();
        this.trackView = null;
        this.statusOverlay.destroy();
        this.statusOverlay = null;
        this.onHostSelect = null;
        this.onHostNameClick = null;
    };
    
    Viewer.prototype.handleWinResize = function(e)
    {
        if (this.dim[0] != this.container.offsetWidth ||
            this.dim[1] != this.container.offsetHeight)
        {
            // Set dimension again
            this.dim = [this.container.offsetWidth, this.container.offsetHeight];
            console.log(this.dim);

            // Dimension changed - resize viewer and elements
            this.trackView.onResize(this.dim[0], this.dim[1]);
        }
    };
    
    Viewer.prototype.drawHostList = function(hostListData)
    {
        if (!this.hostListOverlay)
        {
            this.hostListOverlay = new HtmlRemote.HostListOverlay(this.container);
            this.hostListOverlay.onHostSelect = HtmlRemote.bind(this.handleHostSelect, this);
            this.hostListOverlay.onListClose = HtmlRemote.bind(this.handleHostListClose, this);
        }
        this.hostListOverlay.update(hostListData);
    };
    
    Viewer.prototype.removeHostList = function()
    {
        if (this.hostListOverlay)
        {
            this.hostListOverlay.destroy();
            this.hostListOverlay = null;
        }
    };
    
    Viewer.prototype.handleHostListClose = function()
    {
        this.removeHostList();
    };
    
    Viewer.prototype.handleHostSelect = function(hostInfo)
    {
        this.removeHostList();
        if (this.onHostSelect !== null)
        {
            this.onHostSelect(hostInfo);
        }
        
        if (!this.hostView)
        {
            this.hostView = new HtmlRemote.HostView(this.container);
            this.hostView.onHostNameClick = HtmlRemote.bind(this.handleHostNameClick, this);
        }
        this.hostView.hostNameDiv.innerHTML = HtmlRemote.htmlspecialchars(LfsString.toUCS2(LfsString.remColours(hostInfo.hname)));
        this.hostView.trackNameDiv.innerHTML = hostInfo.track;
    };
    
    Viewer.prototype.setTrack = function(trackName)
    {
        this.hostView.trackNameDiv.innerHTML = trackName;
        this.trackView.loadTrack(trackName.slice(0, 2));
        this.trackView.loadPath(trackName);
    };
    
    Viewer.prototype.setPathSplits = function(finish, split1, split2, split3)
    {
        this.trackView.path.finishLine = finish;
        this.trackView.path.split1 = split1;
        this.trackView.path.split2 = split2;
        this.trackView.path.split3 = split3;
        this.trackView.drawPath();
    };
    
    Viewer.prototype.startAnimation = function()
    {
        if (!this.running)
        {
            window.requestAnimationFrame(this.tickFn);
            this.running = true;
        }
    };
    
    Viewer.prototype.stopAnimation = function()
    {
        window.cancelAnimationFrame(this.tickFn);
        this.running = false;
    };
    
    Viewer.prototype.tick = function(t)
    {
        this.trackView.draw(t);
        if (this.hostView)
        {
            this.hostView.drawTime(t);
        }
        
        if (this.running) {
            window.requestAnimationFrame(this.tickFn);
        }
    };
    
    Viewer.prototype.handleHostNameClick = function(e)
    {
        if (this.onHostNameClick)
        {
            this.onHostNameClick(e);
        }
    };
    
    return Viewer;
})();