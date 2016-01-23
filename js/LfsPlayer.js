"use strict";

var LfsPlayer = (function()
{
    var d, t, p = [0, 0, 0];
    
    function LfsPlayer()
    {
        this.ucId           = 0;
        this.plId           = 0;
        this.userName       = '';
        this.playerName     = '';
        this.playerNameUcs2 = '';
        this.plateName      = '';
        this.playerType     = 0;
        this.flags          = 0;
        this.carName        = '';
        this.skinName       = '';
        this.tyres          = null;
        this.inPits         = false;
        
        this.lastMciUpdate  = new Date().getTime();
        this.node           = 0;
        this.lap            = 0;
        this.racePos        = 0;
        this.info           = 0;
        this.speed          = 0;
        this.direction      = 0;
        this.heading        = 0;
        this.angVel         = 0;
        this.pos            = [0, 0, 0];
    }
    
    LfsPlayer.prototype.destroy = function()
    {
        this.tyres = null;
    };
    
    LfsPlayer.prototype.getPos = function(time)
    {
        t = new Date().getTime();
        d = (t - this.lastMciUpdate) * 0.001;
        p[0] = this.pos[0] + this.speed * d * Math.sin(this.direction);
        p[1] = this.pos[1] + this.speed * d * Math.cos(this.direction);
        
        //this.lastMciUpdate = time;
        
        return [p[0], p[1]];
    };
    
    LfsPlayer.prototype.getPos3d = function(time)
    {
        return [this.pos[0], this.pos[1], this.pos[2]];
    };
    
    return LfsPlayer;
})();