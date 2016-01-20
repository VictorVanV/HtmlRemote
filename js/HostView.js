"use strict";

var HostView = (function()
{
    function HostView(container)
    {
        this.container = container;
        this.div = document.createElement('div');
        this.div.className = 'hostView';
        this.div.innerHTML = 'host view here';

        this.container.appendChild(this.div);
    }
    
    HostView.prototype.destroy = function()
    {
        
    };
    
    return HostView;
})();