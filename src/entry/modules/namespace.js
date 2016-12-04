window.sdk = {};

window.app = {};

sdk.store = microStorage('sdk');

// version
let version = sdk.store('app-version');
Object.defineProperty(app, 'version', {
    get () {
        return version;
    },
    set ( value ) {
        return sdk.store('app-version', (version = value));
    },
});

if (!app.version) {
    app.version = '1.0.0';
}

// splash
let splash = sdk.store('app-splash');
Object.defineProperty(app, 'splash', {
    get () {
        return splash;
    },
    set ( value ) {
        return sdk.store('app-splash', (splash = value));
    },
});

// language
app.language = /^zh/i.test(navigator.language) ? 'zh' : 'en';

// reload
app.reload = function () {
    let elem = sdk.loading.elem;
    elem.style['background-image'] = `url(${ app.splash })`;
    elem.classList.add('is-active');
    location.reload(true);
};

// restart
app.restart = function () {
    sdk.store.remove('packages')
    app.reload();
};
