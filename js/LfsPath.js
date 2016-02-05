var LfsPath = (function()
{
    "use strict";
    
    var a, n;
    
    function LfsPath()
    {
        this.pathName       = '';
        this.version        = 0;
        this.revision       = 0;
        this.numNodes       = 0;
        this.finishLine     = 0xFFFF;
        this.split1         = 0xFFFF;
        this.split2         = 0xFFFF;
        this.split3         = 0xFFFF;
        this.nodes          = [];
        this.onLoad         = null;
    }
    
    LfsPath.prototype.destroy = function()
    {
        this.pathName       = '';
        this.version        = 0;
        this.revision       = 0;
        this.numNodes       = 0;
        this.finishLine     = 0;
        this.finishLine     = 0xFFFF;
        this.split1         = 0xFFFF;
        this.split2         = 0xFFFF;
        this.split3         = 0xFFFF;
        this.nodes.length   = 0;
        this.onLoad         = null;
    };
    
    LfsPath.prototype.load = function(track)
    {
        this.destroy();
        
        if (track.slice(-1) == 'Y' || track.slice(-1) == 'X') { return; }
        
        this.pathName = track;

        var rq = new DataRequest(track, 'http://img.lfs.net/remote/pth/' + track + '.pth');
        rq.responseType = 'arraybuffer';
        rq.responseCallback = HtmlRemote.bind(this.onPathLoaded, this);
        rq.request();
    };
    
    LfsPath.prototype.onPathLoaded = function(id, dataBuf)
    {
        this.parse(dataBuf);
        if (this.onLoad) {
            this.onLoad();
        }
    };
    
    LfsPath.prototype.parse = function(dataBuf)
    {
        var dView = new DataView(dataBuf);
        if (dView.byteLength < 6 || HtmlRemote.getDVNullString(dView, 0, 6) != 'LFSPTH')
        {
            return;
        }
        
        var offset = 6;

        this.version       = dView.getUint8(offset++);
        this.revision      = dView.getUint8(offset++);
        if (this.version > 0 || this.revision > 0)
        {
            return;
        }
        
        this.numNodes      = dView.getUint32(offset, true);      offset += 4;
        this.finishLine    = dView.getUint32(offset, true);      offset += 4;
        
        if (dView.byteLength != this.numNodes * 40 + 16)
        {
            return;
        }
        
        for (a = 0; a < this.numNodes; a++)
        {
            n = new LfsPathNode();
            n.centreX       = dView.getInt32(offset, true) / 65536;     offset += 4;
            n.centreY       = -dView.getInt32(offset, true) / 65536;    offset += 4;
            n.centreZ       = dView.getInt32(offset, true) / 65536;     offset += 4;
            n.dirX          = dView.getFloat32(offset, true);           offset += 4;
            n.dirY          = -dView.getFloat32(offset, true);          offset += 4;
            n.dirZ          = dView.getFloat32(offset, true);           offset += 4;
            n.limitLeft     = dView.getFloat32(offset, true);           offset += 4;
            n.limitRight    = dView.getFloat32(offset, true);           offset += 4;
            n.driveLeft     = dView.getFloat32(offset, true);           offset += 4;
            n.driveRight    = dView.getFloat32(offset, true);           offset += 4;
            this.nodes.push(n);
        }
    };
    
    LfsPath.prototype.generate = function(cv, zoom)
    {
        if (!this.numNodes) { return; }
        
        this.clear(cv);
        
        var llx, lly, lrx, lry,
            llx2, lly2, lrx2, lry2,
            dlx, dly, drx, dry,
            dlx2, dly2, drx2, dry2;
        var ctx = cv.getContext('2d');
        ctx.save();
        ctx.globalCompositeOperation  = 'lighter';
        
        var leftCos = Math.cos(90 * Math.PI / 180),
            leftSin = Math.sin(90 * Math.PI / 180),
            rightCos = Math.cos(-90 * Math.PI / 180),
            rightSin = Math.sin(-90 * Math.PI / 180);
        
        n = this.nodes[this.numNodes - 1];
        llx2 = (n.dirX * leftCos - n.dirY * leftSin) * n.limitLeft + n.centreX + 1280;
        lly2 = (n.dirY * leftCos + n.dirX * leftSin) * n.limitLeft + n.centreY + 1280;
        lrx2 = (n.dirX * rightCos - n.dirY * rightSin) * -n.limitRight + n.centreX + 1280;
        lry2 = (n.dirY * rightCos + n.dirX * rightSin) * -n.limitRight + n.centreY + 1280;
        
        dlx2 = (n.dirX * leftCos - n.dirY * leftSin) * n.driveLeft + n.centreX + 1280;
        dly2 = (n.dirY * leftCos + n.dirX * leftSin) * n.driveLeft + n.centreY + 1280;
        drx2 = (n.dirX * rightCos - n.dirY * rightSin) * -n.driveRight + n.centreX + 1280;
        dry2 = (n.dirY * rightCos + n.dirX * rightSin) * -n.driveRight + n.centreY + 1280;
        
        for (a = 0; a < this.numNodes; a++)
        {
            n = this.nodes[a];
            
            llx = (n.dirX * leftCos - n.dirY * leftSin) * n.limitLeft + n.centreX + 1280;
            lly = (n.dirY * leftCos + n.dirX * leftSin) * n.limitLeft + n.centreY + 1280;
            lrx = (n.dirX * rightCos - n.dirY * rightSin) * -n.limitRight + n.centreX + 1280;
            lry = (n.dirY * rightCos + n.dirX * rightSin) * -n.limitRight + n.centreY + 1280;

            ctx.fillStyle = 'rgba(200, 200, 200, 0.25)';
            ctx.beginPath();
            ctx.moveTo(llx2, lly2);
            ctx.lineTo(llx, lly);
            ctx.lineTo(lrx, lry);
            ctx.lineTo(lrx2, lry2);
            ctx.closePath();
            ctx.fill();
            
            llx2 = llx;
            lly2 = lly;
            lrx2 = lrx;
            lry2 = lry;
            
            dlx = (n.dirX * leftCos - n.dirY * leftSin) * n.driveLeft + n.centreX + 1280;
            dly = (n.dirY * leftCos + n.dirX * leftSin) * n.driveLeft + n.centreY + 1280;
            drx = (n.dirX * rightCos - n.dirY * rightSin) * -n.driveRight + n.centreX + 1280;
            dry = (n.dirY * rightCos + n.dirX * rightSin) * -n.driveRight + n.centreY + 1280;

            ctx.fillStyle = 'rgba(200, 200, 200, 0.35)';
            ctx.beginPath();
            ctx.moveTo(dlx2, dly2);
            ctx.lineTo(dlx, dly);
            ctx.lineTo(drx, dry);
            ctx.lineTo(drx2, dry2);
            ctx.closePath();
            ctx.fill();
            
            if (a == this.finishLine)
            {
                this.drawLine(ctx, '#0000FF', dlx2, dly2, drx2, dry2);
            }
            else if (a == this.split1 ||
                     a == this.split2 ||
                     a == this.split3)
            {
                this.drawLine(ctx, '#00D000', dlx2, dly2, drx2, dry2);
            }
            
            dlx2 = dlx;
            dly2 = dly;
            drx2 = drx;
            dry2 = dry;
        }
        
        ctx.restore();
    };
    
    LfsPath.prototype.drawLine = function(ctx, col, lx, ly, rx, ry)
    {
        ctx.strokeStyle = col;
        ctx.beginPath();
        ctx.moveTo(lx, ly);
        ctx.lineTo(rx, ry);
        ctx.stroke();
    };
    
    LfsPath.prototype.clear = function(cv)
    {
        var ctx = cv.getContext('2d');
        ctx.clearRect(0, 0, cv.width, cv.height);
    };
    
    return LfsPath;
})();

var LfsPathNode = (function()
{
    function LfsPathNode()
    {
        this.centreX        = 0;
        this.centreY        = 0;
        this.centreZ        = 0;
        this.dirX           = 0;
        this.dirY           = 0;
        this.dirZ           = 0;
        this.limitLeft      = 0;
        this.limitRight     = 0;
        this.driveLeft      = 0;
        this.driveRight     = 0;
    }
    
    return LfsPathNode;
})();