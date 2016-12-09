<script>
import navbar from './navbar.vue';
import tabbar from './tabbar.vue';
import popout from './popout.vue';

const noop = () => {};

export default {
	data () {
		return {
			mask : '',
			display : true,
			topbarHeight : '0px',
			tabbarHeight : '0px',
		};
	},
	components : {
		navbar,
		tabbar,
		popout,
	},
	methods : {
		close () {
			if (this.mask == 'is-action-sheet') {
				this.$emit('action-sheet:hide', -1);
			}
		},
		showSuccessToast ( content = '' ) {
			this.mask = 'is-toast';
			this.$refs.popout.successToastContent = content;
			this.$refs.popout.successToastDisplay = true;
			setTimeout(() => {
				this.mask = '';
				this.$refs.popout.successToastDisplay = false;
			}, 1500);
		},
		showLoadingToast ( content = '' ) {
			this.mask = 'is-toast';
			this.$refs.popout.loadingToastContent = content;
			this.$refs.popout.loadingToastDisplay = true;
			setTimeout(() => {
				this.mask = '';
				this.$refs.popout.loadingToastDisplay = false;
			}, 1500);
		},
		showAlertDialog ( content = '', options = [], callback = noop ) {
			this.mask = 'is-dialog';
			this.$refs.popout.alertDialogContent = content;
			this.$refs.popout.alertDialogOptions = options;
			this.$refs.popout.alertDialogDisplay = true;
			this.$on('alert-dialog:hide', () => {
				this.$off('alert-dialog:hide');
				this.mask = '';
				this.$refs.popout.alertDialogDisplay = false;
				callback();
			});
		},
		showConfirmDialog ( title = '', content = '', options = [], callback = noop ) {
			this.mask = 'is-dialog';
			this.$refs.popout.confirmDialogTitle = title;
			this.$refs.popout.confirmDialogContent = content;
			this.$refs.popout.confirmDialogOptions = options;
			this.$refs.popout.confirmDialogDisplay = true;
			this.$on('confirm-dialog:hide', ( index ) => {
				this.$off('confirm-dialog:hide');
				this.mask = '';
				this.$refs.popout.confirmDialogDisplay = false;
				callback(index);
			});
		},
		showActionSheet ( cancel = '', options = [], callback = noop ) {
			this.mask = 'is-action-sheet';
			this.$refs.popout.actionSheetOptions = options;
			this.$refs.popout.actionSheetCancelText = cancel;
			this.$refs.popout.actionSheetDisplay = true;
			this.$on('action-sheet:hide', ( index ) => {
				this.$off('action-sheet:hide');
				this.mask = '';
				this.$refs.popout.actionSheetDisplay = false;
				callback(index == -1 ? '' : options[index], index);
			});
		},
	},
};
</script>

<template>
	<div class="app" v-show="display">
		<router-view class="app-content" v-el:content
		 v-bind:style="{ 'padding-top' : topbarHeight, 'padding-bottom' : tabbarHeight }"></router-view>
		<navbar class="app-navigation" v-ref:navbar v-bind:height="topbarHeight"></navbar>
		<tabbar class="app-navigation" v-ref:tabbar v-bind:height.sync="tabbarHeight"></tabbar>
		<div class="app-mask {{ mask }}" v-el:mask v-touch:tap="close"></div>
		<popout class="app-popout" v-ref:popout></popout>
	</div>
</template>

<style lang="scss">
	@import "../sass/variable.scss";
	body {
		font-size: $app-font-size;
		.app {
			width: 100%;
	        height: 100%;
			display: block;
			position: relative;
		}
	}
	.app-content {
		z-index: 1;
	}
	.app-navigation {
		z-index: 2;
	}
	.app-mask {
		z-index: 3;
	}
	.app-popout {
		z-index: 4;
	}
	.app-content,
	.app-mask {
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
		position: absolute;
	}
	.app-content {
		box-sizing: border-box;
	}
	.app-mask {
		opacity: 0;
		pointer-events: none;
		transition: opacity 300ms linear;
		&.is-toast,
		&.is-dialog,
		&.is-action-sheet {
			pointer-events: auto;
		}
		&.is-dialog {
			opacity: .6;
			background-color: #000;
		}
		&.is-action-sheet {
			opacity: .6;
			background-color: #000;
		}
	}
</style>
