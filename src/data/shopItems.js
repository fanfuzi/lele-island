// 商店道具数据 (扩充版)

const shopItems = [
  // ===== 食物 (12个) =====
  { id: 1, name: '小鱼干', icon: '🐟', type: 'food', price: 10, priceType: 'coins', description: '宠物最爱的小鱼干！' },
  { id: 2, name: '小蛋糕', icon: '🧁', type: 'food', price: 15, priceType: 'coins', description: '香香甜甜的小蛋糕' },
  { id: 3, name: '鲜牛奶', icon: '🥛', type: 'food', price: 8, priceType: 'coins', description: '补充营养的鲜牛奶' },
  { id: 4, name: '水果拼盘', icon: '🍉', type: 'food', price: 20, priceType: 'coins', description: '新鲜水果大拼盘' },
  { id: 5, name: '小饼干', icon: '🍪', type: 'food', price: 5, priceType: 'coins', description: '脆脆的小饼干' },
  { id: 6, name: '冰淇淋', icon: '🍦', type: 'food', price: 18, priceType: 'coins', description: '夏天必备的冰淇淋' },
  { id: 7, name: '甜甜圈', icon: '🍩', type: 'food', price: 12, priceType: 'coins', description: '彩色的甜甜圈' },
  { id: 8, name: '果汁', icon: '🧃', type: 'food', price: 9, priceType: 'coins', description: '新鲜鲜榨果汁' },
  { id: 9, name: '布丁', icon: '🍮', type: 'food', price: 14, priceType: 'coins', description: '滑滑的焦糖布丁' },
  { id: 10, name: '棉花糖', icon: '☁️', type: 'food', price: 6, priceType: 'coins', description: '软绵绵的棉花糖' },

  // ===== 服装 (14个) =====
  { id: 11, name: '红色蝴蝶结', icon: '🎀', type: 'clothing', price: 1, priceType: 'stars', description: '可爱红色蝴蝶结' },
  { id: 12, name: '小花帽', icon: '🌺', type: 'clothing', price: 3, priceType: 'stars', description: '戴上变花园小精灵' },
  { id: 13, name: '小围巾', icon: '🧣', type: 'clothing', price: 2, priceType: 'stars', description: '暖暖的小围巾' },
  { id: 14, name: '圆眼镜', icon: '👓', type: 'clothing', price: 2, priceType: 'stars', description: '看起来好聪明' },
  { id: 15, name: '小皇冠', icon: '👑', type: 'clothing', price: 8, priceType: 'stars', description: '今天你是小公主！' },
  { id: 16, name: '星星项圈', icon: '⭐', type: 'clothing', price: 3, priceType: 'stars', description: '闪闪发亮的项圈' },
  { id: 17, name: '小背包', icon: '🎒', type: 'clothing', price: 5, priceType: 'stars', description: '一起出门探险吧' },
  { id: 18, name: '珍珠项链', icon: '📿', type: 'clothing', price: 6, priceType: 'stars', description: '优雅的珍珠项链' },
  { id: 19, name: '小披风', icon: '🧙', type: 'clothing', price: 8, priceType: 'stars', description: '变身小超人的披风' },
  { id: 20, name: '运动鞋', icon: '👟', type: 'clothing', price: 4, priceType: 'stars', description: '一起跑步去' },
  { id: 21, name: '小手表', icon: '⌚', type: 'clothing', price: 4, priceType: 'stars', description: '看看几点了' },
  { id: 22, name: '发箍', icon: '🎀', type: 'clothing', price: 2, priceType: 'stars', description: '可爱的猫咪发箍' },
  { id: 23, name: '小领结', icon: '🦋', type: 'clothing', price: 2, priceType: 'stars', description: '帅气的蝴蝶领结' },
  { id: 24, name: '手环', icon: '💫', type: 'clothing', price: 3, priceType: 'stars', description: '闪闪发光的手环' },

  // ===== 新增服装 (8个) =====
  { id: 42, name: '猫耳发箍', icon: '🐱', type: 'clothing', price: 3, priceType: 'stars', description: '戴上变小猫！' },
  { id: 43, name: '小礼帽', icon: '🎩', type: 'clothing', price: 5, priceType: 'stars', description: '绅士小礼帽' },
  { id: 44, name: '头戴耳机', icon: '🎧', type: 'clothing', price: 6, priceType: 'stars', description: '酷酷的耳机' },
  { id: 45, name: '小墨镜', icon: '🕶️', type: 'clothing', price: 4, priceType: 'stars', description: '超酷墨镜' },
  { id: 46, name: '铃铛项圈', icon: '🔔', type: 'clothing', price: 3, priceType: 'stars', description: '叮叮当当' },
  { id: 47, name: '小翅膀', icon: '🕊️', type: 'clothing', price: 10, priceType: 'stars', description: '变身小天使！' },
  { id: 48, name: '天使光环', icon: '✨', type: 'clothing', price: 7, priceType: 'stars', description: '闪闪发光的光环' },
  { id: 49, name: '小围裙', icon: '🍳', type: 'clothing', price: 4, priceType: 'stars', description: '厨房小帮手' },

  // ===== 家具 (12个) =====
  { id: 25, name: '小花地毯', icon: '🌸', type: 'furniture', price: 3, priceType: 'stars', description: '软软的小花地毯' },
  { id: 26, name: '小床铺', icon: '🛏️', type: 'furniture', price: 10, priceType: 'stars', description: '温馨可爱的小床' },
  { id: 27, name: '星星灯', icon: '💡', type: 'furniture', price: 5, priceType: 'stars', description: '一闪一闪的星星灯' },
  { id: 28, name: '小书架', icon: '📚', type: 'furniture', price: 8, priceType: 'stars', description: '放满故事书的小书架' },
  { id: 29, name: '盆栽植物', icon: '🪴', type: 'furniture', price: 3, priceType: 'stars', description: '给房间添点绿色' },
  { id: 30, name: '小窗帘', icon: '🪟', type: 'furniture', price: 5, priceType: 'stars', description: '印着小花的窗帘' },
  { id: 31, name: '摇摇椅', icon: '🪑', type: 'furniture', price: 7, priceType: 'stars', description: '摇啊摇好舒服' },
  { id: 32, name: '小台灯', icon: '🪔', type: 'furniture', price: 4, priceType: 'stars', description: '温馨的小夜灯' },
  { id: 33, name: '画框', icon: '🖼️', type: 'furniture', price: 5, priceType: 'stars', description: '装着你画的画' },
  { id: 34, name: '音乐盒', icon: '🎵', type: 'furniture', price: 8, priceType: 'stars', description: '会唱歌的音乐盒' },
  { id: 35, name: '小摇铃', icon: '🔔', type: 'furniture', price: 2, priceType: 'stars', description: '叮叮当当好有趣' },
  { id: 36, name: '仙人掌', icon: '🌵', type: 'furniture', price: 3, priceType: 'stars', description: '不用浇水也能活' },

  // ===== 新增家具 (8个) =====
  { id: 50, name: '小帐篷', icon: '⛺', type: 'furniture', price: 10, priceType: 'stars', description: '在房间里露营！' },
  { id: 51, name: '乐高积木', icon: '🧱', type: 'furniture', price: 6, priceType: 'stars', description: '搭积木真好玩' },
  { id: 52, name: '大熊公仔', icon: '🧸', type: 'furniture', price: 8, priceType: 'stars', description: '软软的抱抱熊' },
  { id: 53, name: '小钢琴', icon: '🎹', type: 'furniture', price: 12, priceType: 'stars', description: '弹弹小曲子' },
  { id: 54, name: '画架', icon: '🎨', type: 'furniture', price: 5, priceType: 'stars', description: '画出你的世界' },
  { id: 55, name: '小鱼缸', icon: '🐠', type: 'furniture', price: 7, priceType: 'stars', description: '小鱼游来游去' },
  { id: 56, name: '小地毯', icon: '🔴', type: 'furniture', price: 4, priceType: 'stars', description: '软软的圆地毯' },
  { id: 57, name: '毛绒枕头', icon: '🛏️', type: 'furniture', price: 5, priceType: 'stars', description: '靠着好舒服' },
];

const shopCategories = [
  { id: 'food', name: '宠物食物', icon: '🍽️' },
  { id: 'clothing', name: '宠物服装', icon: '👗' },
  { id: 'furniture', name: '房间家具', icon: '🛋️' },
];

export { shopItems, shopCategories };
