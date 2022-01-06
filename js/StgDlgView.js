/**
 * StgDlgView(静的クラス)
 */
class StgDlgView {
	// 初期化
    static init() {
        $('body').append(`
            <div id="stgdlg" title="Settings">
                Screen size<br>
                <select name="size" id="stgdlg-screen-size-select">
                    <option value="1">x 1</option>
                    <option value="2">x 2</option>
                    <option value="3">x 3</option>
                    <option value="4">x 4</option>
                </select>
                <br><br>
                Image rendering<br>
                <select name="stgdlg-image-rendering" id="stgdlg-image-rendering-select">
                    <option value="smooth">smooth</option>
                    <option value="high-quality">high-quality</option>
                    <option value="crisp-edges">crisp-edges</option>
                    <option value="pixelated">pixelated</option>
                </select>
                <br><br>    
                BGM volume<br>
                <input id="stgdlg-bgm-volume-range" type="range" value="1" min="0" max="100" step="5">
                <span id="stgdlg-bgm-volume-span"></span>
                <br><br>
                SE volume<br>
                <input id="stgdlg-se-volume-range" type="range" value="1" min="0" max="100" step="5">      
                <span id="stgdlg-se-volume-span"></span>
                <br><br>
                FPS (10-300) 60 is recommended<br>
                <input id="stgdlg-fps-number" type="number" value="1" min="10" max="300" step="5">
            </div>
        `);

        $('#stgdlg').dialog({
            autoOpen: false,
            modal: true,
            closeOnEscape: false,
            width: 400,
            height: 450,
        });    	

        $('#stgdlg-screen-size-select').selectmenu({
            width: 120
        });
        $('#stgdlg-image-rendering-select').selectmenu({
            width: 200
        });        
    }
    static update() {
        $('.ui-dialog-titlebar-close').hide();
        $('#stgdlg-screen-size-select').val(StgDlgModel.settings.screenSize + '').selectmenu('refresh');
        $('#stgdlg-image-rendering-select').val(StgDlgModel.settings.imageRendering).selectmenu('refresh');
        $('#stgdlg-bgm-volume-range').val(StgDlgModel.settings.bgmVolume);
        $('#stgdlg-bgm-volume-span').text(StgDlgModel.settings.bgmVolume);
        $('#stgdlg-se-volume-range').val(StgDlgModel.settings.seVolume);
        $('#stgdlg-se-volume-span').text(StgDlgModel.settings.seVolume);
        $('#stgdlg-fps-number').val(StgDlgModel.settings.fps);
    }
}