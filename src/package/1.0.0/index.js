// weui
import 'weui';

// vue系列
import Vue from 'vue';
import VueTouch from 'vue-touch';
import VuePseudo from 'vue-pseudo';
import VueRouter from 'vue-router';

// 注册插件
Vue.use(VueTouch);
Vue.use(VuePseudo);
Vue.use(VueRouter);

// 组件
import app from './components/app.vue';
import test from './components/test.vue';

// 配置路由
let router = new VueRouter();

// 注册组件
router.map({
    '/chats' : {
		component : test,
	},
    '/chats/*view' : {
		component : test,
	},
	'/contacts' : {
		component : test,
	},
    '/contacts/*view' : {
		component : test,
	},
	'/discover' : {
		component : test,
	},
    '/discover/*view' : {
		component : test,
	},
	'/me' : {
		component : test,
	},
    '/me/*view' : {
		component : test,
	},
    '/error' : {
		component : test,
	},
});

router.redirect({
    '/' : '/chats',
    '*' : '/error',
});

router.start(app, 'app');

if (process.env.NODE_ENV !== 'production') {
    window.router = router;
}
