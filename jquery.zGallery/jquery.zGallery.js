(function(w,$){
	//定义构造函数
	function Gallery(obj,options){
		//定义默认参数
		var defaultOptions = {
		}
		//参数合并
		this.options = $.extend({},defaultOptions,options||{});
		//拿到操作对象，这里体现了jQuery连缀的好处
		this.$obj = $(obj).css({
			"position":"relative",
			"text-align" : "center"
		});
		//定义一些变量
		this.imgs = null;
		this.index = 0;
		this.timer = null;
		
		this.$prev = this.$obj.find(".prev");
		this.$next = this.$obj.find(".next");
		
		
		//初始化
		this.init();
		//启动函数
		this.start();
		//绑定事件
		this.bindEvent();
	}
	//方法挂载在原型上
	Gallery.prototype = {
		constructor : Gallery,
		init : function(){
			//这里提供一个hook函数，由用户自己获得图片
			this.options.getImg && this.options.getImg();
			//为了保证图片在正确的容器里，一定要使用容器获得内容的方法去拿到图片
			this.imgs = this.$obj.find("img");
			if(this.imgs.length<=0){
				console.log("缺少图片");
				return;
			}
			//设置图片原始位置
			this.imgs.each(function(index,item){
				$(item).css({
					"position" : "absolute",
					"left" : "0",
					"right" : "0",
					"max-width" : "100%",
					"opacity" : 0,
					"z-index" : 0
				});
			}).eq(0).css("opacity","1");
			
		},
		start : function(){
			var _this = this;
			this.timer = setInterval(function(){
				_this.index++;
				_this.effects();
			},2000);
		},
		effects : function(){
			//特效主体
			//思路：统一将所有图片的z-index设置为某一个值
			//将下一张需要显示的图片z-index加高一个层级并显示
			//完成后将其他图片的z-index设置回原来的层级
			var _this = this;
			this.imgs.css("z-index","0");
			if(this.index>this.imgs.length-1){
				this.index = 0;
			}
			if(this.index<0){
				this.index = this.imgs.length-1;
			}
			this.imgs.eq(this.index).css("z-index","1").animate({"opacity":"1"},500,function(){
				_this.imgs.each(function(index,item){
					if(index!=_this.index){
						$(item).css("opacity","0");
					}
				});
			});
		},
		bindEvent : function(){
			var _this = this;
			//鼠标移入暂停事件
			this.$obj.on("mouseover",function(){
				clearInterval(_this.timer);
			});
			this.$obj.on("mouseout",function(){
				_this.start();
			});
			
			//翻页事件
			this.$prev.on("click",function(){
				clearInterval(_this.timer);
				_this.index--;
				_this.effects();
			});
			this.$next.on("click",function(){
				clearInterval(_this.timer);
				_this.index++;
				_this.effects();
			});
		}
	}
	//将插件挂到$.fn下，就可以通过获取实例调用插件
	$.fn.extend({
		gallery : function(opts){
			return $(this).each(function(){
				new Gallery(this,opts);
			});
		}
	});
}(window,jQuery));