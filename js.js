/**
 * Created by mengshaohua on 2017/4/11.
 */
var scrollBar;
scrollBar = function (option) {
    var changefn = function () {
    };
    /* 处理参数 */
    if (option instanceof Array || typeof option === 'string' || option instanceof Number || !option) throw new Error('参数格式错误');
    if (isEmptyObject(option)) throw new Error('参数为空{}');

    /* 处理dom */
    var dom;
    if (!option.dom) throw new Error('DOM元素不存在');
    option.dom.length ? dom = option.dom[0] : dom = option.dom;
    if (isEmptyObject(dom)) throw new Error('DOM为空{}');
    if (!(dom instanceof Element)) throw new Error('DOM元素不存在');
    dom.style.position = 'relative';

    /* 注入DOM */
    var scrollBox = document.createElement('div');
    var h = option.height || 12;
    var w = option.width || dom.offsetWidth || 996;

    //  处理位置
    var tb = '';
    arrhad(['bottom', 'top'], option.position) ? tb = option.position : tb = 'bottom';

    //  设置属性
    var bgUrl = '';
    option.backgroundImage ? bgUrl = 'url(' + option.backgroundImage + ') repeat-x' : bgUrl = '#1f2d70';
    scrollBox.style.width = w - 2 + 'px';
    scrollBox.style.height = h - 2 + 'px';
    scrollBox.style.background = bgUrl;
    scrollBox.style.position = 'absolute';
    scrollBox.style[tb] = '10px';
    scrollBox.style.borderRadius = h / 2 + 'px';
    scrollBox.style.left = '50%';
    scrollBox.style.marginLeft = -(w / 2) + 'px';
    scrollBox.style.border = '1px solid #3357B0';

    //  滑块
    var scrollDom = document.createElement('div');
    var slideStart = '';
    arrhad(['left', 'right'], option.slideStart) ? slideStart = option.slideStart : slideStart = 'left';
    var slideBg = '';
    option.slideBgImage ? slideBg = 'url(' + option.slideBgImage + ') no-repeat' : slideBg = '#208eca';
    scrollDom.style.position = 'absolute';
    scrollDom.style[slideStart] = '0px';
    scrollDom.style.width = (option.slideWidth || 17) + 'px';
    scrollDom.style.height = h + 'px';
    scrollDom.style.background = slideBg;
    scrollDom.style.backgroundSize = 'cover';
    scrollDom.style.marginTop = '-1px';
    scrollDom.style.cursor = 'pointer';
    scrollBox.appendChild(scrollDom);

    //  左右shadow
    var scrollLeft = document.createElement('span');
    scrollLeft.style.position = 'absolute';
    scrollLeft.style.top = '0px';
    scrollLeft.style.left = '-2px';
    scrollLeft.style.width = '2px';
    scrollLeft.style.height = h + 'px';
    scrollLeft.style.backgroundColor = '#00adfa';
    scrollLeft.style.boxShadow = '0 0 3px #00adfa';
    scrollDom.appendChild(scrollLeft);
    var scrollRight = document.createElement('span');
    scrollRight.style.position = 'absolute';
    scrollRight.style.top = '0px';
    scrollRight.style.right = '-2px';
    scrollRight.style.width = '3px';
    scrollRight.style.height = h + 'px';
    scrollRight.style.backgroundColor = '#00adfa';
    scrollRight.style.boxShadow = '0 0 3px #00adfa';
    scrollDom.appendChild(scrollRight);

    //  tooltip
    var tlUrl = '';
    option.tooltipImage ? tlUrl = 'url(' + option.tooltipImage + ') no-repeat' : tlUrl = '#24358C';
    var scrollToolTip = document.createElement('div');
    scrollToolTip.style.width = (option.tooltipWidth || 48) + 'px';
    scrollToolTip.style.height = (option.tooltipHeight || 20) + 8 + 'px';
    scrollToolTip.style.position = 'absolute';
    scrollToolTip.style.left = -((option.tooltipWidth || 48) - (option.slideWidth || 17)) / 2 + 'px';
    scrollToolTip.style.top = -(option.tooltipWidth || 48) + 15 + 'px';
    scrollToolTip.style.background = tlUrl;
    scrollToolTip.style.borderRadius = '3px';
    // scrollToolTip.style.border = '1px solid #42B7FF';
    scrollToolTip.style.cursor = 'auto';
    scrollToolTip.style.color = '#00C9FF';
    scrollToolTip.style.textAlign = 'center';
    scrollToolTip.style.fontSize = '12px';
    scrollToolTip.style.lineHeight = (option.tooltipHeight || 20) + 'px';
    scrollToolTip.innerHTML = '2017';
    scrollDom.appendChild(scrollToolTip);

    //  放入Dom中
    dom.appendChild(scrollBox);

    /* 拖动*/
    var len = option.data.length;
    var scaleW = w / len;
    var oldLeft = scrollDom.offsetLeft;
    var scrollDomW = (option.slideWidth || 17) / 2;
    var index = parseInt(oldLeft / scaleW);

    scrollToolTip.innerHTML = option.data[index];
    var oldInner = option.data[index];
    scrollDom.onmousedown = function (e) {
        var oldX = e.clientX;
        oldLeft = scrollDom.offsetLeft;
        document.onmousemove = function (e) {
            var newX = e.clientX;
            var newLeft = oldLeft + (newX - oldX);        
            if (newLeft > w - scrollDomW * 2) {
                newLeft = w - scrollDomW * 2;
            } else if (newLeft < 0) {
                newLeft = 0;
            }
            index = parseInt(newLeft / scaleW);
            scrollToolTip.innerHTML = option.data[index];
            var newInner = option.data[index];
            if (newInner != oldInner) {
                oldInner = newInner;
                changefn(oldInner);
            }
            scrollDom.style.left = newLeft + 'px';
            e.stopPropagation();
        };
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
        }
    };

    return {
        scrollChange: function (fn) {
            changefn = fn;
        }
    };

    /* 判断参数是否为{} */
    function isEmptyObject(e) {
        var t = null;
        for (t in e) {
            return !1;
        }
        return !0;
    }

    /* 判断数组中是否包含item */
    function arrhad(arr, item) {
        if (!item) return !1;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == item) return !0;
        }
        return !1;
    }
};