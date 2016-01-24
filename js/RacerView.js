"use strict";

var RacerView = (function()
{
    function RacerView(container)
    {
        this.container = container;
        this.div = document.createElement('div');
        this.div.className = 'racerView';
        
        this.testDiv = document.createElement('div');
        this.testDiv.className = 'hrBtn inline';
        this.testDiv.innerHTML = 'test div';
        this.div.appendChild(this.testDiv);
        

        this.container.appendChild(this.div);
    }
    
    RacerView.prototype.destroy = function()
    {
        
    };
    
    return RacerView;
})();