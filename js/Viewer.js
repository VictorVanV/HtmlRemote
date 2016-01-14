"use strict";

var Viewer = (function()
{
    function Viewer(div)
    {
        this.container = div;
        this.dim = [this.container.offsetWidth, this.container.offsetHeight];
        
        this.trackView = new TrackView(this.container);
        //this.statusOverlay = new StatusOverlay(this.container);
        this.messageOvl = new MessageOverlay(this.container);
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
            this.hostListOverlay = new HostListOverlay(this.container);
            this.hostListOverlay.onHostSelect = HtmlRemote.bind(this.handleHostSelect, this);
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
    
    Viewer.prototype.handleHostSelect = function(hostInfo)
    {
        this.removeHostList();
        if (this.onHostSelect !== null)
        {
            this.onHostSelect(hostInfo);
        }
    };
    
    Viewer.prototype.startAnimation = function()
    {
        window.requestAnimationFrame(this.tickFn);
        this.running = true;
    };
    
    Viewer.prototype.stopAnimation = function()
    {
        window.cancelAnimationFrame(this.tickFn);
        this.running = false;
    };
    
    Viewer.prototype.tick = function(t)
    {
        this.trackView.draw(t);
        
        if (this.running) {
            window.requestAnimationFrame(this.tickFn);
        }
    };
    
    return Viewer;
})();