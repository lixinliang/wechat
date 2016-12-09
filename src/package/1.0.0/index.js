// weui
import 'weui';

// vue系列
import Vue from 'vue';
import VueTouch from 'vue-touch';
import VueRouter from 'vue-router';
import VuePseudo from './modules/vue-pseudo.js';

// 注册插件
Vue.use(VueTouch);
Vue.use(VueRouter);
Vue.use(VuePseudo);

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
	'/contacts' : {
		component : test,
	},
	'/discover' : {
		component : test,
	},
	'/me' : {
		component : test,
	},
    '/error' : {
		component : test,
	},
    '/test' : {
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
