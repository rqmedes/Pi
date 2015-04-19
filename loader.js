var Pi = {
  loaded : {}
};

function get(url) {
  return new Promise(function(resolve, reject) {
    // Do the usual XHR stuff
    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.onload = function() {
      // This is called even on 404 etc
      // so check the status
      if (req.status == 200) {
        // Resolve the promise with the response text
        resolve(req.response);
      } else {
        // Otherwise reject with the status text
        // which will hopefully be a meaningful error
        reject(req.statusText);
      }
    };
    // Handle network errors
    req.onerror = function() {
      reject("Network Error");
    };

    // Make the request
    req.send();
  });
}
// pass and array of items,
// [{url:'/resources/style.css', type:'css', ver:1},{url:'/resources/script.js', type:'js', ver: 1}]
// e.g loadResources([{url:'/resources/script.js', type:'js', ver: 1}]).then( ......
// http://stackoverflow.com/questions/960866/how-can-i-convert-the-arguments-object-to-an-array-in-javascript
function loadResources(items) {
     return items.map(getResource).reduce(function(chain, sPromise) {
        return chain.then(function() {
          return sPromise;
        }).then(function(result) {
            injectResource(result);
        });
      }, Promise.resolve());
}
function injectResource(res){
    if(res.loaded) return;

    var s;
    if(res.type == 'css') {
        s = document.createElement('style');
        s.type = 'text/css';
    } else {
        s = document.createElement('script');
        s.type = "text/javascript";
    }
    s.appendChild(document.createTextNode(res.content));
    document.getElementsByTagName("head")[0].appendChild(s);

    Pi.loaded[res.url] = res.ver;
}

function getResource(item) {
  return new Promise(function(resolve, reject) {
    if(Pi.loaded[item.url] == item.ver ) {
         item.loaded = true;
         resolve(item);
     } else {
         var c = localStorage.getItem(item.url + "_ver");
         if (c && c == item.ver) {
             item.content = localStorage.getItem(item.url);
             resolve(item);
         } else {
              // remove any previous versions
              localStorage.removeItem(item.url);
              localStorage.removeItem(item.url + "_ver");
              return get(item.url +"?ver="+item.ver).then(function(result){
                   // add to local storage,
                   localStorage.setItem(item.url + "_ver",item.ver);
                   localStorage.setItem(item.url, result);
                   item.content = result;
                   resolve(item);
              }).catch(function(error){  reject(error);  });
         }
    }
  });
}
