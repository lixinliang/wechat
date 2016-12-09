<script>
import IScroll from 'iscroll';

export default {
    ready () {
        // 模拟滚动
        setTimeout(() => {
            let scroll = new IScroll('.scroll-view', {
                scrollY : true,
                scrollbars : true,
                deceleration : 0.006,
                disableMouse : true,
                disablePointer : true,
                fadeScrollbars : true,
                shrinkScrollbars : 'scale',
            });
            let indicator = scroll.indicators[0];
            indicator.wrapper.classList.add('scroll-view-scrollbar');
            indicator.wrapperStyle['width'] = '4.5px';
            indicator.wrapperStyle['right'] = '2px';
        }, 0);
    },
};
</script>

<template>
    <div class="scroll-view">
        <div class="scroll-view-container">
            <slot></slot>
        </div>
    </div>
</template>

<style lang="scss">
    @import "../sass/variable.scss";
    .scroll-view {
        width: 100%;
        height: 100%;
		overflow: hidden;
        position: relative;
		background-color: $scroll-view-background-color;
	}
	.scroll-view-container {
		width: 100%;
		min-height: 100%;
	}
</style>
