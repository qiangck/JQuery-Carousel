;(function($){
    var Carousel = function(poster){
        // 保存单个旋转木马对象
        this.poster = poster;
        this.posterItemMain = poster.find('ul.poster-list');
        this.nextBtn = poster.find('#poster-next-btn');
        this.prevBtn = poster.find('#poster-prev-btn');
        this.posterFirstItem = this.posterItemMain.find('li').eq(0);
        this.posterItems = poster.find('li.poster-item');
        // 默认配置参数
        this.setting={
            "width":1000,               //幻灯片宽度
            "height":270,               //幻灯片高度
            "posterWidth":640,          //幻灯片第一帧宽度
            "posterHight":270,          //幻灯片第一帧高度
            "scale":0.9,                //记录显示比例关系
            "speed":500,
            "verticalAlign":"middle"    
        };
        $.extend(this.setting,this.getSetting());
        // 设置配置参数值
        this.setSettingValue();
        this.setPosterPos();
    };
    Carousel.prototype = {
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
        // 设置剩余的图片的位置关系
        setPosterPos:function(){
            var self = this;
            var sliceItems = this.posterItems.slice(1),
                sliceSize = sliceItems.size()/2,
                rightItem = sliceItems.slice(0,sliceSize);
                level = Math.floor(this.posterItems.size()/2);
            //设置右边帧的位置关系和宽度高度
            var rightWidth = this.setting.posterWidth,
                rightHigth = this.setting.posterHight,
                gap = ((this.setting.width-this.setting.posterWidth)/2)/level;
            var firstLeft = (this.setting.width-this.setting.posterWidth)/2;
            var firOffsetLeft = firstLeft + rightWidth;
            rightItem.each(function(i){
                level--;
                rightWidth = rightWidth*self.setting.scale;
                rightHigth = rightHigth*self.setting.scale;
                var j = i;
                $(this).css({
                    zIndex:level,
                    width:rightWidth,
                    height:rightWidth,
                    opacity:1/(++i),
                    left:firOffsetLeft + (++j) * gap - rightWidth,
                    top:(self.setting.height-rightHigth)/2
                });
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