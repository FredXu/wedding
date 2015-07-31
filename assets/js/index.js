$(function(){
	//幻灯片
	var imgSwipe = $('#imgSwipe'),
		oNum = $('#swipeNum span'),
		subNav = $('#sub_nav a'),
		imgReadyCb = function(){ //计算图片尺寸
			var obj = $(this).is(':visible') ? this : $(this).getHiddenDimensions(),
				h = obj.height,
				w = obj.width,
				boxW = imgSwipe.width(),
				boxH = imgSwipe.height();

			if(w > boxW){
				h = boxW / (w / h);
			}

			if(h < boxH){
				$(this).css('margin-top', ( boxH - h ) /2).attr('ready', true);
			}
		},
		swipeFn = function(obj){
			obj.Swipe({
				auto: 3000,
				callback: function (index) {
					oNum.eq(index).addClass('cur').siblings().removeClass('cur');
				}
			});
		},
		anmation = function(callback){ //开场动画
			if($('#animation').length){
				$('#animation').fadeIn(1500, function(){
					$(this).animate({top: 120}, 'easeOutBack', function(){
				       $(this).animate({top: 0}, 500, 'easeOutElastic');
				       $('#loading').remove();
				    }).one('touchstart', function(e){
				    	$(this).animate({top: '-100%'}, function(){
			                $(this).remove();
			            });
			            if(callback) callback.call(this);
			            e.preventDefault();
				    });
				});
			}else{
				if(callback) callback.call(this);
			}
		},
		tab = function(index){ // index-1-a 
			var target = $('#tab_content > div').eq(index),
				id = target.attr('id');
			if(target.length){
				subNav.eq(index).addClass('cur').parents().siblings().find('a').removeClass('cur');
				target.show().siblings().hide();

				if(id == 'imgSwipe'){
					if(target.data('Swipe')){
						target.data('Swipe').setup();
					}else{
						swipeFn(target);
					}
					imgSwipe.find('img[ready!="true"]').imgReady(imgReadyCb);
				}
				if(target.attr('type') === 'video') target.showVideo();

				if(target.hasClass('scroller')){
					if(!target.children().data('scroller')) target.children().scroller({scrollX: false});
				}
				if(id == 'plan_cont'){ //new Scroller('#planContWrap', {scrollX: false});
					
				}
			}
		},
		init = function(){
			//音乐
			if($('#audio').length){
				$('#audio').audioInit('#audioPlay')
			}else{
				var _title = $('header .title');
				_title.css('padding-right', 10);
				if(($('header #shareBtn').length)){
					_title.css('padding-right', 40);
					$('#shareBtn').css('margin-left', 35);
				}
			};
			setTimeout(function(){
				anmation(function(){
					$('#marquee').marquee();
					if(imgSwipe.length && imgSwipe.is(':visible')){
						imgSwipe.find('img').imgReady(imgReadyCb);
						swipeFn(imgSwipe);
					}
					tab(0);
					$('#videoBox').show();
				});
			}, 300);

			

			$('#slideNav li > a').on('click', function(){
				var _next = $(this).next(),
					_parent = this.parentNode,
					url = this.href,
					isCurrent = !_parent.className;
				if(/javascript/.test(url) || _next.length){
					_parent.className = isCurrent ? 'cur' : '';
					if(_next.attr('type') === 'video') _next.showVideo();
					_next.height(isCurrent ? _next[0].scrollHeight : 0);
				}
			});

			subNav.on('click', function(){
				tab(subNav.index(this));
			});

			//分享
			var $sharePop = $('#sharePop');
			$sharePop.height($(document).height());
			$('#shareBtn').on('click', function(){
				window.scrollTo(0, 0);
				$sharePop.show().find('div').animate({top: 0}, 'easeOutExpo');
			});

			$sharePop.on('click', function(){
				$(this).hide().find('div').css('top', '100%');
			});
		};

	init();	
});