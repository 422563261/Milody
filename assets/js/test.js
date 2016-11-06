var Milody = function () {

    var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight;

    var _that = this;
    var _player = document.querySelector("#mi-player");
    var _file = null,
        _fileName = null,               //要处理的文件的名，文件名
        _audioContext = null,           //进行音频处理的上下文，稍后会进行初始化
        _source = null,                 //保存音频
        _arrayBuffer = null;


    var startOffset = 0; // audio file offset
    var startTime = 0; // web audio absolute time
    var _buffer;
    var _analyser;



    // 文件获取
    function _getMusic(url) {
        _fileName = url;
        var request = new XMLHttpRequest(); //建立一个请求
        request.open('GET', url, true); //配置好请求类型，文件路径等
        request.responseType = 'arraybuffer'; //配置数据返回类型
        // 一旦获取完成，对音频进行进一步操作，比如解码
        request.onload = function() {
            _arrayBuffer = request.response;
            _audioContext.decodeAudioData(_arrayBuffer, function(buffer) { //解码成功则调用此函数，参数buffer为解码后得到的结果
                _buffer = buffer;
                _start();
            }, function(e) { //这个是解码失败会调用的函数
                console.log("!哎玛，文件解码失败:(");
            });
        };
        request.send();

    }


    // 准备API
    function _prepareAPI() {

        // 消除浏览器差异
        window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
        window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;

        try {
            _audioContext = new window.AudioContext();
        } catch (e) {
            console.log("Your browser does not support AudioContext!");
            console.log(e);
        }

    }



    // 播放
    function _start() {
        console.log(_buffer);

        _source = _audioContext.createBufferSource();
        _analyser = _audioContext.createAnalyser();

        // 将source与分析器连接
        _source.connect(_analyser);

        // 将分析器与destination连接，这样才能形成到达扬声器的通路
        _source.connect(_audioContext.destination);

        // buffer数据赋值给source
        _source.buffer = _buffer;
        _source.loop = true;
        // 播放
        _source.start(0, startOffset % _buffer.duration);
        startTime = startOffset;

        // 绘制频谱
        _drawBeats(_analyser);

    }

    // 暂停
    function _pause() {
        _source.stop();
        // 已经播放了多长时间
        startOffset += _audioContext.currentTime - startTime;
        _drawBeats(_analyser);
    }

    // 继续
    function _resume() {
        // 和<audio>标签嵌入的音频文件不同，source node是不能重复播放的，所以继续功能其实就是play
        _start();
    }



    // 频谱！
    function _drawBeats(analyser) {

        var canvas = document.getElementById('canvas');

        canvas.setAttribute("width", SCREEN_WIDTH);
        canvas.setAttribute("height", SCREEN_HEIGHT);

        var ctx = canvas.getContext("2d");
        var centerX = SCREEN_WIDTH/2;
        var centerY = SCREEN_HEIGHT/2;
        var POINT_NUM = 60;
        var DEG = POINT_NUM / 2;
        var radius;
        var x,y;
        var i;
        var deg = Math.PI;


        if (SCREEN_WIDTH > SCREEN_HEIGHT){
            radius = SCREEN_HEIGHT/4;
        } else {
            radius = SCREEN_WIDTH/4;
        }


        function lineAnimate(){
            var Pa = [],
                Pb = [],
                temp1 = [],temp2 = [];
            var array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            var step = Math.round(array.length / POINT_NUM); //计算采样步长
            var value = 0;

            ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
            canvas.width = canvas.width;
            // ctx.translate(centerX, centerY);
            // ctx.rotate(deg);
            // ctx.translate(-centerX, -centerY);
            deg += Math.PI / 360 ;

            ctx.restore();
            for( i = 0; i < POINT_NUM; i++ ){
                (function (i) {
                    // value = array[i * step];
                    value = array[i * step] * array[i * step] * 0.01;
                    x = centerX + Math.sin(Math.PI / DEG * i + Math.PI/4) * ( radius + value/4 );
                    y = centerY - Math.cos(Math.PI / DEG * i + Math.PI/4) * ( radius + value/4 );
                    temp1 = [x,y];
                    x = centerX + Math.sin(Math.PI / DEG * i + Math.PI/4) * ( radius - value/4 );
                    y = centerY - Math.cos(Math.PI / DEG * i + Math.PI/4) * ( radius - value/4 );
                    temp2 = [x,y];
                    Pa[i] = temp1;
                    Pb[i] = temp2;
                })(i)
            }

            for( i = 0; i < POINT_NUM; i++ ){
                (function (i) {
                    if ( i == POINT_NUM - 1 ){
                        drawLine(ctx, Pa[i], Pa[0]);
                        drawLine(ctx, Pb[i], Pb[0]);
                    } else {
                        drawLine(ctx, Pa[i], Pa[i+1]);
                        drawLine(ctx, Pb[i], Pb[i+1]);
                    }

                    drawLine(ctx, Pa[i], Pb[i]);
                })(i)
            }

            ctx.strokeStyle = "#ffffff";
            ctx.stroke();
            ctx.closePath();

            ctx.setTransform(1, 0, 0, 1, 0, 0);

            requestAnimationFrame(lineAnimate);

        }

        requestAnimationFrame(lineAnimate);

        function drawLine(ctx, Pa, Pb) {
            ctx.moveTo(Pa[0], Pa[1]);
            ctx.lineTo(Pb[0], Pb[1]);
        }


    }


    return {
        player : _player,
        fileName : _fileName,
        source : _source,
        init : function () {
            _prepareAPI();
            _getMusic("assets/music/徐梦圆&双笙 - 孤竹遗梦.mp3");
        },
        pause : function () {
            _pause();
        },
        resume : function () {
            _resume();
        }
    }

};


(function main() {
    var start = document.querySelector("#start"),
        pause = document.querySelector("#pause"),
        list = document.querySelector("#list"),
        next = document.querySelector("#next"),
        good = document.querySelector("#good"),
        search = document.querySelector("#search"),
        flower = document.querySelector("#flower"),
        lock = document.querySelector("#lock"),
        unlock = document.querySelector("#unlock");

    var action = document.querySelector(".mi-action"),
        btns = document.querySelector(".mi-btns"),
        btns_ctn = document.querySelector(".mi-btns-ctn");

    var milody = Milody();
    milody.init();
    // setTimeout(function () {
    //     milody.pause();
    // },2000);

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
        btns.style.transform = "scale(1)";
        btns_ctn.style.transform = "scale(1)";
    }

    function actionHide() {
        if (!LOCK){
            action.style.opacity = "0";
            btns.style.transform = "scale(1.2)";
            btns_ctn.style.transform = "scale(0.8)";
        }
    }

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

    start.addEventListener("click",function () {
        start.style.display = "none";
        milody.resume();
        pause.style.display = "inline-block";
    });

    pause.addEventListener("click",function () {
        pause.style.display = "none";
        milody.pause();
        start.style.display = "inline-block";
    });


})();



