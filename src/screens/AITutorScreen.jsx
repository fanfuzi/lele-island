import { useState, useRef, useEffect } from 'react';
import { useGame, getPetEmoji } from '../store';
import { classifyContent, generateExam, homeworkDiagnose, generateReview } from '../api';
import { ocrImage, isValidText } from '../utils/ocr';
import QuizGame from '../games/QuizGame';
import PetCompanion from '../components/PetCompanion';
import RewardModal from '../components/RewardModal';
import MistakeAnalysis from '../components/MistakeAnalysis';
import { logActivity } from '../utils/activityLog';
import { saveGameDataToServer } from '../api/auth';

const SUBJECTS = [
  { id: 'math', label: '数学', icon: '🔢', color: '#FF9EAA' },
  { id: 'chinese', label: '中文', icon: '✍️', color: '#A8D8EA' },
  { id: 'english', label: '英文', icon: '🔤', color: '#FFB5C2' },
  { id: 'gs', label: '常识', icon: '🌍', color: '#C9B1FF' },
  { id: 'cantonese', label: '粤语', icon: '🗣️', color: '#FFDAA3' },
];

const TYPE_LABELS = {
  homework: { label: '作业', icon: '📝', color: '#FF9EAA' },
  exam: { label: '试卷', icon: '📋', color: '#C9B1FF' },
  textbook: { label: '教材', icon: '📖', color: '#A8D8EA' },
  mistakes: { label: '错题', icon: '❌', color: '#FF8C42' },
  concept: { label: '概念', icon: '💡', color: '#AAE1C6' },
};

export default function AITutorScreen({ onBack, preset }) {
  const { state, dispatch } = useGame();
  const cameraRef = useRef(null);
  const galleryRef = useRef(null);

  // === 步骤 ===
  // start → upload → classifying → groups → generating → quiz
  const [step, setStep] = useState('start');
  const [subject, setSubject] = useState('math');
  const [petMood, setPetMood] = useState('normal');
  const [petStatus, setPetStatus] = useState('');

  // 上传内容（支持多份）
  const [items, setItems] = useState([]); // [{ text, imageData, mimeType, preview }]
  const [ocrLoading, setOcrLoading] = useState(false);

  // AI 分类结果
  const [groups, setGroups] = useState([]); // [{ id, type, label, itemIndices, topics, difficulty, summary }]
  const [overallAnalysis, setOverallAnalysis] = useState(null);
  const [selectedGroups, setSelectedGroups] = useState(new Set());

  // 生成的试卷
  const [examQuestions, setExamQuestions] = useState(null);
  const [examTitle, setExamTitle] = useState('');

  // 文本输入（上传页用）
  const [textInput, setTextInput] = useState('');

  // 当前存档 ID（用于标记已练习）
  const [currentArchiveId, setCurrentArchiveId] = useState(null);

  // 通用
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showReward, setShowReward] = useState(false);
  const [rewardCoins, setRewardCoins] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [playerTotal, setPlayerTotal] = useState(0);

  const subjectInfo = SUBJECTS.find(s => s.id === subject) || SUBJECTS[0];
  const grade = state.userGrade || 'p3';

  // 预设处理
  const presetDone = useRef(false);
  useEffect(() => {
    if (preset?.subject && preset?.topic && !presetDone.current) {
      presetDone.current = true;
      setSubject(preset.subject);
      setItems([{ text: `${preset.topic}\n${preset.desc || ''}`, imageData: null, mimeType: null, preview: null }]);
      setStep('upload');
    }
  }, [preset]);

  // === 添加内容 ===
  async function addImageItem(file) {
    if (!file) return;
    setError('');
    try {
      // 1. 压缩图片到 1024px（手机拍照太大，API 受不了）
      const { dataUrl } = await compressImage(file);
      const base64Data = dataUrl.split(',')[1];

      const newItem = {
        text: '',
        imageData: base64Data,
        mimeType: file.type || 'image/png',
        preview: dataUrl,
      };

      // 2. 在线 AI 提取文字（跳过浏览器 Tesseract，质量太差）
      setOcrLoading(true);
      try {
        const res = await fetch('/api/ocr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Data }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.text && data.text.trim().length >= 10) {
            newItem.text = data.text.trim();
          }
        }
      } catch { /* 在线 OCR 失败也没关系，后面 AI 直接看图 */ }
      setOcrLoading(false);

      setItems(prev => [...prev, newItem]);
    } catch (e) {
      setError('图片加载失败: ' + e.message);
    }
  }

  function addTextItem(text) {
    if (!text.trim()) return;
    setItems(prev => [...prev, { text: text.trim(), imageData: null, mimeType: null, preview: null }]);
  }

  function removeItem(index) {
    setItems(prev => prev.filter((_, i) => i !== index));
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // === 图片压缩（手机拍照通常太大，压缩后传给 AI） ===
  async function compressImage(file, maxDim = 1024) {
    const dataUrl = await fileToBase64(file);
    const img = new Image();
    img.src = dataUrl;
    await new Promise(r => { img.onload = r; });
    let { width, height } = img;
    if (width <= maxDim && height <= maxDim) return { dataUrl, needCompress: false };
    if (width > height) { height = Math.round(height * (maxDim / width)); width = maxDim; }
    else { width = Math.round(width * (maxDim / height)); height = maxDim; }
    const canvas = document.createElement('canvas');
    canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);
    const compressed = canvas.toDataURL(file.type || 'image/jpeg', 0.85);
    return { dataUrl: compressed, needCompress: true };
  }

  // === 核心：AI 自动分类 ===
  async function handleClassify() {
    if (items.length === 0) { setError('请先上传内容'); return; }
    setLoading(true);
    setError('');
    setStep('classifying');

    try {
      const result = await classifyContent({
        items: items.map(i => ({ text: i.text || undefined, imageData: i.imageData || undefined, mimeType: i.mimeType || undefined })),
        subject, grade,
      });

      if (result?.groups?.length > 0) {
        setGroups(result.groups);
        setOverallAnalysis(result.overallAnalysis || null);
        // 默认全选
        setSelectedGroups(new Set(result.groups.map(g => g.id)));
        setStep('groups');
      } else {
        // AI 分类失败，降级为单组
        setGroups([{
          id: 'G1', type: 'homework', label: '上传内容',
          itemIndices: items.map((_, i) => i),
          topics: [], difficulty: '待分析', summary: '全部上传内容',
        }]);
        setSelectedGroups(new Set(['G1']));
        setStep('groups');
      }

      // 自动存档：保存本次上传内容+分析结果
      try {
        const finalGroups = result?.groups?.length > 0 ? result.groups : [{
          id: 'G1', type: 'homework', label: '上传内容',
          itemIndices: items.map((_, i) => i),
          topics: [], difficulty: '待分析', summary: '全部上传内容',
        }];
        const sInfo = SUBJECTS.find(s => s.id === subject) || SUBJECTS[0];
        const firstText = items.find(i => i.text)?.text?.slice(0, 30) || '';
        const title = firstText ? `${sInfo.label} - ${firstText}···` : `${sInfo.label}（${items.length}份）`;
        const weakSnapshot = {
          mastery: state.mastery[subject] || {},
          wrongRecords: (state.wrongRecords[subject] || []).slice(-20),
        };
        // 存档时去掉大字段，只保留文字摘要（图片数据用于AI看一次就够了，重新出题用groups即可）
        const lightItems = items.map(i => ({
          text: i.text || undefined,
          mimeType: i.mimeType || undefined,
          hasImage: !!i.imageData,     // 只记录是否有图，不存数据
        }));
        const archivePayload = { subject, grade, title, createdAt: Date.now(), items: lightItems, groups: finalGroups, overallAnalysis: result?.overallAnalysis || null, weakSnapshot, practiced: false };
        dispatch({ type: 'SAVE_UPLOAD_ARCHIVE', payload: archivePayload });
        // 立即同步到云端（不等30秒定时器）
        const stateAfterSave = { ...state, uploadArchives: [archivePayload, ...(state.uploadArchives || [])].slice(0, 20) };
        saveGameDataToServer(stateAfterSave);
        // 保存后从 localStorage 获取新 ID
        try {
          const saved = JSON.parse(localStorage.getItem('lele-island-data') || '{}');
          if (saved.uploadArchives?.length > 0) {
            setCurrentArchiveId(saved.uploadArchives[0].id);
          }
        } catch {} // eslint-disable-line
      } catch (e) {
        console.warn('存档失败:', e.message);
      }
    } catch (e) {
      setError('分类失败: ' + e.message);
      setStep('upload');
    }
    setLoading(false);
  }

  // === 根据选中分组生成试卷 ===
  async function handleGenerateExam() {
    const selected = groups.filter(g => selectedGroups.has(g.id));
    if (selected.length === 0) { setError('请至少选择一个分组'); return; }

    setLoading(true);
    setError('');
    setStep('generating');

    const weakTopics = [...new Set((state.wrongRecords[subject] || []).map(r => r.category).filter(Boolean))];
    const masteryData = Object.entries(state.mastery[subject] || {}).map(([topic, data]) => ({
      topic, level: data.level, total: data.total,
    }));

    try {
      // 把选中分组对应的原始内容传给 AI（去掉 preview 避免 payload 过大）
      const selectedGroupsData = selected.map(g => ({
        ...g,
        items: (g.itemIndices || []).map(idx => items[idx]).filter(Boolean).map(i => ({
          text: i.text || undefined,
          imageData: i.imageData || undefined,
          mimeType: i.mimeType || undefined,
        })),
      }));

      const result = await generateExam({
        subject, grade,
        groups: selectedGroupsData,
        weakTopics, masteryData,
        count: 8,
      });

      if (result?.questions?.length > 0) {
        setExamQuestions(result.questions);
        setExamTitle(result.examTitle || `${subjectInfo.label}模拟练习`);
        setStep('quiz');
        // 标记存档为已练习
        if (currentArchiveId) {
          dispatch({ type: 'MARK_ARCHIVE_PRACTICED', payload: currentArchiveId });
        }
      } else {
        // 尝试提取服务端错误信息
        const serverMsg = result?.error || (result ? 'AI 返回内容无法解析' : 'API 无响应');
        setError(`AI 出题失败: ${serverMsg}`);
        setStep('groups');
      }
    } catch (e) {
      setError('出题失败: ' + e.message);
      setStep('groups');
    }
    setLoading(false);
  }

  // === 直接诊断（单张作业快速分析） ===
  async function handleQuickDiagnose() {
    if (items.length === 0) return;
    setLoading(true);
    setError('');
    setStep('classifying');

    const textContent = items.map(i => i.text).filter(Boolean).join('\n');
    const firstImage = items.find(i => i.imageData);

    const weakTopics = [...new Set((state.wrongRecords[subject] || []).map(r => r.category).filter(Boolean))];
    const masteryData = Object.entries(state.mastery[subject] || {}).map(([topic, data]) => ({
      topic, level: data.level, total: data.total,
    }));

    try {
      const result = await homeworkDiagnose({
        textContent, imageData: firstImage?.imageData, mimeType: firstImage?.mimeType,
        subject, grade, wrongRecords: state.wrongRecords[subject] || [], masteryData,
      });

      if (result) {
        // 转为试卷格式
        if (result.guidanceSteps?.length > 0) {
          const diagQuestions = result.guidanceSteps.map((step, i) => ({
            id: `D-${i + 1}`,
            question: step.detectiveHint || step.question || '请检查这道题',
            answer: step.correctAnswer || '详见解析',
            options: step.options || [],
            category: step.type || '诊断',
            difficulty: 2,
            hint: step.strategy || '',
          }));
          setExamQuestions(diagQuestions);
          setExamTitle('作业诊断练习');
          setStep('quiz');
        } else {
          setError(result.firstMessage || '分析完成，未发现错误');
          setStep('upload');
        }
      }
    } catch (e) {
      setError('诊断失败: ' + e.message);
      setStep('upload');
    }
    setLoading(false);
  }

  // === 答题完成 ===
  function handleComplete(score, total) {
    setPlayerScore(score);
    setPlayerTotal(total);
    const coins = Math.round((score / total) * 10) + 2;
    setRewardCoins(coins);
    setShowReward(true);
    dispatch({ type: 'COMPLETE_QUEST', payload: { subject, score: coins, questionsDone: total } });
    logActivity({ type: 'review', subject, gameType: 'ai-exam', score: Math.round((score / total) * 100), total, correct: score });
  }

  function handleAnswer(correct, question) {
    if (correct) {
      setPetMood('happy'); setPetStatus('答对了！🌟');
      setTimeout(() => { setPetMood('normal'); setPetStatus(''); }, 1500);
    } else {
      setPetMood('sad'); setPetStatus('加油！💪');
      setTimeout(() => { setPetMood('normal'); setPetStatus(''); }, 2000);
      if (question?.category) {
        dispatch({ type: 'RECORD_WRONG_ANSWER', payload: { subject, category: question.category, questionId: question.id } });
        dispatch({ type: 'UPDATE_MASTERY', payload: { subject, category: question.category, correct: 0, total: 1 } });
      }
    }
  }

  function handleRewardClose() {
    setShowReward(false);
    resetAll();
  }

  function resetAll() {
    setStep('start');
    setItems([]);
    setGroups([]);
    setOverallAnalysis(null);
    setSelectedGroups(new Set());
    setExamQuestions(null);
    setExamTitle('');
    setError('');
  }

  // ═══════════════════════════════════════════
  //  渲染：起始页 — 选择科目
  // ═══════════════════════════════════════════
  if (step === 'start') {
    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={onBack}>← 返回</button>
          <h2>🧑‍🏫 AI 助教</h2><div />
        </div>
        <div className="tutor-hero">
          <PetCompanion size="small" mood="happy" statusText="上传资料，我帮你智能分析！" interactive gazeTracking />
        </div>
        <div className="section-desc"><p>选择科目</p></div>
        <div className="tutor-subject-grid">
          {SUBJECTS.map(s => (
            <button key={s.id} className="tutor-subject-card" style={{ '--card-color': s.color }}
              onClick={() => { setSubject(s.id); setStep('upload'); }}>
              <span className="tutor-subject-icon">{s.icon}</span>
              <span className="tutor-subject-label">{s.label}</span>
            </button>
          ))}
        </div>
        {/* 学习存档入口 */}
        {state.uploadArchives?.length > 0 && (
          <div className="tutor-archives-entry" onClick={() => setStep('archives')}>
            <span className="tutor-archives-entry-icon">📂</span>
            <span className="tutor-archives-entry-text">学习存档（{state.uploadArchives.length}）</span>
            <span className="tutor-archives-entry-arrow">→</span>
          </div>
        )}
        {/* 薄弱点总览 */}
        {Object.entries(state.mastery).some(([, m]) => Object.keys(m).length > 0) && (
          <div className="tutor-weakness-overview">
            <div className="tutor-weakness-title">📊 薄弱知识点</div>
            <div className="tutor-weakness-list">
              {Object.entries(state.mastery).map(([subj, topics]) => {
                const weak = Object.entries(topics).filter(([, d]) => d.level < 0.5 && d.total >= 2);
                if (!weak.length) return null;
                const sInfo = SUBJECTS.find(s => s.id === subj);
                return weak.slice(0, 3).map(([topic, data]) => (
                  <span key={`${subj}-${topic}`} className="tutor-weakness-chip" style={{ borderColor: sInfo?.color }}>
                    {sInfo?.icon} {topic} ({Math.round(data.level * 100)}%)
                  </span>
                ));
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ═══════════════════════════════════════════
  //  渲染：学习存档列表
  // ═══════════════════════════════════════════
  if (step === 'archives') {
    const sorted = state.uploadArchives || []; // 最新的在第一个
    const SUBJECT_MAP = Object.fromEntries(SUBJECTS.map(s => [s.id, s]));

    function loadArchive(archive) {
      setSubject(archive.subject);
      setItems(archive.items || []);
      setGroups(archive.groups || []);
      setOverallAnalysis(archive.overallAnalysis || null);
      setSelectedGroups(new Set((archive.groups || []).map(g => g.id)));
      setCurrentArchiveId(archive.id);
      setStep('groups');
    }

    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={() => setStep('start')}>← 返回</button>
          <h2>📂 学习存档</h2><div />
        </div>
        <div className="tutor-content">
          {sorted.length === 0 ? (
            <div className="archive-empty">
              <p>暂无存档</p>
              <p className="archive-empty-hint">上传内容并完成AI分析后，会自动保存到这里</p>
            </div>
          ) : (
            <div className="archive-list">
              {sorted.map(a => {
                const sInfo = SUBJECT_MAP[a.subject] || SUBJECTS[0];
                const date = new Date(a.createdAt).toLocaleDateString('zh-HK', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                const itemSummary = a.items?.length > 0
                  ? (a.items.find(i => i.text)?.text?.slice(0, 40) || (a.items.some(i => i.hasImage) ? `${a.items.length}份图片` : ''))
                  : '';
                const weakTags = (a.weakSnapshot?.mastery ? Object.entries(a.weakSnapshot.mastery).filter(([, d]) => d.level < 0.5 && d.total >= 2).map(([t]) => t) : []).slice(0, 3);

                return (
                  <div key={a.id} className={`archive-card ${a.practiced ? 'archive-practiced' : ''}`}>
                    <div className="archive-card-header">
                      <span className="archive-subject-icon" style={{ color: sInfo.color }}>{sInfo.icon}</span>
                      <span className="archive-grade">{a.grade?.toUpperCase()}</span>
                      <span className="archive-date">{date}</span>
                      {a.practiced && <span className="archive-practiced-badge">✅已练</span>}
                    </div>
                    <div className="archive-title">{a.title}</div>
                    {itemSummary && <div className="archive-summary">{itemSummary}</div>}
                    {weakTags.length > 0 && (
                      <div className="archive-weak-tags">
                        {weakTags.map(t => <span key={t} className="group-topic-tag">⚠️ {t}</span>)}
                      </div>
                    )}
                    <div className="archive-actions">
                      <button className="btn btn-primary btn-small" onClick={() => loadArchive(a)}>
                        📝 重新出题
                      </button>
                      <button className="btn btn-small btn-secondary" onClick={() => {
                        if (confirm('确定删除这条存档？')) {
                          dispatch({ type: 'DELETE_UPLOAD_ARCHIVE', payload: a.id });
                        }
                      }}>
                        🗑️ 删除
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  //  渲染：上传页（支持多份内容）
  // ═══════════════════════════════════════════
  if (step === 'upload') {
    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={() => { setItems([]); setStep('start'); }}>← 返回</button>
          <h2>{subjectInfo.icon} 上传资料</h2><div />
        </div>
        <div className="tutor-content">
          <p className="upload-hint-text">上传作业、试卷、教材或错题（可多次上传），AI 会自动分类分析</p>

          {/* 已添加的内容列表 */}
          {items.length > 0 && (
            <div className="upload-items-list">
              {items.map((item, i) => (
                <div key={i} className="upload-item-card">
                  {item.preview ? (
                    <img src={item.preview} alt="" className="upload-item-thumb" />
                  ) : (
                    <div className="upload-item-text-preview">{item.text.slice(0, 60)}...</div>
                  )}
                  <button className="upload-item-remove" onClick={() => removeItem(i)}>✕</button>
                </div>
              ))}
            </div>
          )}

          {/* 添加按钮 */}
          <div className="upload-actions">
            <button className="upload-action-btn upload-camera" onClick={() => cameraRef.current?.click()}>
              <span className="upload-action-icon">📷</span>
              <span className="upload-action-label">拍照</span>
            </button>
            <button className="upload-action-btn upload-gallery" onClick={() => galleryRef.current?.click()}>
              <span className="upload-action-icon">🖼️</span>
              <span className="upload-action-label">相册</span>
            </button>
            <input ref={cameraRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }}
              onChange={e => { const f = e.target.files?.[0]; if (f) addImageItem(f); e.target.value = ''; }} />
            <input ref={galleryRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
              onChange={e => { [...(e.target.files || [])].forEach(f => addImageItem(f)); e.target.value = ''; }} />
          </div>

          {ocrLoading && <div className="upload-ocr-status"><span>识别中...</span></div>}

          {/* 粘贴文本 */}
          <div className="tutor-divider"><span>或粘贴文本内容</span></div>
          <div className="upload-text-row">
            <textarea className="review-textarea" rows={3}
              placeholder={`粘贴${subjectInfo.label}题目或课本内容...`}
              value={textInput} onChange={e => setTextInput(e.target.value)} />
            <button className="btn btn-small btn-primary" disabled={!textInput.trim()}
              onClick={() => { addTextItem(textInput); setTextInput(''); }}>
              添加
            </button>
          </div>

          {error && <div className="tutor-error">{error}</div>}

          {/* 操作按钮 */}
          <div className="upload-submit-area">
            {items.length > 0 && (
              <>
                <button className="btn btn-primary tutor-submit-btn" onClick={handleClassify} disabled={loading}>
                  {loading ? '🔍 分析中...' : `🤖 AI 智能分析（${items.length}份）`}
                </button>
                {items.length === 1 && items[0].imageData && (
                  <button className="btn btn-secondary tutor-submit-btn" onClick={handleQuickDiagnose} disabled={loading}>
                    ⚡ 快速诊断（单张）
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  //  渲染：AI 分析中
  // ═══════════════════════════════════════════
  if (step === 'classifying') {
    return (
      <div className="screen">
        <div className="screen-header"><h2>🔍 AI 分析中</h2><div /></div>
        <div className="analyzing-screen">
          <div className="analyzing-animation">
            <PetCompanion size="medium" mood="happy" statusText="正在智能分析..." interactive />
          </div>
          <div className="analyzing-steps">
            <div className="analyzing-step active">📖 读取 {items.length} 份内容...</div>
            <div className="analyzing-step">🏷️ 自动分类识别...</div>
            <div className="analyzing-step">📊 分析知识点和难度...</div>
            <div className="analyzing-step">📝 生成学习建议...</div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  //  渲染：AI 分组结果
  // ═══════════════════════════════════════════
  if (step === 'groups') {
    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={() => setStep('upload')}>← 返回</button>
          <h2>📊 AI 分析结果</h2><div />
        </div>
        <div className="tutor-content">
          {/* 整体分析 */}
          {overallAnalysis && (
            <div className="groups-overall">
              <div className="groups-overall-title">📋 整体分析</div>
              {overallAnalysis.difficulty && <p className="groups-overall-row">难度：{overallAnalysis.difficulty}</p>}
              {overallAnalysis.weakTopics?.length > 0 && (
                <div className="groups-overall-row">
                  薄弱点：{overallAnalysis.weakTopics.map(t => <span key={t} className="result-weak-tag">{t}</span>)}
                </div>
              )}
              {overallAnalysis.suggestion && <p className="groups-overall-suggestion">💡 {overallAnalysis.suggestion}</p>}
            </div>
          )}

          {/* 分组列表 */}
          <div className="groups-list">
            <div className="groups-list-title">AI 自动分为 {groups.length} 组，选择要练习的内容：</div>
            {groups.map(g => {
              const typeInfo = TYPE_LABELS[g.type] || TYPE_LABELS.homework;
              const isSelected = selectedGroups.has(g.id);
              return (
                <button key={g.id} className={`group-card ${isSelected ? 'group-selected' : ''}`}
                  onClick={() => {
                    const next = new Set(selectedGroups);
                    if (isSelected) next.delete(g.id); else next.add(g.id);
                    setSelectedGroups(next);
                  }}>
                  <div className="group-card-header">
                    <span className="group-type-badge" style={{ background: typeInfo.color + '22', color: typeInfo.color }}>
                      {typeInfo.icon} {typeInfo.label}
                    </span>
                    <span className="group-difficulty">{g.difficulty || ''}</span>
                    <span className="group-check">{isSelected ? '✅' : '⬜'}</span>
                  </div>
                  <div className="group-label">{g.label}</div>
                  {g.topics?.length > 0 && (
                    <div className="group-topics">
                      {g.topics.map(t => <span key={t} className="group-topic-tag">{t}</span>)}
                    </div>
                  )}
                  {g.summary && <div className="group-summary">{g.summary}</div>}
                </button>
              );
            })}
          </div>

          {error && <div className="tutor-error">{error}</div>}

          <button className="btn btn-primary tutor-submit-btn"
            onClick={handleGenerateExam}
            disabled={selectedGroups.size === 0 || loading}>
            {loading ? '📝 生成中...' : `📝 生成练习题（${selectedGroups.size}组）`}
          </button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  //  渲染：生成中
  // ═══════════════════════════════════════════
  if (step === 'generating') {
    return (
      <div className="screen">
        <div className="screen-header"><h2>📝 正在出题</h2><div /></div>
        <div className="analyzing-screen">
          <div className="analyzing-animation">
            <PetCompanion size="medium" mood="happy" statusText="正在出题..." interactive />
          </div>
          <p className="analyzing-hint">AI 正在根据选中的 {selectedGroups.size} 个分组生成针对性练习...</p>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  //  渲染：答题
  // ═══════════════════════════════════════════
  if (step === 'quiz' && examQuestions) {
    // 从上传内容中取第一张图片作为题目配图（AI 引用图上的图形时学生也能看到）
    const firstImg = items.find(i => i.imageData)?.preview || null;
    return (
      <div className="screen">
        <div className="screen-header">
          <button className="btn-back" onClick={() => setStep('groups')}>← 返回</button>
          <h2>📝 {examTitle}</h2><div />
        </div>
        <PetCompanion size="small" mood={petMood} celebrating={petMood === 'happy'} statusText={petStatus} interactive />
        <QuizGame questions={examQuestions} onComplete={handleComplete} onAnswer={handleAnswer}
          title={examTitle} showStory examImage={firstImg} />
        <RewardModal show={showReward} coins={rewardCoins} score={playerScore} total={playerTotal}
          message="练习完成！" onClose={handleRewardClose} />
      </div>
    );
  }

  // 兜底
  return (
    <div className="screen">
      <div className="screen-header">
        <button className="btn-back" onClick={onBack}>← 返回</button>
        <h2>🧑‍🏫 AI 助教</h2><div />
      </div>
      <button className="btn btn-primary" onClick={resetAll}>重新开始</button>
    </div>
  );
}
