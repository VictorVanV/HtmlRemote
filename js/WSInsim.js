HtmlRemote.WSInsim = (function()
{
    "use strict";
    
    var a, dv;
    
    function WSInsim(host, port)
    {
        this.host = host;
        this.port = port;
        
        this.ws = null;
        
        this.onOpen = null;
        this.onClose = null;
        this.onError = null;
        this.onMessage = null;
    }
    
    WSInsim.prototype.destroy = function()
    {
        if (this.getState() != WebSocket.CLOSED())
        {
            this.ws.close(1000);
        }

        if (this.ws !== null)
        {
            this.ws.onopen      = null;
            this.ws.onclose     = null;
            this.ws.onerror     = null;
            this.ws.onmessage   = null;
            this.ws = null;
        }

        this.onOpen = null;
        this.onClose = null;
        this.onError = null;
        this.onMessage = null;
    };
    
    WSInsim.prototype.getState = function()
    {
        if (this.ws === null) { return WebSocket.CLOSED; }
        return this.ws.readyState;
    };
    
    WSInsim.prototype.connect = function()
    {
        if (this.getState() == WebSocket.CONNECTING ||
            this.getState() == WebSocket.OPEN) { return; }
        
        this.ws = new WebSocket('ws://' + this.host + ':' + this.port + '/connect');
        this.ws.binaryType  = 'arraybuffer';
        this.ws.onopen      = HtmlRemote.bind(this.wsHandleOpen, this);
        this.ws.onclose     = HtmlRemote.bind(this.wsHandleClose, this);
        this.ws.onerror     = HtmlRemote.bind(this.wsHandleError, this);
        this.ws.onmessage   = HtmlRemote.bind(this.wsHandleMessage, this);
    };

    WSInsim.prototype.send = function(pkt)
    {
        this.ws.send(pkt);
    };
    
    WSInsim.prototype.close = function(_errCode)
    {
        if (_errCode == undefined ||
            typeof(_errCode) != 'number') { _errCode = 1000; }
        this.ws.close(_errCode);
    };
    
    WSInsim.prototype.wsHandleOpen = function(e)
    {
        console.log('Connected');
        if (this.onOpen)
        {
            this.onOpen(e);
        }
    };
    
    WSInsim.prototype.wsHandleClose = function(e)
    {
        console.log('Closed');
        if (this.onClose)
        {
            this.onClose(e);
        }
    };
    
    WSInsim.prototype.wsHandleError = function(e)
    {
        console.log('WS (connection) error', e);
        if (this.onError)
        {
            this.onError(e);
        }
    };
    
    WSInsim.prototype.wsHandleMessage = function(e)
    {
        // We received a packet - parse it
        dv = new DataView(e.data);
        
        var pktType = dv.getUint8(1);
        var pktName = IS.translatePktIdToName(pktType);
        if (!pktName)
        {
            console.log('Unknown packet of type ' + pktType);
            return;
        }
        
        var pkt;
        if (IS[pktName])
        {
            pkt = new IS[pktName]();
            pkt.unpack(dv);
        }
        else
        {
            console.log('No method to parse packet of type ' + pktType + ' (' + pktName + ')');
            return;
        }
        
        delete pkt.getProperties;
        delete pkt.pack;
        delete pkt.unpack;
        delete pkt.unpackPost;
        delete pkt.packPre;

        // Perform some auto-magic on selected packets
        switch (pkt.type)
        {
            case IS.ISP_TINY:
                if (pkt.subt == IS.TINY_NONE)
                {
                    this.ws.send(new IS.IS_TINY().pack());
                    return;
                }
                break;
            
            case IS.IRP_HOS:
                for (a = 0; a < pkt.info.length; a++)
                {
                    delete pkt.info[a].getProperties;
                    delete pkt.info[a].pack;
                    delete pkt.info[a].unpack;
                    delete pkt.info[a].unpackPost;
                }
                break;
        }

        // CB
        if (this.onMessage)
        {
            this.onMessage(pkt);
        }
    };
    
    return WSInsim;
})();