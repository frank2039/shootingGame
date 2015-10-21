/**
 * Created by win7 on 2014/10/14 0014.
 */

window.onload = function(){
    var oBtn = document.getElementById('gameBtn');

    oBtn.onclick = function(){
        this.style.display = 'none';

        Game.init('con');  //游戏开始!!!

    };

};

var Game = {//单例模式,定义一个大的json

    oEnemy : {   //敌人的数据
        e1 : { style : 'enemy1',blood : 1 , speed : 5 , score : 1 },
        e2 : { style : 'enemy2',blood : 2 , speed : 6 , score : 2 },
        e3 : { style : 'enemy3',blood : 3 , speed : 5 , score : 3 },
        e4 : { style : 'enemy4',blood : 9999 , speed : 0.55 , score : 3 }
    },

    gk : [   //关卡的数据, 第一关即数组的第一项
        {
            eMap : [ //第一关数据
                'e2','e2','e2','e2','e2','e2','e2','e2','e2','e2',
                'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
                'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
                'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
                'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
                'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1'

            ],
            colNum : 10,  //一行10个
            iSpeedX : 9,  //敌人往右移动的速度
            iSpeedY : 9, //敌人往下移动的速度
            times : 4000 //敌人飞下来的时间的不同

        },
        {
            eMap : [
                'e3','e3','e3','e3','e3','e3','e3','e3','e3','e3',
                'e2','e2','e2','e2','e2','e2','e2','e2','e2','e2',
                'e2','e2','e2','e2','e2','e2','e2','e2','e2','e2',
                'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
                'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
                'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1'
            ],
            colNum : 10,
            iSpeedX : 9,
            iSpeedY : 8,
            times : 3000
        },
        {
            eMap : [
                'e3','e3','e3','e3','e3','e3','e3','e3','e3','e3',
                'e3','e3','e3','e3','e3','e3','e3','e3','e3','e3',
                'e2','e2','e2','e2','e2','e2','e2','e2','e2','e2',
                'e2','e2','e2','e2','e2','e2','e2','e2','e2','e2',
                'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
                'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1'
            ],
            colNum : 10,
            iSpeedX : 7,
            iSpeedY : 7,
            times : 3500
        },
        {
            eMap : [
                "e4"
            ],
            colNum : 10,
            iSpeedX : 3,
            iSpeedY : 3,
            times : 5000
        }
    ],

    air : {   //发射器的数据
        style : 'air1',
        bulletStyle : 'bullet'
    },

    init : function(id){  //初始化
        this.oParent = document.getElementById(id);

        this.createScore(); //一上来就开始创建积分
        var n = 0;
        this.n = n;
        this.createEnemy(n); //一上来就创建敌人, 数组是从0开始的,所以参数是0

        this.createAir();

        var This = this;

        this.init.timer = setInterval(function(){
            This.createBullet();
        }, 120)

    },
    createScore : function(){  //积分的创建
        var oS = document.createElement('div');
        oS.id = 'score';
        oS.innerHTML = '积分:<span>0</span>';
        this.oParent.appendChild(oS);  //this.oParent是指最外面的大div

        this.oSNum = oS.getElementsByTagName('span')[0];

    },
    createEnemy : function(iNow){  //敌人的创建

        if(this.oUl){
            clearInterval(this.oUl.timer);  //在删除oUl之前,把它的定时器给清了

            this.oParent.removeChild(this.oUl); //当进入下一关的时候,如果oUl还存在的话 把它移除
        }

        document.title = '第'+(iNow+1)+'关';

        var gk = this.gk[iNow];  //取得数组中敌人的数据
        var arr = [];
        var oUl = document.createElement('ul');
        oUl.id = 'bee'; //oUl是整个敌人的container
        oUl.style.width = gk.colNum * 40 + 'px';  //把敌人的宽度写死 为40
        this.oParent.appendChild( oUl );
        oUl.style.left = (this.oParent.offsetWidth - oUl.offsetWidth)/2 + 'px'; //让oUl居中

        this.oUl = oUl; //上面的oUl是一个局部变量,只有让它变成对象的属性的时候,外面才可以调用

        for(var i = 0;i < gk.eMap.length;i++){ //创建单个敌人
            var oLi = document.createElement('li');
            oLi.className =  this.oEnemy[ gk.eMap[i] ].style;

            oLi.blood = this.oEnemy[ gk.eMap[i] ].blood; //创建自定义属性,得到血量
            oLi.speed = this.oEnemy[ gk.eMap[i] ].speed;
            oLi.score = this.oEnemy[ gk.eMap[i] ].score;

            oUl.appendChild(oLi);
        }

        this.aLi = oUl.getElementsByTagName('li');  //让li变成全局的,以便下面碰撞检测的时候用到


        for(var i = 0;i < this.aLi.length;i++){   //把每个敌人循环下,并保存它们的offsetLeft 和 offsetTop
            arr.push( [ this.aLi[i].offsetLeft , this.aLi[i].offsetTop ] );
        }

        for(var i = 0;i < this.aLi.length;i++){ //循环每个敌人 把它的float布局改成position,把上面的数组里的值分别赋给定位后的left和top
            this.aLi[i].style.position = 'absolute';
            this.aLi[i].style.left = arr[i][0] + 'px';
            this.aLi[i].style.top = arr[i][1] + 'px';
        }

        this.runEnemy(gk);  //在敌人全部创建好之后 就可以触发了

    },
    runEnemy : function(gk){   //移动敌人

        var This = this; //把this值赋给变量This,用于下面定时器改变this指向

        var L = 0;
        var R = this.oParent.offsetWidth - this.oUl.offsetWidth;  //父级的宽减去整个敌人的宽,就是它在x轴能移动的最大的距离

        this.oUl.timer = setInterval(function(){

            if(This.oUl.offsetLeft > R){
                gk.iSpeedX *= -1;
                This.oUl.style.top = This.oUl.offsetTop + gk.iSpeedY + 'px';
            }
            else if(This.oUl.offsetLeft < L){
                gk.iSpeedX *= -1;
                This.oUl.style.top = This.oUl.offsetTop + gk.iSpeedY + 'px';
            }

            This.oUl.style.left = This.oUl.offsetLeft + gk.iSpeedX + 'px';  //如果这个直接用this的话,会指向window

        },200);


        setInterval(function(){

            This.oneMove();

        },gk.times);  //开启定时器  调用单兵作战

    },

    oneMove : function(){  //单兵作战

        var nowLi = this.aLi[ Math.floor(Math.random()*this.aLi.length) ];  //随机出来单个敌人

        var This = this;

        nowLi.timer = setInterval(function(){ //开启定时器 让其来攻击

            var a = (This.oA.offsetLeft + This.oA.offsetWidth/2) - (nowLi.offsetLeft + nowLi.parentNode.offsetLeft + This.oA.offsetWidth/2 );

            var b = (This.oA.offsetTop + This.oA.offsetHeight/2) - (nowLi.offsetTop + nowLi.parentNode.offsetTop + This.oA.offsetHeight/2 );

            var c = Math.sqrt(a*a + b*b);

            var iSX = nowLi.speed * a/c;  //x轴 的速度
            var iSY = nowLi.speed * b/c;

            nowLi.style.left = nowLi.offsetLeft + iSX + 'px';  //让单个敌人的left值 变成 当前的offsetLeft + X轴的速度
            nowLi.style.top = nowLi.offsetTop + iSY + 'px';


            if( This.pz(This.oA,nowLi) ){  //发射器 与 单个飞下来的敌人 的碰撞检测
                //alert('非常遗憾~游戏结束咯~');
                window.location = "http://1.frankwong.sinaapp.com/shooting/index.html";
            }

        },30);

    },

    createAir : function(){  //发射器的创建

        var oA = document.createElement('div');
        oA.className = this.air.style;

        this.oA = oA;

        this.oParent.appendChild( oA );
        oA.style.left = (this.oParent.offsetWidth - oA.offsetWidth)/2 + 'px';
        oA.style.top = this.oParent.offsetHeight - oA.offsetHeight + 'px';

        this.bindAir();

    },
    bindAir : function(){  //操作发射器

        var timer = null;
        var iNum = 0;
        var This = this;

        document.onkeydown = function(ev){
            var ev = ev || window.event;

            if(!timer){  //用这个if判断就可以保证 在键盘按下的时候 这个定时器只保持一个
                timer = setInterval(show,30);  //当键盘按下的时候 就触发show方法 30毫秒执行一次
            }

            if(ev.keyCode == 37){  //左键
                iNum = 1;
            }
            else if(ev.keyCode == 39){  //右键
                iNum = 2;
            }else if(ev.keyCode == 38){
                iNum = 3;
            }else if(ev.keyCode == 40){
                iNum = 4;
            }
        };

        document.onkeyup = function(ev){  //当鼠标抬起的时候 清除定时器
            var ev = ev || window.event;
            clearInterval(timer);
            timer = null;  //清除定时器之后 timer不会等于空 所以要手动进行设置
            iNum = 0;
        };


        function show(){
            if(iNum == 1){
                This.oA.style.left = This.oA.offsetLeft - 10 + 'px';  //10就是速度

                if(This.oA.offsetLeft < 0){   //左边界判断
                    This.oA.style.left = 0;
                }
            }
            else if(iNum == 2){
                This.oA.style.left = This.oA.offsetLeft + 10 + 'px';

                var right =  This.oParent.clientWidth - This.oA.offsetWidth; //右边界判断
                if(This.oA.offsetLeft  > right ){
                    This.oA.style.left = right + "px";
                }
            }else if( iNum == 3){
                This.oA.style.top = This.oA.offsetTop - 10 + 'px';

                if(This.oA.offsetTop < 0){//顶部边界判断
                    This.oA.style.top = 0;
                }
            }else if( iNum == 4){
                This.oA.style.top = This.oA.offsetTop + 10 + 'px';

                var bottom = This.oParent.clientHeight - This.oA.offsetHeight; //底部边界判断
                if(This.oA.offsetTop > bottom){
                    This.oA.style.top = bottom + "px";
                }
            }
        }

    },
    createBullet : function(){   //子弹的创建

        var oB = document.createElement('div');
        oB.className = this.air.bulletStyle;
        this.oParent.appendChild( oB );
        oB.style.left = this.oA.offsetLeft + this.oA.offsetWidth/2 + 'px';  //发射器的offsetLeft + 发射器的宽度的一半 就是 子弹的left值
        oB.style.top = this.oA.offsetTop - 10 + 'px';// 发射器的offsetTop - 子弹的高度

        this.runBullet(oB);  //每次创建子弹的时候 都会以参数的形式传给这个方法

    },
    runBullet : function(oB){  //子弹的运动 这边接收到上面的参数

        var This = this;

        oB.timer = setInterval(function(){  //每个子弹都有个定时器 给oB加一个自定义的属性

            if(oB.offsetTop < -10){   //子弹 offsetTop 小于自身高度时 则说明 它已经到屏幕外面去了 就该清除定时器
                clearInterval(oB.timer);
                This.oParent.removeChild( oB );
            }
            else{
                oB.style.top = oB.offsetTop - 10 + 'px';  //30秒改变子弹的top值
            }

            for(var i=0;i<This.aLi.length;i++){ //循环每个敌人
                if( This.pz(oB,This.aLi[i]) ){ //把子弹 跟 循环的每个敌人 做碰撞检测的 如果return true 则碰上, 检测时要找准同一个父级定位

                    if( This.aLi[i].blood == 1 ){ //做血量判断

                        clearInterval(This.aLi[i].timer);//就是把飞下来的单体nowLi的定时器删掉
                        This.oSNum.innerHTML = parseInt(This.oSNum.innerHTML) + This.aLi[i].score;//每次子弹消失 都会加个积分

                        This.oUl.removeChild(This.aLi[i]);  //两者碰撞之后 把单个敌人删除

                    }
                    else{
                        This.aLi[i].blood--;
                        This.oSNum.innerHTML ++;
                    }

                    clearInterval(oB.timer);  //因为子弹删除之后 它的定时器还是在的 所以在删除子弹之前把定时器给删了
                    This.oParent.removeChild(oB);

                }
            }

            if( !This.aLi.length ){  //只要li的长度不存在时
                This.createEnemy(This.n + 1);  //进入下一关
                This.n++;
            }

        },30);

    },
    pz : function (obj1, obj2){  //碰撞检测

        var L1 = obj1.offsetLeft;
        var R1 = obj1.offsetLeft + obj1.offsetWidth;
        var T1 = obj1.offsetTop + 5;
        var B1 = obj1.offsetTop + obj1.offsetHeight;

        var L2 = obj2.offsetLeft + obj2.parentNode.offsetLeft + 8;
        var R2 = obj2.offsetLeft + obj2.offsetWidth + obj2.parentNode.offsetLeft + 8;
        var T2 = obj2.offsetTop + obj2.parentNode.offsetTop;
        var B2 = obj2.offsetTop + obj2.offsetHeight + obj2.parentNode.offsetTop + 5;

        if( R1<L2 || L1>R2 || B1<T2 || T1>B2 ){  //这四种情况都是碰不着的
            return false;
        }
        else{
            return true;
        }

    }

};
