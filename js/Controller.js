/**
 * コントローラークラス(静的クラス)
 */
class Controller {
    static async init() {
        await Model.init();
        View.init();        

        StgDlgController.init();
        MsgDlgController.init();

        Controller.attachEvents();
    }
    static attachEvents() {        
        // settings button
        $('#settings-button').click(() => {
            StgDlgController.open(Model.settings,
                settings => {
                    Model.settings = Util.copy(settings);
                    Model.saveSettings();
                    Model.updateStyleSize();
                    Model.updateVolume(Model.settings.bgmVolume, Model.settings.seVolume);
                    Model.updateSpeed(Model.settings.fps);
                    View.rebuildCanvas();
                    View.updateStyleSize();
                    View.update();
                }, null);
        });

        // message-select change
        $('#message-select').selectmenu({
            change: () => {
                Model.message.selected = $('#message-select').prop('selectedIndex');
                Model.saveMessage();
                Model.reset();
                View.update();
            },
        });
        // create button
        $('#create-message-button').click(() => { 
            const names = Model.message.msgArray.map(e => e.name);
            MsgDlgController.open(Model.createNewMessage(), names,
                Model.numImg, Model.blockImg, Model.eyeImg,
                message => {
                    const copied = Util.copy(message);
                    Model.message.msgArray.push(copied);
                    Model.message.selected = Model.message.msgArray.length - 1;
                    Model.saveMessage();
                    Model.reset();
                    View.updateMessageSelect();
                    View.update();
                }, null); 
        });

        // edit button
        $('#edit-message-button').click(() => { 
            const names = Model.message.msgArray.filter((e, i) => i !== Model.message.selected)
                          .map(e => e.name);
            MsgDlgController.open(Model.message.msgArray[Model.message.selected], names,
                Model.numImg, Model.blockImg, Model.eyeImg,
                message => {
                    const copied = Util.copy(message);
                    Model.message.msgArray[Model.message.selected] = copied;
                    Model.saveMessage();
                    Model.reset();
                    View.updateMessageSelect();
                    View.update();
                }, null);
        });

        // delete button
        $('#delete-message-button').click(() => { 
            const res = confirm(`Delete "${Model.message.msgArray[Model.message.selected].name}".\n Is it OK?`);
            if(res) {
                Model.message.msgArray.splice(Model.message.selected, 1);
                if(Model.message.msgArray.length) {
                    Model.message.selected = 0;
                } else {
                    Model.message.selected = -1;
                }
            }
            Model.saveMessage();
            Model.reset();
            View.updateMessageSelect();
            View.update();
        });

        // click canvas
        $('#canvas-div').on('click', '#main-canvas', () => {
            if(Model.message.selected === -1) {
                alert('No message.');
                return;
            }
            if(Model.timeoutId !== -1) {
                if(!Model.enablePause) { return; }
                Model.audioProps = Model.stop();
                Model.play('pause');
                clearTimeout(Model.timeoutId);
                Model.timeoutId = -1;
                $('#create-message-button, #edit-message-button, #delete-message-button')
                .button({ disabled: false });
                $('#message-select').selectmenu({ disabled: false });
            } else {
                if(Model.audios.pause.paused) {
                    if(!Model.isPlaying) {
                        Model.isPlaying = true;
                        Model.initGameStart();
                    } else {
                        Model.resume(Model.audioProps);
                    }
                    Model.timeoutId = setTimeout(Controller.loop, 1000 / Model.settings.fps);
                    $('#create-message-button, #edit-message-button, #delete-message-button')
                    .button({ disabled: true });
                    $('#message-select').selectmenu({ disabled: true });                    
                }                
            }
        });        

        /* debug start */
        $('body').keydown(e => {
            if(e.code === 'ArrowRight') {
                //Controller.frame();
            } else if(e.code === 'KeyP') {
                //Util.downloadAsPng('ym.png');
            }        
        });        
        /* debug end */
    }

    static frame() {
        Model.frame();
        View.update();
    }
    static loop() {
        const startTime = new Date();
        Controller.frame();
        const endTime = new Date();
        // startTime から endTime までの処理時間をミリ秒で測定
        const diff = endTime - startTime;
        const interval = 1000 / Model.settings.fps - diff;        
        Model.timeoutId = setTimeout(Controller.loop, interval);
    }
}
