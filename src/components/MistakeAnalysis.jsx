import { useState } from 'react';
import { analyzeMistakes } from '../api';

const SUBJECT_LABELS = {
  math: { name: '数学', emoji: '🔢' },
  cantonese: { name: '粤语', emoji: '🗣️' },
  chinese: { name: '汉字', emoji: '✍️' },
};

const PET_ENCOURAGEMENTS = [
  '团子发现你在这里需要加油哦！💪',
  '每个小错误都是进步的机会！🌟',
  '不要怕错，团子陪你一起练习！🐱',
  '错过的题目，我们一起来打败它们！⚔️',
  '每一次改正错误，都会变得更厉害！📈',
];

export default function MistakeAnalysis({ subject, wrongRecords, categories, onPractice, onAnalyze }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  if (!wrongRecords || wrongRecords.length === 0) return null;
  if (!categories) return null;

  const subjectInfo = SUBJECT_LABELS[subject] || { name: subject, emoji: '📚' };

  // 按类别统计错题
  const categoryStats = categories.map(cat => {
    const count = wrongRecords.filter(r => r.category === cat.id).length;
    return { ...cat, count };
  }).filter(c => c.count > 0).sort((a, b) => b.count - a.count);

  const totalWrong = wrongRecords.length;
  const encouragement = PET_ENCOURAGEMENTS[totalWrong % PET_ENCOURAGEMENTS.length];

  async function handleAIAnalyze() {
    setAnalyzing(true);
    setAnalysisResult(null);
    try {
      const result = await analyzeMistakes(subject, wrongRecords, 1);
      if (result) {
        setAnalysisResult(result);
      } else {
        setAnalysisResult({ analysis: 'AI暂时无法分析，请稍后重试～', weaknesses: [], suggestions: [], recommendedTopics: [] });
      }
    } catch {
      setAnalysisResult({ analysis: 'AI暂时无法分析，请稍后重试～', weaknesses: [], suggestions: [], recommendedTopics: [] });
    }
    setAnalyzing(false);
  }

  return (
    <div className="analysis-section">
      <div className="analysis-header">
        <span className="analysis-pet">{subjectInfo.emoji}</span>
        <div className="analysis-header-text">
          <h3>📊 错题分析</h3>
          <p className="analysis-encouragement">{encouragement}</p>
        </div>
      </div>

      <div className="analysis-summary">
        共 <strong>{totalWrong}</strong> 道错题，<strong>{categoryStats.length}</strong> 个薄弱类别
      </div>

      {/* 按类别展示错题分布 */}
      <div className="analysis-categories">
        {categoryStats.map(cat => {
          const barWidth = Math.min(100, Math.round((cat.count / totalWrong) * 100));
          return (
            <div key={cat.id} className="analysis-card" onClick={() => onPractice?.(cat.id)}>
              <div className="analysis-card-header">
                <span className="analysis-card-icon">{cat.icon || '📝'}</span>
                <span className="analysis-card-name">{cat.name}</span>
                <span className="analysis-card-count">{cat.count}题</span>
              </div>
              <div className="analysis-bar">
                <div
                  className="analysis-bar-fill"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              <div className="analysis-card-hint">点击进行针对性练习 →</div>
            </div>
          );
        })}
      </div>

      {/* 按钮组 */}
      <div className="analysis-actions">
        <button className="btn btn-primary" onClick={() => onPractice?.()}>
          🎯 针对性训练
        </button>
        <button className="btn btn-secondary" onClick={handleAIAnalyze} disabled={analyzing}>
          {analyzing ? '🤖 AI分析中...' : '🤖 AI智能分析'}
        </button>
      </div>

      {/* AI分析结果 */}
      {analysisResult && (
        <div className="analysis-ai-result">
          <div className="analysis-ai-header">🤖 AI学习诊断</div>
          <p className="analysis-ai-text">{analysisResult.analysis}</p>

          {analysisResult.weaknesses?.length > 0 && (
            <div className="analysis-ai-section">
              <strong>薄弱环节：</strong>
              <ul>
                {analysisResult.weaknesses.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {analysisResult.suggestions?.length > 0 && (
            <div className="analysis-ai-section">
              <strong>学习建议：</strong>
              <ul>
                {analysisResult.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
