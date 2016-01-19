"use strict";

var LfsPlayer = (function()
{
    function LfsPlayer()
    {
        this.ucId       = 0;
        this.plId       = 0;
        this.userName   = '';
        this.playerName = '';
        this.plateName  = '';
        this.playerType = 0;
        this.flags      = 0;
        this.carName    = '';
        this.skinName   = '';
        this.tyres      = null;
        this.inPits     = false;
        
        this.pos        = [0, 0, 0];
    }
    
    LfsPlayer.prototype.destroy = function()
    {
        this.tyres = null;
    };
    
    LfsPlayer.prototype.getPos = function(time)
    {
        return [this.pos[0], this.pos[1]];
    };
    
    LfsPlayer.prototype.getPos3d = function(time)
    {
        return [this.pos[0], this.pos[1], this.pos[2]];
    };
    
    return LfsPlayer;
})();