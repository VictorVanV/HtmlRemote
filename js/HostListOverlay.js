HtmlRemote.HostListOverlay = (function()
{
    "use strict";
    
    var a, t, entryDiv, nameDiv, trackDiv, connDiv, licDiv;
    
    function HostListOverlay(container)
    {
        this.hostListData = null;
        
        this.container = container;
        this.div = document.createElement('div');
        this.div.className = 'hostListOvl';
        
        this.container.appendChild(this.div);
        
        this.listDiv = document.createElement('div');
        this.listDiv.className = 'hostListList';
        this.div.appendChild(this.listDiv);
        
        this.onHostSelect = null;
        
        this.filterEmpty = true;
    }
    
    HostListOverlay.prototype.destroy = function()
    {
        while (this.listDiv.children.length > 0)
        {
            this.listDiv.removeChild(this.listDiv.children[0]);
        }
        
        this.container.removeChild(this.div);
        this.div.removeChild(this.listDiv);
        this.listDiv = null;
        this.div = null;
        
        this.hostListData = null;
        this.onHostSelect = null;
    };
    
    HostListOverlay.prototype.update = function(hostListData)
    {
        this.clearList();
        this.hostListData = hostListData;

        for (a = 0; a < hostListData.hosts.length; a++)
        {
            if (this.filterEmpty && hostListData.hosts[a].numconns < 2) { continue; }
            
            entryDiv = document.createElement('div');
            entryDiv.className = 'hrBtn hrClick' + (hostListData.hosts[a].flags & 1 ? ' dark' : '');
            entryDiv.idx = a;
            
            licDiv = document.createElement('div');
            licDiv.style.float = 'right';
            licDiv.style.width = '75px';
            licDiv.innerHTML = '| ' + getHostStatusText(hostListData.hosts[a].flags);
            entryDiv.appendChild(licDiv);
            
            connDiv = document.createElement('div');
            connDiv.style.float = 'right';
            connDiv.style.width = '45px';
            connDiv.innerHTML = '| ' + (hostListData.hosts[a].numconns - 1);
            entryDiv.appendChild(connDiv);
            
            trackDiv = document.createElement('div');
            trackDiv.style.float = 'right';
            trackDiv.style.width = '75px';
            trackDiv.innerHTML = '| ' + hostListData.hosts[a].track;
            entryDiv.appendChild(trackDiv);
            
            nameDiv = document.createElement('div');
            nameDiv.innerHTML = HtmlRemote.htmlspecialchars(LfsString.toUCS2(LfsString.remColours(hostListData.hosts[a].hname)));
            entryDiv.appendChild(nameDiv);
            HtmlRemote.addEvent(entryDiv, 'click', HtmlRemote.bind(this.handleHostSelect, this));

            this.listDiv.appendChild(entryDiv);
        }
        
        entryDiv = nameDiv = connDiv = entryDiv = licDiv = null;
    };
    
    HostListOverlay.prototype.clearList = function()
    {
        while (this.listDiv.children.length > 0)
        {
            HtmlRemote.removeEvent(this.listDiv.children[0], 'click', HtmlRemote.bind(this.handleHostSelect, this));
            this.listDiv.removeChild(this.listDiv.children[0]);
        }
    };
    
    HostListOverlay.prototype.handleHostSelect = function(e)
    {
        entryDiv = HtmlRemote.getETarget(e);
        while (entryDiv.idx == undefined &&
               entryDiv.parentNode)
        {
            entryDiv = entryDiv.parentNode;
        }
        
        if (this.onHostSelect !== null)
        {
            this.onHostSelect(this.hostListData.hosts[entryDiv.idx]);
        }
        
        entryDiv = null;
    };
    
    var getHostStatusText = function(flags)
    {
        if ((flags & 4) > 0) { return 'S1'; }
        if ((flags & 8) > 0) { return 'S2'; }
        if ((flags & 16) > 0) { return 'S3'; }
        return 'DEMO';
    };
    
    return HostListOverlay;
})();