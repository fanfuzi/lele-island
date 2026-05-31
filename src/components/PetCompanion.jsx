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

// ===== 宠物角色（大 emoji 方案 — 系统自带专业设计） =====
const PET_EMOJIS = {
  cat: '🐱', dog: '🐶', rabbit: '🐰', hamster: '🐹',
  fox: '🦊', panda: '🐼', bear: '🐻', frog: '🐸',
  owl: '🦉', penguin: '🐧', unicorn: '🦄', turtle: '🐢',
};
const MOOD_EMOJI = { normal: '😊', happy: '🥰', sad: '😢', hungry: '😋', excited: '🤩', sleepy: '😴' };
const ACC_EMOJI = { 11:'🎀',12:'🌺',13:'🧣',14:'👓',15:'👑',16:'⭐',17:'🎒',18:'📿',19:'🧙',20:'👟',21:'⌚',22:'🎀',23:'🦋',24:'💫',42:'🐱',43:'🎩',44:'🎧',45:'🕶️',46:'🔔',47:'🕊️',48:'✨',49:'🍳' };

function PetSprite({ type, color, mood, celebrating, accessories, size }) {
  const [blink, setBlink] = useState(false);
  useEffect(() => {
    const t = setInterval(() => { setBlink(true); setTimeout(() => setBlink(false), 150); }, 3000 + Math.random() * 2000);
    return () => clearInterval(t);
  }, []);

  const emojis = { cat:'🐱', dog:'🐶', rabbit:'🐰', hamster:'🐹', fox:'🦊', panda:'🐼', bear:'🐻', frog:'🐸', owl:'🦉', penguin:'🐧', unicorn:'🦄', turtle:'🐢' };
  const moods = { normal:'😊', happy:'🥰', sad:'😢', hungry:'😋', excited:'🤩', sleepy:'😴' };
  const accessories_emoji = { 11:'🎀',12:'🌺',13:'🧣',14:'👓',15:'👑',16:'⭐',17:'🎒',18:'📿',19:'🧙',20:'👟',21:'⌚',22:'🎀',23:'🦋',24:'💫',42:'🐱',43:'🎩',44:'🎧',45:'🕶️',46:'🔔',47:'🕊️',48:'✨',49:'🍳' };

  const petEmoji = emojis[type] || '🐱';
  const moodEmoji = moods[mood] || '😊';
  const isLarge = (size || 50) >= 70;
  const moodBg = mood === 'sad' ? '#E3F2FD' : (mood === 'happy' || mood === 'excited') ? '#FFE0B2' : mood === 'hungry' ? '#FFF3E0' : '#FFF8E1';
  const petColor = color || '#FFB5C2';

  const accList = (accessories || []).filter(a => { const i = shopItems.find(s => s.id === a); return i && i.type === 'clothing'; });
  const headAcc = accList.filter(a => [11,12,15,22,42,43,44].includes(a));
  const faceAcc = accList.filter(a => [14,45].includes(a));
  const neckAcc = accList.filter(a => [13,16,18,23,46].includes(a));
  const bodyAcc = accList.filter(a => [17,19,21,24,47,48,49].includes(a));
  const footAcc = accList.filter(a => [20].includes(a));

  return (
    <div className={'pet-emoji-wrap' + (blink ? ' pet-blink' : '') + (celebrating ? ' pet-celebrate' : '')}
      style={{ width: size, height: size * 1.15, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

      <div style={{ position: 'absolute', width: size * 0.88, height: size * 0.88, borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 30%,' + moodBg + ',' + petColor + '33)',
        border: '3px solid ' + petColor + '44', boxShadow: '0 4px 20px ' + petColor + '33' }} />

      {isLarge && <span style={{ position: 'absolute', top: -3, right: -2, fontSize: 16, zIndex: 5,
        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}>{moodEmoji}</span>}

      <span style={{ fontSize: isLarge ? 48 : 30, lineHeight: 1, zIndex: 2, position: 'relative', top: -2,
        filter: celebrating ? 'drop-shadow(0 0 10px #FFD700)' : 'none' }}>{petEmoji}</span>

      {headAcc.map(id => <span key={id} style={{ position: 'absolute', top: isLarge?0:-3, left:'50%', transform:'translateX(-50%)', fontSize:isLarge?16:10, zIndex:3 }}>{accessories_emoji[id]||'🎀'}</span>)}
      {faceAcc.map((id,i) => <span key={id} style={{ position:'absolute', top:'28%', [i===0?'left':'right']:isLarge?6:2, fontSize:isLarge?13:8, zIndex:3 }}>{accessories_emoji[id]||'👓'}</span>)}
      {neckAcc.map(id => <span key={id} style={{ position:'absolute', bottom:isLarge?'20%':'16%', left:'50%', transform:'translateX(-50%)', fontSize:isLarge?14:9, zIndex:3 }}>{accessories_emoji[id]}</span>)}
      {bodyAcc.map((id,i) => <span key={id} style={{ position:'absolute', bottom:isLarge?'8%':'4%', [i%2===0?'left':'right']:isLarge?6:2, fontSize:isLarge?13:8, zIndex:3 }}>{accessories_emoji[id]}</span>)}
      {footAcc.length>0 && <div style={{ position:'absolute', bottom:0, left:'50%', transform:'translateX(-50%)', display:'flex', gap:4, fontSize:isLarge?12:7 }}>
        {footAcc.map(id => <span key={id}>{accessories_emoji[id]||'👟'}</span>)}</div>}
      {accList.includes(47) && <><span style={{position:'absolute', top:'35%', left:-10, fontSize:isLarge?18:11, opacity:0.7}}>🪽</span><span style={{position:'absolute', top:'35%', right:-10, fontSize:isLarge?18:11, opacity:0.7, transform:'scaleX(-1)'}}>🪽</span></>}
      {accList.includes(48) && <span style={{position:'absolute', top:-8, left:'50%', transform:'translateX(-50%)', fontSize:22, opacity:0.7}}>✨</span>}
    </div>
  );
}

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
