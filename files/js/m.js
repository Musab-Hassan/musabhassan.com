
var m_routers = [],
m_window_path = window.location.pathname;

var m_isMobile = false;

if (m_window_path.substring(m_window_path.lastIndexOf("/")+1)) {
  m_window_path = m_window_path.substring(0, m_window_path.lastIndexOf("/")+1);
}

if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
|| /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
    m_isMobile = true;
}

var m = {
  transitions: {
    mntm_scroll: function(parent, elems, timing, ease) {

      /*
        # USAGE:

        m.transitions.mntm_scroll(FIXED ELEMENT, [
          {element: ELEMENT, offsetY: DIVISION}
        ], TIMING, CSS EASING)

      */

      if (!Array.isArray(elems)) {
        throw "Parameter passed is not an Array";
      }
      
      document.querySelector(parent).style.position = "fixed";

      var elem = document.querySelector(parent);
      var oldParent = elem.parentNode;
      var wrapper;

      if (elem.parentNode.id == "scroll-height") {
        wrapper = document.querySelector("#scroll-height")
      } else {
        wrapper = document.createElement("div")
        wrapper.setAttribute("id", "scroll-height");

        oldParent.replaceChild(wrapper, elem);
        wrapper.appendChild(elem);
      }

      wrapper.style.height = elem.offsetHeight + "px";

      window.addEventListener('resize', function() {
        wrapper.style.height = elem.offsetHeight + "px";
      }, false);

      var observer = new MutationObserver(function() {
        wrapper.style.height = elem.offsetHeight + "px";
      });

      observer.observe(elem, {attributes: false, childList: true, subtree: true});


      if (m_isMobile) {
        window.addEventListener("scroll", loop, false);

        function loop(e) {
          for (i=0; i<elems.length; i++) {
            if (typeof elems[i] === 'object' && elems[i] !== null) {
              if ((('element' in elems[i]) && ('offsetY' in elems[i]) && (Object.keys(elems[i]).length == 2))) {
                setTranslate(window.scrollY / elems[i].offsetY, elems[i].element);
              } else {
                throw "Objects contain missing or unknown keys in Array parameter";
              }
            } else {
              throw "Array children are not Objects";
            }
          }
        }

        function setTranslate(yPos, el) {
          var e = document.querySelector(el);
          if (e) {
            e.style.transform = "translateY("+yPos+"px)";
            e.style.webkitTransform = "translateY("+yPos+"px)";
            e.style.MozTransform = "translateY("+yPos+"px)";
            e.style.msTransform = "translateY("+yPos+"px)";
          } else {
            console.warn("Momentum Scrolling: Skipping element " + elems[i].element + ". Element doesn't exists.");
          }
        }

        return;
      }

      for (i=0; i<elems.length; i++) {
        if (typeof elems[i] === 'object' && elems[i] !== null) {
          if ((('element' in elems[i]) && ('offsetY' in elems[i]) && (Object.keys(elems[i]).length == 2))) {
            var e = document.querySelector(elems[i].element);
            var top = window.scrollY / elems[i].offsetY;
            if (e) {
              e.style.transition = "transform "+ timing + "ms " + ease;
              e.style.webkitTransition = "transform "+ timing + "ms " + ease;
              e.style.transform = "translateY("+top+"px)";
              e.style.webkitTransform = "translateY("+top+"px)";
              e.style.MozTransform = "translateY("+top+"px)";
              e.style.msTransform = "translateY("+top+"px)";
            } else {
              console.warn("Momentum Scrolling: Skipping element " + elems[i].element + ". Element doesn't exists.");
            }
          } else {
            throw "Objects contain missing or unknown keys in Array parameter";
          }
        } else {
          throw "Array items are not Objects";
        }
      }

      document.addEventListener("scroll", function() {
        for (i=0; i<elems.length; i++) {
          var e = document.querySelector(elems[i].element);
          if (e) {
            var top = window.scrollY / elems[i].offsetY;
            e.style.transform = "translateY("+top+"px)";
            e.style.webkitTransform = "translateY("+top+"px)";
            e.style.MozTransform = "translateY("+top+"px)";
            e.style.msTransform = "translateY("+top+"px)";
          }
        }
      }, false);
    }
  },


  navigation: function(container, pages) {
    /*

      # REQUIRES REWRITE RULE IN HTACCESS TO PROPERLY FUNCTION:

      RewriteEngine On
      RewriteRule ^(home|about|contact)$ index.php?p=$1 [NC,L]

      (index.php will then route the url through php using url paths defined below)



      # USAGE:

      m.navigation(ELEMENT WHERE PAGES WILL LOAD, [
        {
          id: IDENTIFIER,
          path: ARRAY WITH STRINGS OF PATHNAMES,
          src: FILE PATH TO PULL PAGE FROM,
          routers (Optional): ARRAY WITH ROUTING BUTTONS ETC.,
          default (Optional): IF PAGE IS HOMEPAGE
        },
      ]);

    */

    var path = window.location.pathname;

    if (!Array.isArray(pages)) {
      throw "Parameter passed is not an Array";
    }

    window.addEventListener('popstate', function(event) {
      render();
    });

    for (i=0; i<pages.length; i++) {
      if (typeof pages[i] === 'object' && pages[i] !== null) {
        if ((('id' in pages[i]) && ('src' in pages[i]))) {
          if (('routers' in pages[i])) {

            m_routers.push({id: pages[i].id, routers: pages[i].routers});

            if (!Array.isArray(pages[i].routers)) {
              throw "Key 'routers's value is not an Array";
            }

            for (a=0; a<pages[i].routers.length; a++) {
              var nodes = document.querySelectorAll(pages[i].routers[a]);
              for (j=0; j<nodes.length; j++) {

                nodes[j].dataset.route = pages[i].id;

                nodes[j].addEventListener("click", function() {
                  route(this.getAttribute('data-route'));
                });
              }
            }
          }
        } else {
          throw "Keys 'id' and 'src' are required";
        }
      } else {
        throw "Array items are not Objects";
      }
    }

    function route(id, routers) {
      for (i=0; i<pages.length; i++) {
        if (pages[i].id == id) {
          window.history.pushState({pathId: id}, null, m_window_path + pages[i].path[0]);
          render(routers);
          break;
        }
      }
    }

    function resetRouters(routers) {
      for (var i=0; i<routers.length; i++) {
        for (var a=0; a<routers[i].routers.length; a++) {
          var nodes = document.querySelectorAll(routers[i].routers);
          for (var j=0; j<nodes.length; j++) {
            var newEl = clearListeners(nodes[j]);
            newEl.dataset.route = routers[i].id;
            newEl.addEventListener("click", function() {
              route(this.getAttribute('data-route'));
            });
          }
        }
      }

      function clearListeners(el) {
        var newEl = el.cloneNode(false);
        while (el.hasChildNodes()) newEl.appendChild(el.firstChild);
        el.parentNode.replaceChild(newEl, el);
        return newEl;
      }
    }

    function render() {
      var path;
      for (var i=0; i<pages.length; i++) {
        var strippedPath = window.location.pathname.replace(m_window_path, '');
        for (var a=0; a<pages[i].path.length; a++) {
          if ((pages[i].path[a] == strippedPath.replace('/', '')) || (pages[i].default && a==0 && strippedPath == "")) {
            var makeRequest = function(id) {
              var request = new XMLHttpRequest();
              request.open('GET', m_window_path + "/" + pages[id].src, true);

              request.setRequestHeader('Cache-Control', 'no-cache');

              request.onload = function() {
                if (this.status >= 200 && this.status < 400) {
                  window.scrollTo(0, 0);
                  document.querySelector(container).innerHTML = this.response;
                  resetRouters(m_routers);

                  if ('success' in pages[id]) {
                    setTimeout(function() {
                      pages[id].success();
                    }, 200);
                  }
                } else {
                  throw "Server side error: " + this.response;
                }
              };

              request.onerror = function() {
                throw "Unable to connect to server";
              };

              request.send();
            }

            makeRequest(i);
          }
        }
      }
    }

    render();
  },

  http: {
    fileUpload: function(data) {

      if (('php' in data) && ('form' in data)) {

        var form = document.querySelector(data.form);

        function getExtension(fileName) {
          var parts = fileName.split('.');
          return parts[parts.length - 1];
        }

        var el = document.querySelector(data.form + ' input[type="file"]');
        var name = el.getAttribute('name');

        form.addEventListener('submit', function(e) {
          e.preventDefault()

          var files = document.querySelector('[type=file]').files
          var formData = new FormData()

          for (i=0; i<files.length; i++) {
            var file = files[i];
            var check;

            if ('typeCheck' in data) {
              if (('types' in data.typeCheck) && ('error' in data.typeCheck)) {
                for (a=0; a<data.typeCheck.types.length; a++) {
                  if (getExtension(file.name) == data.typeCheck.types[a]) {
                    check = true;
                    break;
                  } else {
                    check = false;
                  }
                }

                if (!check) {
                  data.typeCheck.error(getExtension(file.name));
                  return;
                }
              } else {
                throw "Keys 'types' and 'error' are required for key 'typeCheck'"
              }
            }

            formData.append(name, file);
          }

          if ('size' in data) {
              formData.append('size', data.size);
          }

          fetch(data.php, {
            method: 'POST',
            body: formData,
            cache: "no-store"
          }).then(function(response) {
            if (response.status == 200) {
              if ('success' in data) {
                response.text().then(function (text) {
                  data.success(text);
                });
              }
            } else {
              return Promise.reject(response);
            }
          }).then(function(response) {

            if ('error' in data) {
              data.error(response);
            } else {
              throw "(catch errors by using 'error' key): " + response.status + " " + response.statusText;
            }
          })
        });

      } else {
        throw "Keys 'php' and 'form' are required"
      }
    }
  }
};
