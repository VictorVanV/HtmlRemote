HtmlRemote.PlayerView = (function()
{
    "use strict";
    
    var a, b, c, i, p, t,
        cell, connRow, playerRow, posDiv, nameDiv, carDiv, timeDiv, lapsDiv, penDiv;
    
    function PlayerView(container)
    {
        this.container = container;
        this.div = document.createElement('div');
        this.div.className = 'playerView';
        
        this.playerTable = document.createElement('table');
        this.playerTable.className = 'playerViewTable';
        this.playerTable.setAttribute('border', '0');
        this.div.appendChild(this.playerTable);

        this.playerBody = document.createElement('tbody');
        this.playerTable.appendChild(this.playerBody);

        this.connBody = document.createElement('tfoot');
        this.playerTable.appendChild(this.connBody);
        
        this.conns = [];
        this.connRows = [];
        this.ucIdCache = [];
        
        this.players = [];
        this.playerIndices = [];
        this.playerRows = [];

        this.container.appendChild(this.div);

        this.ctrlShift = false;
        
        this.onPlayerClick = null;
        
        this.keyDownFn = HtmlRemote.bind(this.onKeyDown, this);
        this.keyUpFn = HtmlRemote.bind(this.onKeyUp, this);
        this.playerClickFn = HtmlRemote.bind(this.handlePlayerClick, this);
        
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
    
    PlayerView.prototype.destroyConn = function(a)
    {
        if (this.connRows[a].drawn) {
            this.connBody.removeChild(this.connRows[a]);
        }
        this.connRows[a].conn = null;
        this.connRows[a] = null;
    };
    
    PlayerView.prototype.destroyPlayer = function(a)
    {
        this.playerBody.removeChild(this.playerRows[a]);
        this.playerRows[a].player = null;
        this.playerRows[a] = null;
    };
    
    PlayerView.prototype.setConns = function(conns)
    {
        this.conns = conns;
        for (a = 0; a < this.connRows.length; a++)
        {
            if (this.connRows[a])
            {
                this.destroyConn(a);
            }
        }
        this.connRows.length = 0;
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
    
    PlayerView.prototype.createConn = function(a)
    {
        c = this.conns[a];
        
        connRow = document.createElement('tr');
        connRow.conn = c;
        connRow.drawn = false;
        
        cell = document.createElement('td');
        connRow.appendChild(cell);

        cell = document.createElement('td');
        nameDiv = document.createElement('div');
        nameDiv.className = 'hrBtn';
        cell.appendChild(nameDiv);
        connRow.appendChild(cell);

        cell = document.createElement('td');
        connRow.appendChild(cell);

        cell = document.createElement('td');
        connRow.appendChild(cell);

        cell = document.createElement('td');
        connRow.appendChild(cell);

        cell = document.createElement('td');
        connRow.appendChild(cell);
        
        return connRow;
    };
    
    PlayerView.prototype.createPlayer = function(a)
    {
        p = this.players[a];
        
        playerRow = document.createElement('tr');
        playerRow.player = p;
        playerRow.drawn = false;
        
        cell = document.createElement('td');
        posDiv = document.createElement('div');
        posDiv.className = 'hrBtn';
        cell.appendChild(posDiv);
        playerRow.appendChild(cell);
        
        cell = document.createElement('td');
        nameDiv = document.createElement('div');
        nameDiv.className = 'hrBtn hrClick';
        HtmlRemote.addEvent(nameDiv, 'click', this.playerClickFn);
        cell.appendChild(nameDiv);
        playerRow.appendChild(cell);
        
        cell = document.createElement('td');
        carDiv = document.createElement('div');
        carDiv.className = 'hrBtn';
        cell.appendChild(carDiv);
        playerRow.appendChild(cell);
        
        cell = document.createElement('td');
        timeDiv = document.createElement('div');
        timeDiv.className = 'hrBtn';
        cell.appendChild(timeDiv);
        playerRow.appendChild(cell);
        
        cell = document.createElement('td');
        lapsDiv = document.createElement('div');
        lapsDiv.className = 'hrBtn';
        cell.appendChild(lapsDiv);
        playerRow.appendChild(cell);
        
        cell = document.createElement('td');
        penDiv = document.createElement('div');
        penDiv.className = 'hrBtn';
        penDiv.innerHTML = 'pen';
        penDiv.style.display = 'none';
        cell.appendChild(penDiv);
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
            }
            else if (this.playerRows[a].drawn)
            {
                this.playerBody.removeChild(this.playerRows[a]);
                this.playerRows[a].drawn = false;
            }
            
            // Insert player index at sorted pos
            i = false;
            if (p.racePos)
            {
                for (b = 0; b < this.playerIndices.length; b++)
                {
                    if (p.racePos < this.players[this.playerIndices[b]].racePos ||
                        !this.players[this.playerIndices[b]].racePos)
                    {
                        this.playerIndices.splice(b, 0, a);
                        i = true;
                        break;
                    }
                }
            }
            if (!i) {
                this.playerIndices.push(a);
            }
        }
        
        this.update();
    };
    
    PlayerView.prototype.update = function()
    {
        this.ucIdCache.length = 0;
        for (a = 0; a < this.playerIndices.length; a++)
        {
            playerRow = this.playerRows[this.playerIndices[a]];
            if (!playerRow.drawn)
            {
                this.playerBody.appendChild(playerRow);
                playerRow.drawn = true;
            }
            
            p = this.players[this.playerIndices[a]];
            playerRow.children[0].firstChild.innerHTML = p.racePos;
            if (this.ctrlShift) {
                playerRow.children[1].firstChild.innerHTML = HtmlRemote.htmlspecialchars(p.userName);
            } else {
                playerRow.children[1].firstChild.innerHTML = HtmlRemote.htmlspecialchars(p.playerNameUcs2);
            }
            playerRow.children[2].firstChild.innerHTML = p.carName;
            if (p.inPits) {
                playerRow.children[3].firstChild.innerHTML = 'in pits';
            } else {
                playerRow.children[3].firstChild.innerHTML = 'time';
            }
            playerRow.children[4].firstChild.innerHTML = p.lap + '.' + p.sector;
            
            if ((p.flags & 2) === 0)
            {
                this.ucIdCache.push(p.ucId);
                if (this.connRows[p.ucId].drawn)
                {
                    this.connBody.removeChild(this.connRows[p.ucId]);
                    this.connRows[p.ucId].drawn = false;
                }
            }
        }
        
        for (a = 0; a < this.conns.length; a++)
        {
            c = this.conns[a];
            if (!c)
            {
                if (this.connRows[a])
                {
                    this.destroyConn(a);
                }
                continue;
            }
            
            if (this.ucIdCache.indexOf(c.ucId) > -1) { continue; }
            
            connRow = this.connRows[a];
            if (!connRow)
            {
                connRow = this.createConn(a);
                this.connRows[a] = connRow;
            }
            if (!connRow.drawn)
            {
                this.connBody.appendChild(connRow);
                connRow.drawn = true;
            }
            if (this.ctrlShift && c.userName) {
                connRow.children[1].firstChild.innerHTML = HtmlRemote.htmlspecialchars(c.userName);
            } else {
                connRow.children[1].firstChild.innerHTML = HtmlRemote.htmlspecialchars(c.playerNameUcs2);
            }
        }
    };
    
    PlayerView.prototype.onKeyDown = function(e)
    {
        a = this.ctrlShift;
        this.ctrlShift = (e.ctrlKey && e.shiftKey);
        if (a !== this.ctrlShift) {
            this.update();
        }
    };
    
    PlayerView.prototype.onKeyUp = function(e)
    {
        a = this.ctrlShift;
        this.ctrlShift = (e.ctrlKey && e.shiftKey);
        if (a !== this.ctrlShift) {
            this.update();
        }
    };
    
    PlayerView.prototype.handlePlayerClick = function(e)
    {
        t = HtmlRemote.getETarget(e);
        
        if (this.onPlayerClick) {
            this.onPlayerClick(t.parentNode.parentNode.player.plId);
        }
    };
    
    return PlayerView;
})();