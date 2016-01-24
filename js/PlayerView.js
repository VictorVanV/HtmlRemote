"use strict";

var PlayerView = (function()
{
    var a, p,
        cell, playerRow, posDiv, nameDiv, carDiv;
    
    function PlayerView(container)
    {
        this.container = container;
        this.div = document.createElement('table');
        this.div.setAttribute('border', '0');
        this.div.className = 'racerView';
        
        this.divBody = document.createElement('tbody');
        this.div.appendChild(this.divBody);
        
        this.players = [];
        this.playerIndices = [];
        this.playerRows = [];

        this.container.appendChild(this.div);

        this.ctrlShift = false;
        
        this.keyDownFn = HtmlRemote.bind(this.onKeyDown, this);
        this.keyUpFn = HtmlRemote.bind(this.onKeyUp, this);
        
        HtmlRemote.addEvent(document, 'keydown', this.keyDownFn);
        HtmlRemote.addEvent(document, 'keyup', this.keyUpFn);
    }
    
    PlayerView.prototype.destroy = function()
    {
        this.players.length = 0;
        
        for (a = 0; a < this.playerRows.length; a++)
        {
            if (this.playerRows[a])
            {
                this.destroyPlayer(a);
            }
        }
        this.playerRows.length = 0;
        
        this.keyDownFn = null;
        this.keyUpFn = null;
        
        HtmlRemote.removeEvent(document, 'keydown', this.keyDownFn);
        HtmlRemote.removeEvent(document, 'keyup', this.keyUpFn);
    };
    
    PlayerView.prototype.destroyPlayer = function(a)
    {
        this.div.removeChild(this.playerRows[a]);
        this.playerRows[a] = null;
    };
    
    PlayerView.prototype.setPlayers = function(players)
    {
        this.players = players;
        for (a = 0; a < this.playerRows.length; a++)
        {
            if (this.playerRows[a])
            {
                this.destroyPlayer(a);
            }
        }
        this.playerRows.length = 0;
    };
    
    PlayerView.prototype.createPlayer = function(a)
    {
        p = this.players[a];
        
        playerRow = document.createElement('tr');
        playerRow.player = p;
        
        cell = document.createElement('td');
        posDiv = document.createElement('div');
        posDiv.className = 'hrBtn';
//        posDiv.innerHTML = p.racePos;
        cell.appendChild(posDiv);
        playerRow.appendChild(cell);
        
        cell = document.createElement('td');
        nameDiv = document.createElement('div');
        nameDiv.className = 'hrBtn';
//        nameDiv.innerHTML = p.playerNameUcs2;
        cell.appendChild(nameDiv);
        playerRow.appendChild(cell);
        
        cell = document.createElement('td');
        carDiv = document.createElement('div');
        carDiv.className = 'hrBtn';
//        carDiv.innerHTML = p.playerNameUcs2;
        cell.appendChild(carDiv);
        playerRow.appendChild(cell);
        
        return playerRow;
    };
    
    PlayerView.prototype.draw = function()
    {
        this.playerIndices.length = 0;
        for (a = 0; a < this.players.length; a++)
        {
            p = this.players[a];
            if (!p)
            {
                if (this.playerRows[a])
                {
                    this.destroyPlayer(a);
                }
                continue;
            }
            
            if (!this.playerRows[a])
            {
                // Create player object
                this.playerRows[a] = this.createPlayer(a);
                this.playerRows[a].drawn = true;
                this.div.appendChild(this.playerRows[a]);
            }
            
            this.playerIndices.push(a);
        }
        
        for (a = 0; a < this.playerIndices.length; a++)
        {
            playerRow = this.playerRows[this.playerIndices[a]];
            if (playerRow.drawn)
            {
                this.div.appendChild(playerRow);
                playerRow.drawn = true;
            }
            
            p = this.players[this.playerIndices[a]];
            playerRow.children[0].firstChild.innerHTML = p.racePos;
            if (this.ctrlShift) {
                playerRow.children[1].firstChild.innerHTML = p.userName;
            } else {
                playerRow.children[1].firstChild.innerHTML = p.playerNameUcs2;
            }
            playerRow.children[2].firstChild.innerHTML = p.carName;
        }
    }
    
    PlayerView.prototype.onKeyDown = function(e)
    {
        a = this.ctrlShift;
        this.ctrlShift = (e.ctrlKey && e.shiftKey);
        if (a !== this.ctrlShift) {
            this.draw();
        }
    };
    
    PlayerView.prototype.onKeyUp = function(e)
    {
        a = this.ctrlShift;
        this.ctrlShift = (e.ctrlKey && e.shiftKey);
        if (a !== this.ctrlShift) {
            this.draw();
        }
    };
    
    return PlayerView;
})();