"use strict";

var HostView = (function()
{
    var a, b;
    
    function HostView(container)
    {
        this.container = container;
        this.div = document.createElement('div');
        this.div.className = 'hostView';
        
        this.onHostNameClick = null;
        this.hostNameDiv = document.createElement('div');
        this.hostNameDiv.className = 'hrBtn hrClick inline';
        HtmlRemote.addEvent(this.hostNameDiv, 'click', HtmlRemote.bind(this.handleHostNameClick, this));
        this.div.appendChild(this.hostNameDiv);
        
        this.trackNameDiv = document.createElement('div');
        this.trackNameDiv.className = 'hrBtn inline';
        this.div.appendChild(this.trackNameDiv);
        
        this.modeDiv = document.createElement('div');
        this.modeDiv.className = 'hrBtn inline';
        this.div.appendChild(this.modeDiv);

        this.timeStart = 0;
        this.raceTime = 0;
        this.timeDiv = document.createElement('div');
        this.timeDiv.className = 'hrBtn inline';
        this.timeDiv.style.width = '70px';
        this.timeDiv.style.textAlign = 'center';
        this.div.appendChild(this.timeDiv);
        
        this.lobby = false;
        
        this.container.appendChild(this.div);
    }
    
    HostView.prototype.destroy = function()
    {
        
    };
    
    HostView.prototype.handleHostNameClick = function(e)
    {
        if (this.onHostNameClick)
        {
            this.onHostNameClick(e);
        }
    };
    
    HostView.prototype.setLobby = function(toggle)
    {
        if (toggle)
        {
            this.timeDiv.innerHTML = 'Lobby';
        }
        this.lobby = toggle;
    };
    
    HostView.prototype.setMode = function(pkt, raceInProg)
    {
        if (raceInProg == 2 && pkt.qualmins > 0)
        {
            if (pkt.qualmins > 60)
            {
                a = Math.floor(pkt.qualmins / 60);
                b = pkt.qualmins - a * 60;
                this.modeDiv.innerHTML = 'Qualify ' + a + ' hour' + (a == 1 ? '' : 's') + ' and ' + b + ' minute' + (b == 1 ? '' : 's');
            }
            else
            {
                this.modeDiv.innerHTML = 'Qualify ' + pkt.qualmins + ' minute' + (pkt.qualmins == 1 ? '' : 's');
            }
        }
        else if (raceInProg == 1 && pkt.racelaps > 0)
        {
            if (pkt.racelaps < 100)
            {
                this.modeDiv.innerHTML = pkt.racelaps + ' lap' + (pkt.racelaps == 1 ? '' : 's');
            }
            else if (pkt.racelaps < 191)
            {
                a = (pkt.racelaps - 100) * 10 + 100;
                this.modeDiv.innerHTML = a + ' laps';
            }
            else
            {
                a = pkt.racelaps - 190;
                this.modeDiv.innerHTML = a + ' hour' + (a == 1 ? '' : 's');
            }
        }
        else
        {
            this.modeDiv.innerHTML = 'Practise';
        }
    };
    
    HostView.prototype.setTime = function(time)
    {
        this.timeStart = 0;
        this.raceTime = time;
        if (!this.lobby) {
            this.timeDiv.innerHTML = HtmlRemote.ms2Msht(this.raceTime);
        }
    };
    
    HostView.prototype.drawTime = function(time)
    {
        if (!this.timeStart)
        {
            this.timeStart = time;
        }
        if (!this.lobby) {
            this.timeDiv.innerHTML = HtmlRemote.ms2Msht(this.raceTime + Math.floor(time - this.timeStart)).slice(0, -1);
        }
    }
    
    return HostView;
})();