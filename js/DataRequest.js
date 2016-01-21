function createXMLHttpRequest() {
	try { return new XMLHttpRequest();                   } catch(e) {}
	try { return new ActiveXObject("Msxml2.XMLHTTP");    } catch(e) {}
	try { return new ActiveXObject("Microsoft.XMLHTTP"); } catch(e) {}
	return null;
}

function DataRequest(_id, _url)
{
    this.id = _id;
    this.url = _url;

    this.xhr = createXMLHttpRequest();
    this.responseCallback = null;
    this.errorCallback = null;

    this.responseType = 'text';  // empty, "arraybuffer", "blob", "document", "json", and "text"
    this.responseTypeManual = false;
        
    this.headers = [];
    this.postVars = [];
    
    this.postBlob = null;   // to upload raw data / files
    this.blobBoundary = '';     // files must be upped in multipart form, so we need a binary.
    this.blobName = '';
    this.blobSize = 0;
    this.blobType = '';
}

DataRequest.statusTypes = [];
DataRequest.statusTypes[400] = 'Bad request';
DataRequest.statusTypes[404] = 'File not found';
DataRequest.statusTypes[413] = 'File too large';

DataRequest.prototype.request = function request()
{
    if (this.url === '')
    {
        throw new TypeError('Empty url property in DataRequest.request()');
    }
    
    var method = (this.postBlob !== null || this.postVars.length > 0) ? 'POST' : 'GET';
    
    this.xhr.open(method, this.url, true);
    this.xhr.onreadystatechange = HtmlRemote.bind(this.procResult, this);
    
    var a;
    for (a = 0; a < this.headers.length; a++)
    {
        this.xhr.setRequestHeader(this.headers[a][0], this.headers[a][1]);
    }

    if (this.postBlob !== null) {
        this.xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + this.blobBoundary);
    }
    else if (this.postVars.length > 0) {
        this.xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
    }
    else {
        if (this.responseType == 'text') {
            this.xhr.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
        } else {
            this.xhr.setRequestHeader('Content-Type', 'text/plain');
        }
    }
    
    if (this.responseType == 'json')
    {
        if (typeof this.xhr.responseType === 'string')
        {
            this.xhr.responseType = 'text';
        }
        this.responseTypeManual = true;
    }
    else
    {
        try
        {
            this.xhr.responseType = this.responseType;
            this.responseTypeManual = false;
        }
        catch(e)
        {
            this.responseTypeManual = true;
        }
    }
    
    if (this.postBlob !== null)
    {
        if (this.xhr.sendAsBinary != null) {
			this.xhr.sendAsBinary(this.postBlob); 
		}
		else {
			this.xhr.send(this.postBlob);
		}
        this.postBlob = null;
    }
    else if (this.postVars.length > 0)
    {
        var postData = '';
        for (a = 0; a < this.postVars.length; a++)
        {
            if (a > 0) { postData += '&'; }
            postData += this.postVars[a].key + '=' + encodeURIComponent(this.postVars[a].val);
        }
        this.postVars.length = 0;
        this.xhr.send(postData);
    }
    else
    {
        this.xhr.send(null);
    }
    
//    if (this.responseCallback !== null) {
//        document.body.style.cursor = 'progress';
//    }
};

DataRequest.prototype.procResult = function procResult(e)
{
    var httpStatus;
    if (this.xhr.readyState == 3)
    {
        // Progress
        try { httpStatus = this.xhr.status; }
        catch (e) { httpStatus = 0; }
    }
    else if (this.xhr.readyState == 4)
    {
//        document.body.style.cursor = '';

        // Done
        try { httpStatus = this.xhr.status; }
        catch (e) { httpStatus = 0; }
        if (httpStatus == 200)
        {
            var retData = null;
            if (this.xhr.mozResponseArrayBuffer)
            {
                retData = this.xhr.mozResponseArrayBuffer;
            }
            else if (this.xhr.responseArrayBuffer)
            {
                retData = this.xhr.responseArrayBuffer;
            }
            else if (this.xhr.response)
            {
                retData = this.xhr.response;
            }
            else if (typeof(this.xhr.responseText) !== 'undefined')
            {
                retData = this.xhr.responseText;
            }
            else
            {
                if (this.responseCallback) {
                    console.log(this);
                    throw new TypeError('Unknown responseType in DataRequest.procResult()');
                }
            }
            
            if (this.responseTypeManual)
            {
                switch (this.responseType)
                {
                    case 'json':
                        retData = JSON && JSON.parse(retData) || eval(retData);
                        break;
                }
            }
            
            //alert(httpStatus + "\n" + this.xhr.getAllResponseHeaders());
            //document.body.innerHTML += this.url;
            if (retData !== null && this.responseCallback !== null)
            {
                this.responseCallback(this.id, retData);
            }

        } else {
            // Some error ocurred
            if (this.errorCallback) {
                this.errorCallback(httpStatus);
            }
            //throw new Error('Http request error in DataRequest.procResult(). httpStatus : ' + httpStatus);
        }
        
        this.errorCallback = null;
        this.responseCallback = null;
        //this.xhr.onreadystatechange = null;
        this.xhr = null;
    }
};

DataRequest.prototype.abort = function abort()
{
    if (this.xhr !== null)
    {
        this.xhr.abort();
    }
};