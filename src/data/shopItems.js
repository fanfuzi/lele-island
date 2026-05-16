// 商店道具数据 (扩充版)

const shopItems = [
  // ===== 食物 (12个) =====
  { id: 1, name: '小鱼干', icon: '🐟', type: 'food', price: 10, description: '宠物最爱的小鱼干！' },
  { id: 2, name: '小蛋糕', icon: '🧁', type: 'food', price: 15, description: '香香甜甜的小蛋糕' },
  { id: 3, name: '鲜牛奶', icon: '🥛', type: 'food', price: 8, description: '补充营养的鲜牛奶' },
  { id: 4, name: '水果拼盘', icon: '🍉', type: 'food', price: 20, description: '新鲜水果大拼盘' },
  { id: 5, name: '小饼干', icon: '🍪', type: 'food', price: 5, description: '脆脆的小饼干' },
  { id: 6, name: '冰淇淋', icon: '🍦', type: 'food', price: 18, description: '夏天必备的冰淇淋' },
  { id: 7, name: '甜甜圈', icon: '🍩', type: 'food', price: 12, description: '彩色的甜甜圈' },
  { id: 8, name: '果汁', icon: '🧃', type: 'food', price: 9, description: '新鲜鲜榨果汁' },
  { id: 9, name: '布丁', icon: '🍮', type: 'food', price: 14, description: '滑滑的焦糖布丁' },
  { id: 10, name: '棉花糖', icon: '☁️', type: 'food', price: 6, description: '软绵绵的棉花糖' },

  // ===== 服装 (14个) =====
  { id: 11, name: '红色蝴蝶结', icon: '🎀', type: 'clothing', price: 30, description: '可爱红色蝴蝶结' },
  { id: 12, name: '小花帽', icon: '🌺', type: 'clothing', price: 40, description: '戴上变花园小精灵' },
  { id: 13, name: '小围巾', icon: '🧣', type: 'clothing', price: 35, description: '暖暖的小围巾' },
  { id: 14, name: '圆眼镜', icon: '👓', type: 'clothing', price: 25, description: '看起来好聪明' },
  { id: 15, name: '小皇冠', icon: '👑', type: 'clothing', price: 50, description: '今天你是小公主！' },
  { id: 16, name: '星星项圈', icon: '⭐', type: 'clothing', price: 30, description: '闪闪发亮的项圈' },
  { id: 17, name: '小背包', icon: '🎒', type: 'clothing', price: 45, description: '一起出门探险吧' },
  { id: 18, name: '珍珠项链', icon: '📿', type: 'clothing', price: 55, description: '优雅的珍珠项链' },
  { id: 19, name: '小披风', icon: '🧙', type: 'clothing', price: 60, description: '变身小超人的披风' },
  { id: 20, name: '运动鞋', icon: '👟', type: 'clothing', price: 40, description: '一起跑步去' },
  { id: 21, name: '小手表', icon: '⌚', type: 'clothing', price: 35, description: '看看几点了' },
  { id: 22, name: '发箍', icon: '🎀', type: 'clothing', price: 20, description: '可爱的猫咪发箍' },
  { id: 23, name: '小领结', icon: '🦋', type: 'clothing', price: 25, description: '帅气的蝴蝶领结' },
  { id: 24, name: '手环', icon: '💫', type: 'clothing', price: 22, description: '闪闪发光的手环' },

  // ===== 家具 (12个) =====
  { id: 25, name: '小花地毯', icon: '🌸', type: 'furniture', price: 60, description: '软软的小花地毯' },
  { id: 26, name: '小床铺', icon: '🛏️', type: 'furniture', price: 80, description: '温馨可爱的小床' },
  { id: 27, name: '星星灯', icon: '💡', type: 'furniture', price: 50, description: '一闪一闪的星星灯' },
  { id: 28, name: '小书架', icon: '📚', type: 'furniture', price: 70, description: '放满故事书的小书架' },
  { id: 29, name: '盆栽植物', icon: '🪴', type: 'furniture', price: 40, description: '给房间添点绿色' },
  { id: 30, name: '小窗帘', icon: '🪟', type: 'furniture', price: 55, description: '印着小花的窗帘' },
  { id: 31, name: '摇摇椅', icon: '🪑', type: 'furniture', price: 65, description: '摇啊摇好舒服' },
  { id: 32, name: '小台灯', icon: '🪔', type: 'furniture', price: 45, description: '温馨的小夜灯' },
  { id: 33, name: '画框', icon: '🖼️', type: 'furniture', price: 50, description: '装着你画的画' },
  { id: 34, name: '音乐盒', icon: '🎵', type: 'furniture', price: 75, description: '会唱歌的音乐盒' },
  { id: 35, name: '小摇铃', icon: '🔔', type: 'furniture', price: 30, description: '叮叮当当好有趣' },
  { id: 36, name: '仙人掌', icon: '🌵', type: 'furniture', price: 35, description: '不用浇水也能活' },
];

const shopCategories = [
  { id: 'food', name: '宠物食物', icon: '🍽️' },
  { id: 'clothing', name: '宠物服装', icon: '👗' },
  { id: 'furniture', name: '房间家具', icon: '🛋️' },
];

export { shopItems, shopCategories };
