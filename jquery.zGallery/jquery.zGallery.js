(function(w,$){
	//���幹�캯��
	function Gallery(obj,options){
		//����Ĭ�ϲ���
		var defaultOptions = {
		}
		//�����ϲ�
		this.options = $.extend({},defaultOptions,options||{});
		//�õ�������������������jQuery��׺�ĺô�
		this.$obj = $(obj).css({
			"position":"relative",
			"text-align" : "center"
		});
		//����һЩ����
		this.imgs = null;
		this.index = 0;
		this.timer = null;
		
		this.$prev = this.$obj.find(".prev");
		this.$next = this.$obj.find(".next");
		
		
		//��ʼ��
		this.init();
		//��������
		this.start();
		//���¼�
		this.bindEvent();
	}
	//����������ԭ����
	Gallery.prototype = {
		constructor : Gallery,
		init : function(){
			//�����ṩһ��hook���������û��Լ����ͼƬ
			this.options.getImg && this.options.getImg();
			//Ϊ�˱�֤ͼƬ����ȷ�������һ��Ҫʹ������������ݵķ���ȥ�õ�ͼƬ
			this.imgs = this.$obj.find("img");
			if(this.imgs.length<=0){
				console.log("ȱ��ͼƬ");
				return;
			}
			//����ͼƬԭʼλ��
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
			//��Ч����
			//˼·��ͳһ������ͼƬ��z-index����Ϊĳһ��ֵ
			//����һ����Ҫ��ʾ��ͼƬz-index�Ӹ�һ���㼶����ʾ
			//��ɺ�����ͼƬ��z-index���û�ԭ���Ĳ㼶
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
			//���������ͣ�¼�
			this.$obj.on("mouseover",function(){
				clearInterval(_this.timer);
			});
			this.$obj.on("mouseout",function(){
				_this.start();
			});
			
			//��ҳ�¼�
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
	//������ҵ�$.fn�£��Ϳ���ͨ����ȡʵ�����ò��
	$.fn.extend({
		gallery : function(opts){
			return $(this).each(function(){
				new Gallery(this,opts);
			});
		}
	});
}(window,jQuery));