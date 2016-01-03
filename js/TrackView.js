"use strict";

var TrackView = (function()
{
    function TrackView(container)
    {
        this.container = container;
        this.div = document.createElement('div');
        this.div.className = 'trackView';
        
        this.container.appendChild(this.div);
    }
    
    TrackView.prototype.destroy = function()
    {
        this.container.removeChild(this.div);
        this.container = null;
    };
    
    return TrackView;
})();