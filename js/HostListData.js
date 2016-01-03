"use strict";

var HostListData = (function()
{
    function HostListData()
    {
        this.hosts = [];
        this.receiveStatus = 0;
        this.lastRequestTime = 0;
    }
    
    HostListData.RECV_STATUS_NONE       = 0;
    HostListData.RECV_STATUS_RECEIVING  = 1;
    HostListData.RECV_STATUS_RECEIVED   = 2;
    HostListData.CACHETIME              = 30000;
    
    return HostListData;
})();