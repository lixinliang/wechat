import './sass/sdk.scss';

import './modules/prevent.js';

import './modules/namespace.js';

import './modules/loading.js';

import './modules/log.js';

import './modules/referrer.js';

import packages from './modules/packages.js';

packages.onerror = function () {

    sdk.loading.report('进入紧急重启方案...');

};

let fragment = document.createDocumentFragment();

packages.onload = function ( packages ) {

    sdk.packages = packages;

    let alias = {};
    for (let version in packages) {
        alias[version] = packages[version].path;
    }
    Define.alias(alias);

    sdk.loading.report('正在对版本序列化处理...');

    for (let version in packages) {
        let temp = version.split('.');
        let major = +temp[0];
        let minor = +temp[1];
        let patch = +temp[2];
        if ((major || major == major) && (minor || minor == minor) && (patch || patch == patch)) {
            let patchDom = document.createElement('patch');
            patchDom.setAttribute('version', version);
            let minorDom = fragment.querySelector(`minor[version="${ major }.${ minor }"]`);
            if (minorDom) {
                minorDom.appendChild(patchDom);
            } else {
                minorDom = document.createElement('minor');
                minorDom.setAttribute('version', `${ major }.${ minor }`);
                let majorDom = fragment.querySelector(`major[version="${ major }"]`);
                if (majorDom) {
                    majorDom.appendChild(minorDom);
                    minorDom.appendChild(patchDom);
                } else {
                    majorDom = document.createElement('major');
                    majorDom.setAttribute('version', `${ major }`);
                    fragment.appendChild(majorDom);
                    majorDom.appendChild(minorDom);
                    minorDom.appendChild(patchDom);
                }
            }
        }
    }

    sdk.loading.report('版本序列号处理成功...');
    sdk.loading.report('正在匹配版本号...');

    let current = fragment.querySelector(`[version="${ app.version }"]`);

    if (current) {
        sdk.loading.report('匹配版本号成功...');
    } else {
        sdk.log.error('version-match-fail', `"${ app.version }" not in ${ JSON.stringify(sdk.packages) }`);
        sdk.loading.report('匹配版本号失败...');
        sdk.loading.report('自动匹配最新版本...');
        let candidate = fragment.querySelectorAll('patch');
        current = candidate[candidate.length - 1];
        app.version = current.getAttribute('version');
    }

    sdk.loading.report(`当前版本号: ${ app.version }`);

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(main, 0);
    } else {
        document.addEventListener('DOMContentLoaded', main, false);
    }

}

packages.load('package.json');


function main () {

    sdk.loading.report('正在载入版本包...');

    if (process.env.NODE_ENV === 'production') {
        Define([app.version], ( entry ) => {
            if (typeof entry == 'function') {
                entry();
                sdk.loading.hide();
                sdk.log.occur('version-import-success');
            } else {
                sdk.log.error('version-import-fail', `"${ app.version }" return ${ entry }`);
                sdk.loading.report('该版本包载入失败...');
                sdk.loading.report('正在回滚版本...');
                let current = fragment.querySelector(`[version="${ app.version }"]`);
                let candidate = fragment.querySelectorAll('patch');
                for (let i = 0; i < candidate.length; i++) {
                    if (candidate[i] === current) {
                        if (i == 0) {
                            sdk.loading.report('版本回滚失败...');
                            sdk.loading.report('进入紧急重启方案...');
                        } else {
                            app.version = candidate[i - 1].getAttribute('version');
                            sdk.loading.report(`当前版本号: ${ app.version }`);
                            main();
                            break;
                        }
                    }
                }
            }
        });
    } else {
        sdk.loading.report('正在进入开发通道...');
        const url = sdk.packages[app.version].path;
        let link = document.createElement('link');
        let script = document.createElement('script');
        script.src = url;
        script.onload = () => {
            document.head.removeChild(script);
            sdk.loading.hide();
        };
        link.rel = 'stylesheet';
        link.href = url.replace(/\.js$/, '.css');
        document.head.appendChild(link);
        document.head.appendChild(script);
    }

}

// Checking for Update...
// Your software is up to date.
//
// 正在检查更新...
// 您的软件是最新版本。
