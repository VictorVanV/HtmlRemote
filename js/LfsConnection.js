HtmlRemote.LfsConnection = (function()
{
    "use strict";
    
    function LfsConnection()
    {
        this.userName       = '';
        this.playerName     = '';
        this.flags          = 0;
        this.admin          = 0;
    }
    
    LfsConnection.prototype.destroy = function()
    {
        
    };
    
    return LfsConnection;
})();