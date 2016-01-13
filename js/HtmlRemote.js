"use strict";

var HtmlRemote = (function()
{
    var MAX_RECON_COUNT = 10;
    
    var a, p, pkt;
    
    function HtmlRemote(div)
    {
        // Check caps
        if (!BrowserCaps.WEBSOCKET)
        {
            // We could redirect to the old flash version
            throw new Error('LFS Remote requires WebSockets, but your browser does not support them');
        }
        
        // Our InSim websocket
        this.wsInsim = new WSInsim('isrelay.lfs.net', 47474);
        this.wsInsim.onOpen = HtmlRemote.bind(this.onRelayConnected, this);
        this.wsInsim.onClose = HtmlRemote.bind(this.onRelayClosed, this);
        this.wsInsim.onError = HtmlRemote.bind(this.onRelayError, this);
        this.wsInsim.onMessage = HtmlRemote.bind(this.onRelayMessage, this);
        this.reconnCount = 0;
        
        // Contains host and racer data.
        this.lfsHost = null;
        
        // All visuals go in the Viewer
        this.viewer = new Viewer(div);
        this.viewer.onHostSelect = HtmlRemote.bind(this.handleHostSelect, this);

        this.hostListData = null;
        this.curLfsHost = '';
    }
    
    HtmlRemote.prototype.destroy = function()
    {
        this.wsInsim.destroy();
        this.wsInsim = null;
        this.viewer.destroy();
        this.viewer = null;
        if (this.hostListData)
        {
            this.hostListData.destroy();
            this.hostListData = null;
        }
    };
    
    HtmlRemote.prototype.onRelayConnected = function(e)
    {
        this.reconnCount = 0;
        if (!this.curLfsHost)
        {
            this.requestHostlist();
        }
        else
        {
            
        }
    };

    HtmlRemote.prototype.onRelayClosed = function(e)
    {
        if (this.reconnCount++ < MAX_RECON_COUNT)
        {
            setTimeout(HtmlRemote.bind(this.wsInsim.connect, this.wsInsim), 3000);
        }
        else
        {
            // Notify user about failed connection attempts
            
        }
    };
    
    HtmlRemote.prototype.onRelayError = function(e)
    {
        //console.log(this.wsInsim.getState(), e);
    };
    
    HtmlRemote.prototype.onRelayMessage = function(pkt)
    {
        switch (pkt.type)
        {
            case IS.IRP_HOS:
                if (!this.hostListData) { break; }
                if ((pkt.info[0].flags & IS.HOS_FIRST) > 0)
                {
                    this.hostListData.hosts.length = 0;
                }
                
                for (a = 0; a < pkt.info.length; a++)
                {
                    this.hostListData.hosts.push(pkt.info[a]);
                    if ((pkt.info[a].flags & IS.HOS_LAST) > 0)
                    {
                        this.hostListData.receiveStatus = HostListData.RECV_STATUS_RECEIVED;
                        break;
                    }
                }
                
                this.viewer.drawHostList(this.hostListData);

                break;
            
            case IS.ISP_VER:
                // Request ISM packet.
                p = new IS.IS_TINY();
                p.subt = IS.TINY_ISM;
                this.wsInsim.send(p.pack());
                p.subt = IS.TINY_SST;
                this.wsInsim.send(p.pack());
                break;
            
            case IS.ISP_ISM:
                this.viewer.messageOvl.addMessage('Connected to host "' + LfsString.toUCS2(LfsString.remColours(pkt.hname)) + '"');
                break;
            
            case IS.ISP_STA:
                //console.log('STA', pkt);
                
                // pkt.flags
                // pkt.numconns
                // pkt.nump
                // pkt.numfinished
                // pkt.racelaps
                // pkt.qualmins

                // Request connections?
                
                
                // Request players?
                
                
                // Init a new lfsHost??
                if (!this.lfsHost)
                {
                    this.lfsHost = new LfsHost();
                }
                
                // Set track?
                if (this.lfsHost.track != pkt.track)
                {
                    this.viewer.messageOvl.addMessage('Loading track ' + pkt.track);
                    
                    this.lfsHost.track = pkt.track;
                    
                    // Setup the viewer for a new track
                    this.viewer.trackView.loadTrack(pkt.track.slice(0, 2));
                    this.viewer.trackView.loadPth(pkt.track);
                }
                
                break;
            
            case IS.ISP_RST:
                //console.log('RST', pkt);
                break;
            
            case IS.ISP_NCN:
                //console.log('NCN', pkt);
                break;
            
            case IS.ISP_CNL:
                //console.log('CNL', pkt);
                break;
            
            case IS.ISP_CPR:
                //console.log('CPR', pkt);
                break;
            
            case IS.ISP_NPL:
                //console.log('NPL', pkt);
                break;
            
            case IS.ISP_PLP:
                //console.log('PLP', pkt);
                break;
            
            case IS.ISP_PLL:
                //console.log('PLL', pkt);
                break;
            
            case IS.ISP_LAP:
                //console.log('LAP', pkt);
                break;
            
            case IS.ISP_SPX:
                //console.log('SPX', pkt);
                break;
            
            case IS.ISP_MCI:
                //console.log('MCI', pkt);
                break;
            
            case IS.IRP_ARP:
                //console.log('ARP', pkt);
                break;
            
            case IS.ISP_MSO:
                this.viewer.messageOvl.addMessage(LfsString.toUCS2(LfsString.remColours(pkt.msg)));
                break;
            
            case IS.IRP_ERR:
                //console.log('ERR', pkt);
                switch(pkt.errno)
                {
                    case 1:
                        this.viewer.messageOvl.addMessage("** Relay error : invalid packet");
                        break;
                    case 2:
                        this.viewer.messageOvl.addMessage("** Relay error : non forwardable packet");
                        break;
                    case 3:
                        this.viewer.messageOvl.addMessage("** Relay error : wrong hostname");
                        break;
                    case 4:
                        this.viewer.messageOvl.addMessage("** Relay error : wrong admin pass");
                        break;
                    case 5:
                        this.viewer.messageOvl.addMessage("** Relay error : wrong spectator pass");
                        break;
                    case 6:
                        this.viewer.messageOvl.addMessage("** Relay error : no spectator pass provided");
                        break;
                    default:
                        this.viewer.messageOvl.addMessage("** Relay error : unknown error");
                        break;
                }
                break;
            
            default:
                //console.log('Unhandled packet', pkt);
                break;
        }
    };
    
    HtmlRemote.prototype.requestHostlist = function()
    {
        if (!this.hostListData)
        {
            this.hostListData = new HostListData();
        }
        else if (this.hostListData.receiveStatus == HostListData.RECV_STATUS_RECEIVING)
        {
            return;
        }
        else if (this.hostListData.receiveStatus == HostListData.RECV_STATUS_RECEIVED)
        {
            if (this.hostListData.lastRequestTime > new Date().getTime() - HostListData.CACHETIME)
            {
                // Redraw the list of hosts
                this.viewer.drawHostList(this.hostListData);
                
                
                return;
            }
        }
        
        this.hostListData.hosts.length = 0;
        this.hostListData.receiveStatus = HostListData.RECV_STATUS_RECEIVING;
        this.hostListData.lastRequestTime = new Date().getTime();
        this.wsInsim.send(new IS.IR_HLR().pack());

        // Draw / update list of hosts
        this.viewer.drawHostList(this.hostListData);
    };
    
    HtmlRemote.prototype.handleHostSelect = function(hostInfo)
    {
        console.log(hostInfo.hname);
        
        pkt = new IS.IR_SEL();
        pkt.reqi = 1;
        pkt.hname = hostInfo.hname;
        pkt.admin = '';
        pkt.spec = '';
        this.wsInsim.send(pkt.pack());
    };
    
    HtmlRemote.prototype.start = function()
    {
        this.wsInsim.connect();
    };
    
    // A few helpers
    HtmlRemote.addEvent = window.addEventListener ? function (elem, type, method) {
        elem.addEventListener(type, method, false);
    } : function (elem, type, method) {
        elem.attachEvent('on' + type, method);
    };
    
    HtmlRemote.removeEvent = window.removeEventListener ? function (elem, type, method) {
        elem.removeEventListener(type, method, false);
    } : function (elem, type, method) {
        elem.detachEvent('on' + type, method);
    };
    
    HtmlRemote.bind = function(f, obj)
    {
        return function() {
            return f.apply(obj, arguments);
        };
    };
    
    HtmlRemote.getETarget = function(e)
    {
        e = e || window.event;
        return e.target || e.srcElement;
    };
    
    HtmlRemote.htmlspecialchars = function(t)
    {
        t = t.replace(/</g, '&lt;');
        return t.replace(/>/g, '&gt;');
    };
        
    return HtmlRemote;
})();
