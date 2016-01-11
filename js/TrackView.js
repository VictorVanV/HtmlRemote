"use strict";

var TrackView = (function()
{
    function TrackView(container)
    {
        this.container = container;
        this.div = document.createElement('canvas');
        this.div.className = 'trackView';
        
        this.container.appendChild(this.div);
    }
    
    TrackView.prototype.destroy = function()
    {
        this.container.removeChild(this.div);
        this.container = null;
    };
    
    TrackView.prototype.loadTrack = function(track)
    {
        console.log('Gonna load track "' + track + '" into the track view');
        
    };
    
    return TrackView;
})();