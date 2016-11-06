/**
 * Created by misicdemone on 2016/10/24.
 */

(function main() {
    var start = document.querySelector("#start"),
        pause = document.querySelector("#pause"),
        list = document.querySelector("#list"),
        next = document.querySelector("#next"),
        good = document.querySelector("#good"),
        search = document.querySelector("#search"),
        flower = document.querySelector("#flower"),
        lock = document.querySelector("#lock"),
        unlock = document.querySelector("#unlock"),
        dotCanvas = document.querySelector("#dotCanvas"),
        action = document.querySelector(".mi-action"),
        infoBox = document.querySelector(".mi-info-box"),
        btns_ctn = document.querySelector(".mi-btns-ctn"),
        cover = document.querySelector(".mi-cover"),
        logo = document.querySelector(".mi-logo"),
        list_ctn = document.querySelector(".mi-list"),
        list_close = document.querySelector("#mi-list-close"),
        blurArea = document.querySelector(".mi-blur");


    var milody = new Milody();
    milody.init("assets/music/徐梦圆&双笙 - 孤竹遗梦.mp3");
    // setTimeout(function () {
    //     _pause();
    // },2000);

    (function starting() {
        setTimeout(function () {
            logo.style.opacity = 1;
        },500);
        setTimeout(function () {
            cover.style.opacity = 0;
            logo.style.transform = "scale(0.5)";
            setTimeout(function () {
                cover.style.display = "none";
                logo.style.zIndex = "10";
            }, 500)
        },2000);
    })();

    var LOCK = false;

    function lockToggle() {
        if (LOCK){
            LOCK = false;
            unlock.style.display = "none";
            lock.style.display = "inline-block";
        } else {
            LOCK = true;
            lock.style.display = "none";
            unlock.style.display = "inline-block";
        }

    }

    function actionShow() {
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

    function listShow() {
        blurArea.style.filter = "blur(3px)";
        blurArea.style.transform = "scale(1.1)";
        list_ctn.style.transform = "translateY(0)";
    }

    function listHide() {
        blurArea.style.filter = "none";
        blurArea.style.transform = "scale(1)";
        list_ctn.style.transform = "translateY(100%)";
    }

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

    function _pause() {
        pause.style.display = "none";
        milody._controlMusic('pause');
        start.style.display = "inline-block";
        dotCanvas.style.opacity = "0";
    }
    function _resume() {
        start.style.display = "none";
        milody._controlMusic('resume');
        pause.style.display = "inline-block";
        dotCanvas.style.opacity = "1";
    }

    start.addEventListener("click",function () {
        _resume();
    });

    pause.addEventListener("click",function () {
        _pause();
    });




})();
