"use strict";

var StatusOverlay = (function()
{
    function StatusOverlay(container)
    {
        this.container = container;
        this.div = document.createElement('div');
        this.div.className = 'statusOvl';
        
        this.messageOvl = new MessageOverlay(this.div);
        
        this.container.appendChild(this.div);
    }
    
    StatusOverlay.prototype.destroy = function()
    {
        this.container.removeChild(this.div);
        this.container = null;
    };
    
    return StatusOverlay;
})();