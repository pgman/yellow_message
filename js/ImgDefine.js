const ImgDefine = {
	// 向きとインデックス
	// state: ロックマンの状態('normal', 'pull', 'run0', 'run1', 'run2', 'jump', 'jumpshot', 'blink')
	ROCK_IMAGES: {
		right: {
			normal: {
				imgX: 0,
				imgY: 0,
				imgWidth: 21,
				imgHeight: 24, 
				diffX: 0,
				diffY: 0,
			},
			pull: {
				imgX: 0,
				imgY: 24,
				imgWidth: 20,
				imgHeight: 24, 
				diffX: 0,
				diffY: 0,
			},
			run0: {
				imgX: 0,
				imgY: 48,
				imgWidth: 24,
				imgHeight: 22, 
				diffX: -2,
				diffY: 2,
			},
			run1: {
				imgX: 0,
				imgY: 70,
				imgWidth: 16,
				imgHeight: 24, 
				diffX: 1,
				diffY: 0,
			},
			run2: {
				imgX: 0,
				imgY: 94,
				imgWidth: 21,
				imgHeight: 22, 
				diffX: -3,
				diffY: 2,
			},
			jump: {
				imgX: 0,
				imgY: 116,
				imgWidth: 26,
				imgHeight: 30, 
				diffX: -2,
				diffY: -5,
			},
			jumpshot: {
				imgX: 0,
				imgY: 146,
				imgWidth: 29,
				imgHeight: 30, 
				diffX: -2,
				diffY: -5,
			},
			blink: {
				imgX: 0,
				imgY: 176,
				imgWidth: 21,
				imgHeight: 24, 
				diffX: 0,
				diffY: 0,
			},
			// 以下は right のみに定義する
			stick :{
				imgX: 0,
				imgY: 200,
				imgWidth: 7,
				imgHeight: 32, 
				diffX: 7,
				diffY: -8,
			},
			divided :{
				imgX: 0,
				imgY: 232,
				imgWidth: 22,
				imgHeight: 27, 
				diffX: 0,
				diffY: -3,
			},
			shrink :{
				imgX: 0,
				imgY: 259,
				imgWidth: 22,
				imgHeight: 11, 
				diffX: 0,
				diffY: 13,
			},
		},
		left: {
			normal: {
				imgX: 0,
				imgY: 0,
				imgWidth: 21,
				imgHeight: 24, 
				diffX: 1,
				diffY: 0,
			},
			pull: {
				imgX: 0,
				imgY: 24,
				imgWidth: 20,
				imgHeight: 24, 
				diffX: 2,
				diffY: 0,
			},
			run0: {
				imgX: 0,
				imgY: 48,
				imgWidth: 24,
				imgHeight: 22, 
				diffX: 0,
				diffY: 2,
			},
			run1: {
				imgX: 0,
				imgY: 70,
				imgWidth: 16,
				imgHeight: 24, 
				diffX: 5,
				diffY: 0,
			},
			run2: {
				imgX: 0,
				imgY: 94,
				imgWidth: 21,
				imgHeight: 22, 
				diffX: 4,
				diffY: 2,
			},
			jump: {
				imgX: 0,
				imgY: 116,
				imgWidth: 26,
				imgHeight: 30, 
				diffX: -2,
				diffY: -5,
			},
			jumpshot: {
				imgX: 0,
				imgY: 146,
				imgWidth: 29,
				imgHeight: 30, 
				diffX: -5,
				diffY: -5,
			},
			blink: {
				imgX: 0,
				imgY: 176,
				imgWidth: 21,
				imgHeight: 24, 
				diffX: 1,
				diffY: 0,
			},
		},		
	},	
	// 飛んでいるブロック
	FLY_IMAGES: {
		ready0: {
			imgX: 0,
			imgY: 0,
			imgWidth: 16,
			imgHeight: 12, 
			diffX: 0,
			diffY: 3,
		},
		ready1: {
			imgX: 0,
			imgY: 12,
			imgWidth: 16,
			imgHeight: 12, 
			diffX: 0,
			diffY: 3,
		},
		block0: {
			imgX: 0,
			imgY: 24,
			imgWidth: 16,
			imgHeight: 12, 
			diffX: 0,
			diffY: 3,
		},
		block1: {
			imgX: 0,
			imgY: 36,
			imgWidth: 16,
			imgHeight: 12, 
			diffX: 0,
			diffY: 3,
		},
		block2: {
			imgX: 0,
			imgY: 48,
			imgWidth: 16,
			imgHeight: 12, 
			diffX: 0,
			diffY: 3,
		},
		block3: {
			imgX: 0,
			imgY: 60,
			imgWidth: 16,
			imgHeight: 12, 
			diffX: 0,
			diffY: 3,
		},
	},	
	// 静止しているブロック
	BLOCK_IMAGES: {
		inner: {
			imgX: 0,
			imgY: 0,
			imgWidth: 12,
			imgHeight: 12,
		},
		innerVertical: {
			imgX: 0,
			imgY: 0,
			imgWidth: 2,
			imgHeight: 12,
		},
		innerHorizontal: {
			imgX: 0,
			imgY: 0,
			imgWidth: 12,
			imgHeight: 2,
		},
		innerCorner: {
			imgX: 0,
			imgY: 0,
			imgWidth: 2,
			imgHeight: 2,
		},
		top: {
			imgX: 0,
			imgY: 12,
			imgWidth: 12,
			imgHeight: 2,
		},
		topCorner: {
			imgX: 0,
			imgY: 12,
			imgWidth: 2,
			imgHeight: 2,
		},
		bottom: {
			imgX: 0,
			imgY: 14,
			imgWidth: 12,
			imgHeight: 2,
		},
		bottomCorner: {
			imgX: 0,
			imgY: 14,
			imgWidth: 2,
			imgHeight: 2,
		},
		left: {
			imgX: 0,
			imgY: 16,
			imgWidth: 2,
			imgHeight: 12,
		},
		leftCorner: {
			imgX: 0,
			imgY: 16,
			imgWidth: 2,
			imgHeight: 2,
		},
		right: {
			imgX: 2,
			imgY: 16,
			imgWidth: 2,
			imgHeight: 12,
		},
		rightCorner: {
			imgX: 2,
			imgY: 16,
			imgWidth: 2,
			imgHeight: 2,
		},
		topLeft: {
			imgX: 4,
			imgY: 16,
			imgWidth: 2,
			imgHeight: 2,
		},
		bottomLeft: {
			imgX: 4,
			imgY: 18,
			imgWidth: 2,
			imgHeight: 2,
		},
		topRight: {
			imgX: 4,
			imgY: 20,
			imgWidth: 2,
			imgHeight: 2,
		},
		bottomRight: {
			imgX: 4,
			imgY: 22,
			imgWidth: 2,
			imgHeight: 2,
		},
		reverseTopLeft: {
			imgX: 6,
			imgY: 16,
			imgWidth: 2,
			imgHeight: 2,
		},
		reverseBottomLeft: {
			imgX: 6,
			imgY: 18,
			imgWidth: 2,
			imgHeight: 2,
		},
		reverseTopRight: {
			imgX: 6,
			imgY: 20,
			imgWidth: 2,
			imgHeight: 2,
		},
		reverseBottomRight: {
			imgX: 6,
			imgY: 22,
			imgWidth: 2,
			imgHeight: 2,
		},
	},
	// イエローデビルの目
	EYE_IMAGES: {
		right: {
			eye0: {
				imgX: 0,
				imgY: 0,
				imgWidth: 11,
				imgHeight: 1, 
				diffX: 3,
				diffY: 8,
			},
			eye1: {
				imgX: 0,
				imgY: 1,
				imgWidth: 13,
				imgHeight: 5, 
				diffX: 1,
				diffY: 6,
			},
			eye2: {
				imgX: 0,
				imgY: 6,
				imgWidth: 13,
				imgHeight: 8, 
				diffX: 1,
				diffY: 4,
			},
		},
		left: {
			eye0: {
				imgX: 0,
				imgY: 14,
				imgWidth: 11,
				imgHeight: 1, 
				diffX: 2,
				diffY: 8,
			},
			eye1: {
				imgX: 0,
				imgY: 15,
				imgWidth: 13,
				imgHeight: 5, 
				diffX: 2,
				diffY: 6,
			},
			eye2: {
				imgX: 0,
				imgY: 20,
				imgWidth: 13,
				imgHeight: 8, 
				diffX: 2,
				diffY: 4,
			},
		},
		
	},
};