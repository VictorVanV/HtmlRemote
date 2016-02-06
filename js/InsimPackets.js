var IS = (function(){
    "use strict";

    function IS()
    {
        
    }
    
    IS.VERSION = 5;
    
    IS.ISP_NONE = 0;
    IS.ISP_ISI = 1;
    IS.ISP_VER = 2;
    IS.ISP_TINY = 3;
    IS.ISP_SMALL = 4;
    IS.ISP_STA = 5;
    IS.ISP_SCH = 6;
    IS.ISP_SFP = 7;
    IS.ISP_SCC = 8;
    IS.ISP_CPP = 9;
    IS.ISP_ISM = 10;
    IS.ISP_MSO = 11;
    IS.ISP_III = 12;
    IS.ISP_MST = 13;
    IS.ISP_MTC = 14;
    IS.ISP_MOD = 15;
    IS.ISP_VTN = 16;
    IS.ISP_RST = 17;
    IS.ISP_NCN = 18;
    IS.ISP_CNL = 19;
    IS.ISP_CPR = 20;
    IS.ISP_NPL = 21;
    IS.ISP_PLP = 22;
    IS.ISP_PLL = 23;
    IS.ISP_LAP = 24;
    IS.ISP_SPX = 25;
    IS.ISP_PIT = 26;
    IS.ISP_PSF = 27;
    IS.ISP_PLA = 28;
    IS.ISP_CCH = 29;
    IS.ISP_PEN = 30;
    IS.ISP_TOC = 31;
    IS.ISP_FLG = 32;
    IS.ISP_PFL = 33;
    IS.ISP_FIN = 34;
    IS.ISP_RES = 35;
    IS.ISP_REO = 36;
    IS.ISP_NLP = 37;
    IS.ISP_MCI = 38;
    IS.ISP_MSX = 39;
    IS.ISP_MSL = 40;
    IS.ISP_CRS = 41;
    IS.ISP_BFN = 42;
    IS.ISP_AXI = 43;
    IS.ISP_AXO = 44;
    IS.ISP_BTN = 45;
    IS.ISP_BTC = 46;
    IS.ISP_BTT = 47;
    IS.ISP_RIP = 48;
    IS.ISP_SSH = 49;
    IS.ISP_CON = 50;
    IS.ISP_OBH = 51;
    IS.ISP_HLV = 52;
    IS.ISP_PLC = 53;
    IS.ISP_AXM = 54;
    IS.ISP_ACR = 55;
    IS.ISP_HCP = 56;
    IS.ISP_NCI = 57;
    
    // Added relay packets
    IS.IRP_ARQ = 250;   // Send : request if we are host admin (after connecting to a host)
    IS.IRP_ARP = 251;   // Receive : replies if you are admin (after connecting to a host)
    IS.IRP_HLR = 252;   // Send : To request a hostlist
    IS.IRP_HOS = 253;   // Receive : Hostlist info
    IS.IRP_SEL = 254;   // Send : To select a host
    IS.IRP_ERR = 255;   // Receive : An error number
    
    // Tiny packet types
    IS.TINY_NONE = 0;
    IS.TINY_VER = 1;
    IS.TINY_CLOSE = 2;
    IS.TINY_PING = 3;
    IS.TINY_REPLY = 4;
    IS.TINY_VTC = 5;
    IS.TINY_SCP = 6;
    IS.TINY_SST = 7;
    IS.TINY_GTH = 8;
    IS.TINY_MPE = 9;
    IS.TINY_ISM = 10;
    IS.TINY_REN = 11;
    IS.TINY_CLR = 12;
    IS.TINY_NCN = 13;
    IS.TINY_NPL = 14;
    IS.TINY_RES = 15;
    IS.TINY_NLP = 16;
    IS.TINY_MCI = 17;
    IS.TINY_REO = 18;
    IS.TINY_RST = 19;
    IS.TINY_AXI = 20;
    IS.TINY_AXC = 21;
    IS.TINY_RIP = 22;
    IS.TINY_NCI = 23;
    
    // Small packet types
    IS.SMALL_NONE = 0;
    IS.SMALL_SSP = 1;
    IS.SMALL_SSG = 2;
    IS.SMALL_VTA = 3;
    IS.SMALL_TMS = 4;
    IS.SMALL_STP = 5;
    IS.SMALL_RTP = 6;
    IS.SMALL_NLI = 7;
    
    IS.ISP_XLATED = [
        'IS_NONE', 'IS_ISI', 'IS_VER', 'IS_TINY', 'IS_SMALL', 'IS_STA', 'IS_SCH',
        'IS_SFP', 'IS_SCC', 'IS_CPP', 'IS_ISM', 'IS_MSO', 'IS_III', 'IS_MST', 'IS_MTC',
        'IS_MOD', 'IS_VTN', 'IS_RST', 'IS_NCN', 'IS_CNL', 'IS_CPR', 'IS_NPL', 'IS_PLP',
        'IS_PLL', 'IS_LAP', 'IS_SPX', 'IS_PIT', 'IS_PSF', 'IS_PLA', 'IS_CCH', 'IS_PEN',
        'IS_TOC', 'IS_FLG', 'IS_PFL', 'IS_FIN', 'IS_RES', 'IS_REO', 'IS_NLP', 'IS_MCI',
        'IS_MSX', 'IS_MSL', 'IS_CRS', 'IS_BFN', 'IS_AXI', 'IS_AXO', 'IS_BTN', 'IS_BTC',
        'IS_BTT', 'IS_RIP', 'IS_SSH', 'IS_CON', 'IS_OBH', 'IS_HLV', 'IS_PLC', 'IS_AXM',
        'IS_ACR', 'IS_HCP', 'IS_NCI'
    ];
    IS.ISP_XLATED[250] = 'IR_ARQ';
    IS.ISP_XLATED[251] = 'IR_ARP';
    IS.ISP_XLATED[252] = 'IR_HLR';
    IS.ISP_XLATED[253] = 'IR_HOS';
    IS.ISP_XLATED[254] = 'IR_SEL';
    IS.ISP_XLATED[255] = 'IR_ERR';
    
    IS.translatePktIdToName = function(id)
    {
        var name = IS.ISP_XLATED[id];
        if (name == undefined || name === null) { return null; }
        return name;
    };
    
    // Insim Packet IS_ISI Flags
    IS.ISF_RES_0    = 0x01;  // bit 0 : spare
    IS.ISF_RES_1    = 0x02;  // bit 1 : spare
    IS.ISF_LOCAL    = 0x04;  // bit 2 : guest or single player
    IS.ISF_MSO_COLS = 0x08;  // bit 3 : keep colours in MSO text
    IS.ISF_NLP      = 0x10;  // bit 4 : receive NLP packets
    IS.ISF_MCI      = 0x20;  // bit 5 : receive MCI packets
    IS.ISF_CON      = 0x40;  // bit 6 : receive CON packets
    IS.ISF_OBH      = 0x80;  // bit 7 : receive OBH packets
    IS.ISF_HLV      = 0x100; // bit 8 : receive HLV packets
    IS.ISF_AXM_LOAD = 0x200; // bit 9 : receive AXM when loading a layout
    IS.ISF_AXM_EDIT = 0x400; // bit 10 : receive AXM when changing objects
    
    IS.IS_ISI = function()
    {
        this._PACK = 'BBBBHHBBH16s16s';
        
        this.size = 44;
        this.type = IS.ISP_ISI;
        this.reqi = 0;
        this.zero = 0;
        
        this.udpport = 0;
        this.flags = 0;
        
        this.sp0 = 0;
        this.prefix = '';
        this.interval = 0;
        
        this.admin = '';
        this.iname = '';
        
        addPacketBase(this);
    };
    
    IS.IS_TINY = function()
    {
        this._PACK = 'BBBB';
        
        this.size = 4;
        this.type = IS.ISP_TINY;
        this.reqi = 0;
        this.subt = 0;
        
        addPacketBase(this);
    };
    
    IS.IS_SMALL = function()
    {
        this._PACK = 'BBBBL';
        
        this.size = 8;
        this.type = IS.ISP_SMALL;
        this.reqi = 0;
        this.subt = 0;
        
        this.uval = 0;
        
        addPacketBase(this);
    };
    
    IS.IS_VER = function()
    {
        this._PACK = 'BBBB8s6sH';
        
        this.size = 20;
        this.type = IS.ISP_VER;
        this.reqi = 0;
        this.zero = 0;
        
        this.version = '';
        this.product = '';
        this.insimver = 0;
        
        addPacketBase(this);
    };
    
    // state flags
    IS.ISS_GAME             = 1; // in-game
    IS.ISS_REPLAY           = 2; // in spr
    IS.ISS_PAUSED           = 4; // paused
    IS.ISS_SHIFTU           = 8; // in shifu
    IS.ISS_16               = 16; // unused
    IS.ISS_SHIFTU_FOLLOW    = 32; // shiftu follow
    IS.ISS_SHIFTU_NO_OPT    = 64; // shiftu no options
    IS.ISS_SHOW_2D          = 128; // showing 2d display?
    IS.ISS_FRONT_END        = 256; // entry screen
    IS.ISS_MULTI            = 512; // multiplayer mode
    IS.ISS_MPSPEEDUP        = 1024; // multiplayer speed up?
    IS.ISS_WINDOWED         = 2048; // lfs is in a window
    IS.ISS_SOUND_MUTE       = 4096; // audio is muted
    IS.ISS_VIEW_OVERRIDE    = 8192; // custom view
    IS.ISS_VISIBLE          = 16384; // insim buttons visible
    
    IS.IS_STA = function()
    {
        this._PACK = 'BBBBfHBBBBBBBBBB6sBB';
        
        this.size = 28;
        this.type = IS.ISP_STA;
        this.reqi = 0;
        this.zero = 0;
        
        this.replayspeed = 0;
        this.flags = 0;
        this.ingamecam = 0;
        this.viewplid = 0;
        
        this.nump = 0;
        this.numconns = 0;
        this.numfinished = 0;
        this.raceinprog = 0;
        
        this.qualmins = 0;
        this.racelaps = 0;
        this.spare2 = 0;
        this.spare3 = 0;
        
        this.track = "";
        this.weather = 0;
        this.wind = 0;
        
        addPacketBase(this);
    };
    
    IS.IS_SFP = function()
    {
        this._PACK = 'BBBBHBB';
        
        this.size = 8;
        this.type = IS.ISP_SFP;
        this.reqi = 0;
        this.zero = 0;
        
        this.flag = 0;
        this.offon = 0;
        this.sp3 = 0;
        
        addPacketBase(this);
    };
    
    IS.IS_MOD = function()
    {
        this._PACK = 'BBBBllll';
        
        this.size = 20;
        this.type = IS.ISP_MOD;
        this.reqi = 0;
        this.zero = 0;
        
        this.bits16 = 0;
        this.rr = 0;
        this.width = 0;
        this.height = 0;
        
        addPacketBase(this);
    };
    
    // Message flags
    IS.MSO_SYSTEM   = 0; // system message
    IS.MSO_USER     = 1; // normal visible user message
    IS.MSO_PREFIX   = 2; // hidden message starting with special prefix (see ISI)
    IS.MSO_O        = 3; // hidden message typed on local pc with /o command
    
    IS.IS_MSO = function()
    {
        this._PACK = 'BBBBBBBB128s';
        
        this.size = 136;
        this.type = IS.ISP_MSO;
        this.reqi = 0;
        this.zero = 0;
        
        this.ucid = 0;
        this.plid = 0;
        this.usertype = 0;
        this.textstart = 0;
        this.msg = '';
        
        addPacketBase(this);
    };
    
    IS.IS_III = function()
    {
        this._PACK = 'BBBBBBBB64s';
        
        this.size = 72;
        this.type = IS.ISP_III;
        this.reqi = 0;
        this.zero = 0;
        
        this.ucid = 0;
        this.plid = 0;
        this.sp2 = 0;
        this.sp3 = 0;
        this.msg = '';
        
        addPacketBase(this);
    };
    
    IS.IS_ACR = function()
    {
        this._PACK = 'BBBBBBBB64s';
        
        this.size = 72;
        this.type = IS.ISP_ACR;
        this.reqi = 0;
        this.zero = 0;
        
        this.ucid = 0;
        this.admin = 0;
        this.result = 0;
        this.sp3 = 0;
        this.msg = '';
        
        addPacketBase(this);
    };
    
    IS.IS_MST = function()
    {
        this._PACK = 'BBBB64s';
        
        this.size = 68;
        this.type = IS.ISP_MST;
        this.reqi = 0;
        this.zero = 0;
        
        this.msg = '';
        
        addPacketBase(this);
    };
    
    IS.IS_MSX = function()
    {
        this._PACK = 'BBBB96s';
        
        this.size = 100;
        this.type = IS.ISP_MSX;
        this.reqi = 0;
        this.zero = 0;
        
        this.msg = '';
        
        addPacketBase(this);
    };
    
    // Message Sounds (for Sound byte)
    IS.SND_SILENT = 0;
    IS.SND_MESSAGE = 1;
    IS.SND_SYSMESSAGE = 2;
    IS.SND_INVALIDKEY = 3;
    IS.SND_ERROR = 4;
    IS.SND_NUM = 5;
    
    IS.IS_MSL = function()
    {
        this._PACK = 'BBBB128s';
        
        this.size = 132;
        this.type = IS.ISP_MSL;
        this.reqi = 0;
        this.sound = 0;
        
        this.msg = '';
        
        addPacketBase(this);
    };
    
    IS.IS_MTC = function()
    {
        this._PACK = 'BBBBBBBB';
        
        this.size = 8;
        this.type = IS.ISP_MTC;
        this.reqi = 0;
        this.sound = 0;
        
        this.ucid = 0;
        this.plid = 0;
        this.sp2 = 0;
        this.sp3 = 0;
        
        this.text = '';
        
        addPacketBase(this);
        
        this.unpackPost = function(dv)
        {
            var c, tLen = this.size - 8;
            for (var a = 0; a < tLen; a++)
            {
                c = dv.getUint8(8+a);
                if (c === 0) { break; }
                this.text += String.fromCharCode(c);
            }       
        };
        this.packPre = function()
        {
            var tLen = this.text.length;
            if (tLen > 127) { tLen = 127; }
            tLen += 4 - (tLen % 4);
            this.size = 8 + tLen;
            this._PACK = "BBBBBBBB" + tLen + "s";
        };
    };
    
    IS.IS_SCH = function()
    {
        this._PACK = 'BBBBBBBB';
        
        this.size = 8;
        this.type = IS.ISP_SCH;
        this.reqi = 0;
        this.zero = 0;
        
        this.charb = 0;
        this.flags = 0;
        this.spare2 = 0;
        this.spare3 = 0;
        
        addPacketBase(this);
    };
    
    IS.IS_ISM = function()
    {
        this._PACK = 'BBBBBBBB32s';
        
        this.size = 40;
        this.type = IS.ISP_ISM;
        this.reqi = 0;
        this.zero = 0;
        
        this.host = 0;
        this.sp1 = 0;
        this.sp2 = 0;
        this.sp3 = 0;
        
        this.hname = '';
        
        addPacketBase(this);
    };
    
    // The Vote Actions
    IS.VOTE_NONE    = 0; // no vote
    IS.VOTE_END     = 1; // end race
    IS.VOTE_RESTART = 2; // restart
    IS.VOTE_QUALIFY = 3; // qualify
    IS.VOTE_NUM     = 4;
    
    IS.IS_VTN = function()
    {
        this._PACK = 'BBBBBBBB';
        
        this.size = 8;
        this.type = IS.ISP_VTN;
        this.reqi = 0;
        this.zero = 0;
        
        this.ucid = 0;
        this.action = 0;
        this.sp2 = 0;
        this.sp3 = 0;
        
        addPacketBase(this);
    };
    
    // IDs for allowed cars field for IS_PLC
    // Both short and long names for convenience
    IS.XF_GTI = IS.XFG = 1;
    IS.XR_GT = IS.XRG = 2;
    IS.XR_GT_TURBO = IS.XRT = 4;
    IS.RB4_GT = IS.RB4 = 8;
    IS.FXO_TURBO = IS.FXO = 0x10;
    IS.LX4 = 0x20;
    IS.LX6  = 0x40;
    IS.MRT5 = 0x80;
    IS.UF_1000 = IS.UF1 = 0x100;
    IS.RACEABOUT = IS.RAC = 0x200;
    IS.FZ50 = IS.FZ5 = 0x400;
    IS.FORMULA_XR = IS.FOX = 0x800;
    IS.XF_GTR = IS.XFR = 0x1000;
    IS.UF_GTR = IS.UFR = 0x2000;
    IS.FORMULA_V8 = IS.FO8 = 0x4000;
    IS.FXO_GTR = IS.FXR = 0x8000;
    IS.XR_GTR = IS.XRR = 0x10000;
    IS.FZ50_GTR = IS.FZR = 0x20000;
    IS.BMW_SAUBER_F106 = IS.BF1 = 0x40000;
    IS.FORMULA_BMW_FB02 = IS.FBM = 0x80000;
    
    IS.IS_PLC = function()
    {
        this._PACK = 'BBBBBBBBL';
        
        this.size = 12;
        this.type = IS.ISP_PLC;
        this.reqi = 0;
        this.zero = 0;
        
        this.ucid = 0;
        this.sp1 = 0;
        this.sp2 = 0;
        this.sp3 = 0;
        
        this.cars = 0;
        
        addPacketBase(this);
    };
    
    IS.IS_CARHCP = function()
    {
        this._PACK = 'BB';
        
        this.h_mass = 0;
        this.h_tres = 0;

        addPacketBase(this);
    };
    
    IS.IS_HCP = function()
    {
        this._PACK = 'BBBB';
        
        this.size = 68;
        this.type = IS.ISP_HCP;
        this.reqi = 0;
        this.zero = 0;
        
        this.info = [];
        
        addPacketBase(this);
        
        this.unpackPost = function(dv)
        {
            var a, ofs = 4;
            for (a = 0; a < 32; a++)
            {
                this.info.push(new IS.IS_CARHCP());
                this.info[a].unpack(new DataView(dv.buffer.slice(ofs, ofs + 2)));
                ofs += 2;
            }       
        };
    };
    
    IS.IS_RST = function()
    {
        this._PACK = 'BBBBBBBB6sBBHHHHHH';
        
        this.size = 28;
        this.type = IS.ISP_RST;
        this.reqi = 0;
        this.zero = 0;
        
        this.racelaps = 0;
        this.qualmins = 0;
        this.nump = 0;
        this.timing = 0;
        
        this.track = '';
        this.weather = 0;
        this.wind = 0;
        
        this.flags = 0;
        this.numnodes = 0;
        this.finish = 0;
        this.split1 = 0;
        this.split2 = 0;
        this.split3 = 0;
        
        addPacketBase(this);
    };
    
    IS.IS_NCN = function()
    {
        this._PACK = 'BBBB24s24sBBBB';
        
        this.size = 56;
        this.type = IS.ISP_NCN;
        this.reqi = 0;
        this.ucid = 0;
        
        this.uname = '';
        this.pname = '';
        
        this.admin = 0;
        this.total = 0;
        this.flags = 0;
        this.sp3 = 0;
        
        addPacketBase(this);
    };
    
    IS.IS_NCI = function()
    {
        this._PACK = 'BBBBBBBBLL';
        
        this.size = 16;
        this.type = IS.ISP_NCI;
        this.reqi = 0;
        this.ucid = 0;

        this.language = 0;
        this.sp1 = 0;
        this.sp2 = 0;
        this.sp3 = 0;
        
        this.userid = 0;
        this.ipaddress = 0;
        
        addPacketBase(this);
    };
    
    IS.IS_CNL = function()
    {
        this._PACK = 'BBBBBBBB';
        
        this.size = 8;
        this.type = IS.ISP_CNL;
        this.reqi = 0;
        this.ucid = 0;
        
        this.reason = 0;
        this.total = 0;
        this.sp2 = 0;
        this.sp3 = 0;
        
        addPacketBase(this);
    };
    
    IS.IS_CPR = function()
    {
        this._PACK = 'BBBB24s8s';
        
        this.size = 36;
        this.type = IS.ISP_CPR;
        this.reqi = 0;
        this.ucid = 0;
        
        this.pname = '';
        this.plate = '';
        
        addPacketBase(this);
    };
    
    IS.IS_NPL = function()
    {
        this._PACK = 'BBBBBBH24s8s4s16s4BBBBBlBBBB';
        
        this.size = 76;
        this.type = IS.ISP_NPL;
        this.reqi = 0;
        this.plid = 0;
        
        this.ucid = 0;
        this.ptype = 0;
        this.flags = 0;
        
        this.pname = '';
        this.plate = '';
        
        this.cname = '';
        this.sname = '';
        this.tyres = new Uint8Array(4)
        
        this.h_mass = 0;
        this.h_tres = 0;
        this.model = 0;
        this.pass = 0;
        
        this.spare = 0;
        
        this.setf = 0;
        this.nump = 0;
        this.sp2 = 0;
        this.sp3 = 0;
        
        addPacketBase(this);
    };
    
    IS.IS_PLP = function()
    {
        this._PACK = 'BBBB';
        
        this.size = 4;
        this.type = IS.ISP_PLP;
        this.reqi = 0;
        this.plid = 0;
        
        addPacketBase(this);
    };
    
    IS.IS_PLL = function()
    {
        this._PACK = 'BBBB';
        
        this.size = 4;
        this.type = IS.ISP_PLL;
        this.reqi = 0;
        this.plid = 0;
        
        addPacketBase(this);
    };
    
    IS.IS_CRS = function()
    {
        this._PACK = 'BBBB';
        
        this.size = 4;
        this.type = IS.ISP_CRS;
        this.reqi = 0;
        this.plid = 0;
        
        addPacketBase(this);
    };
    
    IS.IS_LAP = function()
    {
        this._PACK = 'BBBBLLHHBBBB';
        
        this.size = 20;
        this.type = IS.ISP_LAP;
        this.reqi = 0;
        this.plid = 0;
        
        this.ltime = 0;
        this.etime = 0;
        
        this.lapsdone = 0;
        this.flags = 0;
        
        this.sp0 = 0;
        this.penalty = 0;
        this.numstops = 0;
        this.sp3 = 0;
        
        addPacketBase(this);
    };
    
    IS.IS_SPX = function()
    {
        this._PACK = 'BBBBLLBBBB';
        
        this.size = 16;
        this.type = IS.ISP_SPX;
        this.reqi = 0;
        this.plid = 0;
        
        this.stime = 0;
        this.etime = 0;
        
        this.split = 0;
        this.penalty = 0;
        this.numstops = 0;
        this.sp3 = 0;
        
        addPacketBase(this);
    };
    
    IS.IS_PIT = function()
    {
        this._PACK = 'BBBBHHBBBB4BLL';
        
        this.size = 24;
        this.type = IS.ISP_PIT;
        this.reqi = 0;
        this.plid = 0;
        
        this.lapsdone = 0;
        this.flags = 0;
        
        this.sp0 = 0;
        this.penalty = 0;
        this.numstops = 0;
        this.sp3 = 0;
        
        this.tyres = new Uint8Array(4);
        
        this.work = 0;
        this.spare = 0;
        
        addPacketBase(this);
    };
    
    IS.IS_PSF = function()
    {
        this._PACK = 'BBBBLL';
        
        this.size = 12;
        this.type = IS.ISP_PSF;
        this.reqi = 0;
        this.plid = 0;
        
        this.stime = 0;
        this.spare = 0;
        
        addPacketBase(this);
    };
    
    IS.PITLANE_EXIT         = 0; // 0 - left pit lane
    IS.PITLANE_ENTER        = 1; // 1 - entered pit lane
    IS.PITLANE_NO_PURPOSE   = 2; // 2 - entered for no purpose
    IS.PITLANE_DT           = 3; // 3 - entered for drive-through
    IS.PITLANE_SG           = 4; // 4 - entered for stop-go
    
    IS.IS_PLA = function()
    {
        this._PACK = 'BBBBBBBB';
        
        this.size = 8;
        this.type = IS.ISP_PLA;
        this.reqi = 0;
        this.plid = 0;
        
        this.fact = 0;
        this.sp1 = 0;
        this.sp2 = 0;
        this.sp3 = 0;
        
        addPacketBase(this);
    };
    
    IS.IS_CCH = function()
    {
        this._PACK = 'BBBBBBBB';
        
        this.size = 8;
        this.type = IS.ISP_CCH;
        this.reqi = 0;
        this.plid = 0;
        
        this.camera = '';
        this.sp1 = 0;
        this.sp2 = 0;
        this.sp3 = 0;
        
        addPacketBase(this);
    };
    
    IS.IS_PEN = function()
    {
        this._PACK = 'BBBBBBBB';
        
        this.size = 8;
        this.type = IS.ISP_PEN;
        this.reqi = 0;
        this.plid = 0;
        
        this.oldpen = '';
        this.newpen = 0;
        this.reason = 0;
        this.sp3 = 0;
        
        addPacketBase(this);
    };
    
    IS.IS_TOC = function()
    {
        this._PACK = 'BBBBBBBB';
        
        this.size = 8;
        this.type = IS.ISP_TOC;
        this.reqi = 0;
        this.plid = 0;
        
        this.olducid = 0;
        this.newucid = 0;
        this.sp2 = 0;
        this.sp3 = 0;
        
        addPacketBase(this);
    };
    
    IS.FLG_BLUE     = 1; // given
    IS.FLG_YELLOW   = 1; // receiving
    
    IS.IS_FLG = function()
    {
        this._PACK = 'BBBBBBBB';
        
        this.size = 8;
        this.type = IS.ISP_FLG;
        this.reqi = 0;
        this.plid = 0;
        
        this.offon = 0;
        this.flag = 0;
        this.carbehind = 0;
        this.sp3 = 0;
        
        addPacketBase(this);
    };
    
    IS.IS_PFL = function()
    {
        this._PACK = 'BBBBHH';
        
        this.size = 8;
        this.type = IS.ISP_PFL;
        this.reqi = 0;
        this.plid = 0;
        
        this.flags = 0;
        this.spare = 0;
        
        addPacketBase(this);
    };
    
    IS.IS_FIN = function()
    {
        this._PACK = 'BBBBLLBBBBHH';
        
        this.size = 20;
        this.type = IS.ISP_FIN;
        this.reqi = 0;
        this.plid = 0;
        
        this.ttime = 0;
        this.btime = 0;
        
        this.spa = 0;
        this.numstops = 0;
        this.confirm = 0;
        this.spb = 0;
        
        this.lapsdone = 0;
        this.flags = 0;
        
        addPacketBase(this);
    };
    
    IS.CONF_MENTIONED   = 1;
    IS.CONF_CONFIRMED   = 2;
    IS.CONF_PENALTY_DT  = 4;
    IS.CONF_PENALTY_SG  = 8;
    IS.CONF_PENALTY_30  = 16;
    IS.CONF_PENALTY_45  = 32;
    IS.CONF_DID_NOT_PIT = 64;
    
    IS.CONF_DISQ = (IS.CONF_PENALTY_DT | IS.CONF_PENALTY_SG | IS.CONF_DID_NOT_PIT);
    IS.CONF_TIME = (IS.CONF_PENALTY_30 | IS.CONF_PENALTY_45);
    
    IS.IS_RES = function()
    {
        this._PACK = 'BBBB24s24s8s4sLLBBBBHHBBH';
        
        this.size = 84;
        this.type = IS.ISP_RES;
        this.reqi = 0;
        this.plid = 0;
        
        this.uname = '';
        this.pname = '';
        this.plate = '';
        this.cname = '';
        
        this.ttime = 0;
        this.btime = 0;
        
        this.spa = 0;
        this.numstops = 0;
        this.confirm = 0;
        this.spb = 0;
        
        this.lapsdone = 0;
        this.flags = 0;
        
        this.resultnum = 0;
        this.numres = 0;
        this.pseconds = 0;
        
        addPacketBase(this);
    };
    
    IS.IS_REO = function()
    {
        this._PACK = 'BBBB32B';
        
        this.size = 36;
        this.type = IS.ISP_REO;
        this.reqi = 0;
        this.nump = 0;
        
        this.plid = new Uint8Array(32);
        
        addPacketBase(this);
    };
    
    // Pit Lane Facts
    IS.PITLANE_EXIT        = 0;    // left pit lane
    IS.PITLANE_ENTER       = 1;    // entered pit lane
    IS.PITLANE_NO_PURPOSE  = 2;    // entered for no purpose
    IS.PITLANE_DT          = 3;    // entered for drive-through
    IS.PITLANE_SG          = 4;    // entered for stop-go
    IS.PITLANE_NUM         = 5;
    
    // Pit Work Flags
    IS.PSE_NOTHING      = 0;
    IS.PSE_STOP         = 1;
    IS.PSE_FR_DAM       = 2;
    IS.PSE_FR_WHL       = 3;
    IS.PSE_LE_FR_DAM    = 4;
    IS.PSE_LE_FR_WHL    = 5;
    IS.PSE_RI_FR_DAM    = 6;
    IS.PSE_RI_FR_WHL    = 7;
    IS.PSE_RE_DAM       = 8;
    IS.PSE_RE_WHL       = 9;
    IS.PSE_LE_RE_DAM    = 10;
    IS.PSE_LE_RE_WHL    = 11;
    IS.PSE_RI_RE_DAM    = 12;
    IS.PSE_RI_RE_WHL    = 13;
    IS.PSE_BODY_MINOR   = 14;
    IS.PSE_BODY_MAJOR   = 15;
    IS.PSE_SETUP        = 16;
    IS.PSE_REFUEL       = 17;
    IS.PSE_NUM          = 18;
    
    // View identifiers
    IS.VIEW_FOLLOW      = 0;
    IS.VIEW_HELI        = 1;
    IS.VIEW_CAM         = 2;
    IS.VIEW_DRIVER      = 3;
    IS.VIEW_CUSTOM      = 4;
    IS.VIEW_MAX         = 5;
    
    IS.VIEW_ANOTHER     = 255; // viewing another car
    
    // Leave reasons
    IS.LEAVR_DISCO      = 0;
    IS.LEAVR_TIMEOUT    = 1;
    IS.LEAVR_LOSTCONN   = 2;
    IS.LEAVR_KICKED     = 3;
    IS.LEAVR_BANNED     = 4;
    IS.LEAVR_SECURITY   = 5;
    IS.LEAVR_NUM        = 6;
    
    // Penalty values (VALID means the penalty can now be cleared)
    IS.PENALTY_NONE     = 0;
    IS.PENALTY_DT       = 1;
    IS.PENALTY_DT_VALID = 2;
    IS.PENALTY_SG       = 3;
    IS.PENALTY_SG_VALID = 4;
    IS.PENALTY_30       = 5;
    IS.PENALTY_45       = 6;
    IS.PENALTY_NUM      = 7;
    
    // Penalty reasons
    IS.PENR_UNKNOWN     = 0;    // unknown or cleared penalty
    IS.PENR_ADMIN       = 1;    // penalty given by admin
    IS.PENR_WRONG_WAY   = 2;    // wrong way driving
    IS.PENR_FALSE_START = 3;    // starting before green light
    IS.PENR_SPEEDING    = 4;    // speeding in pit lane
    IS.PENR_STOP_SHORT  = 5;    // stop-go pit stop too short
    IS.PENR_STOP_LATE   = 6;    // compulsory stop is too late
    IS.PENR_NUM         = 7;
    
    // Player flags
    IS.PIF_SWAPSIDE         = 1;
    IS.PIF_RESERVED_2       = 2;
    IS.PIF_RESERVED_4       = 4;
    IS.PIF_AUTOGEARS        = 8;
    IS.PIF_SHIFTER          = 16;
    IS.PIF_RESERVED_32      = 32;
    IS.PIF_HELP_B           = 64;
    IS.PIF_AXIS_CLUTCH      = 128;
    IS.PIF_INPITS           = 256;
    IS.PIF_AUTOCLUTCH       = 512;
    IS.PIF_MOUSE            = 1024;
    IS.PIF_KB_NO_HELP       = 2048;
    IS.PIF_KB_STABILISED    = 4096;
    IS.PIF_CUSTOM_VIEW      = 8192;
    
    // Tyre compounds (4 byte order : rear L, rear R, front L, front R)
    IS.TYRE_R1              = 0;
    IS.TYRE_R2              = 1;
    IS.TYRE_R3              = 2;
    IS.TYRE_R4              = 3;
    IS.TYRE_ROAD_SUPER      = 4;
    IS.TYRE_ROAD_NORMAL     = 5;
    IS.TYRE_HYBRID          = 6;
    IS.TYRE_KNOBBLY         = 7;
    IS.TYRE_NUM             = 8;
    
    IS.NOT_CHANGED = 255;
    
    // Confirmation flags
    IS.CONF_MENTIONED       = 1;
    IS.CONF_CONFIRMED       = 2;
    IS.CONF_PENALTY_DT      = 4;
    IS.CONF_PENALTY_SG      = 8;
    IS.CONF_PENALTY_30      = 16;
    IS.CONF_PENALTY_45      = 32;
    IS.CONF_DID_NOT_PIT     = 64;
    
    IS.CONF_DISQ	= (IS.CONF_PENALTY_DT | IS.CONF_PENALTY_SG | IS.CONF_DID_NOT_PIT);
    IS.CONF_TIME	= (IS.CONF_PENALTY_30 | IS.CONF_PENALTY_45);
    
    // Race flags
    IS.HOSTF_CAN_VOTE       = 1;
    IS.HOSTF_CAN_SELECT     = 2;
    IS.HOSTF_MID_RACE       = 32;
    IS.HOSTF_MUST_PIT       = 64;
    IS.HOSTF_CAN_RESET      = 128;
    IS.HOSTF_FCV            = 256;
    IS.HOSTF_CRUISE         = 512;
    
    // Passengers byte
    // bit 0 female
    // bit 1 front
    // bit 2 female
    // bit 3 rear left
    // bit 4 female
    // bit 5 rear middle
    // bit 6 female
    // bit 7 rear right
    
    IS.IS_AXI = function()
    {
        this._PACK = 'BBBBBBH32s';
        
        this.size = 40;
        this.type = IS.ISP_AXI;
        this.reqi = 0;
        this.zero = 0;
        
        this.axstart = 0;
        this.numcp = 0;
        this.numo = 0;
        
        this.lname = '';
        
        addPacketBase(this);
    };
    
    IS.IS_AXO = function()
    {
        this._PACK = 'BBBB';
        
        this.size = 4;
        this.type = IS.ISP_AXO;
        this.reqi = 0;
        this.plid = 0;
        
        addPacketBase(this);
    };
    
    IS.IS_AXO = function()
    {
        this._PACK = 'BBBB';
        
        this.size = 4;
        this.type = IS.ISP_AXO;
        this.reqi = 0;
        this.plid = 0;
        
        addPacketBase(this);
    };
    
    IS.IS_NODELAP = function()
    {
        this._PACK = 'HHBB';
        
        this.node = 0;
        this.lap = 0;
        this.plid = 0;
        this.position = 0;
        
        addPacketBase(this);
    };
    
    IS.IS_NLP = function()
    {
        //-- NEEDS WORK --//
        this.size = 0;
        this.type = IS.ISP_NLP;
        this.reqi = 0;
        this.nump = 0;
        
        this.info = [];
    };
    
    // CompCar info flags
    IS.CCI_BLUE     = 1;
    IS.CCI_YELLOW   = 2;
    IS.CCI_LAG      = 32;
    IS.CCI_FIRST    = 64;
    IS.CCI_LAST     = 128;
    
    IS.IS_COMPCAR = function()
    {
        this._PACK = 'HHBBBBlllHHHh';
        
        this.node = 0;
        this.lap = 0;
        this.plid = 0;
        this.position = 0;
        this.info = 0;
        this.sp3 = 0;
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.speed = 0;
        this.direction = 0;
        this.heading = 0;
        this.angvel = 0;
        
        addPacketBase(this);
    };
    
    IS.IS_MCI = function()
    {
        this._PACK = 'BBBB';
        
        // Variable size packet
        // 4 + (numc * 28)
        this.size = 4;
        this.type = IS.ISP_MCI;
        this.reqi = 0;
        this.numc = 0;
        
        this.info = [];
        
        addPacketBase(this);
        
        this.unpackPost = function(dv)
        {
            var a, ofs = 4;
            for (a = 0; a < this.numc; a++)
            {
                this.info.push(new IS.IS_COMPCAR());
                this.info[a].unpack(new DataView(dv.buffer.slice(ofs, ofs + 28)));
                ofs += 28;
            }       
        };
    //  this.packPre = function()
    //  {
    //  };
    };
    
    IS.IS_CARCONTACT = function()
    {
        this._PACK = 'BBBcBBBBBBcchh';
        
        this.plid = 0;
        this.info = 0;
        this.sp2 = 0;
        this.steer = 0;
        
        this.thrbrk = 0;
        this.cluhan = 0;
        this.gearsp = 0;
        this.speed = 0;
        
        this.direction = 0;
        this.heading = 0;
        this.accelf = 0;
        this.accelr = 0;
        
        this.x = 0;
        this.y = 0;
        
        addPacketBase(this);
    };
    
    IS.IS_CON = function()
    {
        this._PACK = 'BBBBHH';
        
        this.size = 40;
        this.type = IS.ISP_CON;
        this.reqi = 0;
        this.numc = 0;
        
        this.spclose = 0;
        this.time = 0;
        
        this.a = null;
        this.b = null;
        
        addPacketBase(this);
        
        this.unpackPost = function(dv)
        {
            this.a = new IS.IS_CARCONTACT();
            this.a.unpack(new DataView(dv.buffer.slice(6, 22)));
            this.b = new IS.IS_CARCONTACT();
            this.b.unpack(new DataView(dv.buffer.slice(22, 38)));
        };
    //  this.packPre = function()
    //  {
    //  };
    };
    
    IS.IS_CARCONTOBJ = function()
    {
        this._PACK = 'BBBBhh';
        
        this.direction = 0;
        this.heading = 0;
        this.speed = 0;
        this.sp3 = 0;
        
        this.x = 0;
        this.y = 0;
        
        addPacketBase(this);
    };
    
    // IS_OBH OBHFlags
    IS.OBH_LAYOUT       = 1;
    IS.OBH_CAN_MOVE     = 2;
    IS.OBH_WAS_MOVING   = 4;
    IS.OBH_ON_SPOT      = 8;
    
    IS.IS_OBH = function()
    {
        this._PACK = 'BBBBHH8qhhBBBB';
            
        this.size = 24;
        this.type = IS.ISP_OBH;
        this.reqi = 0;
        this.plid = 0;
        
        this.spclose = 0;
        this.time = 0;
        
        this.c = null;
        
        this.x = 0;
        this.y = 0;
        
        this.sp0;
        this.sp1 = 0;
        
        this.index = 0;
        this.obhflags = 0;
        
        addPacketBase(this);
        
        this.unpackPost = function(dv)
        {
            this.c = new IS.IS_CARCONTOBJ();
            this.c.unpack(new DataView(dv.buffer.slice(8, 16)));
        };
    //  this.packPre = function()
    //  {
    //  };
    };
    
    IS.IS_HLV = function()
    {
        this._PACK = 'BBBBBBH';
        
        this.size = 16;
        this.type = IS.ISP_HLV;
        this.reqi = 0;
        this.plid = 0;
        
        this.hlvc = 0;
        this.sp1 = 0;
        this.time = 0;
        
        this.c = null;
        
        addPacketBase(this);
        
        this.unpackPost = function(dv)
        {
            this.c = new IS.IS_CARCONTOBJ();
            this.c.unpack(new DataView(dv.buffer.slice(8, 16)));
        };
    //  this.packPre = function()
    //  {
    //  };
    };
    
    // IS_BFN subt
    IS.BFN_DEL_BTN      = 0;
    IS.BFN_CLEAR        = 1;
    IS.BFN_USER_CLEAR   = 2;
    IS.BFN_REQUEST      = 3;
    
    IS.IS_BFN = function()
    {
        this._PACK = 'BBBBBBBB';
        
        this.size = 8;
        this.type = IS.ISP_BFN;
        this.reqi = 0;
        this.subt = 0;
        
        this.ucid = 0;
        this.clickid = 0;
        this.inst = 0;
        this.sp3 = 0;
        
        addPacketBase(this);
    };
    
    IS.IS_BTC = function() // BuTton Click - sent back when user clicks a button
    {
        this._PACK = 'BBBBBBBB';
        
    	this.size = 8
    	this.type = IS.ISP_BTC
    	this.reqi = 0
    	this.ucid = 0;		// connection that clicked the button (zero if local)
    
    	this.clickid = 0;	// button identifier originally sent in IS_BTN
    	this.inst = 0;		// used internally by InSim
    	this.cflags = 0;		// button click flags - see below
    	this.sp3 = 0;
        
        addPacketBase(this);
    };
    
    IS.IS_BTT = function() // BuTton Type - sent back when user types into a text entry button
    {
        this._PACK = 'BBBBBBBB96s';
        
    	this.size = 8
    	this.type = IS.ISP_BTT
    	this.reqi = 0
    	this.ucid = 0;		// connection that typed into the button (zero if local)
    
    	this.clickid = 0;	// button identifier originally sent in IS_BTN
    	this.inst = 0;		// used internally by InSim
    	this.typein = 0;		// from original button specification
    	this.sp3 = 0;
    
    	this.text = "";	// typed text, zero to TypeIn specified in IS_BTN
    };
    
    IS.IR_HLR = function() // HostList Request
    {
        this._PACK = 'BBBB';
        
        this.size = 4;
        this.type = IS.IRP_HLR;
        this.reqi = 0;
        this.sp0;
        
        addPacketBase(this);
    };
    
    IS.HInfo = function() // Sub packet for IR_HOS. Contains host information
    {
        this._PACK = '32s6sBB';
        
        this.hname = "";    // Name of the host
        this.track = "";    // Short track name
        this.flags = 0;     // Info flags about the host - see NOTE 1) below
        this.numconns = 0;  // Number of people on the host
        
        addPacketBase(this);
    };
    
    IS.HOS_SPECPASS = 1;    // Host requires a spectator password
    IS.HOS_LICENSED = 2;    // Bit is set if host is licensed
    IS.HOS_S1       = 4;    // Bit is set if host is S1
    IS.HOS_S2       = 8;    // Bit is set if host is S2
    IS.HOS_FIRST    = 64;   // Indicates the first host in the list
    IS.HOS_LAST     = 128;  // Indicates the last host in the list
    
    IS.IR_HOS = function() // Hostlist (hosts connected to the Relay)
    {
        this._PACK = 'BBBB';
        
        this.size = 0;      // 4 + NumHosts * 40
        this.type = IS.IRP_HOS;     // IRP_HOS
        this.reqi = 0;      // As given in IR_HLR
        this.numhosts = 0;  // Number of hosts described in this packet
    
        this.info = []; // Host info for every host in the Relay. 1 to 6 of these in a IR_HOS
        
        addPacketBase(this);
        
        this.unpackPost = function(dv)
        {
            var a, ofs = 4;
            //this.info.splice(0, this.info.length);
            this.info.length = 0;
            for (a = 0; a < this.numhosts; a++)
            {
                this.info.push(new IS.HInfo());
                this.info[a].unpack(new DataView(dv.buffer.slice(ofs, ofs + 40)));
                ofs += 40;
            }
        };
    };
    
    IS.IR_SEL = function()
    {
        this._PACK = 'BBBB32s16s16s';
        
        this.size = 68;
        this.type = IS.IRP_SEL;
        this.reqi = 0;
        this.zero = 0;
        
        this.hname = '';    // Hostname to receive data from - may be colourcode stripped
        this.admin = '';    // Admin password (to gain admin access to host)
        this.spec = '';     // Spectator password (if host requires it)
        
        addPacketBase(this);
    };
    
    IS.IR_ARQ = function() // Admin Request
    {
        this._PACK = 'BBBB';
        
        this.size = 4;
        this.type = IS.IRP_ARQ;
        this.reqi = 0;
        this.sp0;
        
        addPacketBase(this);
    };
    
    IS.IR_ARP = function() // Admin Response
    {
        this._PACK = 'BBBB';
        
        this.size = 4;
        this.type = IS.IRP_ARP;
        this.reqi = 0;
        this.admin = 0;
        
        addPacketBase(this);
    };
    
    IS.IR_ERR = function()
    {
        this._PACK = 'BBBB';
        
        this.size = 4;
        this.type = IS.IRP_ERR;
        this.reqi = 0;
        this.errno = 0;
        
        addPacketBase(this);
    };
    
    var ISgetProperties = function()
    {
        var props = [];
        for (var a in this)
        {
            if (a == "_PACK") { continue; }
            else if (a == "getProperties") { break; }
            props.push(a);
        }
        return props;
    };
    
    var ISPack = function()
    {
        if (this.packPre) { this.packPre(); }
        
        var d = new ArrayBuffer(this.size);
        var dv = new DataView(d);
        var props = this.getProperties();
        var propIndex = 0;
        var a, b, c, cn, cs = "", bo = 0;
        for (a = 0; a < this._PACK.length; a++)
        {
            // Check if we have a number (for repitition)
            c = this._PACK.charAt(a);
            cn = parseInt(c, 10);
            if (cn == c)
            {
                cs += c;
                continue;
            }
            if (!cs) { cs = 1; }
            else { cs = parseInt(cs, 10); }
            
            switch(c)
            {
                case "q":   // skip x bytes and skip property
                    bo += cs;
                    break;
                
                case "B":   // unsigned char
                    if (cs > 1)
                    {
                        b = 0; while(b < cs)
                        {
                            dv.setUint8(bo++, this[props[propIndex]][b++]);
                        }
                    }
                    else
                    {
                        dv.setUint8(bo++, this[props[propIndex]]);
                    }
                    break;
                
                case "c":   // signed char
                    if (cs > 1)
                    {
                        b = 0; while(b < cs)
                        {
                            dv.setInt8(bo++, this[props[propIndex]][b++]);
                        }
                    }
                    else
                    {
                        dv.setInt8(bo++, this[props[propIndex]]);
                    }
                    break;
                
                case "H":   // unsigned short
                    if (cs > 1)
                    {
                        b = 0; while(b < cs)
                        {
                            dv.setUint16(bo, this[props[propIndex]][b++], true); bo += 2;
                        }
                    }
                    else
                    {
                        dv.setUint16(bo, this[props[propIndex]], true); bo += 2;
                    }
                    break;
                
                case "h":
                    if (cs > 1)
                    {
                        b = 0; while(b < cs)
                        {
                            dv.setInt16(bo, this[props[propIndex]][b++], true); bo += 2;
                        }
                    }
                    else
                    {
                        dv.setInt16(bo, this[props[propIndex]], true); bo += 2;
                    }
                    break;
                
                case "L":
                    if (cs > 1)
                    {
                        b = 0; while(b < cs)
                        {
                            dv.setUint32(bo, this[props[propIndex]][b++], true); bo += 4;
                        }
                    }
                    else
                    {
                        dv.setUint32(bo, this[props[propIndex]], true); bo += 4;
                    }
                    break;
                
                case "l":
                    if (cs > 1)
                    {
                        b = 0; while(b < cs)
                        {
                            dv.setInt32(bo, this[props[propIndex]][b++], true); bo += 4;
                        }
                    }
                    else
                    {
                        dv.setInt32(bo, this[props[propIndex]], true); bo += 4;
                    }
                    break;
                
                case "f":
                    if (cs > 1)
                    {
                        b = 0; while(b < cs)
                        {
                            dv.setFloat32(bo, this[props[propIndex]][b++], true); bo += 4;
                        }
                    }
                    else
                    {
                        dv.setFloat32(bo, this[props[propIndex]], true); bo += 4;
                    }
                    break;
                
                case "s":   // string character
                    for (b = 0; b < this[props[propIndex]].length; b++)
                    {
                        if (b == cs) { break; }
                        dv.setUint8(bo+b, this[props[propIndex]].charCodeAt(b));
                    }
                    bo += cs;
                    
                    break;
                
                default:
                    alert("unsupported PACK character : " + this._PACK.charAt(a));
                    break;
            }
            
            propIndex++;
            cs = "";
        }
        
        return d;
    };
    
    var ISUnpack = function(dv)
    {
        if ((dv.byteLength % 4) > 0) { return false; }
        
        var props = this.getProperties();
        var propIndex = 0;
        var a, b, c, cn, cs = '', bo = 0;
        for (a = 0; a < this._PACK.length; a++)
        {
            // Check if we have a number (for repitition)
            c = this._PACK.charAt(a);
            cn = parseInt(c, 10);
            if (cn == c)
            {
                cs += c;
                continue;
            }
            if (!cs) { cs = 1; }
            else { cs = parseInt(cs, 10); }
            
            switch(c)
            {
                case "q":   // skip x bytes and skip property
                    bo += cs;
                    break;
                
                case "B":   // unsigned char
                    if (cs > 1)
                    {
                        this[props[propIndex]] = new Uint8Array(dv.buffer.slice(bo, bo+cs));
                        bo += cs;
                    }
                    else
                    {
                        this[props[propIndex]] = dv.getUint8(bo++);
                    }
                    break;
                
                case "c":   // signed char
                    if (cs > 1)
                    {
                        this[props[propIndex]] = new Int8Array(dv.buffer.slice(bo, bo+cs));
                        bo += cs;
                    }
                    else
                    {
                        this[props[propIndex]] = dv.getInt8(bo++);
                    }
                    break;
                
                case "H":   // unsigned short
                    if (cs > 1)
                    {
                        this[props[propIndex]] = new Uint16Array(dv.buffer.slice(bo, bo+cs*2));
                        bo += cs*2;
                    }
                    else
                    {
                        this[props[propIndex]] = dv.getUint16(bo, true); bo += 2;
                    }
                    break;
                
                case "h":
                    if (cs > 1)
                    {
                        this[props[propIndex]] = new Int16Array(dv.buffer.slice(bo, bo+cs*2));
                        bo += cs*2;
                    }
                    else
                    {
                        this[props[propIndex]] = dv.getInt16(bo, true); bo += 2;
                    }
                    break;
                
                case "L":
                    if (cs > 1)
                    {
                        this[props[propIndex]] = new Uint32Array(dv.buffer.slice(bo, bo+cs*4));
                        bo += cs*4;
                    }
                    else
                    {
                        this[props[propIndex]] = dv.getUint32(bo, true); bo += 4;
                    }
                    break;
                
                case "l":
                    if (cs > 1)
                    {
                        this[props[propIndex]] = new Int32Array(dv.buffer.slice(bo, bo+cs*4));
                        bo += cs*4;
                    }
                    else
                    {
                        this[props[propIndex]] = dv.getInt32(bo, true); bo += 4;
                    }
                    break;
                
                case "f":
                    if (cs > 1)
                    {
                        this[props[propIndex]] = new Float32Array(dv.buffer.slice(bo, bo+cs*4));
                        bo += cs*4;
                    }
                    else
                    {
                        this[props[propIndex]] = dv.getFloat32(bo, true); bo += 4;
                    }
                    break;
                
                case "s":   // string character
                    this[props[propIndex]] = '';
                    for (b = 0; b < cs; b++)
                    {
                        c = dv.getUint8(bo+b);
                        if (c === 0) { break; }
                        this[props[propIndex]] += String.fromCharCode(c);
                    }
                    bo += cs;
                    
                    break;
                
                default:
                    alert("unsupported PACK character : " + this._PACK.charAt(a));
                    break;
            }
            
            propIndex++;
            cs = '';
        }
        
        if (this.unpackPost) { this.unpackPost(dv); }
        
        return true;
    };
    
    function addPacketBase(_ob)
    {
        _ob.getProperties = ISgetProperties;
        _ob.pack = ISPack;
        _ob.unpack = ISUnpack;
    }
    
    return IS;
})();
