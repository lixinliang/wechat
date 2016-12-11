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
    // app.version = '1.0.0';
    app.version = '0';
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

if (!app.splash) {
    app.splash = 'data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABkAAD/4QMxaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzA2NyA3OS4xNTc3NDcsIDIwMTUvMDMvMzAtMjM6NDA6NDIgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkUyRUQ5REZBQUVEMTExRTZBMEU1QTFGNkIxRUUzMTA0IiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkUyRUQ5REY5QUVEMTExRTZBMEU1QTFGNkIxRUUzMTA0IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE0IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MzE4NjcwNjVGMzIyMTFFNTkzRjJDQzZCMjAxOTRBNjMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MzE4NjcwNjZGMzIyMTFFNTkzRjJDQzZCMjAxOTRBNjMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAgICAgICAgICAgIDAwMDAwMDAwMDAQEBAQEBAQIBAQICAgECAgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwP/wAARCAAEAAQDAREAAhEBAxEB/8QASgABAAAAAAAAAAAAAAAAAAAACgEBAAAAAAAAAAAAAAAAAAAAABABAAAAAAAAAAAAAAAAAAAAABEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AfwD/2Q==';
}

// language
let language = sdk.store('app-language');
Object.defineProperty(app, 'language', {
    get () {
        return language;
    },
    set ( value ) {
        return sdk.store('app-language', (language = value));
    },
});

if (!app.language) {
    app.language = /^zh/i.test(navigator.language) ? 'zh' : 'en';
}

// reload
app.reload = function () {
    // document.body.innerHTML = `<div class="sdk-loading is-active is-dev"><div class="sdk-loading__splash" style="background-image:url(${ splash })"></div></div>`;
    location.reload(true);
};

// restart
app.restart = function () {
    sdk.store.remove('packages')
    app.reload();
};
