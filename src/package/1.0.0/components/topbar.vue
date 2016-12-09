<script>
export default {
    props : ['title'],
    data () {
		return {
			height : '64px',
		};
	},
    ready () {
        this.$root.topbarHeight = this.height;
    },
};
</script>

<template>
    <div class="topbar" v-bind:style="{ height : height }">
        <div class="topbar-title">
            <div class="topbar-text">{{* title }}</div>
        </div>
    </div>
</template>

<style lang="scss">
    @import "../sass/variable.scss";
    .topbar {
        top: 0;
        left: 0;
        width: 100%;
        display: block;
        overflow: hidden;
        position: absolute;
        box-sizing: border-box;
        padding-top: $native-navigation-bar-height;
        background: #000;
        z-index: 1;
    }
    .topbar-title {
        height: 100%;
        overflow: hidden;
    }
    .topbar-text {
        width: 100%;
        height: 20px;
        line-height: 20px;
        position: relative;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        color: #fff;
        font-size: 18px;
        text-align: center;
        font-weight: 700;
        // margin-top: 10px;
    }
</style>
