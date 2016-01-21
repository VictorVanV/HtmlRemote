"use strict";

var LfsHost = (function()
{
    var a, c, p, id;
    
    function LfsHost()
    {
        this.track = '';
        
        this.numConns = 0;
        this.conns = [];
        this.numPlayers = 0;
        this.players = [];
    }
    
    LfsHost.prototype.destroy = function()
    {
        this.conns.length = 0;
        this.racers.length = 0;
    };
    
    LfsHost.prototype.connectionNew = function(pkt)
    {
        if (!this.conns[pkt.ucid])
        {
            c = new LfsConnection();
            c.udId = pkt.ucid;
            this.conns[pkt.ucid] = c;
            this.numConns++;
        }
        else
        {
            c = this.conns[pkt.ucid];
        }
        c.userName      = pkt.uname;
        c.playerName    = pkt.pname;
        c.flags         = pkt.flags;
        c.admin         = pkt.admin;
    };
    
    LfsHost.prototype.connectionLeave = function(pkt)
    {
        if (!this.conns[pkt.ucid])
        {
            return;
        }
        this.conns[pkt.ucid].destroy();
        delete this.conns[pkt.ucid];
        this.numConns--;
    };
    
    LfsHost.prototype.playerNew = function(pkt)
    {
        if (!this.players[pkt.plid])
        {
            p = new LfsPlayer();
            p.plId = pkt.plid;
            this.players[pkt.plid] = p;
            this.numPlayers++;
        }
        else
        {
            p = this.players[pkt.plid];
        }
        p.ucId              = pkt.ucid;
        p.userName          = this.conns[pkt.ucid].userName;
        p.playerName        = pkt.pname;
        p.playerNameUtf8    = LfsString.toUCS2(LfsString.remColours(pkt.pname));
        p.plateName         = pkt.plate;
        p.ptype             = pkt.ptype;
        p.flags             = pkt.flags;
        p.carName           = pkt.cname;
        p.skinName          = pkt.sname;
        p.tyres             = pkt.tyres;
        p.inPits            = false;
    };
    
    LfsHost.prototype.playerPit = function(pkt)
    {
        this.players[pkt.plid].inPits = true;
    };
    
    LfsHost.prototype.playerLeave = function(pkt)
    {
        if (!this.players[pkt.plid])
        {
            return;
        }
        this.players[pkt.plid].destroy();
        delete this.players[pkt.plid];
        this.numPlayers--;
    };
    
    LfsHost.prototype.processMci = function(pkt)
    {
        for (a = 0; a < pkt.info.length; a++)
        {
            p = this.players[pkt.info[a].plid];
            if (!p) { continue; }
            p.pos[0] = pkt.info[a].x / 65536;
            p.pos[1] = pkt.info[a].y / -65536;
            p.pos[2] = pkt.info[a].z / 65536;
            p.racePos = pkt.info[a].position;
        }
    };
    
    return LfsHost;
})();