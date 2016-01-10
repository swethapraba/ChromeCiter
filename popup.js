// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
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

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, function(tabs) {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

/**
 * @param {string} searchTerm - Search term for Google Image search.
 * @param {function(string,number,number)} callback - Called when an image has
 *   been found. The callback gets the URL, width and height of the image.
 * @param {function(string)} errorCallback - Called when the image is not found.
 *   The callback gets a string that describes the failure reason.
 */
function citeUrl(searchTerm, callback, errorCallback) 
{
  var url = searchTerm[0];
  var title = searchTerm[1];
  callback(searchTerm);
}

function renderStatus(statusText) 
{ 
  var render = document.getElementById('title')
  render.style.visibility = 'visible'; 
  render.style.display = 'block';
  render.textContent = statusText;
}
//main
document.addEventListener('DOMContentLoaded', function() 
  {
    document.getElementById("autoCite").addEventListener("click", autoCiteMe);
    document.getElementById("insertCite").addEventListener("click", insertCiteMe); 
  }
);

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

  document.getElementById("saveCitation").addEventListener("click", display);
}

function display()
{
  var forms = document.getElementById("citeForm");
  forms.style.visibility = 'hidden';
  forms.style.display = 'none';

  var buttons = document.getElementById("newCitation");
  buttons.style.visibility = 'visible';
  buttons.style.display = 'block';

   getCurrentTabUrl(function(values) 
    {
        url = values[0]
        renderStatus('Citing ' + url);

        citeUrl(values, 
          function(citation) 
          {
            //renderStatus('Citing: ' + url);
            var result = document.getElementById('cite');
            result.style.visibility = 'visible'; 
            result.style.display = 'block';
            result.innerHTML = citation[0];
            renderStatus(citation[1]);
          }, 
          function(errorMessage) 
          {
            renderStatus('Cannot display image. ' + errorMessage);
          }
        );
      
    }
   );
}
