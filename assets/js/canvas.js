var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

(function drawBeats(analyser) {

    var canvas = document.getElementById('canvas');

    canvas.setAttribute("width", SCREEN_WIDTH);
    canvas.setAttribute("height", SCREEN_HEIGHT);

    var ctx = canvas.getContext("2d");
    var centerX = SCREEN_WIDTH/2;
    var centerY = SCREEN_HEIGHT/2;
    var POINT_NUM = 60;
    var radius;
    var x,y;
    var i;


    if (SCREEN_WIDTH > SCREEN_HEIGHT){
        radius = SCREEN_HEIGHT/3;
    } else {
        radius = SCREEN_WIDTH/3;
    }

    // ctx.beginPath();
    // ctx.arc(centerX,centerY,radius,0,2 * Math.PI,false);
    // ctx.stroke();

    function lineAnimate(){
        var Pa = [],
            Pb = [],
            temp1 = [],temp2 = [];
        var array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        var step = Math.round(array.length / POINT_NUM); //计算采样步长
        var value;

        for( i = 0; i < POINT_NUM; i++ ){
            (function (i) {
                value = array[i * step];
                x = centerX + Math.sin(Math.PI / 30 * i) * ( radius + value );
                y = centerY + Math.cos(Math.PI / 30 * i) * ( radius + value );
                temp1 = [x,y];
                x = centerX + Math.sin(Math.PI / 30 * i) * ( radius - value );
                y = centerY + Math.cos(Math.PI / 30 * i) * ( radius - value );
                temp2 = [x,y];
                Pa[i] = temp1;
                Pb[i] = temp1;
            })(i)
        }


        for( i = 0; i < POINT_NUM; i++ ){
            (function (i) {
                if ( i == POINT_NUM - 1 ){
                    drawLine(ctx, Pa[i], Pa[0]);
                } else {
                    drawLine(ctx, Pa[i], Pa[i+1]);
                }

                drawLine(ctx, Pa[i], Pb[i]);
            })(i)
        }


        ctx.strokeStyle = "#66ccff";
        ctx.stroke();
        ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        requestAnimationFrame(lineAnimate);
    }




    requestAnimationFrame(lineAnimate);

    function drawLine(ctx, Pa, Pb) {
        ctx.moveTo(Pa[0], Pa[1]);
        ctx.lineTo(Pb[0], Pb[1]);
    }






})();




// function _drawSpectrum(analyser) {
//     var canvas = document.getElementById('canvas'),
//         cwidth = SCREEN_WIDTH,
//         cheight = SCREEN_HEIGHT - 2,
//         meterWidth = 10, //频谱条宽度
//         gap = 2, //频谱条间距
//         capHeight = 2,
//         capStyle = '#fff',
//         meterNum = 800 / (10 + 2), //频谱条数量
//         capYPositionArray = []; //将上一画面各帽头的位置保存到这个数组
//     ctx = canvas.getContext('2d'),
//         gradient = ctx.createLinearGradient(0, 0, 0, 300);
//     canvas.setAttribute("width", SCREEN_WIDTH);
//     canvas.setAttribute("height", SCREEN_HEIGHT);
//
//     gradient.addColorStop(1, '#0f0');
//     gradient.addColorStop(0.5, '#ff0');
//     gradient.addColorStop(0, '#f00');
//     var drawMeter = function() {
//         var array = new Uint8Array(analyser.frequencyBinCount);
//         analyser.getByteFrequencyData(array);
//         var step = Math.round(array.length / meterNum); //计算采样步长
//         ctx.clearRect(0, 0, cwidth, cheight);
//         for (var i = 0; i < meterNum; i++) {
//             var value = array[i * step]; //获取当前能量值
//             if (capYPositionArray.length < Math.round(meterNum)) {
//                 capYPositionArray.push(value); //初始化保存帽头位置的数组，将第一个画面的数据压入其中
//             }
//             ctx.fillStyle = capStyle;
//             //开始绘制帽头
//             if (value < capYPositionArray[i]) { //如果当前值小于之前值
//                 ctx.fillRect(i * 12, cheight - (--capYPositionArray[i]), meterWidth, capHeight); //则使用前一次保存的值来绘制帽头
//             } else {
//                 ctx.fillRect(i * 12, cheight - value, meterWidth, capHeight); //否则使用当前值直接绘制
//                 capYPositionArray[i] = value;
//             }
//             //开始绘制频谱条
//             ctx.fillStyle = gradient;
//             ctx.fillRect(i * 12, cheight - value + capHeight, meterWidth, cheight);
//         }
//         requestAnimationFrame(drawMeter);
//     };
//     requestAnimationFrame(drawMeter);
// }