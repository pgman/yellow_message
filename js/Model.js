/**
 * モデル(静的クラス)
 */
class Model {
    static async init() {
        // load image
        Model.titleImg = await Model.loadImgAsync(Define.IMAGE_TITLE_PATH);
        Model.titleReverseImg = await Model.loadImgAsync(Define.IMAGE_TITLE_REVERSE_PATH);
        Model.bkImg = await Model.loadImgAsync(Define.IMAGE_BACKGROUND_PATH);
        Model.numImg = await Model.loadImgAsync(Define.IMAGE_NUM_PATH);
        Model.rockImg = {
            right: await Model.loadImgAsync(Define.IMAGE_ROCK_RIGHT_PATH),
            left: await Model.loadImgAsync(Define.IMAGE_ROCK_LEFT_PATH),
        };
        Model.flyImg = await Model.loadImgAsync(Define.IMAGE_FLY_PATH);
        Model.eyeImg = await Model.loadImgAsync(Define.IMAGE_EYE_PATH);
        Model.blockImg = await Model.loadImgAsync(Define.IMAGE_BLOCK_PATH);
        Model.gateImg = await Model.loadImgAsync(Define.IMAGE_GATE_PATH);
        Model.healthImg = await Model.loadImgAsync(Define.IMAGE_HEALTH_PATH);
        Model.rockShotImg = await Model.loadImgAsync(Define.IMAGE_ROCK_SHOT_PATH);
        Model.blockNumImg = await Model.loadImgAsync(Define.IMAGE_BLOCK_NUMBER_PATH);
        Model.blockDamagedImg = await Model.loadImgAsync(Define.IMAGE_BLOCK_DAMAGED_PATH);  
        Model.blockExplosionImg = await Model.loadImgAsync(Define.IMAGE_BLOCK_EXPLOSION_PATH);
        Model.enemyShotImg = await Model.loadImgAsync(Define.IMAGE_ENEMY_SHOT_PATH);         

        // load audio 
        Model.audios = {};
        for(const prp in Define) {
            if(prp.indexOf('AUDIO_') === 0) {                
                const audioPrp = Util.toCamelCase(prp.substring(6, prp.length - 4));
                Model.audios[audioPrp] = await Model.loadAudioAsync(Define[prp]);
            }            
        }
        Model.audios.main.loop = true;

        // create canvas array
        Model.dateCanvas = Model.createDateCanvas();
        Model.gateCanvases = Model.createGateCanvases();
        Model.healthCanvases = Model.createHealthCanvases();

        Model.settings = Model.loadSettings();
        Model.message = Model.loadMessage();
        Model.updateStyleSize();
        Model.updateVolume(Model.settings.bgmVolume, Model.settings.seVolume);
        Model.updateSpeed(Model.settings.fps);        

        Model.reset();
    }
    static reset() {
        Model.isPlaying = false;
        if(Model.timeoutId !== -1) {
            clearTimeout(Model.timeoutId);
        }
        Model.timeoutId = -1;   // setTimeout() の戻り値(タイマーを止めるために必要)
        Model.enablePause = false;
        Model.clearGame = false;

        Model.blockData = Model.createBlockData();
        Model.blockDataIndex = -1;
        Model.lowerMsgImgs = Model.createLowerMessageImages();
        Model.lowerMsgIndex = -1;

        Model.titleType = 'normal';
        Model.gameStartAnimMode = '';
        Model.gameStartFrameCount = 0;

        Model.readyCount = 0;
        Model.readyState = '';

        Model.gate = 0;         // ゲート(0は非表示)
        Model.gateAnimMode = '';
        Model.gateFrameCount = 0;       
        
        Model.health = -1;                  // イエローデビルの体力は非表示
        Model.healthAnimMode = '';
        Model.healthFrameCount = 0;

        Model.lastCount = -1;
        
        Model.rockX = 0;
        Model.rockY = 0;
        Model.rockDirection = '';
        Model.rockState = '';
        Model.rockAnimMode = '';
        Model.rockShotX = 0;               // ロックマンの弾のX座標(0 <= x <= 255 の時のみ表示)
        Model.rockShotY = 0;                // ロックマンの弾のY座標
        Model.rockShotDirection = '';       // ロックマンの弾の向き 
        Model.eyeState = '';
        Model.eyeDirection = '';
        Model.eyeX = 0;
        Model.eyeY = 0;
        Model.enemyShotCount = 0;
        Model.enemyShotState = '';
        Model.enemyShotX = 0;
        Model.enemyShotY = 0;
        Model.enemyShotStartX = 0;
        Model.enemyShotStartY = 0;
        Model.enemyShotEndX = 0;
        Model.enemyShotEndY = 0;
        Model.audioProps = [];    
        Model.resetAudios();
    }
    // 画像を非同期で読み込む(読み込み失敗は面倒くさいので考えない)
    static async loadImgAsync(path) {
        const img = new Image();
        img.src = path;
        return new Promise((resolve, reject) => {
            img.addEventListener('load', () => { resolve(img); });
        });
    }
    static async loadAudioAsync(path) {
        const audio = new Audio();
        audio.autoplay = false;
        audio.src = path;
        return new Promise((resolve, reject) => {
            audio.addEventListener('canplaythrough', () => { resolve(audio); });
        });
    }    
    static updateVolume(bgmVolume, seVolume) {
        Model.audios.main.volume = bgmVolume / 100;
        for(const prp in Model.audios) {
            if(prp !== 'main') {        
                Model.audios[prp].volume = seVolume / 100;
            }            
        }
    }
    static updateSpeed(fps) {
        for(const prp in Model.audios) {
            Model.audios[prp].playbackRate = fps / Define.BASE_FPS;
        }
    }
    static resetAudios() {
        for(const prp in Model.audios) {
            Model.audios[prp].pause();
            Model.audios[prp].currentTime = 0; 
        }
    }
    static pause(prp) {
        Model.audios[prp].pause();
    }
    static play(prp) {
        Model.audios[prp].play();
        // if(prp === 'main') {
        //     Model.audios[prp].play();
        // } else {
        //     const stop = Object.keys(Model.audios)
        //                  .every(prp => prp === 'main' ? true : Model.audios[prp].paused);
        //     if(stop) { Model.audios[prp].play(); }
        // }
    }
    static stop() {
        return Object.keys(Model.audios).filter(prp => {
            if(!Model.audios[prp].paused) {
                Model.audios[prp].pause();
                return true;
            } else {
                return false;
            }
        });
    }
    static resume(prps) {
        prps.forEach((prp) => { Model.audios[prp].play(); });
    }
    static createDateCanvas() {
        const canvas = Util.createCanvas(8 * 8, 8);
        const ctx = canvas.getContext('2d');
        // 現在の日付を取得する
        const dt = Util.getCurrentYYYYMMDD();
        // 日付をcanvasに描画する
        [].forEach.call(dt, (s, i) => {
            const vi = parseInt(s, 10);
            ctx.drawImage(Model.numImg, vi * 8, 0, 8, 8, i * 8, 0, 8, 8);
        });
        return canvas;
    }
    static createHealthCanvases() {
        const canvases = [];
        for(let i = 0; i <= Define.MAX_HEALTH; i += 1) {
            const canvas = Util.createCanvas(8, 56);
            const ctx = canvas.getContext('2d');
            ctx.save();
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            for(let j = 1; j <= i; j += 1) {
                ctx.drawImage(Model.healthImg, 1, 56 - 2 * j);
            }
            ctx.restore();
            canvases.push(canvas);
        }
        return canvases;
    }
    static createGateCanvases() {
        const canvases = [];
        for(let i = 0; i < Define.GATE_MAX_COUNT; i += 1) {
            const canvas = Util.createCanvas(16, 128);
            const ctx = canvas.getContext('2d');
            ctx.save();
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            for(let j = 0; j <= i; j += 1) {
                ctx.drawImage(Model.gateImg, 0, 16 * j);
            }
            ctx.restore();
            canvases.push(canvas);
        }
        return canvases;
    }   
    static createLowerMessageImages() {
        if(Model.message.selected === -1) { return []; }
        const msgArray = Model.message.msgArray;
        const selected = Model.message.selected;
        const msgData = msgArray[selected].data;

        const w = 4;
        const int = 2;
        const canvases = [];
        for(let i = 0; i < msgData.length; i += 1) {   
            if(msgData[i].blocks.length === 0) { continue; }         
            const canvas = Util.createCanvas(20, 20);
            const ctx = canvas.getContext('2d');
            ctx.save();
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgb(255, 160, 0)';  
            msgData[i].blocks.forEach(bidx => {
                const x = (bidx % 5) * w;
                const y = parseInt(bidx / 5) * w;
                ctx.fillRect(x, y, w, w);
            });
            ctx.restore();
            canvases.push(canvas);
        }
        let len = 0;
        for(let i = 0; i < msgData.length; i += 1) {   
            if(msgData[i].blocks.length === 0) { continue; }   
            len += 1;
        }
        const msgCanvases = [];
        const canvas = Util.createCanvas((w * 5) * len + int * (len + 1), (w * 5) + int * 2);
        const ctx = canvas.getContext('2d');
        ctx.save();
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
        msgCanvases.push(canvas);
        for(let i = 0; i < msgData.length; i += 1) { 
            if(msgData[i].blocks.length === 0) { continue; }  
            const canvas = Util.createCanvas((w * 5) * len + int * (len + 1), (w * 5) + int * 2);
            const ctx = canvas.getContext('2d');
            ctx.save();
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            for(let j = 0; j <= i; j += 1) {
                ctx.drawImage(canvases[j], int + ((w * 5) + int) * j, int);
            }
            ctx.restore();
            msgCanvases.push(canvas);
        }
        return msgCanvases;
    }
    static createNewMessage() {
        const message = Util.copy(Define.INIT_MESSAGE);
        let name = 'No name';
        let cnt = 0;

        while(!Model.message.msgArray.every(e => e.name !== name)) {
            cnt += 1;
            name = `No name(${cnt + 1})`;
        }
        message.name = name;
        return message;
    }
    // canvasのスタイルのサイズを更新
    static updateStyleSize() {
        Model.styleWidth = Define.PIXEL_WIDTH * Model.settings.screenSize;
        Model.styleHeight = Define.PIXEL_HEIGHT * Model.settings.screenSize;
    }
    // 設定内容をセット
    static setSettings(screenSize, imageRendering, bgmVolume, seVolume) {
        Model.settings.screenSize = screenSize;
        Model.settings.imageRendering = imageRendering;
        Model.settings.bgmVolume = bgmVolume;
        Model.settings.seVolume = seVolume;
    }
    // 設定をロード
    static loadSettings() {
        const json = localStorage.getItem(Define.SETTINGS_KEY);
        if(json === null) {
            return Define.DEFAULT_SETTINGS;
        } else {
            return JSON.parse(json);
        }
    }
    // 設定を保存
    static saveSettings() {
        const json = JSON.stringify(Model.settings);
        localStorage.setItem(Define.SETTINGS_KEY, json);
    }
    // メッセージをロード
    static loadMessage() {
        const json = localStorage.getItem(Define.MESSAGE_KEY);
        if(json === null) {
            return Define.DEFAULT_MESSAGE;
        } else {
            return JSON.parse(json);
        }
    }
    // メッセージを保存
    static saveMessage() {
        const json = JSON.stringify(Model.message);
        localStorage.setItem(Define.MESSAGE_KEY, json);
    }
    // 音声を非同期で読み込む(※ユーザーアクション時にしか動作しない。要は初期化時に呼び出せない。)
    static async loadAudio(path) {
        const audio = new Audio();
        audio.src = path;
        return new Promise((resolve, reject) => {
            // load イベントがなぜかないので、'canplaythrough' イベントで代用する
            audio.addEventListener('canplaythrough', () => { resolve(audio); });
        }); 
    } 
    static initGameStart() {
        Model.titleType = 'normal';
        Model.gameStartAnimMode = 'start';
        Model.gameStartFrameCount = 0;
    }   
    static gameStartFrame() {
        if(Model.gameStartAnimMode !== 'start') { return; }
        if(Model.gameStartFrameCount === 0) {
            Model.play('gameStart');
        }
        Model.titleType = parseInt(Model.gameStartFrameCount / 8) % 2 ? 'normal' : 'reverse';
        Model.gameStartFrameCount += 1;   
        if(Model.gameStartFrameCount >= 8 * 8) {
            Model.gameStartAnimMode = 'started';
            Model.titleType = '';
            Model.initReady();
        }       
    }
    static initReady() {
        Model.readyCount = 0;
        Model.readyState = 'ready';
    }
    static readyFrame() {
        if(Model.readyState !== 'ready') { return; } 
        if(Model.readyCount === 60) {
            Model.initAppear();            
        } else if(Model.readyCount === 90) {
            Model.health = 0;
            Model.lowerMsgIndex = 0;
        } else if(Model.readyCount === 120) {
            Model.play('main');
        } else if(Model.readyCount === 240) {
            Model.initGate();
        } else if(Model.readyCount === 320) {
            Model.initEnergyFill();
        } else if(Model.readyCount === 400) {
            Model.initStartToRight(); 
            Model.enablePause = true;           
        } else if(Model.readyCount === 460) {
            Model.blockDataIndex = 0;
            Model.readyState = '';
        }
        Model.readyCount += 1;
    }
    static initGate() {
        Model.gate = 0;         // ゲート(0は非表示)
        Model.gateAnimMode = 'close';
        Model.gateFrameCount = 0;
    }
    static gateFrame() {
        if(Model.gateAnimMode !== 'close') { return; }
        if(Model.gateFrameCount === 0) {
            Model.play('gate');
        }
        Model.gate = parseInt(Model.gateFrameCount / 6) + 1;
        if(Model.gate > 8) { Model.gate = 8; }
        Model.gateFrameCount += 1;   
        if(Model.gateFrameCount >= 8 * 6) {
            Model.gateAnimMode = 'closed';
        }       
    }
    static initEnergyFill() {
        Model.health = 0;
        Model.healthAnimMode = 'fill';
        Model.healthFrameCount = 0;
    }
    static energyFillFrame() {
        if(Model.healthAnimMode !== 'fill') { return; }
        if(Model.healthFrameCount === 0) {
            Model.play('energyFill');
        }
        Model.health = parseInt(Model.healthFrameCount / 2) + 1;
        if(Model.health > Define.MAX_HEALTH) { Model.health = Define.MAX_HEALTH; }
        Model.healthFrameCount += 1;   
        if(Model.health === Define.MAX_HEALTH) {
            Model.healthAnimMode = '';
        }
    }
    static initAppear() {
        Model.rockX = Define.ROCK_START_X;
        Model.rockY = Define.ROCK_STAND_Y - 16 * 8;
        Model.frameCnt = 0;
        Model.rockDirection = 'right';
        Model.rockState = 'stick';
        Model.rockAnimMode = 'appear';
    }
    static appearFrame() {
        if(Model.rockAnimMode !== 'appear') { return; }
        Model.frameCnt += 1;
        const frame = FrameDefine.APPEAR_FRAMES[Model.frameCnt - 1];
        Model.rockY = frame.rockY;
        Model.rockState = frame.state;
        if(Model.frameCnt >= 2) {
            const preFrame = FrameDefine.APPEAR_FRAMES[Model.frameCnt - 2];
            if(preFrame.state === 'stick' && frame.state === 'normal') {
                Model.play('rockWarp');
            }
        }
        // ワープ音を出す  
        if(Model.frameCnt >= FrameDefine.APPEAR_FRAMES.length) {
            Model.initIdel();
        } 
    }
    static initStart() {
        Model.rockX = Define.ROCK_START_X;
        Model.rockY = Define.ROCK_STAND_Y;
        Model.frameCnt = 0;
        Model.rockDirection = 'right';
        Model.rockState = 'normal';
        Model.rockAnimMode = 'idle';
    }  
    static initIdel() {
        Model.frameCnt = 0;
        Model.rockAnimMode = 'idle';
    }  
    static initStartToRight() {
        Model.rockX = Define.ROCK_START_X;
        Model.rockY = Define.ROCK_STAND_Y;
        Model.frameCnt = 0;
        Model.rockDirection = 'right';
        Model.rockState = 'normal';
        Model.rockAnimMode = 'startToRight';
    }
    static initRightToLeft() {
        Model.rockX = Define.ROCK_RIGHT_X;
        Model.rockY = Define.ROCK_STAND_Y;
        Model.frameCnt = 0;
        Model.rockDirection = 'left';
        Model.rockState = 'normal';
        Model.rockAnimMode = 'rightToLeft';
    }
    static initLeftToRight() {
        Model.rockX = Define.ROCK_LEFT_X;
        Model.rockY = Define.ROCK_STAND_Y;
        Model.frameCnt = 0;
        Model.rockDirection = 'right';
        Model.rockState = 'normal';
        Model.rockAnimMode = 'leftToRight';
    }    
    static init4FramesJump() {
        Model.frameCnt = 0;
        Model.rockState = 'jump';
        Model.rockAnimMode = '4framesJump';
    }
    static init7FramesJump() {
        Model.frameCnt = 0;
        Model.rockState = 'jump';
        Model.rockAnimMode = '7framesJump';
    }
    static init8FramesJump() {
        Model.frameCnt = 0;
        Model.rockState = 'jump';
        Model.rockAnimMode = '8framesJump';
    }
    static init9FramesJump() {
        Model.frameCnt = 0;
        Model.rockState = 'jump';
        Model.rockAnimMode = '9framesJump';
    }
    static init10FramesJump() {
        Model.frameCnt = 0;
        Model.rockState = 'jump';
        Model.rockAnimMode = '10framesJump';
    }
    static initMiddleJumpShot() {
        Model.frameCnt = 0;
        Model.rockState = 'jump';
        Model.rockAnimMode = 'middleJumpShot';
    }
    static initHighJumpShot() {
        Model.frameCnt = 0;
        Model.rockState = 'jump';
        Model.rockAnimMode = 'highJumpShot';
    }
    static idleFrame(animMode, FRAMES) {
        if(Model.rockAnimMode !== animMode) { return; }
        Model.frameCnt += 1;
        const frame = FRAMES[Model.frameCnt - 1];
        Model.rockState = frame.state;
        if(Model.frameCnt >= FRAMES.length) {
            Model.initIdel();
        } 
    }
    static runFrame(animMode, FRAMES) {
        if(Model.rockAnimMode !== animMode) { return; }
        Model.frameCnt += 1;
        const frame = FRAMES[Model.frameCnt - 1];
        Model.rockX = frame.rockX;
        Model.rockState = frame.state;
        Model.rockDirection = frame.direction;  
        if(Model.frameCnt >= FRAMES.length) {
            Model.initIdel();
        } 
    }
    static jumpFrame(animMode, FRAMES) {
        if(Model.rockAnimMode !== animMode) { return; }
        Model.frameCnt += 1;
        const frame = FRAMES[Model.frameCnt - 1];
        Model.rockY = frame.rockY - 8;
        Model.rockState = frame.state;  
        if(Model.frameCnt >= 2) {
            if((Model.rockY === 136 - 8 || Model.rockY === 137 - 8 || Model.rockY === 138 - 8)
            && Model.rockState === 'jump') {
                Model.play('rockLand');
            }
        }
        if(Model.frameCnt >= FRAMES.length) {
            Model.initIdel();
        } 
    }
    static jumpShotFrame(animMode, FRAMES) {
        if(Model.rockAnimMode !== animMode) { return; }
        Model.frameCnt += 1;
        const frame = FRAMES[Model.frameCnt - 1];
        if(Model.frameCnt >= 2) {
            const preFrame = FRAMES[Model.frameCnt - 2];
            if(preFrame.state === 'jump' && frame.state === 'jumpshot') {
                if(Model.rockDirection === 'right') {
                    Model.rockShotX = 133;                        
                } else {
                    Model.rockShotX = 115; 
                } 
                if(Model.rockAnimMode === 'middleJumpShot') {                    
                    Model.rockShotY = 109;
                } else if(Model.rockAnimMode === 'highJumpShot') {
                    Model.rockShotY = 93;
                }
                Model.rockShotDirection = Model.rockDirection;
                Model.play('rockShot');
            } 
            if((Model.rockY === 137 - 8 || Model.rockY === 138 - 8)
            && Model.rockState === 'jump') {
                Model.play('rockLand');
            }
        }
        Model.rockY = frame.rockY - 8;
        Model.rockState = frame.state;  
        if(Model.frameCnt >= FRAMES.length) {
            Model.initIdel();
        } 
    }
    static rockShotFrame() {
        if(Model.rockDirection === 'none') { return; }
        const sign = Model.rockDirection === 'right' ? 1 : -1;
        Model.rockShotX += sign * Define.ROCK_SHOT_SPEED;
    }
    static reverseBlock(idx) {
        const remainder = idx % 5;
        const newRemainder = 4 - remainder;
        return idx - remainder + newRemainder; 
    }
    static reverseBlocks(argBlocks) {
        return Util.copy(argBlocks).map(idx => Model.reverseBlock(idx));
    }
    static getBlockX(idx, position) {
        let x;
        if(position === 'right') {
            x = 4 * 10 + 4 * (idx % 5);
        } else {
            x = 4 + 4 * (idx % 5);
        }
        return x;
    }
    static createBlockData() {
        const blockData = [];        

        if(Model.message.selected === -1) { return blockData; }
        
        const msgArray = Model.message.msgArray;
        const selected = Model.message.selected;
        const msgData = msgArray[selected].data;

        for(let i = 0; i < msgData.length; i += 1) {
            const blocks = msgData[i].blocks;
            if(blocks.length === 0) { continue; }
            const revBlocks = Model.reverseBlocks(blocks);
            const direction = i % 2 === 0 ? 'right' : 'left';

            const data = [];
            for(let j = 0; j < blocks.length; j += 1) {
                const idx = blocks[j];
                const row = parseInt(idx / 5);
                const revIdx = Model.reverseBlock(idx);
                const block = {};
                // x, y は 4 * i の i であることに注意
                block.y = 18 + 4 * row;
                
                // src
                let srcX, srcImg;
                if(direction === 'right') {                    
                    if(i === 0) {
                        srcX = 0;
                        srcImg = Util.createCanvas(16, 16);
                    } else {
                        srcX = Model.getBlockX(revIdx, 'left');
                        srcImg = Util.createBlockCanvas(revIdx, revBlocks, Model.blockImg);
                    }
                } else {
                    srcX = Model.getBlockX(revIdx, 'right');
                    srcImg = Util.createBlockCanvas(revIdx, revBlocks, Model.blockImg);
                }                
                block.src = {
                    show: true,
                    x: srcX,
                    img: srcImg,
                };

                // fly
                block.fly = {
                    x: block.src.x,
                    state: '',
                };

                // dst
                let dstX;
                if(direction === 'right') {
                    dstX = Model.getBlockX(idx, 'right');
                } else {
                    dstX = Model.getBlockX(idx, 'left');
                }   
                block.dst = {                
                    show: false,
                    x: dstX,
                    img: Util.createBlockCanvas(idx, blocks, Model.blockImg),
                    damagedImg: Util.createBlockCanvas(idx, blocks, Model.blockDamagedImg),
                    explosionImg: Util.createBlockCanvas(idx, blocks, Model.blockExplosionImg),
                };                

                if(direction === 'right') {
                    block.curX = -12 - 26 * j;
                } else {
                    block.curX = 60 + 12 + 26 * j;
                }
                
                data.push(block);
            }
            blockData.push({ 
                data, 
                direction,
                damaged: false,
                damagedCount: 0, 
                explosion: false,   
                srcPadding: 6,
                srcPaddingCount: 0,
                dstPadding: 2,
                dstPaddingCount: -1,            
            });
        }
        return blockData;
    }
    static blockDataFrame() {
        if(Model.blockDataIndex === -1) { return; }
        const curData = Model.blockData[Model.blockDataIndex];
        const data = curData.data;
        const direction = curData.direction;
        const vecX = direction === 'right' ? 1 : -1;
        let minSrcDiff = 100000;
        let minCurX = 100000, maxCurX = -100000;

        if(curData.explosion) { return; }

        if(curData.srcPaddingCount >= 0) {
            curData.srcPaddingCount += 1;
            if(curData.srcPaddingCount % 2 === 0) {
                curData.srcPadding -= 1;
                if(curData.srcPadding === 0) {
                    curData.srcPaddingCount = -1;
                }
            }
            return;
        }
        if(curData.dstPaddingCount >= 0) {
            curData.dstPaddingCount += 1;
            if(curData.dstPaddingCount % 2 === 0) {
                curData.dstPadding += 1;
                if(curData.dstPadding === 8) {
                    curData.dstPaddingCount = -1;
                    if(Model.blockDataIndex + 1 < Model.blockData.length) {
                        Model.blockDataIndex += 1;
                    }
                }
            }
            return;
        }
        
        for(let i = 0; i < data.length; i += 1) {
            const block = data[i];
            // update curX
            block.curX += vecX;
            if(block.curX < minCurX) {
                minCurX = block.curX;
            }
            if(block.curX > maxCurX) {
                maxCurX = block.curX;
            }
            
            // update flyX
            let srcDiff = block.curX - block.src.x;
            if(direction === 'left') {
                srcDiff *= -1;
            }
            if(srcDiff < minSrcDiff) {
                minSrcDiff = srcDiff;
            }
            let dstDiff = block.curX - block.dst.x;
            if(direction === 'left') {
                dstDiff *= -1;
            }
            block.fly.x = block.curX;
            if((direction === 'right' && block.fly.x >= block.dst.x)
            || (direction === 'left'  && block.fly.x <= block.dst.x)){
                block.fly.x = block.dst.x;
            }
            if((direction === 'right' && block.fly.x <= block.src.x)
            || (direction === 'left'  && block.fly.x >= block.src.x)){
                block.fly.x = block.src.x;
            }
            if(dstDiff >= 0) {
                if(0 <= dstDiff && dstDiff <= 4) {
                    block.fly.state = 'block0';
                } else if(5 <= dstDiff && dstDiff <= 9) {
                    block.fly.state = 'ready1';
                } else if(10 <= dstDiff && dstDiff <= 13) {
                    block.fly.state = 'ready0';
                    if(dstDiff === 13) {
                        block.dst.show = true;
                    }
                } else if(dstDiff === 14) {
                    block.fly.state = '';
                } 
            } else if(srcDiff >= 0) {
                if(srcDiff <= 3) {
                    block.fly.state = 'block0';
                } else if(srcDiff >= 4) {
                    let cnt = (srcDiff - 4) % 20;
                    if(0 <= cnt && cnt <= 4) {
                        block.fly.state = direction === 'right' ? 'block1' : 'block3';
                    } else if(5 <= cnt && cnt <= 9) {
                        block.fly.state = 'block2';
                    } else if(10 <= cnt && cnt <= 14) {
                        block.fly.state = direction === 'right' ? 'block3' : 'block1';
                    } else {
                        block.fly.state = 'block0';
                    }
                }
                
            } else if(srcDiff < 0) {
                if(-5 <= srcDiff && srcDiff <= -1) {
                    if(Model.blockDataIndex !== 0) { block.fly.state = 'block0'; }
                    if(srcDiff === -1) {
                        block.src.show = false;
                    }
                } else if(-10 <= srcDiff && srcDiff <= -6) {
                    if(Model.blockDataIndex !== 0) { block.fly.state = 'ready1'; }
                } else if(-15 <= srcDiff && srcDiff <= -11) {
                    if(Model.blockDataIndex !== 0) { block.fly.state = 'ready0'; }
                }                
            }
        }   
        const lastBlock = data[data.length - 1];
        if(direction === 'right' && lastBlock.curX >= 32 
        && Model.rockAnimMode === 'idle' && Model.rockDirection === 'left') {
            Model.initRightToLeft();
        } else if(direction === 'left' && lastBlock.curX <= 32 
        && Model.rockAnimMode === 'idle' && Model.rockDirection === 'right') {
            Model.initLeftToRight();
        }

        let eyeCount;
        if(direction === 'right') {
            eyeCount = minCurX - 60;            
        } else {// left
            eyeCount = -maxCurX;
        }
        eyeCount -= 24;
        let row;
        if(eyeCount >= 0) {
            const idx = Model.message.msgArray[Model.message.selected].data[Model.blockDataIndex].eye;
            row = parseInt(idx / 5);
            Model.eyeX = 4 * Model.getBlockX(idx, direction);
            Model.eyeY = 4 * (18 + 4 * row);
            Model.eyeDirection = direction === 'right' ? 'left' : 'right';
        }
        if(0 <= eyeCount && eyeCount <= 4) {
            Model.eyeState = 'eye0';
        } else if(5 <= eyeCount && eyeCount <= 9) {
            Model.eyeState = 'eye1';
        } else if(10 <= eyeCount && eyeCount <= 59) {
            Model.eyeState = 'eye2';
            if(eyeCount === 10) {
                if(row === 1) {
                    Model.initHighJumpShot();
                } else if(row === 2) {
                    Model.initMiddleJumpShot();
                }
                // enemy shot
                let startX, startY, endX, endY;
                if(direction === 'right') {
                    startX = Model.eyeX + 4;
                    endX = 114;
                } else {
                    startX = Model.eyeX + 6;
                    endX = 136;
                }
                startY = Model.eyeY + 5;
                endY = 139;
                Model.initEnemyShot(startX, startY, endX, endY);
                Model.play('enemyShot');
            }
        } else if(60 <= eyeCount && eyeCount <= 64) {
            Model.eyeState = 'eye1';
        } else if(65 <= eyeCount && eyeCount <= 69) {
            Model.eyeState = 'eye0';
        } else if(eyeCount === 70) {
            Model.eyeState = '';
        } else if(eyeCount === 75) {
            curData.dstPaddingCount = 0;
            // if(Model.blockDataIndex + 1 < Model.blockData.length) {
            //     Model.blockDataIndex += 1;
            // }
        }
        if(curData.damaged) {
            curData.damagedCount += 1;
            if(curData.damagedCount >= 8) {
                curData.damaged = false;
            }
        }        
    }
    static jumpBlock() {
        if(Model.blockDataIndex === -1) { return; }
        const rockX = Model.rockX;
        const data = Model.blockData[Model.blockDataIndex].data;
        const direction = Model.blockData[Model.blockDataIndex].direction;

        const blocks = Model.blocks;
        for(let i = 0; i < data.length; i += 1) {
            const block = data[i];
            let dist;
            if(direction === 'right') {// right
                dist = rockX - (4 * block.fly.x + 16);
            } else {// left
                dist = 4 * block.fly.x - rockX - 22;                
            }
            const row = (block.y - 18) / 4;
            let nextRow = -1;
            if(i < data.length - 1) {
                nextRow = (data[i + 1].y - 18) / 4;
            }
            if(row === 4) {
                if(dist === 20) {
                    Model.init4FramesJump();
                    break;
                }
            } else if(row === 3) {
                if(nextRow === 4) {
                    if(dist === 28) {
                        Model.init8FramesJump();
                        break;
                    }
                } else if(nextRow === 3) {
                    if(dist === 24) {
                        Model.init7FramesJump();
                        break;
                    }
                } else if(nextRow === 2) {
                    if(dist === 28) {
                        Model.init9FramesJump();
                        break;
                    }
                } else {
                    if(dist === 28) {
                        Model.init10FramesJump();
                        break;
                    }
                }
            } 
        }
    }
    static hitEye() {
        if(!Model.rockShotDirection || !Model.eyeState) { return; }
        const shotMinX = Model.rockShotX;
        const shotMaxX = Model.rockShotX + 8;
        const eyeMinX = Model.eyeX + 1;
        const eyeMaxX = Model.eyeX + 15;
        if(shotMinX <= eyeMaxX && eyeMinX <= shotMaxX) {
            Model.rockShotDirection = '';
            Model.health -= Define.DAMAGES[Model.blockData.length - 1][Model.blockDataIndex];
            Model.lowerMsgIndex += 1;
            if(Model.health <= 0) {
                Model.blockData[Model.blockDataIndex].explosion = true;
                Model.eyeState = '';
                Model.pause('main');
                Model.play('explosion');
                Model.enablePause = false;
                Model.rockAnimMode = '';
                Model.initLast();
            } else {
                Model.blockData[Model.blockDataIndex].damaged = true;
                Model.play('enemyDamage');
            }            
        }
    }
    static initLast() {
        Model.lastCount = 0;
    }
    static lastFrame() {
        if(Model.lastCount < 0) { return; }
        Model.lastCount += 1;
        if(Model.lastCount === 120) {
            Model.play('clear'); 
        } else if(Model.lastCount === 600) {
            Controller.finish();
        }
    }
    static initEnemyShot(startX, startY, endX, endY) {
        Model.enemyShotStartX = startX;
        Model.enemyShotStartY = startY;
        Model.enemyShotEndX = endX;
        Model.enemyShotEndY = endY;
        Model.enemyShotX = startX;
        Model.enemyShotY = startY;
        Model.enemyShotState = 'ready';
        Model.enemyShotCount = 0;
    }
    static enemyShotFrame() {
        if(!Model.enemyShotState) { return; }
        Model.enemyShotState = 'move';
        Model.enemyShotCount += 1;
        let vecX = Model.enemyShotEndX - Model.enemyShotStartX;
        let vecY = Model.enemyShotEndY - Model.enemyShotStartY;
        const dist = Math.sqrt(vecX * vecX + vecY * vecY);
        vecX /= dist;
        vecY /= dist;
        Model.enemyShotX = Math.round(Model.enemyShotStartX + vecX * Define.ENEMY_SHOT_SPEED * Model.enemyShotCount);
        Model.enemyShotY = Math.round(Model.enemyShotStartY + vecY * Define.ENEMY_SHOT_SPEED * Model.enemyShotCount);
        if(Model.enemyShotX <= -6 || 256 <= Model.enemyShotX
        || Model.enemyShotY <= -6 || 224 <= Model.enemyShotY) {
            Model.enemyShotState = '';
        }
    }
    static rockFrame() {
        if(Model.rockAnimMode === 'idle') {
            Model.idleFrame('idle', FrameDefine.IDLE_FRAMES);
        } else if(Model.rockAnimMode === 'startToRight') {
            Model.runFrame('startToRight', FrameDefine.START_TO_RIGHT_FRAMES);
        } else if(Model.rockAnimMode === 'rightToLeft') {
            Model.runFrame('rightToLeft', FrameDefine.RIGHT_TO_LEFT_FRAMES);
        } else if(Model.rockAnimMode === 'leftToRight') {
            Model.runFrame('leftToRight', FrameDefine.LEFT_TO_RIGHT_FRAMES);
        } else if(Model.rockAnimMode === '4framesJump') {
            Model.jumpFrame('4framesJump', FrameDefine.JUMP_4FRAMES);
        } else if(Model.rockAnimMode === '7framesJump') {
            Model.jumpFrame('7framesJump', FrameDefine.JUMP_7FRAMES);
        } else if(Model.rockAnimMode === '8framesJump') {
            Model.jumpFrame('8framesJump', FrameDefine.JUMP_8FRAMES);
        } else if(Model.rockAnimMode === '9framesJump') {
            Model.jumpFrame('9framesJump', FrameDefine.JUMP_9FRAMES);
        } else if(Model.rockAnimMode === '10framesJump') {
            Model.jumpFrame('10framesJump', FrameDefine.JUMP_10FRAMES);
        } else if(Model.rockAnimMode === 'middleJumpShot') {
            Model.jumpShotFrame('middleJumpShot', FrameDefine.JUMP_SHOT_8FRAMES);
        } else if(Model.rockAnimMode === 'highJumpShot') {
            Model.jumpShotFrame('highJumpShot', FrameDefine.JUMP_SHOT_12FRAMES);
        }    
    }
    
    static frame() {
        Model.readyFrame();
        Model.appearFrame();
        // ゲームスタートのフレーム
        Model.gameStartFrame();
        // ゲートのフレーム
        Model.gateFrame();
        // イエローデビルの体力満タンフレーム
        Model.energyFillFrame();
        // ロックマンの弾のフレーム
        Model.rockShotFrame();
        // イエローデビルの弾のフレーム
        Model.enemyShotFrame();
        // ロックマンのフレーム
        Model.rockFrame();
        // ブロックのフレーム      
        Model.blockDataFrame();  
        // ジャンプ判断
        Model.jumpBlock();
        // ショットが当たるか判定 
        Model.hitEye();
        // 破壊した後の処理
        Model.lastFrame();
    }
}
