var canvas = document.getElementById('canvas');
var vas = canvas.getContext('2d');


var  centerX = 300;
var  centerY = 200;

var Radius = 60;
var leave;
if (parseInt(window.location.href.split('#')[1])) {
	leave = parseInt(window.location.href.split('#')[1]);
}else {
	leave = 0;
}
// console.log(leave);


var leaveArray = [
	{"levelNum":3,"waitNum":5,"speed":100},
	{"levelNum":4,"waitNum":7,"speed":80},
	{"levelNum":5,"waitNum":7,"speed":70},
	{"levelNum":4,"waitNum":8,"speed":60},
	{"levelNum":3,"waitNum":9,"speed":60},
	{"levelNum":4,"waitNum":7,"speed":70},
	{"levelNum":5,"waitNum":6,"speed":70},
	{"levelNum":4,"waitNum":8,"speed":50},
]

var centerRadius = 13;//等待球的半径

var ball = [];
var smallBall = leaveArray[leave].levelNum;
console.log(smallBall);
var smallBallHeight = 150;
for(var i=0;i<smallBall;i++){
	var angle = (360/smallBall)*(i+1);
	ball.push({"angle":angle,"numStr":""});

}
console.log(angle);
console.log(ball);


//绘制大圆
function bigBall(){
	vas.save();
	vas.beginPath();
	vas.arc(centerX,centerY,Radius,0,Math.PI*2,true);
	vas.fillStyle='black';
	vas.fill();
	vas.closePath();
	vas.restore();

	if (leave == leaveArray.length) {
		leave = leaveArray.length-1;
	}

	var Distance = (leave+1)+"";
	// vas.save();
	// vas.beginPath();
	vas.font = '60px 微软雅黑';
	vas.fillStyle = 'white';
	vas.textAlign = 'center';
	vas.textBaseline = 'middle';
	vas.fillStyle='#EED5B7';
	vas.strokeStyle = "#EED5B7";
	vas.fillText(Distance,centerX,centerY);
	vas.strokeText(Distance,centerX,centerY);
	vas.stroke();
	vas.closePath();
	vas.restore();
}
bigBall();

//设置等待球数组
var waitBall = [];//等待球
var waitOffset = 250;//设置等待球距离上方的距离
var waitBalllen = leaveArray[leave].waitNum;//设置等待数组长度
//设置等待数组添加数字文本
for(var i=waitBalllen;i>0;i--){
	waitBall.push({"angle":"","numStr":i});

}


//绘制转动球
function draw(deg){
	ball.forEach(function(e){
		vas.save();
	    vas.globalCompositeOperation = 'destination-over';//设置图形组合
	    e.angle = e.angle + deg;
	    if (e.angle>=360) {
	    	e.angle = 0;
	    }
	    //绘制大球小球之间的线段
	    vas.moveTo(centerX,centerY);
	    var rad = 2*Math.PI*e.angle/360;
	    var theX = centerX + smallBallHeight*Math.cos(rad);
	    var theY = centerY + smallBallHeight*Math.sin(rad);
	    vas.strokeStyle = 'black';
	    vas.lineTo(theX,theY);
	    vas.stroke();
	    vas.restore();
	    vas.beginPath();
	    vas.arc(theX,theY,centerRadius,0,Math.PI*2,true);
	    vas.closePath();
	    vas.fillStyle = 'black';
	    vas.fill();
	    if (e.numStr != "") {
	    	vas.textAlign = 'center';
	    	vas.textBaseline = 'middle';
	    	vas.font = '15px 微软雅黑';
	    	vas.strokeStyle = '#fff';
	    	vas.fillStyle = '#fff';
	    	vas.fillText(e.numStr,theX,theY);
	    	vas.strokeText(e.numStr,theX,theY);
	    }
    });
}
draw(10);

//绘制等待球
function drawWait(){
	vas.clearRect(0,400,700,350);
	var waitX = centerX;//等待圆的x轴
    var waitY = smallBallHeight + waitOffset;//等待圆的y轴
	waitBall.forEach(function(e){
		vas.moveTo(waitX,waitY);
		vas.beginPath();
		vas.arc(waitX,waitY,centerRadius,0,Math.PI*2,true);
		vas.closePath();
		vas.fillStyle = 'black';
		vas.fill();

		vas.textAlign = 'center';
		vas.textBaseline = 'middle';
		vas.font = '15px 微软雅黑';
		vas.strokeStyle = '#fff';
		vas.fillStyle = '#fff';
		vas.fillText(e.numStr,waitX,waitY);
		vas.strokeText(e.numStr,waitX,waitY);
		waitY += 3*centerRadius;
	});
}

drawWait();

setInterval(function(){
	vas.clearRect(0,0,700,750);
	bigBall();
	draw(10);
	drawWait();

},leaveArray[leave].speed);

var state;//用于成功或者失败
document.onclick  = function (){
	if (waitBall.length ==0) return;
	waitY = smallBallHeight +200;
	drawWait();

	var clearBall = waitBall.shift();//等待球顶部移除一个，并返回值
	clearBall.angle = 90;//设置移除的等待球的角度
	var faild = true;//成功或失败跳出循环
	//判断是否成功
	ball.forEach(function (e,index){
		if (!faild) return;
		if (Math.abs(e.angle - clearBall.angle) < (Math.PI*2/ball.length)) {
			state = 0;
			faild = false;
		}else if(index === ball.length-1 && waitBall.length === 0){
			faild = false;
			state = 1;
		}
	});
	ball.push(clearBall);
	waitY = smallBallHeight+waitOffset;
    drawWait();
    draw(0);
    if (state==0) {
    	alert('闯关失败');
    	window.location.href = 'index.html#' + leave;	
    }else if (state==1){
    	alert('闯关成功');
    	leave++;
    	window.location.href = 'index.html#' + leave;
    }
}
