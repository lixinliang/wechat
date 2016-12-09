<script>
export default {
    data () {
        return {
            successToastDisplay : false,
            successToastContent : '',
            loadingToastDisplay : false,
            loadingToastContent : '',
            alertDialogDisplay : false,
            alertDialogContent : '',
            alertDialogOptions : [],
            confirmDialogDisplay : false,
            confirmDialogTitle : '',
            confirmDialogContent : '',
            confirmDialogOptions : [],
            actionSheetDisplay : false,
            actionSheetCancelText : '',
            actionSheetOptions : [],
        };
    },
    methods : {
        alertDialogSelect ( index ) {
            if (index == 0) {
                this.$dispatch('alert-dialog:hide');
            }
        },
        confirmDialogSelect ( index ) {
            if (index == 0 || index == 1) {
                this.$dispatch('confirm-dialog:hide', index);
            }
        },
        actionSheetSelect ( index ) {
            this.$dispatch('action-sheet:hide', index);
        },
        actionSheetCancel () {
            this.$dispatch('action-sheet:hide', -1);
        },
    },
};
</script>

<template>
    <div class="popout">
        <div class="weui-toast" v-show="successToastDisplay" transition="fade">
            <i class="weui-icon-success-no-circle weui-icon_toast"></i>
            <p class="weui-toast__content">{{ successToastContent }}</p>
        </div>
        <div class="weui-toast" v-show="loadingToastDisplay" transition="fade">
            <i class="weui-loading weui-icon_toast"></i>
            <p class="weui-toast__content">{{ loadingToastContent }}</p>
        </div>
        <div class="weui-dialog" v-show="alertDialogDisplay" transition="fade">
            <div class="weui-dialog__bd">{{ alertDialogContent }}</div>
            <div class="weui-dialog__ft">
                <div class="weui-dialog__btn weui-dialog__btn_primary"
                v-show="$index == 0"
                 v-for="option in alertDialogOptions"
                 v-touch:tap="alertDialogSelect($index)">{{ option }}</div>
            </div>
        </div>
        <div class="weui-dialog" v-show="confirmDialogDisplay" transition="fade">
            <div class="weui-dialog__hd"><strong class="weui-dialog__title">{{ confirmDialogTitle }}</strong></div>
            <div class="weui-dialog__bd">{{ confirmDialogContent }}</div>
            <div class="weui-dialog__ft">
                <div class="weui-dialog__btn"
                 v-show="$index == 0 || $index == 1"
                 v-for="option in confirmDialogOptions"
                 v-touch:tap="confirmDialogSelect($index)"
                 v-bind:class="{ 'weui-dialog__btn_default' : $index == 0, 'weui-dialog__btn_primary' : $index == 1 }">{{ option }}</div>
            </div>
        </div>
        <div class="weui-actionsheet" v-bind:class="{ 'weui-actionsheet_toggle' : actionSheetDisplay }">
            <div class="weui-actionsheet__menu">
                <div class="weui-actionsheet__cell"
                 v-for="option in actionSheetOptions"
                 v-touch:tap="actionSheetSelect($index)">{{ option }}</div>
            </div>
            <div class="weui-actionsheet__action" v-touch:tap="actionSheetCancel">
                <div class="weui-actionsheet__cell">{{ actionSheetCancelText }}</div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    @import "../sass/variable.scss";
    .fade-transition {
		transition: opacity 250ms linear;
		&.fade-enter,
		&.fade-leave {
			opacity: 0;
		}
	}
    .weui-toast {
        top: 230px;
    }
    .weui-dialog__bd {
        word-break: break-word;
    }
</style>
