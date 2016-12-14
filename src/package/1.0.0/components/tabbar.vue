<script>
export default {
	props : ['height'],
	data () {
		return {
			path : '',
		};
	},
	ready () {
		this.height = '50px';
		this.path = this.$route.path.split('/')[1];
		this.$root.tabbarController = ( transition ) => {
			this.path = transition.to.path.split('/')[1];
		};
	},
	beforeDestroy () {
		const noop = () => {};
		this.$root.tabbarController = noop;
	},
	methods : {
		go ( path ) {
			this.$router.go(path);
		},
	},
};
</script>

<template>
	<div class="tabbar" v-bind:style="{ height : height }">
        <div class="weui-tab">
            <div class="weui-tabbar">
                <div v-el:chats
					v-touch:tap="go('/chats')"
					v-touch:press="go('/chats')"
					class="weui-tabbar__item"
					v-bind:class="{ 'weui-bar__item_on' : path == 'chats' }">
                    <div class="weui-tabbar__icon"><i class="i-chats"></i></div>
                    <p class="weui-tabbar__label">Chats</p>
                </div>
                <div v-el:contacts
					v-touch:tap="go('/contacts')"
					v-touch:press="go('/contacts')"
					class="weui-tabbar__item"
					v-bind:class="{ 'weui-bar__item_on' : path == 'contacts' }">
                    <div class="weui-tabbar__icon"><i class="i-contacts"></i></div>
                    <p class="weui-tabbar__label">Contacts</p>
                </div>
                <div v-el:discover
					v-touch:tap="go('/discover')"
					v-touch:press="go('/discover')"
					class="weui-tabbar__item"
					v-bind:class="{ 'weui-bar__item_on' : path == 'discover' }">
                    <div class="weui-tabbar__icon"><i class="i-discover"></i></div>
                    <p class="weui-tabbar__label">Discover</p>
                </div>
                <div v-el:me
					v-touch:tap="go('/me')"
					v-touch:press="go('/me')"
					class="weui-tabbar__item"
					v-bind:class="{ 'weui-bar__item_on' : path == 'me' }">
                    <div class="weui-tabbar__icon"><i class="i-me"></i></div>
                    <p class="weui-tabbar__label">Me</p>
                </div>
            </div>
        </div>
	</div>
</template>

<style lang="scss">
	@import "../sass/variable.scss";
    .tabbar {
		left: 0;
		bottom: 0;
		width: 100%;
		display: block;
		overflow: hidden;
		position: absolute;
		z-index: 2;
    }
	.weui-tabbar__icon {
		position: relative;
		i {
			position: absolute;
			background-size: 100% 100%;
			background-repeat: no-repeat;
			top: 50%;
			left: 50%;
			transform: translate3d(-50%, -50%, 0) scale(0.5);
			&.i-chats {
				width: 50px;
				height: 46px;
				background-image: url('../img/tabbar/tabbar_chats@2x.png');
				.weui-bar__item_on & {
					background-image: url('../img/tabbar/tabbar_chatsHL@2x.png');
				}
			}
			&.i-contacts {
				width: 54px;
				height: 46px;
				background-image: url('../img/tabbar/tabbar_contacts@2x.png');
				.weui-bar__item_on & {
					background-image: url('../img/tabbar/tabbar_contactsHL@2x.png');
				}
			}
			&.i-discover {
				width: 46px;
				height: 46px;
				background-image: url('../img/tabbar/tabbar_discover@2x.png');
				.weui-bar__item_on & {
					background-image: url('../img/tabbar/tabbar_discoverHL@2x.png');
				}
			}
			&.i-me {
				width: 46px;
				height: 46px;
				background-image: url('../img/tabbar/tabbar_me@2x.png');
				.weui-bar__item_on & {
					background-image: url('../img/tabbar/tabbar_meHL@2x.png');
				}
			}
		}
	}
</style>
