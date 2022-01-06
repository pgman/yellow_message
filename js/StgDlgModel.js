/**
 * StgDlgModel(静的クラス)
 */
class StgDlgModel {
	// 初期化
    static init() {  
    	StgDlgModel.settings = null;
    	StgDlgModel.okFunc = null;
        StgDlgModel.cancelFunc = null;
    }
    static update() {
    	StgDlgModel.settings.screenSize = parseInt($('#stgdlg-screen-size-select').val(), 10);
        StgDlgModel.settings.imageRendering = $('#stgdlg-image-rendering-select').val();
        StgDlgModel.settings.bgmVolume = parseInt($('#stgdlg-bgm-volume-range').val(), 10);
        StgDlgModel.settings.seVolume = parseInt($('#stgdlg-se-volume-range').val(), 10);
        StgDlgModel.settings.fps = parseFloat($('#stgdlg-fps-number').val());
    }
    static errorCheck() {
        if(StgDlgModel.settings.fps < Define.MIN_FPS
        || Define.MAX_FPS < StgDlgModel.settings.fps) {
            return `FPS must be between ${Define.MIN_FPS} and ${Define.MAX_FPS}`;
        } else {
            return ``;
        }
    }
}