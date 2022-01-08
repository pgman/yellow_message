/**
 * MsgDlgController(静的クラス)
 */
class MsgDlgController {
    static init() {
    	MsgDlgModel.init();
    	MsgDlgView.init();
    	MsgDlgController.attachEvents();
    }
    static attachEvents() { 
        $('#msgdlg').dialog({
            buttons: {
                OK: () => {
                    const error = MsgDlgModel.errorCheck();
                    if(error) {
                        alert(error);
                        return;
                    }
                    if(MsgDlgModel.okFunc) {
                        MsgDlgModel.okFunc(MsgDlgModel.message);
                    }
                    $('#msgdlg').dialog('close');
                },
                Cancel: () => {
                    if(MsgDlgModel.cancelFunc) {
                        MsgDlgModel.cancelFunc();
                    }
                    $('#msgdlg').dialog('close');
                }
            },
        });

        $('#msgdlg-message-name').change(MsgDlgModel.updateName);

        $('#msgdlg-index-canvas').contextmenu(() => false);
        
        $('#msgdlg-index-canvas').click(e => {
            MsgDlgModel.clickIndexCanvas(e);
            MsgDlgView.update();
        });

        $('[name="msgdlg-click-type"]').change(e => {
            const type = e.target.id.indexOf('block') >= 0 ? 'block' : 'eye';
            MsgDlgModel.clickType = type;
        });

        $('#msgdlg-shuffle-order-button').click(e => {
            MsgDlgModel.shuffleOrder(e);
            MsgDlgView.update();
        });

        $('#msgdlg-block-canvas').contextmenu(e => false);

        $('#msgdlg-block-canvas').click(e => {
        	MsgDlgModel.clickBlockCanvas(e);
            MsgDlgView.update();
        });      

        $('#msgdlg-block-order-sortable').sortable({ 
            scroll: false,
            update: () => {
                MsgDlgModel.updateOrder();
                MsgDlgView.update();
            },
        }); 
    }
    static open(message, names, numImg, blockImg, eyeImg, okFunc, cancelFunc) {
    	MsgDlgModel.message = Util.copy(message);
        MsgDlgModel.clickType = 'block';
        MsgDlgModel.names = names;
        MsgDlgModel.index = 0; 
        MsgDlgModel.numImg = numImg;
        MsgDlgModel.blockImg = blockImg; 
        MsgDlgModel.eyeImg = eyeImg; 
        MsgDlgModel.okFunc = okFunc;
        MsgDlgModel.cancelFunc = cancelFunc;
        MsgDlgView.hideCloseButton();
        MsgDlgView.updateName();    
        MsgDlgView.update();
        $('#msgdlg').dialog('open');  
    }
}
