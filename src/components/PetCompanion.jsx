import { useState, useEffect, useRef, useCallback } from 'react';
import { useGame, getPetMood } from '../store';
import { shopItems } from '../data/shopItems';
import { playTapSound, playCorrectSound, speakPet } from '../utils/speech';
import usePetIdle from '../utils/usePetIdle';
import ProgressBar from './ProgressBar';

// ===== 配件SVG绘制 =====
function renderAccessory(accId) {
  switch (accId) {
    case 11:
      return (
        <g key={accId}>
          <polygon points="22,28 10,20 22,34" fill="#FF4444" />
          <polygon points="22,28 10,38 22,34" fill="#FF4444" />
          <circle cx="22" cy="31" r="3" fill="#CC2222" />
        </g>
      );
    case 12:
      return (
        <g key={accId}>
          <ellipse cx="60" cy="22" rx="22" ry="10" fill="#FF88AA" />
          <rect x="40" y="20" width="40" height="5" rx="2.5" fill="#FF5599" />
          <circle cx="50" cy="18" r="3" fill="#FFDD44" />
          <circle cx="65" cy="16" r="2.5" fill="#FFDD44" />
        </g>
      );
    case 15:
      return (
        <g key={accId}>
          <rect x="42" y="18" width="36" height="10" rx="2" fill="#FFD700" />
          <polygon points="42,18 44,6 50,16 56,6 60,16 66,6 72,16 78,6 78,18" fill="#FFD700" />
          <circle cx="50" cy="14" r="1.5" fill="#FF4444" />
          <circle cx="60" cy="12" r="1.5" fill="#4444FF" />
          <circle cx="70" cy="14" r="1.5" fill="#44BB44" />
        </g>
      );
    case 22:
      return (
        <g key={accId}>
          <path d="M26,32 Q60,14 94,32" fill="none" stroke="#FFB5C2" strokeWidth="3.5" />
          <circle cx="60" cy="22" r="5" fill="#FF8CA8" />
          <circle cx="60" cy="22" r="2.5" fill="#FFB5C2" />
        </g>
      );
    case 14:
      return (
        <g key={accId}>
          <circle cx="40" cy="42" r="10" fill="rgba(255,179,0,0.15)" stroke="#FFB300" strokeWidth="2.5" />
          <circle cx="80" cy="42" r="10" fill="rgba(255,179,0,0.15)" stroke="#FFB300" strokeWidth="2.5" />
          <line x1="50" y1="42" x2="70" y2="42" stroke="#FFB300" strokeWidth="2.5" />
          <line x1="30" y1="40" x2="24" y2="38" stroke="#FFB300" strokeWidth="2" />
          <line x1="90" y1="40" x2="96" y2="38" stroke="#FFB300" strokeWidth="2" />
        </g>
      );
    case 23:
      return (
        <g key={accId}>
          <polygon points="60,58 48,52 48,64" fill="#1565C0" />
          <polygon points="60,58 72,52 72,64" fill="#1565C0" />
          <circle cx="60" cy="58" r="3.5" fill="#0D47A1" />
        </g>
      );
    case 16:
      return (
        <g key={accId}>
          <path d="M36,60 Q60,66 84,60" fill="none" stroke="#FF6699" strokeWidth="3.5" />
          {[40, 48, 56, 64, 72, 80].map((x, i) => (
            <circle key={i} cx={x} cy={60 + (i % 2 === 0 ? 2 : -1)} r="2.5" fill="#FFD700" />
          ))}
        </g>
      );
    case 13:
      return (
        <g key={accId}>
          <path d="M34,60 Q60,68 86,60 L84,74 Q60,80 36,74 Z" fill="#4FC3F7" />
          <path d="M44,72 L48,88 Q50,90 54,88 L52,74" fill="#4FC3F7" />
          <path d="M36,64 Q60,70 84,64" fill="none" stroke="#29B6F6" strokeWidth="1.5" strokeDasharray="3,3" />
        </g>
      );
    case 18:
      return (
        <g key={accId}>
          {[36, 42, 48, 54, 60, 66, 72, 78, 84].map((x, i) => (
            <circle key={i} cx={x} cy={54 + Math.sin(i * 0.7) * 10} r="3" fill="white" stroke="#DDD" strokeWidth="0.5" />
          ))}
        </g>
      );
    case 17:
      return (
        <g key={accId}>
          <rect x="76" y="68" width="22" height="26" rx="5" fill="#8D6E63" />
          <rect x="80" y="72" width="14" height="6" rx="2" fill="#6D4C41" />
          <line x1="87" y1="68" x2="84" y2="56" stroke="#5D4037" strokeWidth="2" />
          <line x1="87" y1="68" x2="92" y2="56" stroke="#5D4037" strokeWidth="2" />
        </g>
      );
    case 19:
      return (
        <g key={accId} className="accessory-back">
          <path d="M32,62 Q60,56 88,62 L94,104 Q60,112 26,104 Z" fill="#7E57C2" opacity="0.55" />
          <path d="M36,62 Q60,58 84,62" fill="none" stroke="#5E35B1" strokeWidth="1.5" />
        </g>
      );
    case 21:
      return (
        <g key={accId}>
          <rect x="16" y="76" width="14" height="11" rx="3" fill="#FFD700" />
          <rect x="18" y="78" width="10" height="7" rx="2" fill="white" />
          <line x1="19" y1="76" x2="19" y2="70" stroke="#FFD700" strokeWidth="2" />
          <line x1="27" y1="76" x2="27" y2="70" stroke="#FFD700" strokeWidth="2" />
          <circle cx="23" cy="81" r="1.5" fill="#333" />
        </g>
      );
    case 24:
      return (
        <g key={accId}>
          <rect x="88" y="78" width="12" height="7" rx="3" fill="#FF8A65" />
          {[90, 94, 98].map((x, i) => (
            <circle key={i} cx={x} cy="81" r="1.5" fill="#FFAB91" />
          ))}
        </g>
      );
    case 20:
      return (
        <g key={accId}>
          <ellipse cx="42" cy="97" rx="11" ry="5" fill="#42A5F5" />
          <rect x="33" y="93" width="18" height="4" rx="2" fill="#1E88E5" />
          <line x1="36" y1="93" x2="38" y2="88" stroke="#1E88E5" strokeWidth="1.5" />
          <ellipse cx="78" cy="97" rx="11" ry="5" fill="#42A5F5" />
          <rect x="69" y="93" width="18" height="4" rx="2" fill="#1E88E5" />
          <line x1="72" y1="93" x2="74" y2="88" stroke="#1E88E5" strokeWidth="1.5" />
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

  // 表情
  const eye = {
    normal: blink ? 'M35,42 Q40,38 45,42' : 'M35,42 Q40,36 45,42',
    happy: 'M35,42 Q40,36 45,42',
    excited: 'M35,40 L38,36 L41,40 M44,40 L47,36 L50,40',
    sad: 'M35,44 Q40,47 45,44',
    hungry: blink ? 'M35,42 Q40,38 45,42' : 'M35,42 Q40,36 45,42',
  }[mood] || 'M35,42 Q40,36 45,42';

  const rightEye = {
    normal: blink ? 'M75,42 Q80,38 85,42' : 'M75,42 Q80,36 85,42',
    happy: 'M75,42 Q80,36 85,42',
    excited: 'M75,40 L78,36 L81,40 M84,40 L87,36 L90,40',
    sad: 'M75,44 Q80,47 85,44',
    hungry: blink ? 'M75,42 Q80,38 85,42' : 'M75,42 Q80,36 85,42',
  }[mood] || 'M75,42 Q80,36 85,42';

  const mouth = {
    normal: 'M55,56 Q60,60 65,56',
    happy: 'M50,56 Q60,68 70,56',
    excited: 'M48,54 Q60,70 72,54',
    sad: 'M52,62 Q60,58 68,62',
    hungry: 'M50,56 Q60,68 70,56',
  }[mood] || 'M55,56 Q60,60 65,56';

  const blushOpacity = (mood === 'happy' || mood === 'excited') ? 0.5 : (mood === 'normal' ? 0.2 : 0);

  // 瞳孔偏移（视线跟踪用）
  // 在 sad / excited 时固定瞳孔位置（不跟踪）
  const useGaze = gaze && (mood === 'normal' || mood === 'happy' || mood === 'hungry');
  const pupilLX = useGaze ? 40 + gaze.x : 40;
  const pupilLY = useGaze ? 42 + gaze.y : 42;
  const pupilRX = useGaze ? 80 + gaze.x : 80;
  const pupilRY = useGaze ? 42 + gaze.y : 42;

  // 配件分组
  const accIds = (accessories || []).filter(a => {
    const item = shopItems.find(i => i.id === a);
    return item && item.type === 'clothing';
  });
  const behindAccs = accIds.filter(a => [19].includes(a));
  const footAccs = accIds.filter(a => [20].includes(a));
  const bodyAccs = accIds.filter(a => [17, 21, 24].includes(a));

  // 耳朵
  const ears = {
    cat: (
      <g>
        <polygon points="25,32 18,8 38,28" fill={color} stroke="#00000018" strokeWidth="1" />
        <polygon points="35,28 28,14 42,26" fill="#FFB5C2" opacity="0.6" />
        <polygon points="95,32 102,8 82,28" fill={color} stroke="#00000018" strokeWidth="1" />
        <polygon points="85,28 92,14 78,26" fill="#FFB5C2" opacity="0.6" />
      </g>
    ),
    dog: (
      <g>
        <ellipse cx="28" cy="36" rx="18" ry="24" fill={color} stroke="#00000018" strokeWidth="1" transform="rotate(-20 28 36)" />
        <ellipse cx="26" cy="46" rx="10" ry="14" fill="#E8D5B7" opacity="0.5" transform="rotate(-20 26 46)" />
        <ellipse cx="92" cy="36" rx="18" ry="24" fill={color} stroke="#00000018" strokeWidth="1" transform="rotate(20 92 36)" />
        <ellipse cx="94" cy="46" rx="10" ry="14" fill="#E8D5B7" opacity="0.5" transform="rotate(20 94 46)" />
      </g>
    ),
    rabbit: (
      <g>
        <ellipse cx="32" cy="16" rx="10" ry="30" fill={color} stroke="#00000018" strokeWidth="1" transform="rotate(-15 32 16)" />
        <ellipse cx="32" cy="22" rx="6" ry="20" fill="#FFB5E6" opacity="0.5" transform="rotate(-15 32 22)" />
        <ellipse cx="88" cy="16" rx="10" ry="30" fill={color} stroke="#00000018" strokeWidth="1" transform="rotate(15 88 16)" />
        <ellipse cx="88" cy="22" rx="6" ry="20" fill="#FFB5E6" opacity="0.5" transform="rotate(15 88 22)" />
      </g>
    ),
    hamster: (
      <g>
        <ellipse cx="20" cy="38" rx="10" ry="8" fill={color} stroke="#00000018" strokeWidth="1" />
        <ellipse cx="20" cy="38" rx="5" ry="4" fill="#FFB5C2" opacity="0.5" />
        <ellipse cx="100" cy="38" rx="10" ry="8" fill={color} stroke="#00000018" strokeWidth="1" />
        <ellipse cx="100" cy="38" rx="5" ry="4" fill="#FFB5C2" opacity="0.5" />
      </g>
    ),
  }[type] || null;

  const nose = {
    cat: <ellipse cx="60" cy="48" rx="4" ry="3" fill="#FF8C9E" />,
    dog: <ellipse cx="60" cy="48" rx="6" ry="5" fill="#4A3A3A" />,
    rabbit: <ellipse cx="60" cy="48" rx="3" ry="2.5" fill="#FFB5C2" />,
    hamster: <ellipse cx="60" cy="48" rx="3" ry="2.5" fill="#FFB5C2" />,
  }[type] || null;

  const whiskers = (type === 'cat' || type === 'hamster') ? (
    <g stroke="#999" strokeWidth="1.2" opacity="0.6">
      <line x1="28" y1="46" x2="8" y2="42" />
      <line x1="28" y1="50" x2="6" y2="50" />
      <line x1="28" y1="54" x2="8" y2="58" />
      <line x1="92" y1="46" x2="112" y2="42" />
      <line x1="92" y1="50" x2="114" y2="50" />
      <line x1="92" y1="54" x2="112" y2="58" />
    </g>
  ) : null;

  return (
    <svg width={size} height={size} viewBox="0 0 120 120"
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

      {/* 身后配件 */}
      {behindAccs.map(renderAccessory)}

      {/* 身体 */}
      <ellipse cx="60" cy="85" rx="32" ry="20" fill={color} opacity="0.7" stroke="#00000010" strokeWidth="1" />

      {/* 身体配件 */}
      {bodyAccs.map(renderAccessory)}

      {/* 脚 */}
      <ellipse cx="42" cy="95" rx="10" ry="6" fill={color} opacity="0.8" />
      <ellipse cx="78" cy="95" rx="10" ry="6" fill={color} opacity="0.8" />
      {footAccs.map(renderAccessory)}

      {/* 耳朵 */}
      {ears}

      {/* 耳侧配件 */}
      {accIds.filter(a => a === 11).map(renderAccessory)}

      {/* 头 */}
      <ellipse cx="60" cy="48" rx="36" ry="32" fill={color} stroke="#00000010" strokeWidth="1" />
      {accIds.filter(a => [12, 15, 22].includes(a)).map(renderAccessory)}

      {/* 腮红 */}
      <ellipse cx="30" cy="55" rx="8" ry="5" fill="#FF8C9E" opacity={blushOpacity} />
      <ellipse cx="90" cy="55" rx="8" ry="5" fill="#FF8C9E" opacity={blushOpacity} />

      {/* 眼睛 */}
      <ellipse cx="40" cy="42" rx="8" ry="8" fill="white" />
      <ellipse cx="80" cy="42" rx="8" ry="8" fill="white" />

      {/* 眼睑 */}
      <path d={eye} fill="none" stroke="#4A3A3A" strokeWidth="2.5" strokeLinecap="round" />
      <path d={rightEye} fill="none" stroke="#4A3A3A" strokeWidth="2.5" strokeLinecap="round" />

      {/* 瞳孔（带视线跟踪） */}
      {(mood === 'normal' || mood === 'happy' || mood === 'hungry') && !blink && (
        <>
          <circle cx={pupilLX} cy={pupilLY} r="3.5" fill="#4A3A3A" />
          <circle cx={pupilLX + 1.5} cy={pupilLY - 1.5} r="1.5" fill="white" opacity="0.8" />
          <circle cx={pupilRX} cy={pupilRY} r="3.5" fill="#4A3A3A" />
          <circle cx={pupilRX + 1.5} cy={pupilRY - 1.5} r="1.5" fill="white" opacity="0.8" />
        </>
      )}

      {/* 眼镜 */}
      {accIds.filter(a => a === 14).map(renderAccessory)}

      {/* 鼻子 */}
      {nose}
      {/* 胡须 */}
      {whiskers}
      {/* 嘴巴 */}
      <path d={mouth} fill="none" stroke="#4A3A3A" strokeWidth="2" strokeLinecap="round" />

      {/* 舌头 */}
      {(type === 'dog' || mood === 'excited') && mood !== 'sad' && (
        <ellipse cx="60" cy="64" rx="4" ry="6" fill="#FF6B8A" opacity="0.7" />
      )}

      {/* 眼泪 */}
      {mood === 'sad' && (
        <>
          <circle cx="32" cy="48" r="2.5" fill="#87CEEB" opacity="0.8">
            <animate attributeName="cy" values="48;56;48" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="88" cy="48" r="2.5" fill="#87CEEB" opacity="0.8">
            <animate attributeName="cy" values="48;56;48" dur="2s" repeatCount="indefinite" begin="0.3s" />
            <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite" begin="0.3s" />
          </circle>
        </>
      )}

      {/* 颈部配件 */}
      {accIds.filter(a => [23, 16, 13, 18].includes(a)).map(renderAccessory)}
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
  const [reaction, setReaction] = useState(null); // bounce | wiggle | null
  const [bubble, setBubble] = useState(null); // { text, key }
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

  // 显示气泡
  function showBubble(text) {
    const key = Date.now() + Math.random();
    setBubble({ text, key });
    setTimeout(() => {
      setBubble(prev => prev?.key === key ? null : prev);
    }, 2500);
  }

  // 点击/触摸处理
  function handlePetTap(e) {
    if (!interactive || reaction) return;

    // 重置空闲计时器
    resetIdleTimer();

    // 随机动画
    const anims = ['pet-tap-bounce', 'pet-wiggle'];
    const chosen = anims[Math.floor(Math.random() * anims.length)];
    setReaction(chosen);
    playTapSound();

    // 随机气泡文字
    const texts = interactive ? ['嘿嘿！', '好痒～', '嘻嘻！', '再来一下！'] : [];
    showBubble(texts[Math.floor(Math.random() * texts.length)]);

    // 语音
    if (voiceEnabled) speakPet('tap');

    // 清除 reaction 动画
    const t = setTimeout(() => setReaction(null), 500);
    reactionTimers.current.push(t);

    onPetClick?.(e);
  }

  // 键盘支持
  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlePetTap(e);
    }
  }

  // 视线跟踪
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

  // 视线重置（移出宠物区域时回归中心）
  const handlePointerLeave = useCallback(() => {
    if (!gazeTracking) return;
    if (gazeRAF.current) cancelAnimationFrame(gazeRAF.current);
    setGaze({ x: 0, y: 0 });
  }, [gazeTracking]);

  // 交互时重置空闲
  function handleInteraction(e) {
    if (idleDetection) resetIdleTimer();
    if (gazeTracking) handlePointerMove(e);
  }

  // 心情消息
  const moodMessages = {
    hungry: '有点饿了…喂我吃点东西吧~',
    sad: '想要你陪陪我…',
    happy: '今天好开心！要继续加油哦！',
    normal: '我在这里等你~',
  };

  const petSize = size === 'large' ? 100 : size === 'small' ? 50 : 70;
  const message = statusText || moodMessages[mood] || '我在这里等你~';

  // reaction 动画的 CSS class
  const reactionClass = reaction || '';
  // 持续呼吸（只要不是 sleepy 就呼吸）
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

        {/* 语音气泡 */}
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
