// packages
let packages = sdk.store('packages');

export default {
    load ( url ) {
        if (!sdk.referrer) {
            return;
        }
        let onload = this.onload || function(){};
        let onerror = this.onerror || function(){};

        // get packages from cache preferentially
        // if dev mode, always from network
        if (process.env.NODE_ENV === 'production' && packages) {
            sdk.log.occur('packages-cached');
            sdk.loading.report('读取缓存的版本列表...');
            onload(packages);
        } else {
            sdk.loading.report('正在请求版本列表...');
            let xhr = new XMLHttpRequest;
            xhr.open('GET', url, true);
            xhr.onerror = function ( err ) {
                // probably off line or server crashed
                sdk.log.error('packages-request-fail', err);
                sdk.loading.report('版本列表请求失败...');
                onerror();
            };
            xhr.onreadystatechange = () => {
                if (xhr.status == 200 && xhr.readyState == 4) {
                    sdk.loading.report('版本列表请求成功...');
                    sdk.loading.report('正在解析版本列表...');
                    let packages;
                    try {
                        packages = JSON.parse(xhr.responseText);
                        sdk.log.occur('packages-request');
                        sdk.loading.report('版本列表解析成功...');
                    } catch ( err ) {
                        sdk.log.error('packages-parse-fail', err);
                        sdk.loading.report('版本列表解析失败...');
                        onerror();
                    }
                    try {
                        onload(sdk.store('packages', packages));
                    } catch ( err ) {
                        sdk.log.error('packages-onload-error', err);
                        sdk.loading.report('发生未知错误...');
                        onerror();
                    }
                }
            };
            xhr.send();
        }
    },
};
