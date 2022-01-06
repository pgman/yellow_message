/**
 * Viewのクラス(静的クラス)
 */
class View {
    static init() {
        View.rebuildCanvas();

        $('.widget input[type=submit], .widget a, .widget button').button();
        //$('button, input, a').click(e => { e.preventDefault(); } );
        $('input[type="checkbox"]').checkboxradio(); 

        $('#message-select').selectmenu({ width: 200 });

        $('title').text(`${Define.APP_NAME}  Ver. ${Define.APP_VERSION}`);

        View.updateMessageSelect();
        View.updateStyleSize();
        View.update();
    } 
    static updateMessageSelect() {
        const message = Model.message;
        let disabled;
        $('#message-select option').remove();
        if(message.msgArray.length) {
            message.msgArray.forEach(m => {
                $('#message-select').append(`<option value=${Util.replaceAll(m.name, ' ', '')}>${m.name}</option>`);
            });
            $('#message-select').val(Util.replaceAll(message.msgArray[message.selected].name, ' ', ''))
            .selectmenu('refresh');
            disabled = false;
        } else {
            disabled = true;
        }
        $('#message-select').selectmenu({ disabled });
        $('#edit-message-button, #delete-message-button').button({ disabled });
        $('#message-select').selectmenu('refresh');
    }
    // imageRendering が更新されないので、canvasを作り直す
    static rebuildCanvas() {
        $('#main-canvas').remove();
        $('#canvas-div').append(`<canvas id="main-canvas" width="${Define.PIXEL_WIDTH}" height="${Define.PIXEL_HEIGHT}"></canvas>`);
    }
    // canvasのスタイル(canvas.style.width, canvas.style.height)を更新
    static updateStyleSize() {
    	const w = Model.styleWidth, 
    		h = Model.styleHeight;
    	$('#main-canvas').css({ width: `${w}px`, height: `${h}px`, imageRendering: Model.settings.imageRendering });
    }  
    // canvasを更新
    static update() {
        const ctx = $('#main-canvas')[0].getContext('2d');
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        // タイトル画面を表示
        View.drawTitle(ctx);
        if(Model.titleType) { return; }
        // 背景を描画
        View.drawBack(ctx);
        // 日付を描画
        View.drawDate(ctx);
        // 下のメッセージを表示する
        View.drawLowerMsg(ctx);
        // ゲートを描画
        View.drawGate(ctx);
        // イエローデビルの体力を描画
        View.drawHealth(ctx);
        // イエローデビルのブロックを描画        
        View.drawBlocks(ctx);
        // 飛んでいるブロックを描画
        View.drawFlies(ctx);
        // イエローデビルの目を描画
        View.drawEye(ctx);
        
        // ロックマンの弾を描画
        View.drawRockShot(ctx);
        // ロックマンを描画
        View.drawRock(ctx);
        // イエローデビルの弾を描画
        View.drawEnemyShot(ctx);
    }
    // タイトル画面を表示
    static drawTitle(ctx) {
        if(Model.titleType === 'normal') {
            ctx.drawImage(Model.titleImg, 0, 0);
        } else if(Model.titleType === 'reverse') {
            ctx.drawImage(Model.titleReverseImg, 0, 0);    
        }        
    }
    // 背景を描画
    static drawBack(ctx) {
        ctx.drawImage(Model.bkImg, 0, 0);
    }
    // 日付を描画
    static drawDate(ctx) {
        ctx.drawImage(Model.dateCanvas, 96, 8);
    }
    // 下のメッセージを描画する
    static drawLowerMsg(ctx) {
        if(Model.lowerMsgIndex === -1) { return; }
        const canvas = Model.lowerMsgImgs[Model.lowerMsgIndex];
        ctx.drawImage(canvas, (256 - canvas.width) / 2, 192 - 16);
    }
    // ゲートを描画
    static drawGate(ctx) {
        if(Model.gate <= 0) { return; }
        ctx.drawImage(Model.gateCanvases[Model.gate - 1], 0, 24);
    }
    // イエローデビルの体力を描画
    static drawHealth(ctx) {
        if(Model.health < 0) { return; }
        ctx.drawImage(Model.healthCanvases[Model.health], 40, 17);
    }
    // ブロックを描画
    static drawBlocks(ctx) {
        if(Model.blockDataIndex === -1) { return; }
        const curData = Model.blockData[Model.blockDataIndex];
        const direction = curData.direction;
        curData.data.forEach((block, i) => {
            const src = block.src;
            const dst = block.dst;
            if(src.show) {
                if(!curData.srcPadding) {
                    ctx.drawImage(src.img, 4 * src.x, 4 * block.y);
                } else {
                    const p = curData.srcPadding;
                    ctx.drawImage(src.img, p, p, 16 - p * 2, 16 - p * 2, 
                        4 * src.x + p, 4 * block.y + p, 16 - p * 2, 16 - p * 2);
                }                
            }
            if(dst.show) {
                let img;
                if(curData.explosion) { 
                    img = dst.explosionImg;
                } else if(curData.damaged) {
                    img = dst.damagedImg;
                } else {
                    img = dst.img;
                }        
                if(curData.dstPaddingCount === -1) {         
                    ctx.drawImage(img, 4 * dst.x, 4 * block.y);
                } else {
                    const p = curData.dstPadding;
                    ctx.drawImage(img, p, p, 16 - p * 2, 16 - p * 2, 
                        4 * dst.x + p, 4 * block.y + p, 16 - p * 2, 16 - p * 2);
                }    
            }
        });
    }
    // 飛んでいるブロックを描画
    static drawFlies(ctx) {
        if(Model.blockDataIndex === -1) { return; }
        const curData = Model.blockData[Model.blockDataIndex];
        curData.data.forEach((block, i) => {
            const fly = block.fly;
            if(fly.state) {
                const info = ImgDefine.FLY_IMAGES[fly.state];
                ctx.drawImage(Model.flyImg,
                    info.imgX, info.imgY, info.imgWidth, info.imgHeight,
                    4 * fly.x + info.diffX, 4 * block.y + info.diffY, info.imgWidth, info.imgHeight);
            }
        });
    }
    static drawEye(ctx) {
        if(!Model.eyeState) { return; }
        const info = ImgDefine.EYE_IMAGES[Model.eyeDirection][Model.eyeState];
        ctx.drawImage(Model.eyeImg,
            info.imgX, info.imgY, info.imgWidth, info.imgHeight,
            Model.eyeX + info.diffX, Model.eyeY + info.diffY, info.imgWidth, info.imgHeight);
    }
    static drawEnemyShot(ctx) {
        if(Model.enemyShotState !== 'move') { return; }
        ctx.drawImage(Model.enemyShotImg, Model.enemyShotX, Model.enemyShotY); 
    }
    // ロックマンのショットを描画
    static drawRockShot(ctx) {
        if(!Model.rockShotDirection) { return; }
        if(Model.rockShotX <= 0 || Model.rockShotX >= 256) { return; }
        ctx.drawImage(Model.rockShotImg, Model.rockShotX, Model.rockShotY);
    }    
    static drawRock(ctx) {
        if(!Model.rockState) { return; }
        const info = ImgDefine.ROCK_IMAGES[Model.rockDirection][Model.rockState];        
        ctx.drawImage(Model.rockImg[Model.rockDirection],
            info.imgX, info.imgY, info.imgWidth, info.imgHeight,
            Model.rockX + info.diffX, Model.rockY + info.diffY, info.imgWidth, info.imgHeight);
    }
}