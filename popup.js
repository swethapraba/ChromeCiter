
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var values = [];
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;
    values.push(url);
    values.push(tab.title);
    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');
    callback(values);
  });
}
function renderStatus(statusText) 
{ 
  var render = document.getElementById('title')
  render.style.visibility = 'visible'; 
  render.style.display = 'block';
  render.textContent = statusText;
}
function autoCiteMe()
{
  var buttons = document.getElementById("newCitation");
  buttons.style.visibility = 'hidden';
  buttons.style.display = 'none';

  var render = document.getElementById('title')
  render.style.visibility = 'hidden'; 
  render.style.display = 'none';

  var result = document.getElementById('cite');
  result.style.visibility = 'hidden'; 
  result.style.display = 'none';

  var forms = document.getElementById("citeForm");
  forms.style.visibility = 'visible';
  forms.style.display = 'block';

  document.getElementById("contributor").addEventListener("click", addContributor);
  document.getElementById("saveCitation").addEventListener("click", display);
  //alert("citing this page"); 
}
function insertCiteMe()
{
  var buttons = document.getElementById("newCitation");
  buttons.style.visibility = 'hidden';
  buttons.style.display = 'none';

  var render = document.getElementById('title')
  render.style.visibility = 'hidden'; 
  render.style.display = 'none';

  var result = document.getElementById('cite');
  result.style.visibility = 'hidden'; 
  result.style.display = 'none';

  var forms = document.getElementById("citeForm");
  forms.style.visibility = 'visible';
  forms.style.display = 'block';

  document.getElementById("contributor").addEventListener("click", addContributor);
  document.getElementById("saveCitation").addEventListener("click", display);
}
function addContributor()
{
  var newContributor = document.createElement('div');
  newContributor.innerHTML = "contributor/author name" + "<br><input type = 'text' class = 'transbox' name = 'firstInputs[]'placeholder = 'Name'> ";
  document.getElementById("dynamicInput").appendChild(newContributor);
}
function display()
{
  //chrome.storage.sync.clear(function(){ console.log("cleared")});
  var d = getData();
  var forms = document.getElementById("citeForm");
  forms.style.visibility = 'hidden';
  forms.style.display = 'none';
  var buttons = document.getElementById("newCitation");
  buttons.style.visibility = 'visible';
  buttons.style.display = 'block';
  getCurrentTabUrl(function(values){
    url = values[0];
    d[6] = url;
    store(d);
  }); 
}

function store(data)
{
  /*
    site 0
    name 1
    website title 2
    publisher 3
    published date 4
    current date 5
    url 6
  */
  console.log(data);
  var source = {};
  //format citation
  citation = data[1]+". " + "'"+ data[0]+"' "+ data[2] /*italicize*/+ " " + data[3] + " " + data[4] + " Web." + data[5] + " <" +data[6] + ">";  
  //data[0] + " " + " " + data[1] + " " + data[5];
  console.log(citation);
  var key = "" + data[0];
  source[key] = citation;//""+citation[1]; 
  console.log(source);
  
  //add citation to storage- key is URL
  chrome.storage.sync.set(source, function()
  {
    console.log("yay");
  });
  var obj = {};
  var map = new Map();
  var names = new Array();
  console.log("7")
  //Make iterable Map of stored data
  chrome.storage.sync.get(null, function(items)
  {
    obj= new Object(items);
    names = Object.getOwnPropertyNames(obj);
    function arrayToMap(element, index, array)
      {
        //make the map from the array of names
        map.set(element, obj[element]);
      }
      names.forEach(arrayToMap);
      //updating the display    
      map.forEach(function(value,key, map)
      {
        //var array = value;
        console.log("array")
        var newCitation = document.createElement('div');
        newCitation.innerHTML = value;//array[1] + "<br>" + array[0]; //temp citation until we get proper formatting
        console.log("1");
        newCitation.style.backgroundColor = "white";
        newCitation.style.marginBottom = "7px";
        newCitation.style.padding = "6px";
        newCitation.style.boxShadow= "0 2px 6px rgba(0,0,0,0.4)";
        newCitation.style.borderRadius = "3px";
        console.log("2")
        document.getElementById("answered[]").appendChild(newCitation);
      });
      console.log("done");
  });
}

function scrape(website)
{
  var site = document.getElementById('siteTitle');
  var fName = document.getElementById('firstInputs[]');
  var lName = document.getElementById('lastInputs[]');
  var wtitle = document.getElementById('wtitle');
  var publisher = document.getElementById('published');
  var pdate = document.getElementById('pdate');
  var cdate = document.getElementById('date');

  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();

  if(dd<10) {
    dd='0'+dd
  } 

  if(mm<10) {
    mm='0'+mm
  } 
  today = mm+'/'+dd+'/'+yyyy;
  cdate.value = today;
 
  getCurrentTabUrl(
    function(values)
    {
        var data = web(website)
        site.value = data[0];
        wtitle.value = data[1];
        fName.value = data[2];
    });
}
function web(url)
{
  var d = ['n/a', 'n/a', 'n/a']

  var sPattern = /<meta.property="og:title".content="([^"]*)">/
  var sMatch = url.match(sPattern);
  if(sMatch != null)
  {
    d[0] = sMatch[1];
  }
  else
  {
    sPattern = /<meta.content="([^"]*)".property="og:title">/
    sMatch = url.match(sPattern);
    if(sMatch != null)
    {
      d[0] = sMatch[1];
    }
    else
    {
      d[0] = ''
    }
  }



  var wPattern = /<meta.property="og:site_name".content="([^"]*)">/
  var wMatch = url.match(wPattern);
  if(wMatch != null)
  {
    d[1] = wMatch[1];
  }
   else
  {
    wPatttern = /<meta.name="cre".content="([^"]*)">/
    wMatch = url.match(wPatttern);
    if(wMatch != null)
    {
      d[1] = wMatch[1];
    }
    else
    {
      wPatttern = /<meta.content="([^"]*)".property="og:site_name">/
      wMatch = url.match(wPatttern);
      if(wMatch != null)
      {
        d[1] = wMatch[1];
      }
      else
      {
        d[1] = ''
      }
    }
  }



  var nPattern = /<meta.name="author".content="([^"]*)">/
  var nMatch = url.match(nPattern);
  if(nMatch == null)
  {
    nPattern = /<meta.property="author".content="([^"]*)">/
    nMatch = url.match(nPattern);
    if(nMatch == null)
    {
      nPattern = /<meta.content="([^"]*)".name="author">/
      nMatch = url.match(nPattern)
      if(nMatch == null)
      {
        d[2] = '';
      }
      else
      {
        d[2] = nMatch[1];
      }
    }
    else
    {
      d[2] = nMatch[1];
    }
  }
  else
  {
    d[2] = nMatch[1];
  }
  return d;
}
function getData()
{
  var site = document.getElementById('siteTitle');
  var fName = document.getElementById('firstInputs[]');
  var lName = document.getElementById('lastInputs[]');
  var wtitle = document.getElementById('wtitle');
  var publisher = document.getElementById('published');
  var pdate = document.getElementById('pdate');
  var cdate = document.getElementById('date');

  var data = [];
  data[0] = site.value;
  data[1] = fName.value;
  data[2] = wtitle.value;
  data[3] = publisher.value;
  data[4] = pdate.value;
  data[5] = cdate.value;

  return data;
}
function onWindowLoad() {

  var buttons = document.getElementById("newCitation");
  buttons.style.visibility = 'hidden';
  buttons.style.display = 'none';

  var render = document.getElementById('title')
  render.style.visibility = 'hidden'; 
  render.style.display = 'none';

  var result = document.getElementById('cite');
  result.style.visibility = 'hidden'; 
  result.style.display = 'none';

  var forms = document.getElementById("citeForm");
  forms.style.visibility = 'visible';
  forms.style.display = 'block';

  document.getElementById("contributor").addEventListener("click", addContributor);
  document.getElementById("saveCitation").addEventListener("click", display);

  var message = document.querySelector('#message');

  chrome.tabs.executeScript(null, {
    file: "getPagesSources.js"
  }, function() {
    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    if (chrome.runtime.lastError) {
      message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
    }
  });
}
function downloadFile()
{
  var obj = {};
  var map = new Map();
  var names = new Array();
  var values = new Array();
  chrome.storage.sync.get(null, function(items)
  {
    obj= new Object(items);
    names = Object.getOwnPropertyNames(obj);
    var file = "Works Cited\n";
    function arrayToMap(element, index, array)
      {
        //make the map from the array of names
        map.set(element, obj[element]);
        values.push(obj[element]);
      }
      names.forEach(arrayToMap);
      //take array of stuff and properly format for the blob

      var theFileElement = document.getElementById("file").innerHTML;
      console.log(theFileElement);
      function makeText(element, index, array)
      {
        theFileElement += element + "\n"; 
      }

      values.forEach(makeText);

      var textToWrite = theFileElement.value;
     // textToWrite = textToWrite.replace(/\n/g, "\r\n");
     console.log(textToWrite);
      //var blob = new Blob([textToWrite], {type: "text/plain;charset=utf-8"});
     // saveAs(blob, "myProject.txt");
  });
}
function openOptions()
{

}
//main
document.addEventListener('DOMContentLoaded', function() 
  {
    document.getElementById("autoCite").addEventListener("click", autoCiteMe);
    document.getElementById("insertCite").addEventListener("click", insertCiteMe); 
    document.getElementById("auto").addEventListener("click", onWindowLoad); 
    document.getElementById("export").addEventListener("click", downloadFile);
    document.getElementById("options").addEventListener("click", openOptions);
  }
);

chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
    message.innerText = request.source;
    scrape(message.innerText);
  }
});

/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 1.1.20151003
 *
 * By Eli Grey, http://eligrey.com
 * License: MIT
 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 */

/*global self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

var saveAs = saveAs || (function(view) {
  "use strict";
  // IE <10 is explicitly unsupported
  if (typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
    return;
  }
  var
      doc = view.document
      // only get URL when necessary in case Blob.js hasn't overridden it yet
    , get_URL = function() {
      return view.URL || view.webkitURL || view;
    }
    , save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
    , can_use_save_link = "download" in save_link
    , click = function(node) {
      var event = new MouseEvent("click");
      node.dispatchEvent(event);
    }
    , is_safari = /Version\/[\d\.]+.*Safari/.test(navigator.userAgent)
    , webkit_req_fs = view.webkitRequestFileSystem
    , req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem
    , throw_outside = function(ex) {
      (view.setImmediate || view.setTimeout)(function() {
        throw ex;
      }, 0);
    }
    , force_saveable_type = "application/octet-stream"
    , fs_min_size = 0
    // See https://code.google.com/p/chromium/issues/detail?id=375297#c7 and
    // https://github.com/eligrey/FileSaver.js/commit/485930a#commitcomment-8768047
    // for the reasoning behind the timeout and revocation flow
    , arbitrary_revoke_timeout = 500 // in ms
    , revoke = function(file) {
      var revoker = function() {
        if (typeof file === "string") { // file is an object URL
          get_URL().revokeObjectURL(file);
        } else { // file is a File
          file.remove();
        }
      };
      if (view.chrome) {
        revoker();
      } else {
        setTimeout(revoker, arbitrary_revoke_timeout);
      }
    }
    , dispatch = function(filesaver, event_types, event) {
      event_types = [].concat(event_types);
      var i = event_types.length;
      while (i--) {
        var listener = filesaver["on" + event_types[i]];
        if (typeof listener === "function") {
          try {
            listener.call(filesaver, event || filesaver);
          } catch (ex) {
            throw_outside(ex);
          }
        }
      }
    }
    , auto_bom = function(blob) {
      // prepend BOM for UTF-8 XML and text/* types (including HTML)
      if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
        return new Blob(["\ufeff", blob], {type: blob.type});
      }
      return blob;
    }
    , FileSaver = function(blob, name, no_auto_bom) {
      if (!no_auto_bom) {
        blob = auto_bom(blob);
      }
      // First try a.download, then web filesystem, then object URLs
      var
          filesaver = this
        , type = blob.type
        , blob_changed = false
        , object_url
        , target_view
        , dispatch_all = function() {
          dispatch(filesaver, "writestart progress write writeend".split(" "));
        }
        // on any filesys errors revert to saving with object URLs
        , fs_error = function() {
          if (target_view && is_safari && typeof FileReader !== "undefined") {
            // Safari doesn't allow downloading of blob urls
            var reader = new FileReader();
            reader.onloadend = function() {
              var base64Data = reader.result;
              target_view.location.href = "data:attachment/file" + base64Data.slice(base64Data.search(/[,;]/));
              filesaver.readyState = filesaver.DONE;
              dispatch_all();
            };
            reader.readAsDataURL(blob);
            filesaver.readyState = filesaver.INIT;
            return;
          }
          // don't create more object URLs than needed
          if (blob_changed || !object_url) {
            object_url = get_URL().createObjectURL(blob);
          }
          if (target_view) {
            target_view.location.href = object_url;
          } else {
            var new_tab = view.open(object_url, "_blank");
            if (new_tab == undefined && is_safari) {
              //Apple do not allow window.open, see http://bit.ly/1kZffRI
              view.location.href = object_url
            }
          }
          filesaver.readyState = filesaver.DONE;
          dispatch_all();
          revoke(object_url);
        }
        , abortable = function(func) {
          return function() {
            if (filesaver.readyState !== filesaver.DONE) {
              return func.apply(this, arguments);
            }
          };
        }
        , create_if_not_found = {create: true, exclusive: false}
        , slice
      ;
      filesaver.readyState = filesaver.INIT;
      if (!name) {
        name = "download";
      }
      if (can_use_save_link) {
        object_url = get_URL().createObjectURL(blob);
        setTimeout(function() {
          save_link.href = object_url;
          save_link.download = name;
          click(save_link);
          dispatch_all();
          revoke(object_url);
          filesaver.readyState = filesaver.DONE;
        });
        return;
      }
      // Object and web filesystem URLs have a problem saving in Google Chrome when
      // viewed in a tab, so I force save with application/octet-stream
      // http://code.google.com/p/chromium/issues/detail?id=91158
      // Update: Google errantly closed 91158, I submitted it again:
      // https://code.google.com/p/chromium/issues/detail?id=389642
      if (view.chrome && type && type !== force_saveable_type) {
        slice = blob.slice || blob.webkitSlice;
        blob = slice.call(blob, 0, blob.size, force_saveable_type);
        blob_changed = true;
      }
      // Since I can't be sure that the guessed media type will trigger a download
      // in WebKit, I append .download to the filename.
      // https://bugs.webkit.org/show_bug.cgi?id=65440
      if (webkit_req_fs && name !== "download") {
        name += ".download";
      }
      if (type === force_saveable_type || webkit_req_fs) {
        target_view = view;
      }
      if (!req_fs) {
        fs_error();
        return;
      }
      fs_min_size += blob.size;
      req_fs(view.TEMPORARY, fs_min_size, abortable(function(fs) {
        fs.root.getDirectory("saved", create_if_not_found, abortable(function(dir) {
          var save = function() {
            dir.getFile(name, create_if_not_found, abortable(function(file) {
              file.createWriter(abortable(function(writer) {
                writer.onwriteend = function(event) {
                  target_view.location.href = file.toURL();
                  filesaver.readyState = filesaver.DONE;
                  dispatch(filesaver, "writeend", event);
                  revoke(file);
                };
                writer.onerror = function() {
                  var error = writer.error;
                  if (error.code !== error.ABORT_ERR) {
                    fs_error();
                  }
                };
                "writestart progress write abort".split(" ").forEach(function(event) {
                  writer["on" + event] = filesaver["on" + event];
                });
                writer.write(blob);
                filesaver.abort = function() {
                  writer.abort();
                  filesaver.readyState = filesaver.DONE;
                };
                filesaver.readyState = filesaver.WRITING;
              }), fs_error);
            }), fs_error);
          };
          dir.getFile(name, {create: false}, abortable(function(file) {
            // delete file if it already exists
            file.remove();
            save();
          }), abortable(function(ex) {
            if (ex.code === ex.NOT_FOUND_ERR) {
              save();
            } else {
              fs_error();
            }
          }));
        }), fs_error);
      }), fs_error);
    }
    , FS_proto = FileSaver.prototype
    , saveAs = function(blob, name, no_auto_bom) {
      return new FileSaver(blob, name, no_auto_bom);
    }
  ;
  // IE 10+ (native saveAs)
  if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
    return function(blob, name, no_auto_bom) {
      if (!no_auto_bom) {
        blob = auto_bom(blob);
      }
      return navigator.msSaveOrOpenBlob(blob, name || "download");
    };
  }

  FS_proto.abort = function() {
    var filesaver = this;
    filesaver.readyState = filesaver.DONE;
    dispatch(filesaver, "abort");
  };
  FS_proto.readyState = FS_proto.INIT = 0;
  FS_proto.WRITING = 1;
  FS_proto.DONE = 2;

  FS_proto.error =
  FS_proto.onwritestart =
  FS_proto.onprogress =
  FS_proto.onwrite =
  FS_proto.onabort =
  FS_proto.onerror =
  FS_proto.onwriteend =
    null;

  return saveAs;
}(
     typeof self !== "undefined" && self
  || typeof window !== "undefined" && window
  || this.content
));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window

if (typeof module !== "undefined" && module.exports) {
  module.exports.saveAs = saveAs;
} else if ((typeof define !== "undefined" && define !== null) && (define.amd != null)) {
  define([], function() {
    return saveAs;
  });
}
