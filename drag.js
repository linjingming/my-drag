/**基于jquery 用之前要引入jquery 1.42 版本以上
 * 作者：jimlin
 * 版本：1.0
 * 参数说明
 */
(function($){
    //判断鼠标是否按下
    var isAcDown = false;
    //判断鼠标是否位移
    var isAcMove = false;
    //鼠标位置
    var iMouseX,iMouseY;
    //鼠标距离拖拽元素位置
    var iMouseOffsetX,iMouseOffsetY;
    //定位
    var dragPos;
    //用以判定用哪种方式来定位
    var positon = {'static': 'relative','relative': 'relative','absolute': 'absolute','fixed': 'fixed'};
    //索引
    var iZindex = 9999;
    //用以存储位置的信息
    var oPosHelp;
    //拖拽范围
    var oRange = {iMinLeft: -9999, iMaxLeft: 9999,iMinTop: -9999, iMaxTop: 9999};
    //默认参数
    var parameters = {
        ele: null,
        handle: null,
        range: null,
        xlock: false,
        ylock: false
    };
    //构造函数
    var Drag = function(options){
        return new init(options)
    }
    //构造函数
    var init = function(options){
        var options = $.extend({},parameters,options);
        this.ele = options.ele;
        this.handle = options.handle;
        this.range = options.range;
        this.xlock = options.xlock;
        this.ylock = options.ylock;
        this.myevent = {};
        this.acStart();
    };
    Drag.prototype = {
        constructor : Drag,
        //设置开始的一些状态
        setSartStatus: function(e,ele){
            var $ele = $(ele);
            var offset = $ele.offset();
            var margin = $ele.css('margin');
            //存储拖拽的定位方式
            dragPos = positon[$ele.css('position')];
            //鼠标位置
            iMouseX = e.pageX, iMouseY = e.pageY;
            //存储偏移量
            iMouseOffsetX = iMouseX - offset.left; iMouseOffsetY = iMouseY - offset.top;
            //设置css
            $ele.css({'position': dragPos,'z-index': ++iZindex});

            if(dragPos == 'absolute'){//如果是绝对定位 获取定位父元素的offset
                var $offsetParent = $ele.offsetParent();
                var borderTop = $offsetParent.css('border-top-width');
                var borderLeft = $offsetParent.css('border-left-width');
                var parentOffset = $offsetParent.offset();
                //ie 6 7 8 border为0时候返回medium
                borderTop = borderTop === 'medium' ? 0 : parseInt(borderTop);
                borderLeft = borderLeft === 'medium' ? 0 : parseInt(borderLeft);
                //ie6 7最顶层定位父元素为html且html有2象素的偏移 其它浏览器为body
                if($offsetParent[0].tagName.toLocaleLowerCase() == 'html'){
                    parentOffset.top = 0;
                    parentOffset.left = 0;
                }
                oPosHelp = {top: parentOffset.top + borderTop,left: parentOffset.left + borderLeft,margin: 0};
            }else if(dragPos == 'relative') {//如果是相对定位 获取元素初始的offset
                oPosHelp = {top: $ele.data('drag-start-offset').top,left: $ele.data('drag-start-offset').left,margin: margin};
            }else{
                oPosHelp = {top: 0 + $(window).scrollTop(),left: 0 + $(window).scrollLeft(),margin: 0};
            }
            this.setRange($ele);
        },

        //设置范围
        setRange: function($ele){
            if(!this.range) return;
            var $range = this.range;
            var dragW = $ele.outerWidth();
            var dragH = $ele.outerHeight();
            var width = $range.outerWidth();
            var height = $range.outerHeight();
            var rangeOffset;
            var iMinLeft,iMaxLeft,iMinTop,iMaxTop;
            var borderTop = borderLeft = borderRight =  borderBottom = 0;
            if($range[0] == window || $range[0] == document){
                rangeOffset = {left: 0,top: 0};
            }else{
                rangeOffset = $range.offset();
                borderTop = $range.css('border-top-width');
                borderLeft = $range.css('border-left-width');
                borderRight = $range.css('border-right-width');
                borderBottom = $range.css('border-bottom-width');
                borderTop = borderTop === 'medium' ? 0 : parseInt(borderTop);
                borderLeft = borderLeft === 'medium' ? 0 : parseInt(borderLeft);
                borderRight = borderRight === 'medium' ? 0 : parseInt(borderRight);
                borderBottom = borderBottom === 'medium' ? 0 : parseInt(borderBottom);
            }

            //left最小值
            iMinLeft = rangeOffset.left - oPosHelp.left + borderLeft;
            //left最大值
            iMaxLeft = rangeOffset.left + width - oPosHelp.left - dragW -borderRight;
            //top最小值
            iMinTop = rangeOffset.top - oPosHelp.top + borderTop;
            //top最大值
            iMaxTop = rangeOffset.top + height - oPosHelp.top - dragH - borderBottom;
            //存到oRange
            oRange = {iMinLeft: iMinLeft, iMaxLeft: iMaxLeft,iMinTop: iMinTop, iMaxTop: iMaxTop};
        },
        //拖拽时设置位置
        setPosition: function(e,ele){
            var $ele = $(ele);
            var css = {};
            var top ,left ;
            top = e.pageY - iMouseOffsetY - oPosHelp.top;
            left = e.pageX - iMouseOffsetX - oPosHelp.left;
            //如果存在限制范围
            if(this.range){
                if(left >= oRange.iMaxLeft){
                    left = oRange.iMaxLeft
                }
                if(left <= oRange.iMinLeft){
                    left = oRange.iMinLeft
                }
                if(top >= oRange.iMaxTop){
                    top = oRange.iMaxTop
                }
                if(top <= oRange.iMinTop){
                    top = oRange.iMinTop
                }
            }

            if(this.xlock){
                css['top'] = top;
            }else if(this.ylock){
                css['left'] = left;
            }else{
                css['top'] = top;
                css['left'] = left;
            }
            css['margin'] = oPosHelp.margin;
            $ele.css(css);
        },
        acStart: function(){
            var self = this;
            var $ele = self.ele;
            $ele.each(function(){
                var _this = this;
                var handle = self.handle;
                handle = $(this).find(handle).length == 0 ? this : $(this).find(handle)[0];
                //保存初始的位置
                $(this).data('drag-start-offset',$(this).offset());
                //改变鼠标样式
                $(handle).css('cursor', 'move');
                $(handle).on('mousedown',function(e){
                    isAcDown = true;
                    self.acDown(e,_this);
                    self.trigger('start',e,_this);
                    return false;
                });
            })
        },
        acDown: function(e,ele){
            var self = this;
            iMouseX = e.pageX;
            iMouseY = e.pageY;
            self.setSartStatus(e,ele);
            self.acMove(ele);
            self.acUp(ele);
        },
        acMove: function(ele){
            var self = this;
            if(isAcDown){
                $(document).on('mousemove',function(e){
                    isAcMove = true;
                    self.setPosition(e,ele);
                    self.trigger('drag',e,ele);
                    return false
                })
            }
        },
        acUp: function(ele){
            var self = this;
            $(document).on('mouseup',function(e){
                isAcDown = false;
                isAcMove = false;
                oRange = {iMinLeft: -9999, iMaxLeft: 9999,iMinTop: -9999, iMaxTop: 9999};
                self.trigger('drop',e,ele);
                $(document).off('mousemove');
                $(document).off('mousedown');
                $(document).off('mouseup');
            })
        },
        on: function(type,callback){
            var callback = callback || function(){};
            this.myevent[type] = this.myevent[type] || [];
            this.myevent[type].push(callback);
            return this;
        },
        trigger: function(type,e,ele){
            if(this.myevent[type] instanceof Array){
                for(var i = 0; i < this.myevent[type].length; i++){
                    this.myevent[type][i](e,ele);
                }
            }
        }
    };

    init.prototype = Drag.prototype;
    window.Drag = Drag;
})(jQuery,window)