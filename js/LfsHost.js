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
        
        this.mciBuf = [];
        this.mciTime = 0;
    }
    
    LfsHost.prototype.destroy = function()
    {
        this.conns.length = 0;
        this.players.length = 0;
        this.mciBuf.length = 0;
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
        this.mciBuf.push(pkt);

        if ((pkt.info[pkt.info.length - 1].info & IS.CCI_LAST) > 0)
        {
            this.processMciFinalise();
        }
    };
    
    LfsHost.prototype.processMciFinalise = function()
    {
        racePosChanged = false;
        //this.mciTime += (this.mciTime) ? 500 : new Date().getTime();
        this.mciTime = new Date().getTime();
        for (c = 0; c < this.mciBuf.length; c++)
        {
            for (a = 0; a < this.mciBuf[c].info.length; a++)
            {
                p = this.players[this.mciBuf[c].info[a].plid];
                if (!p || p.inPits) { continue; }
                
                if (this.mciTime - p.lastMciUpdate > 500)
                {
                    p.fromPos   = p.getPos(this.mciTime);
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
                p.toPos[0]      = this.mciBuf[c].info[a].x / 65536;
                p.toPos[1]      = this.mciBuf[c].info[a].y / -65536;
                p.toPos[2]      = this.mciBuf[c].info[a].z / 65536;
                
                p.node      = this.mciBuf[c].info[a].node;
                p.lap       = this.mciBuf[c].info[a].lap;
                if (!racePosChanged && p.racePos != this.mciBuf[c].info[a].position) { racePosChanged = true; }
                p.racePos   = this.mciBuf[c].info[a].position;
                p.info      = this.mciBuf[c].info[a].info;
                p.speed     = this.mciBuf[c].info[a].speed / 327.68;
    //            p.direction = this.mciBuf[c].info[a].direction / 180 * Math.DEGRAD - Math.PI;
    //            p.angVel    = -this.mciBuf[c].info[a].angvel / 45 * Math.DEGRAD;
    
                p.fromHeading   = p.toHeading;
                p.toHeading     = this.mciBuf[c].info[a].heading / 180 * Math.DEGRAD - Math.PI + p.revs * Math.PI2;
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
//                if (p.fromHeading === 0) {
//                    p.fromHeading = p.toHeading;
//                }
    
                p.lastMciUpdate = this.mciTime;
            }
        }
        
        this.mciBuf.length = 0;
        
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