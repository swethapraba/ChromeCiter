/***
// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// Most methods of the Chrome extension APIs are asynchronous. This means that
// you CANNOT do something like this:
//
// var url;
// chrome.tabs.query(queryInfo, function(tabs) {
//   url = tabs[0].url;
// });
// alert(url); // Shows "undefined", because chrome.tabs.query is async.
*****/

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
 var data = [];
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
/**
 * @param {string} searchTerm - Search term for Google Image search.
 * @param {function(string,number,number)} callback - Called when an image has
 *   been found. The callback gets the URL, width and height of the image.
 * @param {function(string)} errorCallback - Called when the image is not found.
 *   The callback gets a string that describes the failure reason.
 */
var count = 0;
function citeUrl(searchTerm, callback, errorCallback) 
{
  var url = searchTerm[0];
  var title = searchTerm[1];
  callback(searchTerm);
}

function renderStatus(statusText) 
{ 
  var render = document.getElementById('title[]')
  render.style.visibility = 'visible'; 
  render.style.display = 'block';
  render.textContent = statusText;
}

function autoCiteMe()
{
  var buttons = document.getElementById("newCitation");
  buttons.style.visibility = 'hidden';
  buttons.style.display = 'none';

  var render = document.getElementById('title[]')
  render.style.visibility = 'hidden'; 
  render.style.display = 'none';

  var result = document.getElementById('cite[]');
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

  var render = document.getElementById('title[]')
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
  newContributor.innerHTML = "contributor/author name" + "<br><input type = 'text' class = 'transbox' name = 'firstInputs[]' placeholder = 'First Name'> <input type = 'text' class = 'transbox' name = 'lastInputs[]' placeholder = 'Last Name'>";
  document.getElementById("dynamicInput").appendChild(newContributor);
}
function display()
{
  getData();
  var forms = document.getElementById("citeForm");
  forms.style.visibility = 'hidden';
  forms.style.display = 'none';
  var buttons = document.getElementById("newCitation");
  buttons.style.visibility = 'visible';
  buttons.style.display = 'block';
   getCurrentTabUrl(function(values) 
    {
        url = values[0]
        
        //all the stuff about storage using cite URL and the page title
        citeUrl(values, function(citation) 
        {
          //chrome.storage.sync.clear(function() {console.log("cleared")}); 
          //till we build the clear button!
          count++; 
          var source = {};
          /* key: URL (citation[0]) 1- page URL (ctiation[0]) 2- page title (citation[1]) */
          var key = "" + citation[0];
          source[key] = citation;//""+citation[1]; 
          console.log(key);
          //add citation to storage- key is URL
          chrome.storage.sync.set(source, function()
            {console.log("yay");});

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
             /*updating the display */
         
            map.forEach(function(value,key, map)
          {
            var array = value;
            console.log("array")
            var newCitation = document.createElement('div');
            newCitation.innerHTML = array[1] + "<br>" + array[0]; //temp citation until we get proper formatting
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
            /////////////all the stuff about storage using cite URL and the page title
          });
  
          }, function(errorMessage) 
        {
          renderStatus('Cannot display image. ' + errorMessage);
        });   
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
        data = web(website)
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
      d[0] = 'n/a'
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
        d[1] = 'n/a'
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
        d[2] = 'n/a';
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
//UPDATE DISPLAY TO REFLECT TITLE AND SCRAPE

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
function getData()
{
  var site = document.getElementById('siteTitle');
  var fName = document.getElementById('firstInputs[]');
  var lName = document.getElementById('lastInputs[]');
  var wtitle = document.getElementById('wtitle');
  var publisher = document.getElementById('published');
  var pdate = document.getElementById('pdate');
  var cdate = document.getElementById('date');

  var data = []
  data[0] = site.value;
  data[1] = fName.value;
  data[2] = wtitle.value;
  data[3] = publisher.value;
  data[4] = pdate.value;
  data[5] = cdate.value;

  return data;
}

//main
document.addEventListener('DOMContentLoaded', function() 
  {
    document.getElementById("autoCite").addEventListener("click", autoCiteMe);
    document.getElementById("insertCite").addEventListener("click", insertCiteMe); 
    document.getElementById("auto").addEventListener("click", onWindowLoad); 

  }
);
chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
    message.innerText = request.source;
    scrape(message.innerText);
  }
});

