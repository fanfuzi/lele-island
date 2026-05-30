import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'lele-island-data';

const initialState = {
  // 宠物
  pet: {
    type: 'cat',     // cat, dog, rabbit, hamster
    name: '团子',
    color: '#FFB5C2', // 粉色
    accessories: [],  // 已穿戴的装备id
    hunger: 80,       // 饱食度 0-100
    happiness: 80,    // 心情 0-100
    energy: 80,       // 活力 0-100
    health: 80,       // 健康 0-100
    cleanliness: 80,  // 清洁度 0-100
    exp: 0,           // 经验值
    level: 1,         // 等级
  },
  // 经济
  coins: 0,
  stars: 0,
  inventory: [],      // 已购买的道具id列表
  furniture: [],      // 已摆放的家具id列表
  // 进度
  dailyProgress: {
    date: '',
    cantonese: { done: false, score: 0, questionsDone: 0 },
    chinese: { done: false, score: 0, questionsDone: 0 },
    math: { done: false, score: 0, questionsDone: 0 },
    english: { done: false, score: 0, questionsDone: 0 },
    gs: { done: false, score: 0, questionsDone: 0 },
  },
  streak: 0,           // 连续打卡天数
  // 成就
  achievements: [],
  // 各科目学习记录
  cantoneseUnlocked: 1,   // 已解锁的最大level
  chineseUnlocked: 1,
  mathUnlocked: 1,
  englishUnlocked: 1,
  gsUnlocked: 1,
  // 用户年级 (小一 ~ 中三)
  userGrade: 'p3',
  // 战绩统计
  stats: {
    totalQuestions: 0,
    correctAnswers: 0,
    daysActive: 0,
  },
  // 错题记录
  wrongRecords: {
    math: [],
    cantonese: [],
    chinese: [],
    english: [],
    gs: [],
  },
  // 是否显示引导
  showTutorial: true,
  // 收藏的字（用于反复练习）
  savedChars: [],
  // 每个字今日练习次数（防刷星）
  writtenCharCounts: {},
  // 最后活跃时间（用于离线衰减计算）
  lastActive: Date.now(),
  // 掌握度追踪（按知识点）
  mastery: {
    math: {},
    chinese: {},
    cantonese: {},
    english: {},
    gs: {},
  },
  // 习惯养成记录
  habitLog: [],
  // 诊断记录
  diagnosisHistory: [],
  // AI 助教上传内容存档
  uploadArchives: [],
  // === 学习-玩耍循环机制 ===
  // 今日累计学习时长（分钟）
  dailyStudyMinutes: 0,
  // 今日累计玩耍时长（分钟）
  dailyPetPlayMinutes: 0,
  // 每轮学习时长（分钟）— 学满后解锁玩耍
  studySessionMinutes: 25,
  // 每轮玩耍时长（分钟）
  playSessionMinutes: 5,
  // 当前剩余可玩时长（分钟）— 学完一轮+10，玩完归零
  playMinutesAvailable: 0,
  // 上次记录学习时间的时间戳
  lastStudyTick: 0,
};

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // 合并默认值（防止新增字段缺失）
      const merged = { ...initialState, ...parsed, dailyProgress: { ...initialState.dailyProgress, ...parsed.dailyProgress } };

      // 深度合并 pet 对象，确保新属性（energy/health/cleanliness）不被旧存档覆盖
      merged.pet = { ...initialState.pet, ...parsed.pet };

      // 旧用户（已有宠物）赠送 5 星启动金
      if (parsed.pet && parsed.pet.type && !('stars' in parsed)) {
        merged.stars = 5;
      }

      // 离线衰减：根据时间流逝降低各项属性
      const now = Date.now();
      const lastActive = merged.lastActive || now;
      const hoursPassed = (now - lastActive) / (1000 * 60 * 60);
      if (hoursPassed > 0.5) {
        const decayPerHour = 5;
        const decay = Math.min(100, Math.round(hoursPassed * decayPerHour));
        merged.pet.hunger = Math.max(0, merged.pet.hunger - decay);
        merged.pet.happiness = Math.max(0, merged.pet.happiness - decay);
        // 新属性离线衰减（幅度减半）
        const lightDecay = Math.min(50, Math.round(hoursPassed * 2.5));
        merged.pet.energy = Math.max(0, (merged.pet.energy || 80) - lightDecay);
        merged.pet.cleanliness = Math.max(0, (merged.pet.cleanliness || 80) - lightDecay);
        merged.pet.health = Math.max(0, (merged.pet.health || 80) - Math.round(lightDecay / 2));
      }

      merged.lastActive = now;

      // 新的一天重置每日计数器
      const todayStr = new Date().toDateString();
      if (merged.dailyProgress.date !== todayStr) {
        merged.dailyStudyMinutes = 0;
        merged.dailyPetPlayMinutes = 0;
        merged.playMinutesAvailable = 0;
      }

      return merged;
    }
  } catch (e) {
    console.warn('Failed to load state:', e);
  }
  return initialState;
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save state:', e);
  }
}

function gameReducer(state, action) {
  switch (action.type) {
    case 'INIT': {
      if (!action.payload) return initialState;
      // Deep merge to prevent losing nested fields from initialState
      const p = action.payload;
      return {
        ...initialState,
        ...p,
        pet: { ...initialState.pet, ...p.pet },
        dailyProgress: { ...initialState.dailyProgress, ...p.dailyProgress },
        stats: { ...initialState.stats, ...p.stats },
        wrongRecords: { ...initialState.wrongRecords, ...p.wrongRecords },
        mastery: { ...initialState.mastery, ...p.mastery },
        uploadArchives: p.uploadArchives || [],
      };
    }

    case 'CHOOSE_PET': {
      return { ...state, pet: { ...state.pet, type: action.payload.type, color: action.payload.color } };
    }

    case 'SET_PET_NAME': {
      return { ...state, pet: { ...state.pet, name: action.payload } };
    }

    case 'SET_PET_COLOR': {
      return { ...state, pet: { ...state.pet, color: action.payload } };
    }

    case 'FEED_PET': {
      const newHunger = Math.min(100, state.pet.hunger + action.payload);
      return { ...state, pet: { ...state.pet, hunger: newHunger }, lastActive: Date.now() };
    }

    case 'PLAY_WITH_PET': {
      const newHappiness = Math.min(100, state.pet.happiness + action.payload);
      return { ...state, pet: { ...state.pet, happiness: newHappiness }, lastActive: Date.now() };
    }

    case 'ADD_COINS': {
      return { ...state, coins: state.coins + action.payload };
    }

    case 'SPEND_COINS': {
      if (state.coins < action.payload) return state;
      return { ...state, coins: state.coins - action.payload };
    }

    case 'ADD_STARS': {
      return { ...state, stars: state.stars + action.payload };
    }

    case 'SPEND_STARS': {
      if (state.stars < action.payload) return state;
      return { ...state, stars: state.stars - action.payload };
    }

    case 'BUY_ITEM': {
      const item = action.payload;
      const currency = item.priceType || 'coins';
      if (currency === 'stars') {
        if (state.stars < item.price) return state;
      } else {
        if (state.coins < item.price) return state;
      }
      if (state.inventory.includes(item.id)) return state;
      const newState = {
        ...state,
        inventory: [...state.inventory, item.id],
        lastActive: Date.now(),
      };
      if (currency === 'stars') {
        newState.stars = state.stars - item.price;
      } else {
        newState.coins = state.coins - item.price;
      }
      // 食物类道具购买后自动喂养宠物
      if (item.type === 'food') {
        newState.pet = {
          ...state.pet,
          hunger: Math.min(100, state.pet.hunger + 15),
          happiness: Math.min(100, state.pet.happiness + 5),
        };
      }
      return newState;
    }

    case 'WEAR_ACCESSORY': {
      const accId = action.payload;
      const wearing = state.pet.accessories;
      if (wearing.includes(accId)) {
        return { ...state, pet: { ...state.pet, accessories: wearing.filter(id => id !== accId) }, lastActive: Date.now() };
      }
      return { ...state, pet: { ...state.pet, accessories: [...wearing, accId], happiness: Math.min(100, state.pet.happiness + 3) }, lastActive: Date.now() };
    }

    case 'CLEAN_PET': {
      const amount = action.payload || 20;
      return {
        ...state,
        pet: { ...state.pet, cleanliness: Math.min(100, state.pet.cleanliness + amount) },
        lastActive: Date.now(),
      };
    }

    case 'PLACE_FURNITURE': {
      const furnId = action.payload;
      const placed = state.furniture;
      const existing = placed.find(f => f.id === furnId);
      if (existing) {
        return { ...state, furniture: placed.filter(f => f.id !== furnId), lastActive: Date.now() };
      }
      if (placed.length >= 6) return state; // 最多放6件
      // 默认位置：分散摆放，避免重叠
      const defaultPositions = [
        { x: 15, y: 55 }, { x: 70, y: 55 },
        { x: 10, y: 70 }, { x: 75, y: 70 },
        { x: 40, y: 60 }, { x: 40, y: 75 },
      ];
      const pos = defaultPositions[placed.length] || { x: 30, y: 60 };
      return {
        ...state,
        furniture: [...placed, { id: furnId, x: pos.x, y: pos.y }],
        lastActive: Date.now(),
      };
    }

    case 'MOVE_FURNITURE': {
      const { id, x, y } = action.payload;
      return {
        ...state,
        furniture: state.furniture.map(f => f.id === id ? { ...f, x, y } : f),
        lastActive: Date.now(),
      };
    }

    case 'COMPLETE_QUEST': {
      const { subject, score, questionsDone } = action.payload;
      const today = new Date().toDateString();
      const wasAlreadyDone = state.dailyProgress.date === today &&
        state.dailyProgress[subject].done;

      const newProgress = {
        ...state.dailyProgress,
        date: today,
        [subject]: { done: true, score, questionsDone },
      };

      // 检查是否五个科目都完成了
      const allDone = ['cantonese', 'chinese', 'math', 'english', 'gs'].every(
        s => newProgress[s].done
      );

      const bonusCoins = allDone ? 10 : 0;
      const newCoins = state.coins + score + bonusCoins;
      // 星级奖励：10金币 = 1星，全部完成额外+1
      const totalEarned = score + bonusCoins;
      const starGain = Math.floor(totalEarned / 10) + (allDone ? 1 : 0);
      const newStars = state.stars + starGain;

      // 经验值
      const expGain = questionsDone * 5 + (score > 70 ? 10 : 0);
      const newExp = state.pet.exp + expGain;
      const newLevel = Math.floor(newExp / 100) + 1;

      // 连续打卡
      let newStreak = state.streak;
      if (!wasAlreadyDone) {
        if (state.dailyProgress.date !== today) {
          const yesterday = new Date(Date.now() - 86400000).toDateString();
          if (state.dailyProgress.date === yesterday) {
            newStreak = state.streak + 1;
          } else {
            newStreak = 1;
          }
        }
      }

      // 成就检查
      const newAchievements = [...state.achievements];
      if (allDone && !newAchievements.includes('all-done')) {
        newAchievements.push('all-done');
      }
      if (newStreak >= 7 && !newAchievements.includes('7day')) {
        newAchievements.push('7day');
      }
      if (newLevel >= 3 && !newAchievements.includes('level3')) {
        newAchievements.push('level3');
      }

      // 学习时长估算：每题约 30 秒
      const studyGain = Math.max(1, Math.round(questionsDone * 0.5));
      const newDailyStudy = (state.dailyStudyMinutes || 0) + studyGain;
      // 检查是否完成新一轮学习（每满25分钟解锁10分钟玩耍）
      const sessionLen = state.studySessionMinutes || 25;
      const playLen = state.playSessionMinutes || 10;
      const prevCycles = Math.floor((state.dailyStudyMinutes || 0) / sessionLen);
      const newCycles = Math.floor(newDailyStudy / sessionLen);
      const newUnlocks = newCycles - prevCycles;

      return {
        ...state,
        dailyProgress: newProgress,
        coins: newCoins,
        stars: newStars,
        streak: newStreak,
        achievements: newAchievements,
        pet: {
          ...state.pet,
          exp: newExp,
          level: newLevel,
          happiness: Math.min(100, state.pet.happiness + 5),
        },
        stats: {
          ...state.stats,
          totalQuestions: state.stats.totalQuestions + questionsDone,
          correctAnswers: state.stats.correctAnswers + Math.round(score / 100 * questionsDone),
        },
        dailyStudyMinutes: newDailyStudy,
        playMinutesAvailable: (state.playMinutesAvailable || 0) + (newUnlocks * playLen),
        lastStudyTick: Date.now(),
      };
    }

    case 'UNLOCK_LEVEL': {
      const { subject, level } = action.payload;
      const key = subject === 'cantonese' ? 'cantoneseUnlocked' :
                  subject === 'chinese' ? 'chineseUnlocked' :
                  subject === 'english' ? 'englishUnlocked' :
                  subject === 'gs' ? 'gsUnlocked' : 'mathUnlocked';
      if (level > state[key]) {
        return { ...state, [key]: level };
      }
      return state;
    }

    case 'DISMISS_TUTORIAL': {
      return { ...state, showTutorial: false };
    }

    case 'RESET_DAILY': {
      const today = new Date().toDateString();
      if (state.dailyProgress.date !== today) {
        return {
          ...state,
          dailyProgress: { ...initialState.dailyProgress, date: today },
          dailyStudyMinutes: 0,
          dailyPetPlayMinutes: 0,
          playMinutesAvailable: 0,
        };
      }
      return state;
    }

    case 'SET_GRADE': {
      const newGrade = action.payload;
      const gradeConfig = GRADE_CONFIG.find(g => g.id === newGrade);
      const gradeLevel = gradeConfig?.level || 2;
      // 自动调整解锁等级以匹配年级
      const minLevel = gradeLevel >= 3 ? 2 : 1;
      return {
        ...state,
        userGrade: newGrade,
        cantoneseUnlocked: Math.max(state.cantoneseUnlocked, minLevel),
        chineseUnlocked: Math.max(state.chineseUnlocked, minLevel),
        mathUnlocked: Math.max(state.mathUnlocked, minLevel),
        englishUnlocked: Math.max(state.englishUnlocked, minLevel),
        gsUnlocked: Math.max(state.gsUnlocked, minLevel),
      };
    }

    case 'RECORD_STATS': {
      const { correct, total } = action.payload;
      return {
        ...state,
        stats: {
          ...state.stats,
          totalQuestions: state.stats.totalQuestions + total,
          correctAnswers: state.stats.correctAnswers + correct,
        },
      };
    }

    case 'RECORD_WRONG_ANSWER': {
      const { subject, category, questionId } = action.payload;
      const records = state.wrongRecords[subject] || [];
      // 避免重复记录同一题
      if (records.some(r => r.questionId === questionId)) return state;
      const newRecord = { category, questionId, timestamp: Date.now() };
      return {
        ...state,
        wrongRecords: {
          ...state.wrongRecords,
          [subject]: [...records, newRecord],
        },
      };
    }

    case 'CLEAR_WRONG_RECORDS': {
      const { subject, category } = action.payload;
      if (!subject || !state.wrongRecords[subject]) return state;
      if (category) {
        return {
          ...state,
          wrongRecords: {
            ...state.wrongRecords,
            [subject]: state.wrongRecords[subject].filter(r => r.category !== category),
          },
        };
      }
      return {
        ...state,
        wrongRecords: { ...state.wrongRecords, [subject]: [] },
      };
    }

    case 'SAVE_CHAR': {
      const charId = action.payload;
      if (state.savedChars.includes(charId)) {
        return { ...state, savedChars: state.savedChars.filter(id => id !== charId) };
      }
      return { ...state, savedChars: [...state.savedChars, charId] };
    }

    case 'RECORD_WRITTEN_CHAR': {
      const charId = action.payload;
      const counts = { ...state.writtenCharCounts };
      counts[charId] = (counts[charId] || 0) + 1;
      return { ...state, writtenCharCounts: counts };
    }

    case 'RESET_WRITTEN_COUNTS': {
      return { ...state, writtenCharCounts: {} };
    }

    case 'DECAY_PET': {
      const hungerDecay = action.payload?.hunger ?? 2;
      const happinessDecay = action.payload?.happiness ?? 2;
      const cleanDecay = action.payload?.cleanliness ?? 1;
      return {
        ...state,
        pet: {
          ...state.pet,
          hunger: Math.max(0, state.pet.hunger - hungerDecay),
          happiness: Math.max(0, state.pet.happiness - happinessDecay),
          energy: Math.max(0, (state.pet.energy || 80) - Math.round(hungerDecay / 2)),
          health: Math.max(0, (state.pet.health || 80) - (hungerDecay > 2 ? 1 : 0)),
          cleanliness: Math.max(0, (state.pet.cleanliness || 80) - cleanDecay),
        },
        lastActive: Date.now(),
      };
    }

    case 'UPDATE_MASTERY': {
      const { subject, category, correct, total } = action.payload;
      const subjectMastery = { ...(state.mastery[subject] || {}) };
      const old = subjectMastery[category] || { level: 0, correct: 0, total: 0, lastReview: 0 };
      const newTotal = old.total + total;
      const newCorrect = old.correct + correct;
      const newLevel = newTotal > 0 ? newCorrect / newTotal : 0;
      subjectMastery[category] = { level: newLevel, correct: newCorrect, total: newTotal, lastReview: Date.now() };
      return {
        ...state,
        mastery: { ...state.mastery, [subject]: subjectMastery },
      };
    }

    case 'RECORD_HABIT': {
      const habitEntry = { ...action.payload, timestamp: Date.now() };
      return { ...state, habitLog: [...state.habitLog, habitEntry] };
    }

    case 'RECORD_DIAGNOSIS': {
      const diagnosisEntry = { ...action.payload, timestamp: Date.now() };
      return {
        ...state,
        diagnosisHistory: [...state.diagnosisHistory, diagnosisEntry],
        lastActive: Date.now(),
      };
    }

    case 'SAVE_UPLOAD_ARCHIVE': {
      const archive = action.payload.id
        ? action.payload
        : { ...action.payload, id: Date.now() + '-' + Math.random().toString(36).slice(2, 6) };
      return {
        ...state,
        uploadArchives: [archive, ...(state.uploadArchives || [])].slice(0, 20),
        lastActive: Date.now(),
      };
    }

    case 'DELETE_UPLOAD_ARCHIVE': {
      return {
        ...state,
        uploadArchives: state.uploadArchives.filter(a => a.id !== action.payload),
        lastActive: Date.now(),
      };
    }

    case 'MARK_ARCHIVE_PRACTICED': {
      return {
        ...state,
        uploadArchives: state.uploadArchives.map(a =>
          a.id === action.payload ? { ...a, practiced: true } : a
        ),
        lastActive: Date.now(),
      };
    }

    case 'ADD_STUDY_TIME': {
      // 完成学习任务时调用，payload 为分钟数
      const minutes = action.payload || 1;
      const newDailyStudy = (state.dailyStudyMinutes || 0) + minutes;
      const sessionLen = state.studySessionMinutes || 25;
      const playLen = state.playSessionMinutes || 10;
      // 检查是否完成新一轮学习（每满25分钟解锁10分钟玩耍）
      const prevCycles = Math.floor((state.dailyStudyMinutes || 0) / sessionLen);
      const newCycles = Math.floor(newDailyStudy / sessionLen);
      const newUnlocks = newCycles - prevCycles;
      return {
        ...state,
        dailyStudyMinutes: newDailyStudy,
        playMinutesAvailable: (state.playMinutesAvailable || 0) + (newUnlocks * playLen),
        lastStudyTick: Date.now(),
      };
    }

    case 'USE_PET_PLAY_TIME': {
      // 玩宠物时调用，payload 为分钟数
      const minutes = action.payload || 1;
      return {
        ...state,
        dailyPetPlayMinutes: (state.dailyPetPlayMinutes || 0) + minutes,
        playMinutesAvailable: Math.max(0, (state.playMinutesAvailable || 0) - minutes),
      };
    }

    case 'UPDATE_PET_PLAY_SETTINGS': {
      // 家长设置，payload: { studySessionMinutes?, playSessionMinutes? }
      return {
        ...state,
        ...(action.payload.studySessionMinutes !== undefined && { studySessionMinutes: action.payload.studySessionMinutes }),
        ...(action.payload.playSessionMinutes !== undefined && { playSessionMinutes: action.payload.playSessionMinutes }),
      };
    }

    default:
      return state;
  }
}

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, null, loadState);

  // 自动保存
  useEffect(() => {
    if (state) saveState(state);
  }, [state]);

  // 每日重置检查
  useEffect(() => {
    if (state) {
      dispatch({ type: 'RESET_DAILY' });
    }
  }, []);

  // 在线衰减：每3分钟减少饱食度和心情（鼓励持续互动）
  useEffect(() => {
    if (!state) return;
    const timer = setInterval(() => {
      dispatch({ type: 'DECAY_PET', payload: { hunger: 2, happiness: 2 } });
    }, 180000);
    return () => clearInterval(timer);
  }, []);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}

// 辅助方法
export function getPetEmoji(type) {
  const emojis = { cat: '🐱', dog: '🐶', rabbit: '🐰', hamster: '🐹', fox: '🦊', panda: '🐼' };
  return emojis[type] || '🐱';
}

// 年级配置（含新旧双级体系）
const GRADE_CONFIG = [
  { id: 'p1', label: '小一', level: 1, curriculumLevel: 1 },
  { id: 'p2', label: '小二', level: 1, curriculumLevel: 2 },
  { id: 'p3', label: '小三', level: 2, curriculumLevel: 3 },
  { id: 'p4', label: '小四', level: 2, curriculumLevel: 4 },
  { id: 'p5', label: '小五', level: 3, curriculumLevel: 5 },
  { id: 'p6', label: '小六', level: 3, curriculumLevel: 6 },
  { id: 'f1', label: '中一', level: 3, curriculumLevel: 7 },
  { id: 'f2', label: '中二', level: 3, curriculumLevel: 8 },
  { id: 'f3', label: '中三', level: 3, curriculumLevel: 9 },
];

export function getGradeLabel(gradeId) {
  return GRADE_CONFIG.find(g => g.id === gradeId)?.label || '小三';
}

export function getGradeMaxLevel(gradeId) {
  return GRADE_CONFIG.find(g => g.id === gradeId)?.level || 2;
}

// 获取年级对应的curriculumLevel（新9级体系）
export function getCurriculumLevel(gradeId) {
  return GRADE_CONFIG.find(g => g.id === gradeId)?.curriculumLevel || 3;
}

export function getGradeStartLevel(gradeId) {
  const level = getGradeMaxLevel(gradeId);
  return level >= 3 ? 2 : 1;
}

export function getAllGrades() {
  return GRADE_CONFIG;
}

// 按curriculumLevel获取对应年级信息
export function getGradeByCurriculumLevel(curriculumLevel) {
  return GRADE_CONFIG.find(g => g.curriculumLevel === curriculumLevel);
}

// 根据表现获取宠物心情状态
export function getPetMood(state) {
  const { hunger, happiness, cleanliness, health, energy } = state.pet;
  if (hunger < 30) return 'hungry';
  if (happiness < 30) return 'sad';
  if ((cleanliness || 80) < 30) return 'sad';
  if ((health || 80) < 30) return 'sad';
  if (happiness > 80 && hunger > 80 && (cleanliness || 80) > 60 && (energy || 80) > 50) return 'happy';
  return 'normal';
}
