/**
 * Created by misicdemone on 2016/10/24.
 */

function $$(e , context) {
    context = context || document;
    var rst = context.querySelectorAll(e);
    rst = Array.prototype.slice.call(rst);
    return rst[1] == undefined?rst[0]:rst;
}

(function main() {
    var start = $$("#start"),    // 获取文档中的各种元素
        pause = $$("#pause"),
        list = $$("#list"),
        next = $$("#next"),
        star = $$("#star"),
        lock = $$("#lock"),
        unlock = $$("#unlock"),
        dotCanvas = $$("#dotCanvas"),
        action = $$(".mi-action"),
        infoBox = $$(".mi-info-box"),
        btns_ctn = $$(".mi-btns-ctn"),
        cover = $$(".mi-cover"),
        logo = $$(".mi-logo"),
        bg = $$("#bg"),
        list_ctn = $$(".mi-list"),
        list_close = $$("#mi-list-close"),
        blurArea = $$(".mi-blur"),
        songs = $$(".mi-listing-songs"),
        listed = $$(".mi-listed-songs"),
        title = $$(".mi-music-title"),
        singer = $$(".mi-music-singer"),
        process = $$(".mi-process"),
        list_btn = $$("#musicList"),
        hot_btn = $$("#musicHot"),
        recommended_btn = $$("#musicRecommended"),
        back_btn = $$(".mi-listing-back"),
        option_box = $$(".mi-listing-ranking"),
        danmaku_shot = $$(".danmaku-shot"),
        danmaku_input = $$(".danmaku-input"),
        danmaku_ctn = $$('.content'),
        change = $$("#change");


    var milody = new Milody(); // 实例化一个Milody对象
    milody.init();

    var random = 0,
        theme = 0;
    // setTimeout(function () {
    //     _pause();
    // },2000);
    var processManage;

    String.prototype.trim=function(){
        return this.replace(/(^\s*)|(\s*$)/g, "");
    };
    function safeStr(str){
        return str.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    (function starting() { // logo 动画
        setTimeout(function () {
            logo.style.opacity = 1;
        },500);
        setTimeout(function () {
            cover.style.opacity = 0;
            logo.style.transform = "scale(0.5)";
            logo.style.filter = "invert(1)";
            setTimeout(function () {
                cover.style.display = "none";
                logo.style.zIndex = "10";
            }, 500)
        },2000);
    })();

    var LOCK = false;

    function themeToggle() {
        if (theme === 0){
            logo.style.filter = "invert(0)";
            change.style.filter = "invert(1)";
            start.style.filter = "invert(1)";
            pause.style.filter = "invert(1)";
            list.style.filter = "invert(1)";
            next.style.filter = "invert(1)";
            star.style.filter = "invert(1)";
            lock.style.filter = "invert(1)";
            unlock.style.filter = "invert(1)";
            back_btn.forEach(function (item) {
                item.style.filter = "invert(1)";
            });
            list_close.style.filter = "invert(1)";
            title.style.color = "#222";
            singer.style.color = "#222";
            infoBox.style.background = "rgba(255,255,255,.2)";
            infoBox.style.boxShadow = "0 0 3px 3px rgba(0,0,0,.1)";
            bg.className = 'mi-bg-2';
            theme = 1;
            milody.theme = 1;
        } else {
            logo.style.filter = "invert(1)";
            change.style.filter = "invert(0)";
            start.style.filter = "invert(0)";
            pause.style.filter = "invert(0)";
            list.style.filter = "invert(0)";
            next.style.filter = "invert(0)";
            star.style.filter = "invert(0)";
            lock.style.filter = "invert(0)";
            unlock.style.filter = "invert(0)";
            back_btn.forEach(function (item) {
                item.style.filter = "invert(0)";
            });
            list_close.style.filter = "invert(0)";
            title.style.color = "#fff";
            singer.style.color = "#fff";
            infoBox.style.background = "rgba(0,0,0,.2)";
            infoBox.style.boxShadow = "0 0 3px 3px rgba(255,255,255,.1)";
            bg.className = 'mi-bg-1';
            theme = 0;
            milody.theme = 0;
        }
    }

    function lockToggle(i) { // 锁定
        if (!LOCK || i===1){
            LOCK = true;
            lock.style.display = "none";
            unlock.style.display = "inline-block";
        } else {
            LOCK = false;
            unlock.style.display = "none";
            lock.style.display = "inline-block";
        }

    }

    function actionShow() { // 中间面板的显示
        action.style.opacity = "1";
        infoBox.style.transform = "scale(1)";
        btns_ctn.style.transform = "scale(1)";
    }

    function actionHide() {
        if (!LOCK){
            action.style.opacity = "0";
            infoBox.style.transform = "scale(1.2)";
            btns_ctn.style.transform = "scale(0.8)";
        }
    }

    function listShow() { // 列表显示
        blurArea.style.filter = "blur(3px)";
        blurArea.style.transform = "scale(1.1)";
        list_ctn.style.transform = "translateY(0)";
    }

    function listHide() {
        blurArea.style.filter = "none";
        blurArea.style.transform = "scale(1)";
        list_ctn.style.transform = "translateY(100%)";
    }


    function _pause() {
        pause.style.display = "none";
        start.style.display = "inline-block";
        dotCanvas.style.opacity = "0";
        milody._controlMusic('pause');
        clearTimeout(processManage);
    }
    function _resume() {
        start.style.display = "none";
        pause.style.display = "inline-block";
        dotCanvas.style.opacity = "1";
        milody._controlMusic('resume');
        processDrew();
    }

    change.addEventListener("click",function () {
        themeToggle();
    });

    list.addEventListener("click",function () {
        listShow();
    });

    list_close.addEventListener("click",function () {
        listHide();
    });

    lock.addEventListener("click",function () {
        lockToggle();
    });

    unlock.addEventListener("click",function () {
        lockToggle();
    });

    btns_ctn.addEventListener("mouseover",function () {
        actionShow();
    });

    btns_ctn.addEventListener("mouseout",function () {
        actionHide();
    });

    next.addEventListener("click", function () {
        nextMusic();
    });

    songs.addEventListener("click", function (e) {
        if(e.target && e.target.nodeName.toUpperCase == "LI") {
            milody.changeMusic(e.target.dataset.url)
        }
    });

    start.addEventListener("click",function () {
        if (milody.musicName){
            _resume();
        }
    });

    pause.addEventListener("click",function () {
        _pause();
    });

    list_btn.addEventListener("click",function () {
        option_box.style.marginTop = "-200vh";
    });

    hot_btn.addEventListener("click",function () {
        option_box.style.marginTop = "0";
    });

    recommended_btn.addEventListener("click",function () {
        option_box.style.marginTop = "0";
    });

    back_btn.forEach(function (e) {
        e.addEventListener("click",function () {
            option_box.style.marginTop = "-100vh";
        });
    });

    danmaku_input.addEventListener("focus",function () {
        lockToggle(1);
    });

    (function danmaku() {
        var exampleSocket = new WebSocket("ws://119.29.223.130:9501");
        var value = '';
        exampleSocket.onopen = function (event) {
            console.log("服务器连接！");
        };
        danmaku_shot.addEventListener("click",function () {
            value = safeStr(danmaku_input.value.trim());
            if (value != ''){
                exampleSocket.send(value);
                danmaku_input.value = '';
            }
        });
        exampleSocket.onmessage = function (event) {
            var data = event.data;
            var bullet = document.createElement("div");
            var top = ['0','30px','60px'];
            bullet.setAttribute("class", "bullet");
            var randomN = parseInt(Math.random()*3);
            bullet.setAttribute("style", "top:"+top[randomN]);
            bullet.innerHTML = data;
            danmaku_ctn.appendChild(bullet);
            setTimeout(function () {
                danmaku_ctn.removeChild(bullet);
            },12000);
        }

    })();

    (function hotListCreate() {
        var hot_songs = $$(".mi-hot-songs");
        var recommended_songs = $$(".mi-recommended-songs");
        var i = 0;
        var list = milody.musicList;
        if (list) {
            var template1 = ``;     //热度排行的模板字符串
            var template2 = ``;     //推荐歌曲的模板字符串

            list.forEach(function (item) {
                if (i < 8){
                    template1 += `<li class="mi-listing-songs-li" title="${item.name}" data-url="${item.url}" data-i="${item.i}"><h4 data-i="${item.i}">${item.name}</h4><p data-i="${item.i}">${item.singer}</p></li>`;
                    i++;
                } else if (i >= 8 && i < 12){
                    template2 += `<li class="mi-listing-songs-li" title="${item.name}" data-url="${item.url}" data-i="${item.i}"><h4 data-i="${item.i}">${item.name}</h4><p data-i="${item.i}">${item.singer}</p></li>`;
                    i++;
                }
            });
            hot_songs.innerHTML = template1;        //将热度排行的模板字符串插入到页面中
            hot_songs.addEventListener("click",function (e) { //为热度排行添加点击事件
                if(e.target && (e.target.nodeName == "LI" || e.target.nodeName == "H4" || e.target.nodeName == "P")) {
                    milody.addListed(e.target.dataset.i);
                    listedCreate();
                }
            });
            recommended_songs.innerHTML = template2;//将推荐歌曲的模板字符串插入到页面中
            recommended_songs.addEventListener("click",function (e) {//为推荐歌曲添加点击事件
                if(e.target && (e.target.nodeName == "LI" || e.target.nodeName == "H4" || e.target.nodeName == "P")) {
                    milody.addListed(e.target.dataset.i);
                    listedCreate();
                }
            })
        }else {
            setTimeout(hotListCreate,10);
        }
    })();

    (function listCreate() {
        var list = milody.musicList;
        var i = 0;
        if (list) {
            var template = ``;
            list.forEach(function (item) {
                template += `<li class="mi-listing-songs-li" title="${item.name}" data-url="${item.url}" data-i="${item.i}"><h4 data-i="${item.i}">${item.name}</h4><p data-i="${item.i}">${item.singer}</p></li>`;
            });
            songs.innerHTML = template;
            songs.addEventListener("click",function (e) {
                if(e.target && (e.target.nodeName == "LI" || e.target.nodeName == "H4" || e.target.nodeName == "P")) {
                    milody.addListed(e.target.dataset.i);
                    listedCreate();
                }
            })

        } else {
            setTimeout(listCreate,10);
        }

    })();



    function listedCreate() {
        var list = milody.playList;
        var i = 0;
        if (list) {
            var template = ``;
            list.forEach(function (item) {
                template += `<li class="mi-listed-songs-li" title="${item.name}" data-url="${item.url}" data-i="${i}" data-id="${item.i}"><span data-action="up" data-i="${i}" class="listed-up">顶</span><span data-action="delete" data-i="${i}" class="listed-delete">删</span><h4 data-i="${i}" data-id="${item.i}">${item.name}</h4><p data-i="${i}" data-id="${item.i}">${item.singer}</p></li>`;
                i++;
            });
            listed.innerHTML = template;

        }
    }

    listed.addEventListener("click",function (e) {
        if(e.target && (e.target.nodeName == "LI" || e.target.nodeName == "H4" || e.target.nodeName == "P")) {
            milody.changeMusic(e.target.dataset.id);
            milody.deleteListed(e.target.dataset.i);
            title.innerHTML = milody.musicName;
            singer.innerHTML = milody.singer;
            start.style.display = "none";
            pause.style.display = "inline-block";
            dotCanvas.style.opacity = "1";
            sendInfo(milody.musicName,milody.singer);
            processDrew();
            listedCreate();
        } else if (e.target && e.target.dataset.action == 'up') {
            milody.upListed(e.target.dataset.i);
            listedCreate();
        } else if (e.target && e.target.dataset.action == 'delete') {
            milody.deleteListed(e.target.dataset.i);
            listedCreate();
        }
    });

    (function search(){
        var search_val = $$(".mi-listing-search");
        var _val = '';
        search_val.addEventListener("change",function(){
            var songs_name = $$(".mi-listing-songs-li");
            _val = search_val.value;
            for(var i = 0; i < songs_name.length; i++){
                (function(i){
                    if(songs_name[i].innerHTML.indexOf(_val) == -1){
                        songs_name[i].style.display = "none";
                    } else {
                        songs_name[i].style.display = "inline-block";
                    }
                })(i);
            }
        })
    })();



    function processDrew() {
        if (milody && milody.buffer){
            var currentTime = 0;
            var totleTime = milody.duration;
            (function updateProcess() {
                processManage = setTimeout(function () {
                    currentTime = milody._getCurrentTime();
                    if (currentTime/totleTime<1){
                        process.style.width = (currentTime/totleTime)*100 + '%';
                        updateProcess();
                    } else {
                        clearTimeout(processManage);
                        nextMusic();
                    }
                }, 1000)
            })();
        } else {
            setTimeout(processDrew,10);
        }
    }

    function nextMusic() {
        var playList = milody.playList;
        if (random){
            var len = playList.length;
            var num = parseInt(Math.random()*len);
            milody.changeMusic(num);
            title.innerHTML = milody.musicName;
            singer.innerHTML = milody.singer;
            sendInfo(milody.musicName,milody.singer);
            milody.deleteListed();
            listedCreate();
            clearTimeout(processManage);
            processDrew();
        } else {
            milody.changeMusic(playList[0].i);
            title.innerHTML = milody.musicName;
            singer.innerHTML = milody.singer;
            sendInfo(milody.musicName,milody.singer);
            milody.deleteListed();
            listedCreate();
            clearTimeout(processManage);
            processDrew();
        }
    }

    function sendInfo(name, singer) {
        var url = 'http://115.159.54.210/Milody/getnowsong.php';
        var data = new FormData();
        data.append('name',name);
        data.append('singer',singer);
        var xhr = new XMLHttpRequest();
        xhr.open('POST',url);
        xhr.send(data);
    }

    function getInfo() {
        var url = 'http://115.159.54.210/Milody/return_nowsong.php';
        var xhr = new XMLHttpRequest();
        xhr.open('GET',url);
        xhr.onload = function () {
            var data = JSON.parse(xhr.response).data;
            console.log(data);
            title.innerHTML = data[0].name;
            singer.innerHTML = data[0].singer;
        };
        xhr.send();
    }


    if (document.body.scrollWidth<500){
        setInterval(function () {
            getInfo()
        },1000)
    }

})();
