<script>
export default {
    props : ['height'],
    data () {
        return {
            button : '',
        };
    },
    ready () {
        this.$router.afterEach(( transition ) => {
            let path = transition.from.path;
            this.button =  path ? path.slice(1) : '';
		});
    },
};
</script>

<template>
    <div class="navbar" v-bind:style="{ height : height }">
        <div class="navbar-button" v-show="button" v-link="button">
            <div class="navbar-text">{{ button }}</div>
        </div>
    </div>
</template>

<style lang="scss">
    @import "../sass/variable.scss";
    .navbar {
        top: 0;
        left: 0;
        display: block;
        overflow: hidden;
        position: absolute;
        box-sizing: border-box;
        padding-top: $native-navigation-bar-height;
        color: #fff;
        max-width: 33%;
    }
    .navbar-button {
        height: 100%;
        // background: red;
    }
    $navbar-text-padding: 10px;
    $navbar-icon-size: 10px;
    .navbar-text {
        font-size: 16px;
        position: relative;
        top: 50%;
        transform: translateY(-50%);
        padding-left: $navbar-text-padding + $navbar-icon-size + 4;
        padding-right: $navbar-text-padding;
        // width: 1px;
        overflow: hidden;
        white-space: nowrap;
        word-wrap: break-word;
        word-break: break-all;
        text-overflow: ellipsis;
        &::before {
            content: "";
            display: inline-block;
            height: $navbar-icon-size;
            width: $navbar-icon-size;
            border-width: 2px 2px 0 0;
            border-color: #C8C8CD;
            border-style: solid;
            position: absolute;
            top: 50%;
            transform: translateY(-50%) rotate(-135deg);
            left: $navbar-text-padding;
        }
    }
</style>
