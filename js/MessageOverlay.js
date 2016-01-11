"use strict";

var MessageOverlay = (function()
{
    var a, s, div;
    
    var MAX_NUM_MSGS = 15;
    
    function MessageOverlay(container)
    {
        this.messages = [];
        
        this.container = container;
        this.div = document.createElement('div');
        this.div.className = 'messagesOvl';
        
        this.addMessage('LFS Remote Spectator');
        
        this.container.appendChild(this.div);
    }
    
    MessageOverlay.prototype.destroy = function()
    {
        this.container.removeChild(this.div);
        this.container = null;
    };
    
    MessageOverlay.prototype.addMessage = function(msg, msgId)
    {
        if (!msg) { return; }
        if (msgId == undefined) { msgId = 0; }
        
        div = document.createElement('div');
        div.innerHTML = msg;
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
    
    MessageOverlay.prototype.draw = function()
    {
        s = Math.max(0, this.messages.length - MAX_NUM_MSGS);
        for (a = s - 1; a >= 0; a--)
        {
            if (this.messages[a].drawn) {
                this.div.removeChild(this.messages[a]);
            }
            this.messages.splice(a, 1);
        }
        for (a = s; a < this.messages.length; a++)
        {
            this.div.appendChild(this.messages[a]);
            this.messages[a].drawn = true;
        }
    };
    
    return MessageOverlay;
})();