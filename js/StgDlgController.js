/**
 * StgDlgController(静的クラス)
 */
class StgDlgController {
    static init() {
    	StgDlgModel.init();
    	StgDlgView.init();
    	StgDlgController.attachEvents();
    }
    static attachEvents() { 
        $('#stgdlg').dialog({
            buttons: {
                OK: () => {
                    const error = StgDlgModel.errorCheck();
                    if(error) {
                        alert(error);
                        return;
                    }
                    if(StgDlgModel.okFunc) {
                        StgDlgModel.okFunc(StgDlgModel.settings);
                    }
                    $('#stgdlg').dialog('close');
                },
                Cancel: () => {
                    if(StgDlgModel.cancelFunc) {
                        StgDlgModel.cancelFunc();
                    }
                    $('#stgdlg').dialog('close');
                }
            }
        });
        $('#stgdlg-screen-size-select, #stgdlg-image-rendering-select').selectmenu({
            change: () => {
                StgDlgModel.update();
                StgDlgView.update();
            }
        });
    	$('#stgdlg-bgm-volume-range, #stgdlg-se-volume-range, #stgdlg-fps-number').change(() => {
            StgDlgModel.update();
            StgDlgView.update();
        });
    }
    static open(settings, okFunc = null, cancelFunc = null) {
        StgDlgModel.settings = Util.copy(settings);
        StgDlgModel.okFunc = okFunc;
        StgDlgModel.cancelFunc = cancelFunc;
        StgDlgView.update();
    	$('#stgdlg').dialog('open');  
    }
}
