# 简单易用的拖拽 不用改动原本的css
>如果元素默认没有定位，拖拽会以相对定位的方式进行拖拽，这样拖拽不会破坏其它元素的位置
>如果元素有定位，拖拽会以元素css设置的定位进行拖拽

### demo页面
* [http://drag.coding.io/](http://drag.coding.io/)

### 最简单的例子

```
    Drag({
        ele: $('.drag')
    });
```

### 带手柄的

```
    Drag({
        ele: $('.drag'),
        handle: 'h2' //注意这边是dom标签名或者class
    });
```

### 带范围的

```
    Drag({
        ele: $('.drag'),
        handle: 'h2' //注意这边是dom标签名或者class
        range: $(window) //指定的jquery对象例如$('.container')
    });
```

### 锁定x轴

```
    Drag({
        ele: $('.drag'),
        handle: 'h2', //注意这边是dom标签名或者class
        range: $(window), //指定的jquery对象例如$('.container')
        xlock: true //同理y轴锁定传ylock:true 两个都锁定 你还拖个毛啊！
    });
```

### 拖拽回调函数

```
    Drag({
        ele: $('.ul1 li'),
        handle: '.tit'
    }).on('start',function(e,ele){//开始拖拽 鼠标按下
        console.log(e.pageX);
    }).on('drag',function(e,ele){//拖拽 鼠标移动
        console.log(e.pageX);
    }).on('drop',function(e,ele){//拖拽结束 鼠标up
       console.log(e.pageX);
    })
```

# 这个是最基础的拖拽 ，如果你有什么建议，可以给我留言 我会添加进去，有bug及时反馈啊
