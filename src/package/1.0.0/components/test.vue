<script>
import tabbar from './tabbar.vue';
import topbar from './topbar.vue';
import scrollView from './scroll-view.vue';

let alertDialogCounter = 0;
let confirmDialogCounter = [0, 0];

function getChangelog ( packages ) {
    let result = {};
    for (let version in packages) {
        let time = parseInt(packages[version].timestamp);
        let moment = new Date(time);
        if (time) {
            let yyyy = moment.getFullYear();
            let mm = ('0' + moment.getMonth() + 1).slice(-2);
            let dd = ('0' + moment.getDate()).slice(-2);
            result[`${ version } - ${ yyyy }/${ mm }/${ dd }`] = packages[version].changelog[app.language];
        } else {
            result[`${ version } - ${ moment }`] = packages[version].changelog[app.language];
        }
    }
    // console.log(result);
    return result;
}

export default {
    data () {
		return {
            title : 'test',
            tabbarHeight : '',
            topbarHeight : '',
            version : app.version,
            language : app.language,
            changelog : getChangelog(sdk.packages),
            splashStatus : 'splash-empty',
            selectedActionSheet : '',
            selectedAlertDialog : '',
            selectedConfirmDialog : '',
		};
	},
	components : {
        tabbar,
		topbar,
		scrollView,
	},
    methods : {
        go ( path ) {
			this.$router.go({
                path,
                append : true,
            });
		},
        reload () {
            this.$root.display = false;
            app.reload();
        },
        restart () {
            this.$root.display = false;
            app.restart();
        },
        restore () {
            localStorage.clear();
            sessionStorage.clear();
            location.replace('http://web.me.yy.com/s/sdk/test.html');
        },
        changeSplash () {
            let files = this.$els.splash.files;
            let file = files[0];
            if (file) {
                this.splashStatus = 'splash-loading';
                let reader = new FileReader;
                reader.onerror = () => {
                    this.splashStatus = 'splash-error';
                };
                reader.onload = () => {
                    let img = new Image;
                    img.onerror = () => {
                        this.splashStatus = 'splash-error';
                    };
                    img.onload = () => {
                        this.splashStatus = 'splash-success';
                        app.splash = reader.result;
                    };
                    img.src = reader.result;
                };
                reader.readAsDataURL(file);
            } else {
                this.splashStatus = 'splash-empty';
            }
        },
        changeVersion () {
            app.version = this.version = this.$els.version.value;
        },
        showSuccessToast () {
            this.$root.showSuccessToast('Success');
        },
        showLoadingToast () {
            this.$root.showLoadingToast('Loading');
        },
        showAlertDialog () {
            this.$root.showAlertDialog('Custom dialog content is used to display status, information, solution etc.', ['OK'], () => {
                alertDialogCounter++;
                this.selectedAlertDialog = `OK:${ alertDialogCounter }`;
            });
        },
        showConfirmDialog () {
            this.$root.showConfirmDialog('Title', 'Custom dialog content is used to display status, information, solution etc.', ['Cancel', 'OK'], ( index ) => {
                confirmDialogCounter[index]++;
                this.selectedConfirmDialog = `Cancel:${ confirmDialogCounter[0] }, OK:${ confirmDialogCounter[1] }`;
            });
        },
        showActionSheet () {
            this.$root.showActionSheet('Cancel', ['optionA', 'optionB', 'optionC'], ( value, index ) => {
                this.selectedActionSheet = `${ index }:${ value }`;
            });
        },
    }
};
</script>

<template>
    <div v-bind:style="{ 'padding-top' : topbarHeight, 'padding-bottom' : tabbarHeight }">
        <topbar v-bind:title.once="title" v-bind:height.sync="topbarHeight"></topbar>
        <scroll-view>
            <div class="page-logo">logo</div>
            <div class="page-content">
                <div class="weui-cells__title">API Test</div>
                <div class="weui-cells">
                    <div class="weui-cell weui-cell_access" v-touch:tap="showSuccessToast">
                        <div class="weui-cell__bd">
                            <p>Toatst - Success</p>
                        </div>
                        <div class="weui-cell__ft"></div>
                    </div>
                    <div class="weui-cell weui-cell_access" v-touch:tap="showLoadingToast">
                        <div class="weui-cell__bd">
                            <p>Toatst - Loading</p>
                        </div>
                        <div class="weui-cell__ft"></div>
                    </div>
                    <div class="weui-cell weui-cell_access" v-touch:tap="showAlertDialog">
                        <div class="weui-cell__bd">
                            <p>Dialog - Alert</p>
                        </div>
                        <div class="weui-cell__ft">{{ selectedAlertDialog }}</div>
                    </div>
                    <div class="weui-cell weui-cell_access" v-touch:tap="showConfirmDialog">
                        <div class="weui-cell__bd">
                            <p>Dialog - Confirm</p>
                        </div>
                        <div class="weui-cell__ft">{{ selectedConfirmDialog }}</div>
                    </div>
                    <div class="weui-cell weui-cell_access" v-touch:tap="showActionSheet">
                        <div class="weui-cell__bd">
                            <p>Action Sheet</p>
                        </div>
                        <div class="weui-cell__ft">{{ selectedActionSheet }}</div>
                    </div>
                </div>
                <div class="weui-cells__title">Language</div>
                <div class="weui-cells">
                    <div class="weui-cell weui-cell_access" v-touch:tap="go('select-language')">
                        <div class="weui-cell__bd">
                            <p>Select Language</p>
                        </div>
                        <div class="weui-cell__ft">{{ language }}</div>
                    </div>
                </div>
                <div class="weui-cells__title">Splash</div>
                <div class="weui-cells" v-pseudo:active="'is-active'">
                    <div class="weui-cell weui-cell_access">
                        <div class="weui-cell__bd">
                            <p>Select Splash</p>
                        </div>
                        <div class="weui-cell__ft {{ splashStatus }}"></div>
                    </div>
                    <div class="page-hide">
                        <input type="file" v-el:splash v-on:change="changeSplash">
                    </div>
                </div>
                <div class="weui-cells__title">Restart</div>
                <div class="weui-cells">
                    <div class="weui-cell weui-cell_access" v-touch:tap="reload">
                        <div class="weui-cell__bd">
                            <p>Reload</p>
                        </div>
                    </div>
                    <div class="weui-cell weui-cell_access" v-touch:tap="restart">
                        <div class="weui-cell__bd">
                            <p>Clear storage and Restart</p>
                        </div>
                    </div>
                    <div class="weui-cell weui-cell_access" v-touch:tap="restore">
                        <div class="weui-cell__bd">
                            <p>Clear all storage and Restore</p>
                        </div>
                    </div>
                </div>
                <div class="weui-cells__title">Version</div>
                <div class="weui-cells">
                    <div class="weui-cell weui-cell_access" v-touch:tap="go('select-version')">
                        <div class="weui-cell__bd">
                            <p>Select Version</p>
                        </div>
                        <div class="weui-cell__ft">{{ version }}</div>
                    </div>
                </div>
                <div class="weui-panel weui-panel_access">
                    <div class="weui-panel__hd">Change Log</div>
                    <div class="weui-panel__bd">
                        <div class="weui-media-box weui-media-box_text" v-for="(version, logs) in changelog">
                            <h4 class="weui-media-box__title">{{ version }}</h4>
                            <p class="weui-media-box__desc" v-for="detail in logs">- {{ detail }}</p>
                        </div>
                    </div>
                </div>
                <div class="page-blank"></div>
            </div>
        </scroll-view>
        <tabbar v-bind:height.sync="tabbarHeight"></tabbar>
    </div>
</template>

<style lang="scss">
    @import "../sass/variable.scss";
    .page-logo {
        position: absolute;
        top: -48px - 30;
        left: 0;
        width: 100%;
        text-align: center;
        font-size: 18px;
        color: #4a1313;
        height: 48px;
        line-height: 48px;
    }
    .page-content {
        overflow: hidden;
    }
    .page-blank {
        height: 45px;
    }
    .page-hide {
        // &,
        // input,
        // select {
        input {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            padding: 0;
            border: 0;
        }
    }
    .weui-cell__ft {
        &::before {
            content: "";
            display: inline-block;
            // vertical-align: middle;
            font: normal normal normal 14px/1 "weui";
            font-size: inherit;
            text-rendering: auto;
            -webkit-font-smoothing: antialiased;
            vertical-align: top;
            margin-top: 3px;
        }
        &.splash-loading {
            color: #10AEFF;
            &::before {
                content: "\EA09";
            }
        }
        &.splash-error {
            color: #F43530;
            &::before {
                content: "\EA0B";
            }
        }
        &.splash-success {
            color: #09BB07;
            &::before {
                content: "\EA06";
            }
        }
        &.splash-empty {}
    }
    .weui-cells {
        &.is-active {
            background-color: #ECECEC;
        }
    }
    // .weui-media-box__desc {
    //     span {
    //         color: #999;
    //         font-size: 12px;
    //     }
    // }
</style>
