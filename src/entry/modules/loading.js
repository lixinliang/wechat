const splash = app.splash;
const installed = !!sdk.store('installed');

const loading = document.createElement('div');

loading.innerHTML = `
    <div class="sdk-loading__splash" style="background-image:url(${ splash })"></div>
    <div class="sdk-loading__message">
        <div class="sdk-loading__list">
        </div>
    </div>
    <div class="sdk-loading__progress">
        <div class="sdk-loading__subline"></div>
        <div class="sdk-loading__icon"></div>
        <div class="sdk-loading__cover"></div>
        <div class="sdk-loading__status"></div>
    </div>
`;

loading.classList.add('sdk-loading');

if (process.env.NODE_ENV !== 'production') {
    loading.classList.add('is-dev');
}

if (!installed) {
    loading.classList.add('is-uninstalled');
}

document.body.appendChild(loading);

requestAnimationFrame(() => {
    loading.classList.add('is-active');
});

let taskList = [];
let taskSeed = 0;
let taskActived = false;
let addTask = function ( fn ) {
    taskList.push(fn);
    startTask();
};
let startTask = function () {
    if (taskActived) {
        // noop
    } else {
        taskActived = true;
        taskSeed = setInterval(execTask, 150);
    }
};
let execTask = function () {
    if (taskList.length) {
        taskList.shift()();
    } else {
        taskActived = false;
        clearInterval(taskSeed);
    }
};

let icon = loading.querySelector('.sdk-loading__icon');
function show ( url ) {
    let img = new Image;
    img.onload = () => {
        icon.style['background-image'] = `url(${ url })`;
    };
    img.src = url;
}

let list = loading.querySelector('.sdk-loading__list');
function report ( message ) {
    addTask(() => {
        let item = document.createElement('div');
        item.classList.add('sdk-loading__item');
        item.innerHTML = message;
        list.appendChild(item);
    });
}

let hided = false;
function hide () {
    addTask(() => {
        if (hided) {
            // noop
        } else {
            hided = true;
            let removed = false;
            loading.addEventListener('transitionend', () => {
                if (removed) {
                    // noop
                } else {
                    removed = true;
                    document.body.removeChild(loading);
                    if (!installed) {
                        sdk.store('installed', 1);
                    }
                }
            }, false);
            loading.classList.remove('is-active');
        }
    });
}

sdk.loading = {
    show,
    hide,
    report,
};
