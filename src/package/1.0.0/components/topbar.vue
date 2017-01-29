<script>
export default {
    props : ['title', 'height', 'button'],
    ready () {
        this.height = '64px';
    },
    methods : {
        back () {
            this.$router.go('.');
        },
    },
};
</script>

<template>
    <div class="topbar" v-bind:style="{ height : height }">
        <div class="topbar-content">
            <div class="topbar-left" v-touch:tap="back">
                <div class="topbar-text">{{ button }}</div>
                <i></i>
            </div>
            <div class="topbar-right"><slot></slot></div>
            <div class="topbar-middle">
                <div class="topbar-text">{{* title }}</div>
            </div>
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
        z-index: 2;
    }
    .topbar-content {
        height: 100%;
        overflow: hidden;
    }
    .topbar-left {
        float: left;
        padding-left: 10px + 15;
        .topbar-text {
            text-align: left;
            &:empty + i {
                display: none;
            }
        }
        i {
            content: " ";
            display: inline-block;
            height: 8px;
            width: 8px;
            border-width: 2px 2px 0 0;
            border-color: #C8C8CD;
            border-style: solid;
            -webkit-transform: matrix(-0.71, -0.71, 0.71, -0.71, 0, 0);
            transform: matrix(-0.71, -0.71, 0.71, -0.71, 0, 0);
            // position: relative;
            // top: -2px;
            position: absolute;
            top: 50%;
            margin-top: -4px;
            left: 15px;
        }
    }
    .topbar-right {
        float: right;
        padding-right: 10px;
        .topbar-text {
            text-align: right;
        }
    }
    .topbar-left,
    .topbar-right {
        width: 24%;
        height: 100%;
        position: relative;
        box-sizing: border-box;
        &:empty {
            visibility: hidden;
            pointer-events: none;
        }
    }
    .topbar-middle {
        height: 100%;
        overflow: hidden;
        .topbar-text {
            font-weight: 700;
            text-align: center;
        }
    }
    .topbar-text {
        // display: inline-block;
        width: 100%;
        height: 20px;
        line-height: 20px;
        position: relative;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        color: #fff;
        font-size: 18px;
        // margin-top: 10px;
        overflow: hidden;
        white-space: nowrap;
        word-wrap: break-word;
        word-break: break-all;
        text-overflow: ellipsis;
    }
</style>
