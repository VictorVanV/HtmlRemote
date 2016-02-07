HtmlRemote.LfsConnection = (function()
{
    "use strict";
    
    function LfsConnection()
    {
        this.ucId           = 0;
        this.userName       = '';
        this.playerName     = '';
        this.playerNameUcs2 = '';
        this.flags          = 0;
        this.admin          = 0;
    }
    
    LfsConnection.prototype.destroy = function()
    {
        
    };
    
    return LfsConnection;
})();