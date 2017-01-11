// referrer
let referrer = sessionStorage.getItem('referrer');

if (referrer) {
    try {
        referrer = JSON.parse(referrer);
    } catch ( err ) {
        sdk.log.error('referrer-session-fail', err);
        referrer = null;
    }
}

if (referrer) {
    // web-app restart, get information from sessionStorage
    sdk.log.occur('referrer-restart');
} else {
    // web-app first launch, get information from window.name
    // or back to app from homepage
    sdk.log.occur('referrer-launch');
    if (window.name.length > 1) {
        sdk.loading.report('正在读取路由信息...');
        try {
            let temp = decodeURIComponent(window.name.replace(/^micro-app=/, ''));
            referrer = JSON.parse(temp);
            sdk.loading.report('路由信息读取成功...');
            sessionStorage.setItem('referrer', temp);
            sdk.loading.report('正在获取应用图标...');
            if (referrer.query) {
                app.name = referrer.query.name;
                app.icon = referrer.query.icon;
                if (referrer.query.icon) {
                    sdk.loading.show(referrer.query.icon);
                    sdk.loading.report('应用图标获取成功...');
                }
            }
            window.name = '';
        } catch ( err ) {
            // parse fail, it must be something wrongs
            sdk.log.error('referrer-parse-fail', err);
            sdk.loading.report('路由信息解析失败...');
            sdk.loading.report('进入紧急重启方案...');
        }
    } else {
        // missing information, develop in browser or something wrongs
        sdk.log.occur('referrer-empty');
        sdk.loading.report('路由信息读取失败...');
        sdk.loading.report('进入紧急重启方案...');
    }
}

sdk.referrer = referrer;
