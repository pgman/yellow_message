/**
 * MsgDlgModel(静的クラス)
 */
class MsgDlgModel {
	// 初期化
    static init() {
    	MsgDlgModel.message = null;
        MsgDlgModel.clickType = 'block';
        MsgDlgModel.index = -1;
        MsgDlgModel.numImg = null;
        MsgDlgModel.blockImg = null;
        MsgDlgModel.eyeImg = null;
        MsgDlgModel.okFunc = null;
        MsgDlgModel.cancelFunc = null;
    }
    static getCurrentData() {
    	return MsgDlgModel.message.data[MsgDlgModel.index];
    }
    static updateName() {
        MsgDlgModel.message.name = $('#msgdlg-message-name').val();
    }
    static updateOrder() {
    	const $blocks = $('#msgdlg-block-order-sortable > li');
    	const blocks = [];
    	for(let i = 0; i < $blocks.length; i += 1) {
    		const text = $blocks[i].innerText;
    		const y = parseInt(text[0]) - 1;
    		const x = parseInt(text[4]) - 1;
    		const idx = x + y * 5;
    		blocks.push(idx);
    	}
    	const data = MsgDlgModel.getCurrentData();
    	data.blocks = blocks;
    }
    static clickIndexCanvas(e) {
    	const x = e.offsetX,
            y = e.offsetY;

        const w = 10;
        const int = 4;
        let minDist = 100000;
        let index = -1;

        for(let i = 0; i < 8; i += 1) {
        	const xi = int + (w * 5 + int) * i + (w * 5) / 2;
        	const dist = Math.abs(x - xi);
        	if(dist < minDist) {
        		minDist = dist;
        		index = i;
        	}
        }
        MsgDlgModel.index = index;
    }
    static clickBlockCanvas(e) {
        const type = MsgDlgModel.clickType;
        if(type === 'block') {
            MsgDlgModel.updateBlockCanvas(e);
        } else {
            MsgDlgModel.updateEyeCanvas(e);
        }        
    }
    static updateEyeCanvas(e) {
    	const x = e.offsetX,
            y = e.offsetY;
        const w = parseInt($('#msgdlg-block-canvas').css('width'));
        const rate = w / (16 * (5 + 1));
        const stepW = 16 * rate;
        let xi = parseInt(x / stepW) - 1,
            yi = parseInt(y / stepW) - 1;
        if(xi > 4) { xi = 4; }
        if(yi > 4) { yi = 4; }
        if(xi < 0 || yi < 1 || yi > 2) { return; }

        const data = MsgDlgModel.getCurrentData();
        const eye = yi * 5 + xi;
        if(data.eye === eye) {
        	data.eye = -1;
        } else {
        	data.eye = eye;
        }
    }
    static updateBlockCanvas(e) {
        const x = e.offsetX,
            y = e.offsetY;
        const w = parseInt($('#msgdlg-block-canvas').css('width'));
        const rate = w / (16 * (5 + 1));
        const stepW = 16 * rate;
        let xi = parseInt(x / stepW) - 1,
            yi = parseInt(y / stepW) - 1;
        if(xi > 4) { xi = 4; }
        if(yi > 4) { yi = 4; }
        if(xi < 0 || yi < 0) { return false; }

        const data = MsgDlgModel.getCurrentData();
        const blocks = data.blocks;
        const i = yi * 5 + xi;
        const bIndex = blocks.indexOf(i);
        if(bIndex >= 0) {
        	blocks.splice(bIndex, 1); 
        } else if(bIndex < 0) {
        	blocks.push(i);
        }        
        return false;
    }
    static errorCheck() {
    	
    	// Name is not defined
    	if(MsgDlgModel.message.name === '') {
    		return 'Name is not defined';
    	}

        if(!MsgDlgModel.names.every(e => e !== MsgDlgModel.message.name)) {
            return 'Already defined in that name.';
        }

    	// Eye is not defined
    	// Eye is only defined
    	for(let i = 0; i < 8; i += 1) {
    		const blocks = MsgDlgModel.message.data[i].blocks;
    		const eye = MsgDlgModel.message.data[i].eye;
    		const ordinal = Util.ordinal(i + 1);
    		if(blocks.length !== 0 && eye < 0) {    			
    			return `${ordinal} character:\nEye is not defined.`
    		} else if(blocks.length === 0 && eye >= 0) {
    			return `${ordinal} character:\nEye is only defined.`
    		}
    	}

    	// Block is not defined
    	if(MsgDlgModel.message.data.every(d => d.blocks.length === 0)) {
    		return `Block is not defined.`;
		}

		// Space block		
		for(let i = 1; i < 8; i += 1) {
    		const preBlocks = MsgDlgModel.message.data[i - 1].blocks;
    		const blocks = MsgDlgModel.message.data[i].blocks;
    		if(preBlocks.length === 0 && blocks.length !== 0) {
    			const ordinal = Util.ordinal(i);
    			return `${ordinal} character:\nSpace block can not be defined.`
    		}
    	}
    }

}