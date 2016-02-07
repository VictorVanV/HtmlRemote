var HtmlRemote = (function()
{
    "use strict";
    
    var a, p, pkt, secs, mins, hours;
    var MAX_RECON_COUNT = 10;
    
    function HtmlRemote(div)
    {
        // Check caps
        if (!('WebSocket' in window))
        {
            // We could redirect to the old flash version
            throw new Error('LFS Remote requires WebSockets, but your browser does not support them');
        }
        
        // Our InSim websocket
        this.wsInsim = new HtmlRemote.WSInsim('isrelay.lfs.net', 47474);
        this.wsInsim.onOpen = HtmlRemote.bind(this.onRelayConnected, this);
        this.wsInsim.onClose = HtmlRemote.bind(this.onRelayClosed, this);
        this.wsInsim.onError = HtmlRemote.bind(this.onRelayError, this);
        this.wsInsim.onMessage = HtmlRemote.bind(this.onRelayMessage, this);
        this.reconnCount = 0;
        
        // Contains host data.
        this.lfsHost = null;
        this.syncing = false;
        
        // All visuals go in the Viewer
        this.viewer = new HtmlRemote.Viewer(div);
        this.viewer.onHostSelect = HtmlRemote.bind(this.handleHostSelect, this);
        this.viewer.onHostNameClick = HtmlRemote.bind(this.handleHostNameClick, this);
        this.viewer.playerView.onPlayerClick = HtmlRemote.bind(this.handlePlayerClick, this);

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
            case IS.ISP_TINY:
                switch (pkt.subt)
                {
                    case IS.TINY_CLR:
                        console.log('Removed all players from race');
                        for (a = 0; a < this.lfsHost.players.length; a++) {
                            this.lfsHost.players[a] = null;
                        }
                        this.lfsHost.numPlayers = 0;
                        this.viewer.trackView.removeFollowPlayer(0);
                        this.viewer.playerView.draw();
                        break;
                    
                    case IS.TINY_REN:
                        console.log('Race ending - returning to lobby');
                        for (a = 0; a < this.lfsHost.players.length; a++) {
                            this.lfsHost.players[a] = null;
                        }
                        this.lfsHost.numPlayers = 0;
                        this.viewer.trackView.removeFollowPlayer(0);
                        this.viewer.hostView.setLobby(true);
                        this.viewer.playerView.draw();
                        break;
                }
                break;
            
            case IS.ISP_SMALL:
                if (pkt.subt == IS.SMALL_RTP)
                {
                    this.viewer.hostView.setTime(pkt.uval * 10);
                }
                break;
            
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
                        this.hostListData.receiveStatus = HtmlRemote.HostListData.RECV_STATUS_RECEIVED;
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
                p.subt = IS.TINY_RST;
                this.wsInsim.send(p.pack());
                p.subt = IS.TINY_GTH;
                this.wsInsim.send(p.pack());

                // Init a new lfsHost??
                if (!this.lfsHost)
                {
                    this.lfsHost = new HtmlRemote.LfsHost();
                    this.viewer.trackView.players = this.lfsHost.players;
                    this.viewer.playerView.setConns(this.lfsHost.conns);
                    this.viewer.playerView.setPlayers(this.lfsHost.players);
                }
                
                break;
            
            case IS.ISP_ISM:
                this.viewer.messageOvl.addMessage('Connected to host "' + LfsString.toUCS2(LfsString.remColours(pkt.hname)) + '"');
                break;
            
            case IS.ISP_STA:
                // Request connections and players?
                if (this.lfsHost.numConns != pkt.numconns)
                {
                    p = new IS.IS_TINY();
                    p.subt = IS.TINY_NCN;
                    this.wsInsim.send(p.pack());
                    p.subt = IS.TINY_NPL;
                    this.wsInsim.send(p.pack());
                }
                
                // Set track?
                if (this.lfsHost.track != pkt.track)
                {
                    this.viewer.startAnimation();
                    this.viewer.messageOvl.addMessage('Loading track ' + pkt.track);
                    
                    this.lfsHost.track = pkt.track;
                    
                    // Setup the viewer for a new track
                    this.viewer.setTrack(pkt.track);
                }

                this.lfsHost.flags = pkt.flags;
                this.lfsHost.raceInProg = pkt.raceinprog;
                if ((this.lfsHost.flags & IS.ISS_GAME) > 0)
                {
                    this.viewer.hostView.setLobby(false);
                }
                else
                {
                    this.viewer.hostView.setLobby(true);
                }
                this.viewer.hostView.setMode(pkt, this.lfsHost.raceInProg);
                
                //this.viewer.playerView.draw();
                
                break;
            
            case IS.ISP_RST:
                this.lfsHost.raceStart(pkt);
                this.lfsHost.resetMciTime();
                this.viewer.hostView.setTime(0);
                if ((this.lfsHost.flags & IS.ISS_GAME) > 0)
                {
                    this.viewer.hostView.setLobby(false);
                }
                else
                {
                    this.viewer.hostView.setLobby(true);
                }
                this.viewer.hostView.setMode(pkt, this.lfsHost.raceInProg);
                this.viewer.setPathSplits(pkt.finish, pkt.split1, pkt.split2, pkt.split3);
                this.viewer.playerView.draw();
                break;
            
            case IS.ISP_NCN:
                this.lfsHost.connectionNew(pkt);
                this.viewer.playerView.draw();
                break;
            
            case IS.ISP_CNL:
                this.lfsHost.connectionLeave(pkt);
                this.viewer.playerView.draw();
                break;
            
            case IS.ISP_CPR:
                this.lfsHost.playerRename(pkt);
                this.viewer.playerView.update();
                break;
            
            case IS.ISP_NPL:
                this.lfsHost.playerNew(pkt);
                this.viewer.playerView.draw();
                break;
            
            case IS.ISP_PLP:
                this.lfsHost.playerPit(pkt);
                this.viewer.playerView.draw();
                this.viewer.trackView.removeFollowPlayer(pkt.plid);
                break;
            
            case IS.ISP_PLL:
                this.lfsHost.playerLeave(pkt);
                this.viewer.playerView.draw();
                this.viewer.trackView.removeFollowPlayer(pkt.plid);
                break;
            
            case IS.ISP_TOC:
                this.lfsHost.playerTakeOver(pkt);
                this.viewer.playerView.update();
                break;
            
            case IS.ISP_LAP:
//                this.viewer.hostView.setLobby(false);
                this.viewer.hostView.setTime(pkt.etime);
                this.lfsHost.playerLap(pkt);
                this.viewer.playerView.update();
                break;
            
            case IS.ISP_SPX:
//                this.viewer.hostView.setLobby(false);
                this.viewer.hostView.setTime(pkt.etime);
                this.lfsHost.playerSplit(pkt);
                this.viewer.playerView.update();
                break;
            
            case IS.ISP_MCI:
                if (this.lfsHost.processMci(pkt)) {
                    this.viewer.playerView.draw();
                }
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
            this.hostListData = new HtmlRemote.HostListData();
        }
        else if (this.hostListData.receiveStatus == HtmlRemote.HostListData.RECV_STATUS_RECEIVING)
        {
            return;
        }
        else if (this.hostListData.receiveStatus == HtmlRemote.HostListData.RECV_STATUS_RECEIVED)
        {
            if (this.hostListData.lastRequestTime > new Date().getTime() - HtmlRemote.HostListData.CACHETIME)
            {
                // Redraw the list of hosts
                this.viewer.drawHostList(this.hostListData);
                
                return;
            }
        }
        
        this.hostListData.hosts.length = 0;
        this.hostListData.receiveStatus = HtmlRemote.HostListData.RECV_STATUS_RECEIVING;
        this.hostListData.lastRequestTime = new Date().getTime();
        this.wsInsim.send(new IS.IR_HLR().pack());

        // Draw / update list of hosts
        this.viewer.drawHostList(this.hostListData);
    };
    
    HtmlRemote.prototype.handleHostSelect = function(hostInfo)
    {
        pkt = new IS.IR_SEL();
        pkt.reqi = 1;
        pkt.hname = hostInfo.hname;
        pkt.admin = '';
        pkt.spec = '';
        this.wsInsim.send(pkt.pack());
        
        // Selecting a new host, so let's reset some stuff
        if (this.lfsHost)
        {
            this.lfsHost.destroy();
            this.lfsHost = null;
        }
        
        this.viewer.trackView.removeFollowPlayer(0);
    };
    
    HtmlRemote.prototype.handleHostNameClick = function(e)
    {
        this.requestHostlist();
    };
    
    HtmlRemote.prototype.handlePlayerClick = function(plId)
    {
        this.viewer.trackView.followPlayer = this.lfsHost.players[plId];
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
    
    HtmlRemote.blockSelect = function()
    {
        document.onselectstart = new Function ("return false");
        document.ondragstart = new Function ("return false");
        document.onmousedown = function(e){return false;};
    };
    
    HtmlRemote.unBlockSelect = function()
    {
        document.onselectstart = new Function ("return true");
        document.ondragstart = new Function ("return true");
        document.onmousedown = null;
    };
    
    HtmlRemote.getObAbsLoc = function(ob)
    {
        var loc = [0,0];
        if (!ob) { return loc; }
        do {
            loc[0] += ob.offsetLeft || 0;
            loc[1] += ob.offsetTop || 0;
            ob = ob.offsetParent;
        } while(ob);
        return loc;
    }
    
    HtmlRemote.getDVNullString = function(buf, offset, maxLen)
    {
        if (!(buf instanceof DataView))
        {
            throw new Error("Invalid argument type for buf. Must be DataView.");
        }
        if (offset == undefined)
        {
            offset = 0;
        }
        if (maxLen == undefined)
        {
            throw new Error("strSize may not be undefined or 0");
        }
        
        // Read the individual bytes, convert to chars until null byte encountered.
        var txt = "";
        var chr;
        for (var a = 0; a < maxLen; a++)
        {
            chr = buf.getUint8(offset++);
            if (chr === 0) { break; }
            txt += String.fromCharCode(chr);
        }
        
        return txt;
    };
    
    HtmlRemote.ms2Msht = function(ms)
    {
        secs = Math.floor(ms * 0.001);
        ms -= secs * 1000;
        mins = Math.floor(secs / 60);
        secs -= mins * 60;
        hours = Math.floor(mins / 60);
        mins -= hours * 60;
        return hours + ':' + ('0' + mins).slice(-2) + ':' + ('0' + secs).slice(-2) + '.' + ('00' + ms).slice(-3);
    };
    
    return HtmlRemote;
})();
