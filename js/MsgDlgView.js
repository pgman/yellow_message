/**
 * MsgDlgView(静的クラス)
 */
class MsgDlgView {
	// 初期化
    static init() {
        $('body').append(`
            <div id="msgdlg" title="Message">
                Name&nbsp;<input id="msgdlg-message-name" value="">
                <br>
                <canvas id="msgdlg-index-canvas" width="436" height="58"></canvas>
                <hr>
                <div>
                    <label for="msgdlg-block-radio">Block</label>
                    <input id="msgdlg-block-radio" type="radio" name="msgdlg-click-type">
                    <label for="msgdlg-eye-radio">Eye</label>
                    <input id="msgdlg-eye-radio" type="radio" name="msgdlg-click-type">
                    
                </div>
                <div id="message-description">
                    The eye can only be defined on the 2nd and 3rd lines.<span id="message-order-title">order</span>
                </div>
                <canvas id="msgdlg-block-canvas" width="96" height="96"></canvas>
                <ul id="msgdlg-block-order-sortable"></ul>
            </div>
        `);

    	$('#msgdlg').dialog({
            autoOpen: false,
            modal: true,
            closeOnEscape: false,
            width: 510,
            height: 720,
        });
        $('[name="msgdlg-click-type"]').checkboxradio();
    }
    static updateClickType() {
        const type = MsgDlgModel.clickType;
        const unselectedType = type === 'block' ? 'eye' : 'block';
        $(`#msgdlg-${type}-radio`).prop('checked', true).checkboxradio('refresh');
        $(`#msgdlg-${unselectedType}-radio`).prop('checked', false).checkboxradio('refresh');
    }
    static updateIndexCanvas() {
        const data = MsgDlgModel.message.data;

        const ctx = $('#msgdlg-index-canvas')[0].getContext('2d');
        ctx.save();
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        const w = 10;
        const int = 4;
        
        // draw frame
        ctx.fillStyle = 'rgb(0, 206, 209)';
        ctx.fillRect((w * 5 + int) * MsgDlgModel.index, 0, w * 5 + 2 * int, w * 5 + 2 * int);
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fillRect(int + (w * 5 + int) * MsgDlgModel.index, int, w * 5, w * 5);        

        // draw blocks
        ctx.fillStyle = 'rgb(255, 160, 0)';        
        data.forEach((d, i) => {
            d.blocks.forEach(bidx => {
                const x = (bidx % 5) * w;
                const y = parseInt(bidx / 5) * w;
                ctx.fillRect(int + (w * 5 + int) * i + x, int + y, w, w);
            });
        });

        // draw eyes
        ctx.fillStyle = 'rgb(255, 0, 0)';  
        data.forEach((d, i) => {
            if(d.eye >= 0) {
                const x = (d.eye % 5) * w;
                const y = parseInt(d.eye / 5) * w;
                ctx.fillRect(int + (w * 5 + int) * i + x + (w - 4) / 2, int + y + (w - 4) / 2, 4, 4);
            }
        });        
        ctx.restore();
    }
    static hideCloseButton() {
        $('.ui-dialog-titlebar-close').hide();
    }
    static updateName() {
        $('#msgdlg-message-name').val(MsgDlgModel.message.name);
    }
    static update() {
        MsgDlgView.updateClickType();
        MsgDlgView.drawBlockCanvas();
        MsgDlgView.updateOrder();
        MsgDlgView.updateIndexCanvas();
    }
    // 並び順を更新
    static updateOrder() {
        const blocks = MsgDlgModel.getCurrentData().blocks;

        $('#msgdlg-block-order-sortable > li').remove();

        blocks.forEach(idx => {
            const x = idx % 5;
            const y = parseInt(idx / 5);
            $('#msgdlg-block-order-sortable').append(`<li class="ui-state-default">${y + 1} - ${x + 1}</li>`);
        });    
        $('#msgdlg-block-order-sortable').sortable('refresh');                
    }
    // ブロックキャンバスを描画
    static drawBlockCanvas() {
        const ctx = $('#msgdlg-block-canvas')[0].getContext('2d');
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.save();
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        // draw number
        for(let i = 0; i < 5; i += 1) {
            ctx.drawImage(MsgDlgModel.numImg, (i + 1) * 8, 0, 8, 8, 4, 4 + 16 * (i + 1), 8, 8);
            ctx.drawImage(MsgDlgModel.numImg, (i + 1) * 8, 0, 8, 8, 4 + 16 * (i + 1), 4, 8, 8);
        }
        // draw block
        const blocks = MsgDlgModel.getCurrentData().blocks;
        blocks.forEach(idx => {
            const x = idx % 5;
            const y = parseInt(idx / 5);
            const canvas = Util.createBlockCanvas(idx, blocks, MsgDlgModel.blockImg);
            ctx.drawImage(canvas, 16 * (x + 1), 16 * (y + 1));
        });        
        // draw eye
        const eye = MsgDlgModel.getCurrentData().eye;
        if(eye >= 0) {
            let direction = MsgDlgModel.index % 2 ? 'right' : 'left';
            const eyeInfo = ImgDefine.EYE_IMAGES[direction]['eye2'];
            const x = eye % 5;
            const y = parseInt(eye / 5);
            ctx.drawImage(MsgDlgModel.eyeImg, 
                eyeInfo.imgX, eyeInfo.imgY, eyeInfo.imgWidth, eyeInfo.imgHeight,
                16 * (x + 1) + eyeInfo.diffX, 16 * (y + 1) + eyeInfo.diffY, eyeInfo.imgWidth, eyeInfo.imgHeight);
        }       

        // draw number
        blocks.forEach((idx, i) => {
            const x = idx % 5;
            const y = parseInt(idx / 5);
            ctx.drawImage(Model.blockNumImg,
                0, 12 * i, 12, 12,
                18 + 16 * x, 18 + 16 * y, 12, 12);
        });     
        ctx.restore();
    }
}