import { useState, useEffect, useRef, useCallback } from 'react';
import { useGame, getPetMood } from '../store';
import { shopItems } from '../data/shopItems';
import { playTapSound, playCorrectSound, speakPet } from '../utils/speech';
import usePetIdle from '../utils/usePetIdle';
import ProgressBar from './ProgressBar';

// ===== 配件SVG绘制（全部坐标适配新宠物比例：头部中心 60,52，半径 40/36） =====
function renderAccessory(accId) {
  switch (accId) {
    // === 头饰类 ===
    case 11: // 红色蝴蝶结 — 头顶偏右
      return (
        <g key={accId}>
          <polygon points="62,18 52,8 62,22" fill="#FF4444" />
          <polygon points="62,18 52,28 62,22" fill="#FF4444" />
          <circle cx="62" cy="18" r="4" fill="#CC2222" />
        </g>
      );
    case 12: // 小花帽 — 头顶
      return (
        <g key={accId}>
          <ellipse cx="60" cy="18" rx="26" ry="8" fill="#FF88AA" />
          <rect x="38" y="12" width="44" height="8" rx="3" fill="#FF5599" />
          <circle cx="48" cy="10" r="4" fill="#FFDD44" />
          <circle cx="60" cy="8" r="3.5" fill="#FFDD44" />
          <circle cx="72" cy="10" r="4" fill="#FFDD44" />
        </g>
      );
    case 15: // 小皇冠 — 头顶
      return (
        <g key={accId}>
          <rect x="42" y="16" width="36" height="10" rx="2" fill="#FFD700" />
          <polygon points="42,16 44,6 50,14 56,6 60,14 66,6 72,14 78,6 78,16" fill="#FFD700" />
          <circle cx="52" cy="12" r="2" fill="#FF4444" />
          <circle cx="60" cy="10" r="2" fill="#4444FF" />
          <circle cx="68" cy="12" r="2" fill="#44BB44" />
        </g>
      );
    case 42: // 可爱猫耳发箍 🆕
      return (
        <g key={accId}>
          <path d="M36,24 Q60,8 84,24" fill="none" stroke="#FFB5C2" strokeWidth="3" />
          <polygon points="36,24 30,10 42,20" fill="#FF9EAA" />
          <polygon points="84,24 90,10 78,20" fill="#FF9EAA" />
          <polygon points="38,22 34,14 40,20" fill="#FFB5C2" opacity="0.6" />
          <polygon points="82,22 86,14 80,20" fill="#FFB5C2" opacity="0.6" />
        </g>
      );
    case 43: // 小礼帽 🆕
      return (
        <g key={accId}>
          <rect x="44" y="10" width="32" height="8" rx="2" fill="#333" />
          <rect x="48" y="2" width="24" height="10" rx="2" fill="#333" />
          <rect x="44" y="10" width="32" height="3" rx="1" fill="#FFD700" />
          <circle cx="60" cy="6" r="2.5" fill="#FFD700" />
        </g>
      );
    case 44: // 头戴耳机 🆕
      return (
        <g key={accId}>
          <path d="M26,42 Q30,14 60,10 Q90,14 94,42" fill="none" stroke="#7C4DFF" strokeWidth="4" strokeLinecap="round" />
          <rect x="20" y="38" width="14" height="12" rx="4" fill="#7C4DFF" />
          <rect x="86" y="38" width="14" height="12" rx="4" fill="#7C4DFF" />
          <rect x="23" y="42" width="8" height="4" rx="2" fill="#B388FF" />
          <rect x="89" y="42" width="8" height="4" rx="2" fill="#B388FF" />
        </g>
      );
    case 22: // 发箍（改：小花环）
      return (
        <g key={accId}>
          <path d="M22,36 Q60,16 98,36" fill="none" stroke="#66BB6A" strokeWidth="2.5" />
          {[30, 42, 54, 66, 78, 90].map((x, i) => (
            <circle key={i} cx={x} cy={28 + Math.sin(i * 0.8) * 6} r="4" fill={['#FF9EAA','#FFD700','#66BB6A','#7C4DFF','#FF8C42','#FFB5C2'][i]} />
          ))}
        </g>
      );

    // === 面部类 ===
    case 14: // 圆眼镜
      return (
        <g key={accId}>
          <circle cx="42" cy="52" r="12" fill="rgba(255,179,0,0.1)" stroke="#8D6E63" strokeWidth="2" />
          <circle cx="78" cy="52" r="12" fill="rgba(255,179,0,0.1)" stroke="#8D6E63" strokeWidth="2" />
          <path d="M54,52 Q60,56 66,52" fill="none" stroke="#8D6E63" strokeWidth="2" />
          <line x1="30" y1="50" x2="34" y2="48" stroke="#8D6E63" strokeWidth="1.5" />
          <line x1="90" y1="50" x2="86" y2="48" stroke="#8D6E63" strokeWidth="1.5" />
        </g>
      );
    case 45: // 小墨镜 🆕
      return (
        <g key={accId}>
          <rect x="32" y="46" width="18" height="12" rx="4" fill="#333" opacity="0.85" />
          <rect x="70" y="46" width="18" height="12" rx="4" fill="#333" opacity="0.85" />
          <path d="M50,52 Q60,56 70,52" fill="none" stroke="#333" strokeWidth="2" />
          <line x1="28" y1="50" x2="32" y2="50" stroke="#333" strokeWidth="2.5" />
          <line x1="88" y1="50" x2="92" y2="50" stroke="#333" strokeWidth="2.5" />
          <rect x="35" y="48" width="12" height="2" rx="1" fill="white" opacity="0.2" />
          <rect x="73" y="48" width="12" height="2" rx="1" fill="white" opacity="0.2" />
        </g>
      );

    // === 颈部类 ===
    case 13: // 小围巾
      return (
        <g key={accId}>
          <path d="M32,70 Q60,82 88,70 Q92,80 88,90 Q60,102 32,90 Q28,80 32,70Z" fill="#FF8A65" />
          <path d="M38,74 Q60,84 82,74" fill="none" stroke="#FFAB91" strokeWidth="1.5" />
          <path d="M44,90 Q60,96 76,90" fill="none" stroke="#FFAB91" strokeWidth="1" opacity="0.6" />
        </g>
      );
    case 23: // 小领结
      return (
        <g key={accId}>
          <polygon points="60,72 48,66 48,78" fill="#1565C0" />
          <polygon points="60,72 72,66 72,78" fill="#1565C0" />
          <circle cx="60" cy="72" r="4" fill="#0D47A1" />
        </g>
      );
    case 16: // 星星项圈
      return (
        <g key={accId}>
          <path d="M28,72 Q60,84 92,72" fill="none" stroke="#FFD700" strokeWidth="3" strokeDasharray="4,3" />
          <text x="56" y="80" fontSize="10">⭐</text>
        </g>
      );
    case 46: // 铃铛项圈 🆕
      return (
        <g key={accId}>
          <path d="M28,72 Q60,84 92,72" fill="none" stroke="#FF5252" strokeWidth="3" />
          <circle cx="60" cy="82" r="5" fill="#FFD700" />
          <circle cx="60" cy="84" r="1.5" fill="#333" />
        </g>
      );

    // === 身体类 ===
    case 17: // 小背包
      return (
        <g key={accId}>
          <rect x="48" y="94" width="34" height="26" rx="6" fill="#8D6E63" />
          <rect x="52" y="98" width="26" height="8" rx="3" fill="#6D4C41" />
          <line x1="65" y1="94" x2="62" y2="82" stroke="#5D4037" strokeWidth="2" />
          <line x1="65" y1="94" x2="72" y2="82" stroke="#5D4037" strokeWidth="2" />
        </g>
      );
    case 21: // 小手表
      return (
        <g key={accId}>
          <rect x="88" y="118" width="12" height="8" rx="3" fill="#FF8A65" />
          <circle cx="94" cy="122" r="3" fill="#FFF" />
          <line x1="94" y1="120" x2="94" y2="123" stroke="#333" strokeWidth="0.8" />
          <line x1="93" y1="122" x2="95" y2="122" stroke="#333" strokeWidth="0.8" />
        </g>
      );
    case 24: // 手环
      return (
        <g key={accId}>
          <rect x="20" y="118" width="12" height="8" rx="4" fill="#FFD700" />
          <circle cx="26" cy="122" r="2.5" fill="#FFF" opacity="0.5" />
        </g>
      );
    case 47: // 小翅膀 🆕
      return (
        <g key={accId}>
          <path d="M16,90 Q4,74 8,60 Q12,50 20,58 Q24,50 28,64 Q32,76 20,90Z" fill="white" stroke="#E0E0E0" strokeWidth="1" opacity="0.9" />
          <path d="M104,90 Q116,74 112,60 Q108,50 100,58 Q96,50 92,64 Q88,76 100,90Z" fill="white" stroke="#E0E0E0" strokeWidth="1" opacity="0.9" />
        </g>
      );
    case 48: // 光环 🆕
      return (
        <g key={accId}>
          <ellipse cx="60" cy="14" rx="18" ry="6" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.7">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
          </ellipse>
          <circle cx="60" cy="12" r="2" fill="#FFD700" opacity="0.6" />
          <circle cx="52" cy="10" r="1.5" fill="#FFD700" opacity="0.4" />
          <circle cx="68" cy="10" r="1.5" fill="#FFD700" opacity="0.4" />
        </g>
      );
    case 18: // 珍珠项链
      return (
        <g key={accId}>
          {[42, 48, 54, 60, 66, 72, 78].map((x, i) => (
            <circle key={i} cx={x} cy={74 + Math.sin(i * 0.6) * 3} r="3" fill="white" stroke="#DDD" strokeWidth="0.5" />
          ))}
        </g>
      );

    // === 脚部类 ===
    case 20: // 运动鞋
      return (
        <g key={accId}>
          <rect x="32" y="158" width="20" height="10" rx="4" fill="#FF5722" />
          <rect x="34" y="160" width="16" height="4" rx="2" fill="white" />
          <rect x="68" y="158" width="20" height="10" rx="4" fill="#FF5722" />
          <rect x="70" y="160" width="16" height="4" rx="2" fill="white" />
        </g>
      );
    case 19: // 小披风
      return (
        <g key={accId}>
          <path d="M28,68 Q60,62 92,68 L92,110 Q60,120 28,110 Z" fill="#7E57C2" opacity="0.55" />
          <path d="M32,72 Q60,70 88,72" fill="none" stroke="#5E35B1" strokeWidth="1.5" />
        </g>
      );
    case 49: // 小围裙 🆕
      return (
        <g key={accId}>
          <path d="M46,82 L74,82 L78,122 Q60,128 42,122 Z" fill="white" stroke="#E0E0E0" strokeWidth="1" opacity="0.9" />
          <path d="M46,82 Q48,78 60,76 Q72,78 74,82" fill="none" stroke="#FF9EAA" strokeWidth="2" />
          <rect x="55" y="98" width="10" height="12" rx="2" fill="#FF9EAA" opacity="0.3" />
        </g>
      );

    default:
      return null;
  }
}

// ===== SVG 宠物角色 =====
function PetSprite({ type, color, mood = 'normal', celebrating = false, accessories = [], size = 80, gaze = { x: 0, y: 0 }, spriteClass = '' }) {
  const [blink, setBlink] = useState(false);

  // 眨眼
  useEffect(() => {
    const t = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(t);
  }, []);

  // 表情 — 使用更大更可爱的眼睛
  const eye = {
    normal: blink ? 'M35,48 Q40,44 45,48' : 'M35,48 Q40,44 45,48',
    happy: 'M35,46 Q40,42 45,46',
    excited: 'M35,46 L38,42 L41,46 M44,46 L47,42 L50,46',
    sad: 'M35,52 Q40,55 45,52',
    hungry: blink ? 'M35,48 Q40,44 45,48' : 'M35,48 Q40,44 45,48',
  }[mood] || 'M35,48 Q40,44 45,48';

  const rightEye = {
    normal: blink ? 'M75,48 Q80,44 85,48' : 'M75,48 Q80,44 85,48',
    happy: 'M75,46 Q80,42 85,46',
    excited: 'M75,46 L78,42 L81,46 M84,46 L87,42 L90,46',
    sad: 'M75,52 Q80,55 85,52',
    hungry: blink ? 'M75,48 Q80,44 85,48' : 'M75,48 Q80,44 85,48',
  }[mood] || 'M75,48 Q80,44 85,48';

  const mouth = {
    normal: 'M52,62 Q60,68 68,62',
    happy: 'M48,60 Q60,72 72,60',
    excited: 'M46,58 Q60,74 74,58',
    sad: 'M52,68 Q60,62 68,68',
    hungry: 'M50,62 Q60,72 70,62',
  }[mood] || 'M52,62 Q60,68 68,62';

  const blushOpacity = (mood === 'happy' || mood === 'excited') ? 0.5 : (mood === 'normal' ? 0.25 : 0);

  // 瞳孔偏移（视线跟踪用）
  const useGaze = gaze && (mood === 'normal' || mood === 'happy' || mood === 'hungry');
  const pupilLX = useGaze ? 40 + gaze.x : 40;
  const pupilLY = useGaze ? 48 + gaze.y : 48;
  const pupilRX = useGaze ? 80 + gaze.x : 80;
  const pupilRY = useGaze ? 48 + gaze.y : 48;

  // 配件分组（按位置）
  const accIds = (accessories || []).filter(a => {
    const item = shopItems.find(i => i.id === a);
    return item && item.type === 'clothing';
  });
  const headAccs = accIds.filter(a => [11, 12, 15, 22, 42, 43, 44].includes(a));
  const faceAccs = accIds.filter(a => [14, 45].includes(a));
  const neckAccs = accIds.filter(a => [13, 16, 18, 23, 46].includes(a));
  const bodyAccs = accIds.filter(a => [17, 19, 21, 24, 47, 48, 49].includes(a));
  const footAccs = accIds.filter(a => [20].includes(a));
  const behindAccs = accIds.filter(a => [19].includes(a));

  // 耳朵定义
  const ears = {
    cat: (
      <g>
        <polygon points="28,38 22,14 40,34" fill={color} stroke="#00000012" strokeWidth="1" />
        <polygon points="34,34 28,20 40,32" fill="#FFB5C2" opacity="0.5" />
        <polygon points="92,38 98,14 80,34" fill={color} stroke="#00000012" strokeWidth="1" />
        <polygon points="86,34 92,20 80,32" fill="#FFB5C2" opacity="0.5" />
      </g>
    ),
    dog: (
      <g>
        <ellipse cx="30" cy="40" rx="16" ry="22" fill={color} stroke="#00000012" strokeWidth="1" transform="rotate(-25 30 40)" />
        <ellipse cx="28" cy="50" rx="8" ry="12" fill="#E8D5B7" opacity="0.5" transform="rotate(-25 28 50)" />
        <ellipse cx="90" cy="40" rx="16" ry="22" fill={color} stroke="#00000012" strokeWidth="1" transform="rotate(25 90 40)" />
        <ellipse cx="92" cy="50" rx="8" ry="12" fill="#E8D5B7" opacity="0.5" transform="rotate(25 92 50)" />
      </g>
    ),
    rabbit: (
      <g>
        <ellipse cx="34" cy="20" rx="10" ry="28" fill={color} stroke="#00000012" strokeWidth="1" transform="rotate(-10 34 20)" />
        <ellipse cx="34" cy="26" rx="6" ry="20" fill="#FFB5E6" opacity="0.5" transform="rotate(-10 34 26)" />
        <ellipse cx="86" cy="20" rx="10" ry="28" fill={color} stroke="#00000012" strokeWidth="1" transform="rotate(10 86 20)" />
        <ellipse cx="86" cy="26" rx="6" ry="20" fill="#FFB5E6" opacity="0.5" transform="rotate(10 86 26)" />
      </g>
    ),
    hamster: (
      <g>
        <ellipse cx="24" cy="42" rx="10" ry="8" fill={color} stroke="#00000012" strokeWidth="1" />
        <ellipse cx="24" cy="42" rx="5" ry="4" fill="#FFB5C2" opacity="0.5" />
        <ellipse cx="96" cy="42" rx="10" ry="8" fill={color} stroke="#00000012" strokeWidth="1" />
        <ellipse cx="96" cy="42" rx="5" ry="4" fill="#FFB5C2" opacity="0.5" />
      </g>
    ),
    fox: (
      <g>
        <polygon points="26,40 18,10 40,36" fill={color} stroke="#00000012" strokeWidth="1" />
        <polygon points="40,36 32,20 44,34" fill="#FFE0B2" opacity="0.5" />
        <polygon points="94,40 102,10 80,36" fill={color} stroke="#00000012" strokeWidth="1" />
        <polygon points="80,36 88,20 76,34" fill="#FFE0B2" opacity="0.5" />
      </g>
    ),
    panda: (
      <g>
        <ellipse cx="28" cy="34" rx="14" ry="14" fill="#333" />
        <ellipse cx="28" cy="34" rx="8" ry="8" fill="#555" />
        <ellipse cx="92" cy="34" rx="14" ry="14" fill="#333" />
        <ellipse cx="92" cy="34" rx="8" ry="8" fill="#555" />
      </g>
    ),
    // 新宠物耳朵
    bear: (
      <g>
        <ellipse cx="30" cy="34" rx="12" ry="14" fill={color} stroke="#00000012" strokeWidth="1" />
        <ellipse cx="30" cy="36" rx="6" ry="8" fill="#D7CCC8" opacity="0.5" />
        <ellipse cx="90" cy="34" rx="12" ry="14" fill={color} stroke="#00000012" strokeWidth="1" />
        <ellipse cx="90" cy="36" rx="6" ry="8" fill="#D7CCC8" opacity="0.5" />
      </g>
    ),
    penguin: (
      <g>
        <ellipse cx="30" cy="38" rx="6" ry="10" fill="#333" />
        <ellipse cx="90" cy="38" rx="6" ry="10" fill="#333" />
      </g>
    ),
    owl: (
      <g>
        <polygon points="28,44 6,30 18,50" fill={color} />
        <polygon points="92,44 114,30 102,50" fill={color} />
        <circle cx="16" cy="34" r="4" fill="#FFF" />
        <circle cx="104" cy="34" r="4" fill="#FFF" />
      </g>
    ),
    frog: (
      <g>
        <circle cx="32" cy="36" r="8" fill="#81C784" />
        <circle cx="88" cy="36" r="8" fill="#81C784" />
      </g>
    ),
    turtle: (
      <g>
        <ellipse cx="20" cy="38" rx="4" ry="10" fill="#66BB6A" />
        <ellipse cx="100" cy="38" rx="4" ry="10" fill="#66BB6A" />
      </g>
    ),
    unicorn: (
      <g>
        <polygon points="58,2 60,16 62,2" fill="#FFD700" />
        <path d="M56,4 Q62,0 64,2" fill="none" stroke="#FFD700" strokeWidth="1.5" />
        <ellipse cx="34" cy="18" rx="10" ry="26" fill="#E1BEE7" transform="rotate(-12 34 18)" />
        <ellipse cx="86" cy="18" rx="10" ry="26" fill="#E1BEE7" transform="rotate(12 86 18)" />
      </g>
    ),
  }[type] || null;

  const nose = {
    cat: <ellipse cx="60" cy="55" rx="4" ry="3" fill="#FF8C9E" />,
    dog: <ellipse cx="60" cy="55" rx="6" ry="5" fill="#4A3A3A" />,
    rabbit: <ellipse cx="60" cy="55" rx="3" ry="2.5" fill="#FFB5C2" />,
    hamster: <ellipse cx="60" cy="55" rx="3" ry="2.5" fill="#FFB5C2" />,
    fox: <ellipse cx="60" cy="55" rx="5" ry="4" fill="#333" />,
    panda: <ellipse cx="60" cy="56" rx="6" ry="4" fill="#333" />,
    bear: <ellipse cx="60" cy="55" rx="6" ry="5" fill="#5D4037" />,
    owl: <polygon points="60,52 57,58 63,58" fill="#FF8C42" />,
    frog: <ellipse cx="60" cy="54" rx="6" ry="3" fill="#4CAF50" />,
    turtle: <ellipse cx="60" cy="55" rx="3" ry="2" fill="#43A047" />,
    unicorn: <ellipse cx="60" cy="55" rx="4" ry="3" fill="#CE93D8" />,
    penguin: <polygon points="60,52 58,58 62,58" fill="#FF8C42" />,
  }[type] || null;

  const whiskers = (type === 'cat' || type === 'hamster' || type === 'fox') ? (
    <g stroke="#999" strokeWidth="1.2" opacity="0.6">
      <line x1="26" y1="54" x2="8" y2="50" />
      <line x1="26" y1="58" x2="6" y2="58" />
      <line x1="26" y1="62" x2="8" y2="66" />
      <line x1="94" y1="54" x2="112" y2="50" />
      <line x1="94" y1="58" x2="114" y2="58" />
      <line x1="94" y1="62" x2="112" y2="66" />
    </g>
  ) : null;

  // 颜色变体
  const lightColor = {
    cat: '#FFD0DA', dog: '#FFE8CC', rabbit: '#FFD0F0', hamster: '#E8C8E8',
    fox: '#FFCCAA', panda: '#F5F5F5',
    bear: '#D7CCC8', penguin: '#E0E0E0', owl: '#D7CCC8', frog: '#A5D6A7',
    turtle: '#C8E6C9', unicorn: '#E1BEE7',
  }[type] || color;

  const bellyColor = {
    cat: lightColor, dog: '#E8D5B7', rabbit: lightColor,
    fox: '#FFE0B2', panda: 'white',
    bear: '#BCAAA4', penguin: 'white', owl: '#EFEBE9',
    frog: '#C8E6C9', turtle: '#A5D6A7', unicorn: '#F3E5F5',
  }[type] || color;

  return (
    <svg width={size} height={size * 1.5} viewBox="0 0 120 180"
      className={`pet-sprite ${celebrating ? 'pet-celebrating' : ''} ${spriteClass}`}
    >
      {/* 庆祝粒子 */}
      {celebrating && (
        <g className="pet-sparkles">
          {[0, 1, 2, 3, 4, 5].map(i => (
            <text key={i} x={20 + Math.sin(i * 1.2) * 45 + 60} y={15 + Math.cos(i * 1.2) * 20} fontSize="10" className={`sparkle-${i}`}>✨</text>
          ))}
        </g>
      )}

      {/* 身后配件（披风） */}
      {behindAccs.map(renderAccessory)}

      {/* === 身体（圆润Q版） === */}
      <ellipse cx="60" cy="120" rx="34" ry="32" fill={color} opacity="0.8" />
      <ellipse cx="60" cy="128" rx="28" ry="22" fill={bellyColor} opacity="0.4" />

      {/* 后腿 */}
      <ellipse cx="30" cy="148" rx="14" ry="12" fill={color} opacity="0.7" />
      <ellipse cx="90" cy="148" rx="14" ry="12" fill={color} opacity="0.7" />

      {/* 前腿 */}
      <path d="M36,112 Q30,136 34,156 Q36,162 42,164 L46,164 Q50,162 48,156 L48,112 Z" fill={color} opacity="0.85" />
      <path d="M84,112 Q90,136 86,156 Q84,162 78,164 L74,164 Q70,162 72,156 L72,112 Z" fill={color} opacity="0.85" />

      {/* 熊貓/企鵝專屬腿色 */}
      {type === 'panda' && (
        <>
          <path d="M36,112 Q30,136 34,156 Q36,162 42,164 L46,164 Q50,162 48,156 L48,112 Z" fill="#333" opacity="0.9" />
          <path d="M84,112 Q90,136 86,156 Q84,162 78,164 L74,164 Q70,162 72,156 L72,112 Z" fill="#333" opacity="0.9" />
          <path d="M32,108 Q60,120 88,108" fill="none" stroke="#333" strokeWidth="18" strokeLinecap="round" opacity="0.85" />
        </>
      )}
      {type === 'penguin' && (
        <path d="M36,112 Q30,136 34,156 Q36,162 42,164 L46,164 Q50,162 48,156 L48,112 Z" fill="#333" opacity="0.7" />
      )}

      {/* 脚掌 */}
      {type === 'panda' || type === 'penguin' ? (
        <><ellipse cx="42" cy="166" rx="7" ry="4" fill="#333" opacity="0.9" /><ellipse cx="78" cy="166" rx="7" ry="4" fill="#333" opacity="0.9" /></>
      ) : (
        <><ellipse cx="42" cy="166" rx="7" ry="4" fill={color} opacity="0.9" /><ellipse cx="78" cy="166" rx="7" ry="4" fill={color} opacity="0.9" /></>
      )}

      {/* 脚部配件 */}
      {footAccs.map(renderAccessory)}

      {/* 尾巴 */}
      {type === 'cat' && <path d="M90,130 Q110,118 108,100 Q106,90 112,84" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" opacity="0.7" />}
      {type === 'dog' && <path d="M92,138 Q110,128 108,110 Q106,102 112,98" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" opacity="0.7" />}
      {type === 'fox' && <path d="M88,130 Q114,120 112,94 Q110,82 108,76" fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" opacity="0.7" />}
      {type === 'rabbit' && <ellipse cx="58" cy="174" rx="8" ry="5" fill={color} opacity="0.6" />}
      {type === 'bear' && <path d="M86,140 Q112,132 110,110" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" opacity="0.6" />}
      {type === 'turtle' && <path d="M56,170 Q60,176 64,170" fill="none" stroke="#66BB6A" strokeWidth="3" strokeLinecap="round" />}
      {type === 'penguin' && <path d="M56,170 Q60,176 64,170" fill="none" stroke="#333" strokeWidth="2" />}

      {/* 身体配件 */}
      {bodyAccs.map(renderAccessory)}

      {/* 耳朵 */}
      {ears}

      {/* 头（更大更圆） */}
      <ellipse cx="60" cy="52" rx="40" ry="36" fill={color} stroke="#00000008" strokeWidth="1" />
      {/* 头部内测浅色 */}
      <ellipse cx="60" cy="48" rx="34" ry="30" fill={lightColor} opacity="0.15" />

      {/* 乌龟的壳 */}
      {type === 'turtle' && (
        <ellipse cx="60" cy="98" rx="30" ry="24" fill="#81C784" stroke="#66BB6A" strokeWidth="2" />
      )}

      {/* 头饰配件 */}
      {headAccs.map(renderAccessory)}

      {/* 腮红（更大更明显） */}
      {type !== 'panda' && (
        <>
          <ellipse cx="28" cy="60" rx="8" ry="5" fill="#FF8C9E" opacity={blushOpacity} />
          <ellipse cx="92" cy="60" rx="8" ry="5" fill="#FF8C9E" opacity={blushOpacity} />
        </>
      )}

      {/* 熊猫专属黑色眼圈 */}
      {type === 'panda' && (
        <>
          <ellipse cx="42" cy="48" rx="14" ry="11" fill="#333" opacity="0.85" />
          <ellipse cx="78" cy="48" rx="14" ry="11" fill="#333" opacity="0.85" />
        </>
      )}
      {/* 熊猫脸颊也有腮红 */}
      {type === 'panda' && (
        <>
          <ellipse cx="28" cy="60" rx="8" ry="5" fill="#FF8C9E" opacity="0.3" />
          <ellipse cx="92" cy="60" rx="8" ry="5" fill="#FF8C9E" opacity="0.3" />
        </>
      )}

      {/* 眼睛 — 大而闪亮 */}
      <ellipse cx="40" cy="48" rx="10" ry="10" fill="white" />
      <ellipse cx="80" cy="48" rx="10" ry="10" fill="white" />

      {/* 眼睑 */}
      <path d={eye} fill="none" stroke="#4A3A3A" strokeWidth="2.5" strokeLinecap="round" />
      <path d={rightEye} fill="none" stroke="#4A3A3A" strokeWidth="2.5" strokeLinecap="round" />

      {/* 瞳孔（带视线跟踪） */}
      {(mood === 'normal' || mood === 'happy' || mood === 'hungry') && !blink && (
        <>
          <circle cx={pupilLX} cy={pupilLY} r="5" fill="#4A3A3A" />
          <circle cx={pupilLX + 2} cy={pupilLY - 2} r="2" fill="white" opacity="0.9" />
          <circle cx={pupilRX} cy={pupilRY} r="5" fill="#4A3A3A" />
          <circle cx={pupilRX + 2} cy={pupilRY - 2} r="2" fill="white" opacity="0.9" />
        </>
      )}

      {/* 高光小点（闭眼时也保留小亮点） */}
      {(blink || mood === 'sad') && (
        <>
          <circle cx={pupilLX + 1.5} cy={pupilLY - 1.5} r="1.5" fill="white" opacity="0.6" />
          <circle cx={pupilRX + 1.5} cy={pupilRY - 1.5} r="1.5" fill="white" opacity="0.6" />
        </>
      )}

      {/* 面部配件 */}
      {faceAccs.map(renderAccessory)}

      {/* 鼻子 */}
      {nose}
      {/* 胡须 */}
      {whiskers}
      {/* 嘴巴 */}
      <path d={mouth} fill="none" stroke="#4A3A3A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* 舌头 */}
      {(type === 'dog' || type === 'bear' || (mood === 'excited' && type !== 'panda')) && mood !== 'sad' && (
        <ellipse cx="60" cy="68" rx="5" ry="7" fill="#FF6B8A" opacity="0.7" />
      )}

      {/* 眼泪 */}
      {mood === 'sad' && (
        <>
          <circle cx="32" cy="54" r="3" fill="#87CEEB" opacity="0.7">
            <animate attributeName="cy" values="54;64;54" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;0;0.7" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="88" cy="54" r="3" fill="#87CEEB" opacity="0.7">
            <animate attributeName="cy" values="54;64;54" dur="2s" repeatCount="indefinite" begin="0.3s" />
            <animate attributeName="opacity" values="0.7;0;0.7" dur="2s" repeatCount="indefinite" begin="0.3s" />
          </circle>
        </>
      )}

      {/* 颈部配件 */}
      {neckAccs.map(renderAccessory)}
    </svg>
  );
}

// ===== 宠物伙伴组件 =====
export default function PetCompanion({
  size = 'medium',
  showLevel = false,
  celebrating = false,
  mood: forcedMood,
  statusText,
  interactive = false,
  voiceEnabled = false,
  idleDetection = false,
  gazeTracking = false,
  onPetClick,
}) {
  const { state } = useGame();
  const { pet } = state;
  const mood = forcedMood || getPetMood(state);

  // 交互状态
  const [reaction, setReaction] = useState(null);
  const [bubble, setBubble] = useState(null);
  const [gaze, setGaze] = useState({ x: 0, y: 0 });
  const gazeRAF = useRef(null);
  const wrapRef = useRef(null);
  const reactionTimers = useRef([]);

  // 空闲检测
  const { idleState, resetIdleTimer } = usePetIdle({
    enabled: idleDetection,
    timeout: 30000,
    sleepyTimeout: 60000,
    attentionTimeout: 90000,
  });

  // 清理 reaction timers
  useEffect(() => {
    return () => reactionTimers.current.forEach(t => clearTimeout(t));
  }, []);

  // 空闲状态 → CSS class 映射
  const idleClass = idleState === 'idle' ? 'pet-sway'
    : idleState === 'sleepy' ? 'pet-sleepy'
    : idleState === 'attention' ? 'pet-call'
    : '';

  // 空闲 attention 时触发语音
  useEffect(() => {
    if (idleState === 'attention' && voiceEnabled) {
      speakPet('attention');
      showBubble('喂～陪我玩！');
    }
  }, [idleState, voiceEnabled]);

  function showBubble(text) {
    const key = Date.now() + Math.random();
    setBubble({ text, key });
    setTimeout(() => {
      setBubble(prev => prev?.key === key ? null : prev);
    }, 2500);
  }

  function handlePetTap(e) {
    if (!interactive || reaction) return;
    resetIdleTimer();
    const anims = ['pet-tap-bounce', 'pet-wiggle'];
    const chosen = anims[Math.floor(Math.random() * anims.length)];
    setReaction(chosen);
    playTapSound();
    const texts = interactive ? ['嘿嘿！', '好痒～', '嘻嘻！', '再来一下！'] : [];
    showBubble(texts[Math.floor(Math.random() * texts.length)]);
    if (voiceEnabled) speakPet('tap');
    const t = setTimeout(() => setReaction(null), 500);
    reactionTimers.current.push(t);
    onPetClick?.(e);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlePetTap(e);
    }
  }

  const handlePointerMove = useCallback((e) => {
    if (!gazeTracking || !wrapRef.current) return;
    if (gazeRAF.current) cancelAnimationFrame(gazeRAF.current);
    gazeRAF.current = requestAnimationFrame(() => {
      const rect = wrapRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = Math.max(-1, Math.min(1, (e.clientX - cx) / (rect.width * 0.6)));
      const dy = Math.max(-1, Math.min(1, (e.clientY - cy) / (rect.height * 0.6)));
      setGaze({ x: Math.round(dx * 3.5), y: Math.round(dy * 2) });
    });
  }, [gazeTracking]);

  const handlePointerLeave = useCallback(() => {
    if (!gazeTracking) return;
    if (gazeRAF.current) cancelAnimationFrame(gazeRAF.current);
    setGaze({ x: 0, y: 0 });
  }, [gazeTracking]);

  function handleInteraction(e) {
    if (idleDetection) resetIdleTimer();
    if (gazeTracking) handlePointerMove(e);
  }

  const moodMessages = {
    hungry: '有点饿了…喂我吃点东西吧~',
    sad: '想要你陪陪我…',
    happy: '今天好开心！要继续加油哦！',
    normal: '我在这里等你~',
  };

  const petSize = size === 'large' ? 100 : size === 'small' ? 50 : 70;
  const message = statusText || moodMessages[mood] || '我在这里等你~';
  const reactionClass = reaction || '';
  const breatheClass = idleState !== 'sleepy' ? 'pet-breathing' : '';

  return (
    <div className={`pet-companion pet-${size} ${interactive ? 'pet-interactive' : ''}`}
      ref={wrapRef}
      onClick={interactive ? handlePetTap : undefined}
      onKeyDown={interactive ? handleKeyDown : undefined}
      onPointerMove={gazeTracking ? handleInteraction : undefined}
      onPointerLeave={gazeTracking ? handlePointerLeave : undefined}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? `点击与${pet.name}互动` : undefined}
    >
      <div className={`pet-sprite-wrap ${idleClass}`}
        style={{ position: 'relative' }}
      >
        <PetSprite
          type={pet.type}
          color={pet.color}
          mood={mood}
          celebrating={celebrating}
          accessories={pet.accessories}
          size={petSize}
          gaze={gaze}
          spriteClass={`${reactionClass} ${breatheClass}`}
        />
        {bubble && (
          <div className="pet-bubble" key={bubble.key}>
            <span className="pet-bubble-text">{bubble.text}</span>
          </div>
        )}
      </div>
      <div className="pet-info">
        <div className="pet-name">{pet.name}</div>
        <div className="pet-mood-text">{message}</div>
        {showLevel && <ProgressBar />}
      </div>
    </div>
  );
}
