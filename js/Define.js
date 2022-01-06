const Define = {
	// アプリケーションのバージョン
	APP_VERSION: '1.0',
	// アプリケーションの名称
	APP_NAME: 'Yellow Message',
	// Local Storage のキー
	SETTINGS_KEY: 'SETTINGS_KEY',
	MESSAGE_KEY: 'MESSAGE_KEY',

	// デフォルト値(設定)
	DEFAULT_SETTINGS: {
		screenSize: 2,
		bgmVolume: 50,
		seVolume: 50,
		imageRendering: 'high-quality', // smooth, high-quality, crisp-edges, pixelated
		fps: 60,
	},	

	// デフォルト値(メッセージ)
	DEFAULT_MESSAGE: {
		selected: 0, // 選択中のメッセージ
		msgArray: [// メッセージ配列
			{
				name: 'HELLO', // メッセージ名
				data: [
					// blocks: ブロックの有無(ブロック有のインデックスが飛ぶ順番で格納される)
					// eye: 目の位置(2行目か3行目のみ。ブロックのない位置でも定義できる。)
					{// 1文字目(H)
						blocks: [12, 5, 4, 19, 14, 20, 11, 9, 10, 0, 24, 15, 13], 
						eye: 13,	
					},
					{// 2文字目(E)
						blocks: [2, 10, 24, 5, 12, 3, 21, 23, 15, 13, 0, 11, 20, 1, 22, 4], 
						eye: 5,							
					},
					{// 3文字目(L)
						blocks:  [5, 20, 15, 22, 23, 0, 24, 21, 10],
						eye: 5,						
					},
					{// 4文字目(L)
						blocks:  [24, 0, 5, 21, 22, 15, 23, 20, 10],
						eye: 10,						
					},
					{// 5文字目(O)
						blocks:  [9, 15, 3, 22, 19, 10, 5, 21, 14, 2, 1, 23],
						eye: 12,						
					},
					{// 6文字目(void)
						blocks: [],
						eye: -1,
					},
					{// 7文字目(void)
						blocks: [],
						eye: -1,	
					},
					{// 8文字目(void)
						blocks: [],
						eye: -1,
					},
				],
			},			
		],
	},

	// 新規作成時のメッセージ
	INIT_MESSAGE: {
		name: 'No name',
		data: [
			{ blocks: [], eye: -1, },
			{ blocks: [], eye: -1, },
			{ blocks: [], eye: -1, },
			{ blocks: [], eye: -1, },
			{ blocks: [], eye: -1, },
			{ blocks: [], eye: -1, },
			{ blocks: [], eye: -1, },
			{ blocks: [], eye: -1, },
		],
	},	

	// ロックマンのスタート座標
	ROCK_START_X: 13,
	// ロックマンの立ちY座標
	ROCK_STAND_Y: 129,
	// ロックマンの右の定位置の座標
	ROCK_RIGHT_X: 128,
	// ロックマンの左の定位置の座標
	ROCK_LEFT_X: 106,

	// ロックマンの弾によるイエローデビルのダメージ(文字数により異なる。イエローデビルの体力は28)
	DAMAGES: [
		[28],						// 文字数: 1
		[14, 14],					// 文字数: 2
		[10, 10, 8],				// 文字数: 3
		[7, 7, 7, 7],				// 文字数: 4
		[6, 6, 6, 6, 4],			// 文字数: 5
		[5, 5, 5, 5, 5, 3],			// 文字数: 6
		[4, 4, 4, 4, 4, 4, 4],		// 文字数: 7
		[4, 3, 4, 3, 4, 3, 4, 3],	// 文字数: 8
	],	

	// 画像のファイルパス
	IMAGE_TITLE_PATH: 'img/title.png',
	IMAGE_TITLE_REVERSE_PATH: 'img/title_reverse.png',
	IMAGE_BACKGROUND_PATH: 'img/bk.png',
	IMAGE_NUM_PATH: 'img/num.png',
	IMAGE_ROCK_RIGHT_PATH: 'img/rock_right.png',
	IMAGE_ROCK_LEFT_PATH: 'img/rock_left.png',
	IMAGE_FLY_PATH: 'img/fly.png',
	IMAGE_EYE_PATH: 'img/eye.png',
	IMAGE_BLOCK_PATH: 'img/block.png',
	IMAGE_GATE_PATH: 'img/gate.png',
	IMAGE_HEALTH_PATH: 'img/health.png',
	IMAGE_ROCK_SHOT_PATH: 'img/rock_shot.png',
	IMAGE_BLOCK_NUMBER_PATH: 'img/block_number.png',
	IMAGE_BLOCK_DAMAGED_PATH: 'img/block_damaged.png',
	IMAGE_BLOCK_EXPLOSION_PATH: 'img/block_explosion.png',
	IMAGE_ENEMY_SHOT_PATH: 'img/enemy_shot.png',

	// 音声のファイルパス
	AUDIO_MAIN_PATH: 'audio/bgm_bg.wav',
	AUDIO_GATE_PATH: 'audio/se_gate.wav',
	AUDIO_ENERGY_FILL_PATH: 'audio/se_energy_fill.wav',
	AUDIO_ROCK_SHOT_PATH: 'audio/se_rock_shot.wav',
	AUDIO_ROCK_LAND_PATH: 'audio/se_rock_land.wav',
	AUDIO_PAUSE_PATH: 'audio/se_pause.wav',
	AUDIO_GAME_START_PATH: 'audio/se_game_start.wav',
	AUDIO_ROCK_WARP_PATH: 'audio/se_rock_warp.wav',
	AUDIO_ENEMY_SHOT_PATH: 'audio/se_enemy_shot.wav',
	AUDIO_ENEMY_DAMAGE_PATH: 'audio/se_enemy_damage.wav',
	AUDIO_EXPLOSION_PATH: 'audio/se_explosion.wav',
	AUDIO_CLEAR_PATH: 'audio/se_clear.wav',

	// キャンセルしたときに飛ばすグーグルのURL
	GOOGLE_URL: 'https://www.google.com/',

	// ベースとなるFPS
	BASE_FPS: 60,

	// ベースとなるサイズ(※canvas.width, canvas.heightであり、スタイルではないことに注意)
	PIXEL_WIDTH: 256,
	PIXEL_HEIGHT: 224,

	BLINK_FRAMES: 9, 			// ロックマンが目を閉じているフレーム数
	BLINK_INTERVAL_FRAMES: 90,	// ロックマンが目を開けているフレーム数
	GATE_MAX_COUNT: 8,			// ゲートは8回に分けて閉まる
	MAX_HEALTH: 28, 			// イエローデビルの最大体力
	MAX_FPS: 300,				// FPSの最大値
	MIN_FPS: 10,				// FPSの最小値
	ROCK_SHOT_SPEED: 4,			// ロックマンの弾のスピード dots / frame
	ROCK_STICK_SPEED: 16,		// ロックマンが棒状の時に落ちるスピード
	BLOCK_SPEED: 4,				// イエローデビルのブロックのスピード
	ENEMY_SHOT_SPEED: Math.sqrt(50),	// イエローデビルの弾のスピード
};