var Milody = function () {

    this.audioContext = null; // audio api 的创建对象
    this.arrayBuffer = null; // 分析器的返回值，用于动画
    this.source = null; // 用于歌曲操作
    this.analyser = null; // 频谱分析器
    this.startTime = 0; // 开始播放的时间（包括上一次暂停）
    this.startOffset = 0; // 暂停时的歌曲进度
    this.buffer = null; // 歌曲缓存
    this.animationState = null; // 标记动画状态
    this.ready = -1; // 标记歌曲是否正在播放
    this.timeNow = 0; // 当前进度
    this.musicList = null; // 歌单
    this.playList = null;// 播放列表
    this.i = 0; // 歌曲在文件夹中的位置
    this.musicName = null; //歌名
    this.singer = null; // 歌手
    this.duration = 0; // 长度
    this.theme = 0;

};
Milody.prototype = {
    init : function () {
        var that = this;
        var _url = 'assets/js/musicList.json';
        var xhr = new XMLHttpRequest();
        xhr.open('GET', _url, true);
        xhr.onload = function () {
            that.musicList = JSON.parse(xhr.response);
            that.playList = [];
            // that.url = that.musicList[0].url;
            // that.musicName = that.musicList[0].name;
            // that.singer = that.musicList[0].singer;
            // that.i = 0;
            that._fixAPI();
            // that._getMusic();
            // that.tryAnimate();
        };
        xhr.send();
    },

    tryAnimate : function () {
        if (this.analyser){
            this._lineAnimate(this.analyser);
            this._dotAnimate(this.analyser);
        } else {
            setTimeout(this.tryAnimate,10);
        }
    },

    addListed : function (i) {
        this.playList.push(this.musicList[i]);
    },

    upListed : function (i) {
        var temp = this.playList.splice(i,1);
        this.playList.unshift(temp[0]);
    },

    deleteListed : function (i) {
        if (i)
            this.playList.splice(i,1);
        else
            this.playList.splice(0,1);

    },

    changeMusic : function (i) {
        var that = this;
        if (this.ready == -1){
            this.ready = 0;
            this.startTime = 0;
            this.url = this.musicList[i].url;
            this.musicName = this.musicList[i].name;
            this.singer = this.musicList[i].singer;
            this.i = i;
            this._fixAPI();
            this._getMusic();
            this.tryAnimate();
        } else if(this.ready == 1){
            this.startTime = 0;
            this.source.stop();
            this.ready = 0;
            this.url = this.musicList[i].url;
            this.musicName = this.musicList[i].name;
            this.singer = this.musicList[i].singer;
            this.i = i;
            this._fixAPI();
            this._getMusic();
            this.tryAnimate();
        } else {
            setTimeout(function () {
                that.changeMusic(i);
            }, 1000)
        }

    },

    // 消除浏览器差异
    _fixAPI : function () {

        window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
        window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
        window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame;

        try {
            this.audioContext = new window.AudioContext();
            this.audioContext.addEventListener("ended",this._musicEnd);
        } catch (e) {
            console.log("Your browser does not support AudioContext!");
            console.log(e);
        }

    },

    _getMusic : function (url) {
        var _url;
        if (url) {
            _url = url;
        } else {
            _url = this.url;
        }
        var that = this;
        var request = new XMLHttpRequest();
        request.open('GET', _url, true);
        request.responseType = 'arraybuffer';
        request.onload = function() {
            that.arrayBuffer = request.response;
            that.audioContext.decodeAudioData(that.arrayBuffer, function(buffer) { //解码成功则调用此函数，参数buffer为解码后得到的结果

                that.buffer = buffer;
                that._start();

            }, function(e) {
                console.log("文件解码失败\n" + e);
            });
        };
        request.send();
    },

    _controlMusic : function (ctrl) {
        if (ctrl == 'pause') {
            this.source.stop();
            this.startOffset += this.audioContext.currentTime - this.startTime;

        } else if (ctrl == 'resume') {
            this._start();
        }
    },

    _start : function () { //播放&恢复播放

        this.source = this.audioContext.createBufferSource();
        this.analyser = this.audioContext.createAnalyser();
        this.source.connect(this.analyser);
        this.source.connect(this.audioContext.destination);
        this.source.buffer = this.buffer;
        this.source.loop = false;
        this.source.start(0, this.startOffset % this.buffer.duration);
        this._getDuration();
        this.ready = 1;
        this.startTime = this.startOffset;
        this.tryAnimate();

    },

    _getCurrentTime: function () { // 获取歌曲现在的播放进度
        return this.audioContext.currentTime;
    },

    _changeCurrentTime: function (targetTime) { // 更改进度
        this.source.stop();
        this.startOffset = targetTime;
        this.startOffset += this.audioContext.currentTime - this.startTime;
    },

    _getDuration: function () { // 获取歌曲长度
        this.duration = this.buffer.duration;
    },

    _lineAnimate : function (analyser) { // 线条动画
        var that = this;
        var SCREEN_WIDTH = window.innerWidth;
        var SCREEN_HEIGHT = window.innerHeight;

        var canvas = document.getElementById('canvas');

        canvas.setAttribute("width", SCREEN_WIDTH);
        canvas.setAttribute("height", SCREEN_HEIGHT);

        var ctx = canvas.getContext("2d");
        var centerX;
        var centerY;
        var POINT_NUM = 120;
        var DEG = POINT_NUM / 2;
        var radius;
        var x,y;
        var i;
        var deg = Math.PI;
        // var analyser = that.analyser;
        function animate(){
            SCREEN_WIDTH = window.innerWidth;
            SCREEN_HEIGHT = window.innerHeight;
            canvas.setAttribute("width", SCREEN_WIDTH);
            canvas.setAttribute("height", SCREEN_HEIGHT);
            centerX = SCREEN_WIDTH/2;
            centerY = SCREEN_HEIGHT/2;
            if (SCREEN_WIDTH > SCREEN_HEIGHT){
                radius = SCREEN_HEIGHT/4;
            } else {
                radius = SCREEN_WIDTH/4;
            }
            var Pa = [],
                Pb = [],
                temp1 = [],temp2 = [];
            var array = new Uint8Array(484);
            // var array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            var step = Math.round(array.length / POINT_NUM); //计算采样步长
            var value = 0;
            ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
            canvas.width = canvas.width;
            // ctx.translate(centerX, centerY);
            // ctx.rotate(deg);
            // ctx.translate(-centerX, -centerY);
            deg += Math.PI / 720 ;
            ctx.restore();
            for( i = 0; i < POINT_NUM; i++ ){
                (function (i) {
                    // value = array[i * step];
                    value = array[i * step] * array[i * step] * 0.01;
                    x = centerX + Math.sin(Math.PI / DEG * i + Math.PI/4) * ( radius + value/4 );
                    y = centerY - Math.cos(Math.PI / DEG * i + Math.PI/4) * ( radius + value/4 );
                    temp1 = [x,y];
                    x = centerX + Math.sin(Math.PI / DEG * i + Math.PI/4) * ( radius );
                    y = centerY - Math.cos(Math.PI / DEG * i + Math.PI/4) * ( radius );
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
            var gradient=ctx.createLinearGradient(0,0,canvas.width,canvas.width);
            if (that.theme == 1){
                console.log(1)
                gradient.addColorStop("0.3","#66CCFF");
                gradient.addColorStop("0.5","#CCFFCC");
                gradient.addColorStop("0.7","#CC66FF");
            } else {
                console.log(2)
                gradient.addColorStop("1","#fff1f0");
                ctx.shadowBlur=20;
                ctx.shadowColor="#cc99ff";
            }
            ctx.strokeStyle = gradient;
            ctx.stroke();
            ctx.closePath();

            ctx.setTransform(1, 0, 0, 1, 0, 0);

            that.animationState = requestAnimationFrame(animate);

        }
        that.animationState = requestAnimationFrame(animate);
        function drawLine(ctx, Pa, Pb) {
            ctx.moveTo(Pa[0], Pa[1]);
            ctx.lineTo(Pb[0], Pb[1]);
        }
    },

    _dotAnimate : function (analyser) { // 点动画
        var that = this;

        // if ( that.ready == 2 ) {
        var canvas = document.getElementById('dotCanvas'),
            ctx = canvas.getContext('2d'),
            visualizer = [],
            animationId = null;

        var SCREEN_WIDTH = window.innerWidth;
        var SCREEN_HEIGHT = window.innerHeight;

        // console.log(that.analyser);

        var random = function(m, n) {
            return Math.round(Math.random() * (n - m) + m);
        };

        function drawStar(cx,cy,spikes,outerRadius,innerRadius,borderColor,fillColor,deg){
            var rot=Math.PI/2*3;
            var x=cx;
            var y=cy;
            var step=Math.PI/spikes;
            var i;

            ctx.beginPath();
            ctx.moveTo(cx,cy-outerRadius);
            for(i=0;i<spikes;i++){
                x=cx+Math.cos(rot)*outerRadius;
                y=cy+Math.sin(rot)*outerRadius;
                ctx.lineTo(x,y);
                rot+=step;

                x=cx+Math.cos(rot)*innerRadius;
                y=cy+Math.sin(rot)*innerRadius;
                ctx.lineTo(x,y);
                rot+=step
            }
            ctx.lineTo(cx,cy-outerRadius);
            ctx.closePath();
            ctx.lineWidth=1;
            ctx.strokeStyle=borderColor;
            ctx.stroke();
            ctx.fillStyle=fillColor;
            ctx.fill();
            ctx.translate(cx,cy);
            ctx.rotate(deg*Math.PI/180);
        }

        canvas.setAttribute("width", SCREEN_WIDTH);
        canvas.setAttribute("height", SCREEN_HEIGHT);

        var cwidth = canvas.width,
            cheight = canvas.height;

        var num = cwidth > 500 ? 30 : 20;


        for (var i = 0; i < num; i++) {
            var x = random(0, cwidth),
                y = random(0, cheight),
                color = "rgba(" + random(102, 255) + "," + random(102, 255) + "," + random(102, 255) + ",0)";　　//随机化颜色
            visualizer.push({
                x: x,
                y: y,
                dy: Math.random() + 0.1,　　　//保证dy>0.1
                r : random(150,255),
                g : random(150,255),
                b : random(150,255),
                color: color,
                radius: 30
            });
        }


        var draw = function() {
            SCREEN_WIDTH = window.innerWidth;
            SCREEN_HEIGHT = window.innerHeight;

            canvas.setAttribute("width", SCREEN_WIDTH);
            canvas.setAttribute("height", SCREEN_HEIGHT);

            var cwidth = canvas.width,
                cheight = canvas.height;


            var array = new Uint8Array(128);
            analyser.getByteFrequencyData(array);

            ctx.clearRect(0, 0, cwidth, cheight);
            for (var n = 0; n < num; n++) {
                var s = visualizer[n];
                s.radius = Math.round(array[n] / 256 * (cwidth > cheight ? cwidth / 48 : cheight / 36));
                var gradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.radius);

                gradient.addColorStop(0, "rgba("+s.r+","+s.g+","+s.b+","+0.7+")");
                gradient.addColorStop(1, "rgba(255,255,255,0)");
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2, true);
                ctx.fill();
                s.y = s.y - 1 * s.dy;
                //到顶部后返回底部，随机化
                if ((s.y <= 0)&&(that.status != 0)) {
                    s.y = cheight;
                    s.x = random(0, cwidth);
                }
            }
            // for (var n = 0; n < num; n++) {
            //     ctx.save();
            //     var s = visualizer[n];
            //     s.radius = Math.round(array[n] / 256 * (cwidth > cheight ? cwidth / 48 : cheight / 36));
            //     s.innerRadius = s.radius/2;
            //     drawStar(s.x,s.y,5,s.radius,s.innerRadius,"#fff","rgba(0,0,0,0)","10");
            //     ctx.restore();
            // }
            animationId = requestAnimationFrame(draw);　　//动画
        };
        animationId = requestAnimationFrame(draw);　　//动画


        // } else {
        //     setTimeout(function () {
        //         that._dotAnimate();
        //     }, 10)
        // }
    },

    _musicEnd : function () { // 音乐结束，下一曲
        var i = this.i;
        var new_i = this.musicList[++i].i;
        this.changeMusic(new_i);
    }

};