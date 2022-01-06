/**
 * Utilのクラス(静的クラス)
 */
class Util {
    // ディープコピー
	static copy(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
    // 現在の日付をYYYYMMDD形式で取得する
    static getCurrentYYYYMMDD() {
        const dt = new Date(),
            y = dt.getFullYear(),
            m = ('00' + (dt.getMonth() + 1)).slice(-2),
            d = ('00' + dt.getDate()).slice(-2);
        return `${y}${m}${d}`;
    }
    // canvasをpngでダウンロード
    static downloadAsPng(fileName) {
        const canvas = document.createElement('canvas');
        canvas.width = Define.PIXEL_WIDTH;
        canvas.height = Define.PIXEL_HEIGHT;
        const ctx = canvas.getContext('2d');
        ctx.drawImage($('#main-canvas')[0].getContext('2d').canvas, 0, 0);
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = fileName;
        link.click();
    }

    // 正数の乱数を返す
    static randInt(min, max) {
        return Math.floor(Math.random() * (max + 1 - min)) + min;
    }   

    static createCanvas(w, h) {
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        return canvas;
    } 
    // 序数(文字列)を返す
    static ordinal(n) {
        if(n < 1) {
            return '';
        } else if(n === 1) {
            return `${n}st`;
        } else if(n === 2) {
            return `${n}nd`;
        } else if(n === 3) {
            return `${n}rd`;
        } else {
            return `${n}th`;
        }
    }
    static replaceAll(expression, org, dest) {
        return expression.split(org).join(dest);
    }
    static setTimeOutAsync(delay = 1000) {
        return new Promise((resolve, reject) => setTimeout(resolve, delay));
    }
    static toCamelCase(str, upper) {
        if(typeof str !== 'string') { return str; }
        let strs = str.split(/[-_ ]+/), i = 1, len = strs.length;
        if(len <= 1) return str;
        if(upper) {
            i = 0;
            str = '';
        } else {
            str = strs[0].toLowerCase();
        }
        for(; i < len; i += 1) {
            str += strs[i].toLowerCase().replace(/^[a-z]/, value => value.toUpperCase());
        }
        return str;
    }
    static measureTime(func, key = 'timer') {
        console.time(key);
        if(func) { func(); }        
        console.timeEnd(key); 
    }
    static createBlockCanvas(idx, blocks, blockImg) {
        const x = idx % 5;
        const y = parseInt(idx / 5);
        const canvas = Util.createCanvas(16, 16);
        const ctx = canvas.getContext('2d');
        // center
        let blkInfo = ImgDefine.BLOCK_IMAGES['inner'];
        ctx.drawImage(blockImg,
            blkInfo.imgX, blkInfo.imgY, blkInfo.imgWidth, blkInfo.imgHeight,
            2, 2, blkInfo.imgWidth, blkInfo.imgHeight);
        // top
        drawSide(2, 0, index(x, y - 1), 'innerHorizontal', 'top', blocks);
        // bottom
        drawSide(2, 14, index(x, y + 1), 'innerHorizontal', 'bottom', blocks);
        // left
        drawSide(0, 2, index(x - 1, y), 'innerVertical', 'left', blocks);
        // right
        drawSide(14, 2, index(x + 1, y), 'innerVertical', 'right', blocks);
        // top left
        drawCorner(0, 0, [index(x - 1, y), index(x - 1, y - 1), index(x, y - 1)], 
            ['topLeft', 'topCorner', 'leftCorner', 'reverseTopLeft'], blocks);
        // top right
        drawCorner(14, 0, [index(x + 1, y), index(x + 1, y - 1), index(x, y - 1)], 
            ['topRight', 'topCorner', 'rightCorner', 'reverseTopRight'], blocks);
        // bottom left
        drawCorner(0, 14, [index(x - 1, y), index(x - 1, y + 1), index(x, y + 1)], 
            ['bottomLeft', 'bottomCorner', 'leftCorner', 'reverseBottomLeft'], blocks);
        // bottom right
        drawCorner(14, 14, [index(x + 1, y), index(x + 1, y + 1), index(x, y + 1)], 
            ['bottomRight', 'bottomCorner', 'rightCorner', 'reverseBottomRight'], blocks);
        
        return canvas;

        function drawCorner(x, y, pmIdxes, props, blocks) {
            let blkInfo;
            const flg0 = isEnableBlock(pmIdxes[0], blocks);
            const flg1 = isEnableBlock(pmIdxes[1], blocks);
            const flg2 = isEnableBlock(pmIdxes[2], blocks);

            if((!flg0 && !flg1 && !flg2) || (!flg0 && flg1 && !flg2)) {
                blkInfo = ImgDefine.BLOCK_IMAGES[props[0]];
            } else if((flg0 && !flg1 && !flg2) || (flg0 && flg1 && !flg2)) {
                blkInfo = ImgDefine.BLOCK_IMAGES[props[1]];
            } else if((!flg0 && !flg1 && flg2) || (!flg0 && flg1 && flg2)) {
                blkInfo = ImgDefine.BLOCK_IMAGES[props[2]];
            } else if(flg0 && !flg1 && flg2) {
                blkInfo = ImgDefine.BLOCK_IMAGES[props[3]];
            } else if(flg0 && flg1 && flg2) {
                blkInfo = ImgDefine.BLOCK_IMAGES['innerCorner'];
            }
             
            ctx.drawImage(blockImg,
                blkInfo.imgX, blkInfo.imgY, blkInfo.imgWidth, blkInfo.imgHeight,
                x, y, blkInfo.imgWidth, blkInfo.imgHeight);
        }
        function drawSide(x, y, pmIdx, innerProp, prop, blocks) {
            const blkInfo = isEnableBlock(pmIdx, blocks) ? 
                ImgDefine.BLOCK_IMAGES[innerProp] : ImgDefine.BLOCK_IMAGES[prop];

            ctx.drawImage(blockImg,
                blkInfo.imgX, blkInfo.imgY, blkInfo.imgWidth, blkInfo.imgHeight,
                x, y, blkInfo.imgWidth, blkInfo.imgHeight);
        }
        function isEnableBlock(idx, blocks) {
            return blocks.indexOf(idx) >= 0;
        }
        function index(x, y) {
            return (x < 0 || 4 < x || y < 0 || 4 < y) ? -1 : x + y * 5;
        }        
    }
}