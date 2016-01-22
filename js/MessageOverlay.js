"use strict";

var MessageOverlay = (function()
{
    var a, i, s, t, div;
    var MAX_NUM_MSGS = 15,
        MSG_TIMOUT = 4000;
    
    function MessageOverlay(container)
    {
        this.messages = [];
        
        this.container = container;
        this.div = document.createElement('div');
        this.div.className = 'messagesOvl';
        
        this.container.appendChild(this.div);
        this.timer = setInterval(HtmlRemote.bind(this.draw, this), 500);

        this.autoHide = true;
        this.addMessage('LFS Remote Spectator');
        
        this.keyPressFn = HtmlRemote.bind(this.onKeyPress, this);
        this.keyUpFn = HtmlRemote.bind(this.onKeyUp, this);
        
        HtmlRemote.addEvent(document, 'keypress', this.keyPressFn);
        HtmlRemote.addEvent(document, 'keyup', this.keyUpFn);
    }
    
    MessageOverlay.prototype.destroy = function()
    {
        clearInterval(this.timer);
        this.container.removeChild(this.div);
        this.container = null;
    };
    
    MessageOverlay.prototype.addMessage = function(msg, msgId)
    {
        if (!msg) { return; }
        if (msgId == undefined) { msgId = 0; }
        
        div = document.createElement('div');
        div.innerHTML = this.parse(msg);
        div.timestamp = new Date().getTime();
        div.drawn = false;
        div.msgId = msgId;
        this.messages.push(div);
        this.draw();
    };
    
    MessageOverlay.prototype.updateMessage = function(msg, msgId)
    {
        if (!msg || !msgId) { return; }
        
        for (a = 0; a < this.messages.length; a++)
        {
            if (this.messages[a].msgId == msgId)
            {
                this.messages[a].innerHTML = msg;
                break;
            }
        }
    };
    
    MessageOverlay.prototype.parse = function(msg)
    {
        msg = HtmlRemote.htmlspecialchars(msg);
        if (msg.match(/(https?:\/\/[^"'\s,]+)\.$/))
        {
            return msg.replace(/^(.*)(https?:\/\/[^"'\s,]+)\.$/g, '$1<a href="http://$2" target="_blank">$2</a>.');
        }
        if (msg.match(/(https?:\/\/[^"'\s,]+)/))
        {
            return msg.replace(/(https?:\/\/[^"'\s,]+)/g, '<a href="$1" target="_blank">$1</a>');
        }
        if (msg.match(/(www[^"'\s,]+)\.$/))
        {
            return msg.replace(/^(.*)(www[^"'\s,]+)\.$/g, '$1<a href="http://$2" target="_blank">$2</a>.');
        }
        if (msg.match(/(www[^"'\s,]+)/))
        {
            return msg.replace(/(www[^"'\s,]+)/g, '<a href="http://$1" target="_blank">$1</a>');
        }
        return msg;
    };
    
    MessageOverlay.prototype.draw = function()
    {
        i = -1;
        t = new Date().getTime();
        s = Math.max(0, this.messages.length - MAX_NUM_MSGS);
        for (a = s - 1; a >= 0; a--)
        {
            if (this.messages[a].drawn) {
                this.div.removeChild(this.messages[a]);
            }
            this.messages.splice(a, 1);
        }
        for (a = 0; a < this.messages.length; a++)
        {
            if (this.autoHide &&
                this.messages[a].timestamp < t - MSG_TIMOUT)
            {
                if (this.messages[a].drawn)
                {
                    this.div.removeChild(this.messages[a]);
                    this.messages[a].drawn = false;
                }
            }
            else if (!this.messages[a].drawn)
            {
                if (i > -1) {
                    if (this.messages[i].nextSibling) {
                        this.div.insertBefore(this.messages[a], this.messages[i].nextSibling);
                    } else {
                        this.div.appendChild(this.messages[a]);
                    }
                } else if (this.div.firstChild) {
                    this.div.insertBefore(this.messages[a], this.div.firstChild);
                } else {
                    this.div.appendChild(this.messages[a]);
                }
                this.messages[a].drawn = true;
            }
            if (this.messages[a].drawn) {
                i++;
            }
        }
    };
    
    MessageOverlay.prototype.onKeyPress = function(e)
    {
        // Check for mouse focus?
        
        switch (e.charCode)
        {
            case 104:
                this.autoHide = !this.autoHide;
                this.draw();
                break;
        }
    };
    
    MessageOverlay.prototype.onKeyUp = function(e)
    {
        this.ctrlShift = (e.ctrlKey && e.shiftKey);
    };
    
    return MessageOverlay;
})();