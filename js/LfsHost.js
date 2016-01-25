"use strict";

var LfsHost = (function()
{
    var a, c, p, t, id, racePosChanged;
    
    function LfsHost()
    {
        this.track = '';
        
        this.numConns = 0;
        this.conns = [];
        this.numPlayers = 0;
        this.players = [];
        
        this.raceInProg = 0;
    }
    
    LfsHost.prototype.destroy = function()
    {
        this.conns.length = 0;
        this.players.length = 0;
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
    
    LfsHost.prototype.playerRename = function(pkt)
    {
        this.conns[pkt.ucid].playerName = pkt.pname;
        
        for (a = 0; a < this.players.length; a++)
        {
            p = this.players[a];
            if (!p || p.ucId !=  pkt.ucid) { continue; }
            if ((p.playerType & 2) > 0) { continue; }   // ai
            
            p.playerName        = pkt.pname;
            p.playerNameUcs2    = LfsString.toUCS2(LfsString.remColours(pkt.pname));
            p.plateName         = pkt.plate;
            
            // There can only be one human racer per ucId, so we can break
            break;
        }
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
        p.playerNameUcs2    = LfsString.toUCS2(LfsString.remColours(pkt.pname));
        p.plateName         = pkt.plate;
        p.ptype             = pkt.ptype;
        p.flags             = pkt.flags;
        p.carName           = pkt.cname;
        p.skinName          = pkt.sname;
        p.tyres             = pkt.tyres;
        p.inPits            = ((p.flags & IS.PIF_INPITS) > 0);
    };
    
    LfsHost.prototype.playerPit = function(pkt)
    {
        p = this.players[pkt.plid];
        p.inPits = true;
        p.fromPos[0] = 0;
        p.fromPos[1] = 0;
        p.fromPos[2] = 0;
        p.toPos[0] = 0;
        p.toPos[1] = 0;
        p.toPos[2] = 0;
        p.lap = 1;
        p.sector = 1;
        p.lapData.length = 0;
        p.speed = 0;
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
    
    LfsHost.prototype.playerTakeOver = function(pkt)
    {
        p = this.players[pkt.plid];
        p.ucId              = pkt.newucid;
        p.userName          = this.conns[pkt.newucid].userName;
        p.playerName        = this.conns[pkt.newucid].playerName;
        p.playerNameUcs2    = LfsString.toUCS2(LfsString.remColours(p.playerName));
    };
    
    LfsHost.prototype.processMci = function(pkt)
    {
        racePosChanged = false;
        t = new Date().getTime();
        for (a = 0; a < pkt.info.length; a++)
        {
            p = this.players[pkt.info[a].plid];
            if (!p || p.inPits) { continue; }
            
            if (t - p.lastMciUpdate > 500)
            {
                p.fromPos   = p.getPos(t);
            }
            else
            {
                p.fromPos[0]    = p.toPos[0];
                p.fromPos[1]    = p.toPos[1];
                p.fromPos[2]    = p.toPos[2];
            }
            p.fromPos[0]    = p.toPos[0];
            p.fromPos[1]    = p.toPos[1];
            p.fromPos[2]    = p.toPos[2];
            p.toPos[0]      = pkt.info[a].x / 65536;
            p.toPos[1]      = pkt.info[a].y / -65536;
            p.toPos[2]      = pkt.info[a].z / 65536;
            
            p.node      = pkt.info[a].node;
            p.lap       = pkt.info[a].lap;
            if (!racePosChanged && p.racePos != pkt.info[a].position) { racePosChanged = true; }
            p.racePos   = pkt.info[a].position;
            p.info      = pkt.info[a].info;
            p.speed     = pkt.info[a].speed / 327.68;
//            p.direction = pkt.info[a].direction / 180 * Math.DEGRAD - Math.PI;
//            p.angVel    = -pkt.info[a].angvel / 45 * Math.DEGRAD;

            p.fromHeading   = p.toHeading;
            p.toHeading     = pkt.info[a].heading / 180 * Math.DEGRAD - Math.PI + p.revs * Math.PI2;
            if (p.fromHeading)
            {
                if (p.fromHeading - p.toHeading > Math.PI)
                {
                    p.revs++;
                    p.toHeading += Math.PI2;
                }
                else if (p.toHeading - p.fromHeading > Math.PI)
                {
                    p.revs--;
                    p.toHeading -= Math.PI2;
                }
            }

            p.lastMciUpdate = t;
        }
        
        return racePosChanged;
    };
    
    LfsHost.prototype.raceStart = function(pkt)
    {
        for (a = 0; a < this.players.length; a++)
        {
            p = this.players[a];
            if (!p) { continue; }
            
            p.fromPos[0] = 0;
            p.fromPos[1] = 0;
            p.fromPos[2] = 0;
            p.toPos[0] = 0;
            p.toPos[1] = 0;
            p.toPos[2] = 0;
            
            p.lap = 1;
            p.sector = 1;
            p.lapData.length = 0;
            p.racePos = 0;
            p.speed = 0;
        }
    };
    
    LfsHost.prototype.playerSplit = function(pkt)
    {
        p = this.players[pkt.plid];
        if (!p.lapData.length)
        {
            p.lapData.push(new LfsLapData());
        }
        a = p.lapData[p.lapData.length - 1];
        a['split' + pkt.split] = pkt.stime;
        p.sector = pkt.split + 1;
    };
    
    LfsHost.prototype.playerLap = function(pkt)
    {
        p = this.players[pkt.plid];
        if (!p.lapData.length)
        {
            p.lapData.push(new LfsLapData());
        }
        a = p.lapData[p.lapData.length - 1];
        a.lap = pkt.ltime;
        a.lapNum = pkt.lapsdone;
        
        p.lap = pkt.lapsdone + 1;
        p.sector = 1;
        p.lapData.push(new LfsLapData());
    };
    
    return LfsHost;
})();