;(function($){
    var Carousel = function(poster){
        // 保存单个旋转木马对象
        var self = this;
        this.poster = poster;
        this.posterItemMain = poster.find('ul.poster-list');
        this.posterItems = poster.find('li.poster-item');
        this.nextBtn = poster.find('#poster-next-btn');
        this.prevBtn = poster.find('#poster-prev-btn');
        this.posterFirstItem = this.posterItems.first();
        this.posterLastItem = this.posterItems.last();
        this.rotateFlag = true;
        // 默认配置参数
        this.setting={
            "width":1000,               //幻灯片宽度
            "height":270,               //幻灯片高度
            "posterWidth":640,          //幻灯片第一帧宽度
            "posterHight":270,          //幻灯片第一帧高度
            "scale":0.9,                //记录显示比例关系
            "speed":500,                //轮播速度
            "autoPlay":true,            //是否自动轮播
            "delay":2000,               //自动轮播时间
            "verticalAlign":"middle"    //对齐方式
        };
        $.extend(this.setting,this.getSetting());
        // 设置配置参数值
        this.setSettingValue();
        this.setPosterPos();
        // 按钮点击事件
        this.nextBtn.click(function(){
            if(self.rotateFlag){
                self.rotateFlag = false;
                self.carouseRotate('left');
            }
        });
        this.prevBtn.click(function(){
            if(self.rotateFlag){
                self.rotateFlag = false;
                self.carouseRotate('right');
            }
        });
        // 是否自动播放
        if(this.setting.autoPlay){
            this.autoPlay();
            this.poster.hover(function(){
                window.clearInterval(self.timer);
            },function(){
                self.autoPlay();
            });
        };
    };
    Carousel.prototype = {
        autoPlay:function(){
            var self =this;
            this.timer =window.setInterval(function(){
                self.nextBtn.click();
            },self.setting.delay);
        },
        carouseRotate:function(dir){
            var _this_ = this;
            var zIndexArr = [];
            if(dir==="left"){
                this.posterItems.each(function(){
                    var self = $(this),
                        prev = self.prev().get(0)?self.prev():_this_.posterLastItem,
                        width = prev.width(),
                        height = prev.height(),
                        zIndex = prev.css('zIndex'),
                        opacity = prev.css('opacity'),
                        left = prev.css('left'),
                        top = prev.css('top');
                        zIndexArr.push(zIndex);
                        self.animate({
                            width:width,
                            height:height,
                            opacity:opacity,
                            left:left,
                            top:top
                        },_this_.setting.speed,function(){
                            _this_.rotateFlag = true;
                        });
                })
                this.posterItems.each(function(i){
                    $(this).css('zIndex',zIndexArr[i]);
                })
            }else if(dir==="right"){
                this.posterItems.each(function(){
                    var self = $(this),
                        next = self.next().get(0)?self.next():_this_.posterFirstItem,
                        width = next.width(),
                        height = next.height(),
                        zIndex = next.css('zIndex'),
                        opacity = next.css('opacity'),
                        left = next.css('left'),
                        top = next.css('top');
                        zIndexArr.push(zIndex);
                        self.animate({
                            width:width,
                            height:height,
                            opacity:opacity,
                            left:left,
                            top:top
                        },_this_.setting.speed,function(){
                            _this_.rotateFlag = true;
                        });
                })
                this.posterItems.each(function(i){
                    $(this).css('zIndex',zIndexArr[i]);
                })
            }
        },
        // 设置剩余的图片的位置关系
        setPosterPos:function(){
            var self = this;
            var sliceItems = this.posterItems.slice(1),
                sliceSize = sliceItems.size()/2,
                rightSlice = sliceItems.slice(0,sliceSize),
                level = Math.floor(this.posterItems.size()/2);
                leftSlice = sliceItems.slice(sliceSize);
            //设置右边帧的位置关系和宽度高度
            var rightWidth = this.setting.posterWidth,
                rightHigth = this.setting.posterHight,
                gap = ((this.setting.width-this.setting.posterWidth)/2)/level;
            var firstLeft = (this.setting.width-this.setting.posterWidth)/2;
            var fixOffsetLeft = firstLeft + rightWidth;
            rightSlice.each(function(i){
                level--;
                rightWidth = rightWidth*self.setting.scale;
                rightHigth = rightHigth*self.setting.scale;
                var j = i;
                $(this).css({
                    zIndex:level,
                    width:rightWidth,
                    height:rightHigth,
                    opacity:1/(++j),
                    left:fixOffsetLeft+(++i)*gap-rightWidth,
                    top:self.setVertucalAlign(rightHigth)
                });
            });
            // 设置左边帧的闻之关系和宽度高度
            var leftWidth = rightSlice.last().width(),
                leftHeight = rightSlice.last().height(),
                oloop = Math.floor(this.posterItems.size()/2);
            leftSlice.each(function(i){
                    $(this).css({
                        zIndex:i,
                        width:leftWidth,
                        height:leftHeight,
                        opacity:1/oloop,
                        left:i*gap,
                        top:self.setVertucalAlign(leftHeight)
                    });
                leftWidth = leftWidth/self.setting.scale;
                leftHeight = leftHeight/self.setting.scale;
                oloop--;
            });
        },       
        // 设置垂直排列对其方式
        setVertucalAlign:function(height){
            var verticalType = this.setting.verticalAlign,
                top = 0;
            if(verticalType==="middle"){
                top = (this.setting.height-height)/2
            }else if(verticalType==="top"){
                top=0;
            }else if(verticalType==="bottom"){
                top = this.setting.height-height;
            }else{
                top = (this.setting.height-height)/2
            }
            return top;
         },
        // 设置配置参数值去控制基本的宽度高度
        setSettingValue:function(){
            // 主体宽度计算
            this.poster.css({
                width:this.setting.width,
                height:this.setting.height
            });
            // ul宽度计算
            this.posterItemMain.css({
                width:this.setting.width,
                height:this.setting.height
            });
            // 按钮宽度高度计算
            var btn = (this.setting.width - this.setting.posterWidth)/2;
            this.nextBtn.css({
                width:btn,
                height:this.setting.height,
                // 设置按钮层级设置
                zIndex:Math.ceil(this.posterItems.size()/2)
            });
            this.prevBtn.css({
                width:btn,
                height:this.setting.height,
                zIndex:Math.ceil(this.posterItems.size()/2)
            });
            // 第一帧图片居中
            this.posterFirstItem.css({
                width:this.posterWidth,
                height:this.posterHight,
                left:btn,
                zIndex:Math.floor(this.posterItems.size()/2)
            });
        },
        // 获取人工配置
        getSetting:function(){
            var setting = this.poster.attr("data-setting");
            // 判断如果没有人工输入配置则返回空对象{}
            if(setting&&setting!=''){
                return $.parseJSON(setting);
            }
            return {};
        }
    }
    Carousel.init = function(posters){
        var _this_ =this;
        posters.each(function(i,elem){
            new _this_($(this));
        });
    }
    window["Carousel"] = Carousel;
})(jQuery)
