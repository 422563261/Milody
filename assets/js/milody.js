var Milody = function () {

    this.file = null;
    this.fileName = null;
    this.audioContext = null;
    this.source = null;
    this.arrayBuffer = null;
    this.source = null;
    this.analyser = null;
    this.startTime = 0;
    this.startOffset = 0;
    this.buffer = null;
    this.animationState = null;
    this.ready = 0;
    this.timeNow = 0;

};
Milody.prototype = {
    init : function (u) {
        this.url = u;
        this._fixAPI();
        this._getMusic();
        this.tryAnimate();

    },

    tryAnimate : function () {
        if (this.analyser){
            this._lineAnimate(this.analyser);
            this._dotAnimate(this.analyser);
        } else {
            setTimeout(this.tryAnimate,10);
        }
    },

    changeMusic : function (u) {
        this.url = u;
        this._fixAPI();
        this._getMusic();
    },

    // 消除浏览器差异
    _fixAPI : function () {

        window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
        window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
        window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame;

        try {
            this.audioContext = new window.AudioContext();
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
        this.fileName = _url;
        var request = new XMLHttpRequest();
        request.open('GET', _url, true);
        request.responseType = 'arraybuffer';

        request.onload = function() {
            that.arrayBuffer = request.response;
            that.audioContext.decodeAudioData(that.arrayBuffer, function(buffer) { //解码成功则调用此函数，参数buffer为解码后得到的结果

                that.buffer = buffer;
                that._start();

            }, function(e) {
                console.log("!哎玛，文件解码失败:(");
            });
        };
        request.send();
    },

    _controlMusic : function (ctrl) {
        console.log(ctrl == 'pause');
        if (ctrl == 'pause') {
            this.source.stop();
            this.startOffset += this.audioContext.currentTime - this.startTime;

        } else if (ctrl == 'resume') {
            this._start();

        }
    },

    _start : function () {

        this.source = this.audioContext.createBufferSource();
        this.analyser = this.audioContext.createAnalyser();
        this.source.connect(this.analyser);

        this.source.connect(this.audioContext.destination);

        this.source.buffer = this.buffer;
        this.source.loop = true;

        this.source.start(0, this.startOffset % this.buffer.duration);
        this.startTime = this.startOffset;

        this.tryAnimate();

    },

     _lineAnimate : function (analyser) {
            var that = this;
        // if ( that.ready === 2 ){

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

                ctx.strokeStyle = "#ffffff";
                ctx.stroke();
                ctx.closePath();

                ctx.setTransform(1, 0, 0, 1, 0, 0);

                that.animationState = requestAnimationFrame(animate);

            }

            that.animationState = requestAnimationFrame(animate);

        // } else {
        //     setTimeout(function () {
        //         that._lineAnimate();
        //     }, 10)
        // }


        function drawLine(ctx, Pa, Pb) {
            ctx.moveTo(Pa[0], Pa[1]);
            ctx.lineTo(Pb[0], Pb[1]);
        }
    },

    _dotAnimate : function (analyser) {
        var that = this;

        // if ( that.ready == 2 ) {
        var canvas = document.getElementById('dotCanvas'),
            ctx = canvas.getContext('2d'),
            visualizer = [],
            animationId = null;

        var SCREEN_WIDTH = window.innerWidth;
        var SCREEN_HEIGHT = window.innerHeight;

        console.log(that.analyser);

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
                gradient.addColorStop(0, "rgba(255,255,255,1)");
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

    _musicEnd : function () {

    },

    prepare : function () {

    }

};