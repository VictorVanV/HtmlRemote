"use strict";

var RacerView = (function()
{
    function RacerView(container)
    {
        this.container = container;
        this.div = document.createElement('div');
        this.div.className = 'racerView';
        this.div.innerHTML = 'racer view here';

        this.container.appendChild(this.div);
    }
    
    RacerView.prototype.destroy = function()
    {
        
    };
    
    return RacerView;
})();