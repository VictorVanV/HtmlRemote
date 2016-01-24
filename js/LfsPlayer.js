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
        this.sector         = 0;
        this.lap            = 0;
        this.lapData        = [];
        this.racePos        = 0;
        this.info           = 0;
        this.speed          = 0;
        this.direction      = 0;
        this.fromHeading    = 0;
        this.toHeading      = 0;
        this.revs           = 0;
        this.angVel         = 0;
        
        this.fromPos        = [0, 0, 0];
        this.toPos          = [0, 0, 0];
    }
    
    LfsPlayer.prototype.destroy = function()
    {
        this.tyres = null;
        this.lapData.length = 0;
    };
    
    LfsPlayer.prototype.getPos = function(time)
    {
        if (this.fromPos[0] == 0 &&
            this.fromPos[1] == 0 &&
            this.fromPos[2] == 0) { return [this.toPos[0], this.toPos[1], this.toPos[2]]; }
        d = (time - this.lastMciUpdate) * 0.002;
        return [this.fromPos[0] + (this.toPos[0] - this.fromPos[0]) * d,
                this.fromPos[1] + (this.toPos[1] - this.fromPos[1]) * d,
                this.fromPos[2] + (this.toPos[2] - this.fromPos[2]) * d];
    };
    
    LfsPlayer.prototype.getHeading = function(time)
    {
        d = (time - this.lastMciUpdate) * 0.002;
        return this.fromHeading + (this.toHeading - this.fromHeading) * d;
    };
    
    return LfsPlayer;
})();

var LfsLapData = (function()
{
    function LfsLapData()
    {
        this.split1 = 0;
        this.split2 = 0;
        this.split3 = 0;
        this.lap    = 0;
        this.lapNum = 0;
    }
    
    return LfsLapData;
})();