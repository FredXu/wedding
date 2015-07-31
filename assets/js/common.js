//common js
(function($){
	var imgReady = (function () {
	    var list = [], 
	    	intervalId = null,
		    // 用来执行队列
		    tick = function () {
		        var i = 0;
		        for (; i < list.length; i++) {
		            list[i].end ? list.splice(i--, 1) : list[i]();
		        };
		        !list.length && stop();
		    },
		 
		    // 停止所有定时器队列
		    stop = function () {
		        clearInterval(intervalId);
		        intervalId = null;
		    };
	 
	    return function (url, ready, obj, load, error) {
	        var onready, width, height, newWidth, newHeight,
	            img = new Image(),
	            obj = obj || img;
	         
	        img.src = url;
	        // 如果图片被缓存，则直接返回缓存数据
	        if (img.complete) {
	            ready.call(obj);
	            load && load.call(obj);
	            return;
	        };

	        width = img.width;
	        height = img.height;
	         
	        // 加载错误后的事件
	        img.onerror = function () {
	            error && error.call(obj);
	            onready.end = true;
	            img = img.onload = img.onerror = null;
	        };
	         
	        // 图片尺寸就绪
	        onready = function () {
	            newWidth = img.width;
	            newHeight = img.height;
	            if (newWidth !== width || newHeight !== height ||
	                // 如果图片已经在其他地方加载可使用面积检测
	                newWidth * newHeight > 1024
	            ) {
	                ready.call(obj);
	                onready.end = true;
	            };
	        };
	        onready();
	         
	        // 完全加载完毕的事件
	        img.onload = function () {
	            // onload在定时器时间差范围内可能比onready快
	            // 这里进行检查并保证onready优先执行
	            !onready.end && onready();
	            load && load.call(obj);
	            // IE gif动画会循环执行onload，置空onload即可
	            img = img.onload = img.onerror = null;
	        };
	 
	        // 加入队列中定期执行
	        if (!onready.end) {
	            list.push(onready);
	            // 无论何时只允许出现一个定时器，减少浏览器性能损耗
	            if (intervalId === null) intervalId = setInterval(tick, 40);
	        };
	    };
	})();

	$.fn.extend({
		// 背景音乐
		audioInit: function(target){
			var _this = this[0];
			_this.play();

			$(target).on('click', function(){
				if($(this).hasClass('ico_music_on')){
					_this.play();
					$(this).removeClass('ico_music_on');
				}else{
					_this.pause();
					$(this).addClass('ico_music_on');
				}
			});
		},

		// 文字滚动
		marquee: function(){
			var delay = 2000;
			function reset(style){
				style.webkitTransitionDuration = '0s';
				style.webkitTransform = 'translateX(0px)';
			}
			function start(style, speed, sw){
				setTimeout(function(){
					reset(style);
					setTimeout(function(){
						start(style, speed, sw);
					}, delay);
				}, speed);

				style.webkitTransitionDuration = speed + 'ms';
				style.webkitTransform = 'translateX(-'+ sw +'px)';
			}

			return this.each(function(){
				var style = this.style,
					scroller = $(this).children(),
					offsetW = $(this).width(),
					sw = scroller.outerWidth(true),
					speed;

				if(sw > offsetW){
					speed = sw * 30 ;
					scroller.clone().appendTo($(this));

					setTimeout(function(){
						start(style, speed, sw);
					}, delay);
				}
			});
		},

		// 视频展示
		showVideo: function(){
			var video = $(this).find('video');
			if(video.length){
				video[0][$(this).is(':visible') ? 'play' : 'pause']();
			}else{
				$(this).html('<video autoplay="autoplay" autobuffer="false" controls="" preload="metadata" x-webkit-airplay="" style="width: 100%; min-height:200px;" src="'+ $(this).attr('url') +'"></video>');
			}
		},
		imgReady: function(callback){
			return this.each(function(){
				imgReady(this.src, callback, this);
			});
		}
	});

	$.extend($.easing, {
		def: 'easeOutQuad',
		easeOutBack: function (x, t, b, c, d, s) {
	        if (s == undefined) s = 1.70158;
	        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	    },
	    easeOutElastic: function (x, t, b, c, d) {
	        var s=1.70158;var p=0;var a=c;
	        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
	        if (a < Math.abs(c)) { a=c; var s=p/4; }
	        else var s = p/(2*Math.PI) * Math.asin (c/a);
	        return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	    },
	    easeOutExpo: function (x, t, b, c, d) {
	        return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	    }
	});
})(jQuery);
