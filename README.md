# jquery 走马灯组件

```js
<div class="auto-scroll">
	<div class="auto-scroll-wapper">
		<a href="#">0000000000000000000000000000</a>
		<a href="#">1111111111111111111111111111</a>
		<a href="#">2222222222222222222222222222</a>
		<a href="#">3333333333333333333333333333</a>
	</div>
</div>

let autoScroll = $('.auto-scroll').autoScroll({
		direction: 'left', // left | right | up | down
		speed: 0.5,
		runshort: false, // 内容不足是否滚动 默认滚动
		hoverstop: false, // 鼠标悬停是否暂停 默认暂停
	});

autoScroll.update() // 更新
autoScroll.pause() // 暂停
autoScroll.play() // 继续滚动
autoScroll.destroy() // 销毁
```
