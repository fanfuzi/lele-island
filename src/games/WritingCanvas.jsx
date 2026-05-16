import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * 写字练习画布组件
 * Props:
 *   character: 要练习的字（繁体）
 *   onComplete: (score) => void
 *   mode: 'copy' | 'dictation'  — copy=有参考字, dictation=听写无参考
 *   onPlayAudio: () => void — 播放发音（仅 dictation 模式）
 */
export default function WritingCanvas({ character, onComplete, mode = 'copy', onPlayAudio }) {
  const canvasRef = useRef(null);
  const bgCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const lastPos = useRef(null);
  const [score, setScore] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showCorrectChar, setShowCorrectChar] = useState(false);

  const isDictation = mode === 'dictation';

  // 在背景画布上画参考字（仅 copy 模式）
  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas || !character) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, rect.width, rect.height);

    // 画米字格
    ctx.strokeStyle = '#FFE0E6';
    ctx.lineWidth = 1;
    ctx.strokeRect(5, 5, rect.width - 10, rect.height - 10);
    ctx.beginPath();
    ctx.moveTo(rect.width / 2, 5);
    ctx.lineTo(rect.width / 2, rect.height - 5);
    ctx.moveTo(5, rect.height / 2);
    ctx.lineTo(rect.width - 5, rect.height / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(5, 5);
    ctx.lineTo(rect.width - 5, rect.height - 5);
    ctx.moveTo(rect.width - 5, 5);
    ctx.lineTo(5, rect.height - 5);
    ctx.stroke();

    // 仅 copy 模式显示参考字
    if (!isDictation) {
      ctx.fillStyle = 'rgba(255, 150, 180, 0.3)';
      ctx.font = `${Math.min(rect.width * 0.6, rect.height * 0.6)}px "Noto Sans SC", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(character, rect.width / 2, rect.height / 2);
    }
  }, [character, isDictation]);

  const getPos = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches?.[0];
    return {
      x: (touch?.clientX || e.clientX) - rect.left,
      y: (touch?.clientY || e.clientY) - rect.top,
    };
  }, []);

  const startDrawing = useCallback((e) => {
    e.preventDefault();
    setIsDrawing(true);
    setHasDrawn(true);
    lastPos.current = getPos(e);
  }, [getPos]);

  const draw = useCallback((e) => {
    e.preventDefault();
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e);
    const last = lastPos.current;

    if (!ctx || !last) return;

    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = '#FF6B8A';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    lastPos.current = pos;
  }, [isDrawing, getPos]);

  const stopDrawing = useCallback((e) => {
    e.preventDefault();
    setIsDrawing(false);
    lastPos.current = null;
  }, []);

  function clearCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setScore(null);
    setShowResult(false);
    setShowCorrectChar(false);
  }

  function finishWriting() {
    if (!hasDrawn) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const drawData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // 在离屏画布上渲染参考字用于对比
    const refCanvas = document.createElement('canvas');
    refCanvas.width = canvas.width;
    refCanvas.height = canvas.height;
    const refCtx = refCanvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    refCtx.fillStyle = '#000';
    refCtx.font = `${Math.min(w * 0.6, h * 0.6) * dpr}px "Noto Sans SC", sans-serif`;
    refCtx.textAlign = 'center';
    refCtx.textBaseline = 'middle';
    refCtx.fillText(character, canvas.width / 2, canvas.height / 2);
    const refData = refCtx.getImageData(0, 0, canvas.width, canvas.height);

    // 10x10 网格评分
    const gridSize = 10;
    const cellW = canvas.width / gridSize;
    const cellH = canvas.height / gridSize;
    const refCells = [];
    const drawCells = [];

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        let refHasInk = false;
        let drawHasInk = false;
        for (let y = Math.floor(row * cellH); y < Math.floor((row + 1) * cellH); y++) {
          for (let x = Math.floor(col * cellW); x < Math.floor((col + 1) * cellW); x++) {
            const idx = (y * canvas.width + x) * 4;
            if (refData.data[idx + 3] > 30) refHasInk = true;
            if (drawData.data[idx + 3] > 50) drawHasInk = true;
            if (refHasInk && drawHasInk) break;
          }
          if (refHasInk && drawHasInk) break;
        }
        refCells.push(refHasInk);
        drawCells.push(drawHasInk);
      }
    }

    const totalRefCells = refCells.filter(Boolean).length;
    const totalDrawCells = drawCells.filter(Boolean).length;

    if (totalDrawCells === 0) {
      setScore(0);
      setShowResult(true);
      if (isDictation) setShowCorrectChar(true);
      onComplete?.(0);
      return;
    }

    const overlap = refCells.filter((v, i) => v && drawCells[i]).length;
    const precision = overlap / Math.max(1, totalDrawCells);
    const recall = overlap / Math.max(1, totalRefCells);
    const f1 = precision + recall > 0
      ? 2 * (precision * recall) / (precision + recall)
      : 0;

    // 偏离惩罚
    let offCenterCells = 0;
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (!drawCells[row * gridSize + col]) continue;
        let nearRef = false;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = row + dr, nc = col + dc;
            if (nr >= 0 && nr < gridSize && nc >= 0 && nc < gridSize && refCells[nr * gridSize + nc]) {
              nearRef = true;
            }
          }
        }
        if (!nearRef) offCenterCells++;
      }
    }
    const offCenterPenalty = Math.min(0.3, (offCenterCells / Math.max(1, totalDrawCells)) * 0.5);

    let finalScore = Math.round((f1 - offCenterPenalty) * 100);
    finalScore = Math.max(0, Math.min(100, finalScore));

    setScore(finalScore);
    setShowResult(true);
    if (isDictation) setShowCorrectChar(true);
    onComplete?.(finalScore);
  }

  const resultEmoji = score >= 80 ? '🌟🌟🌟' : score >= 60 ? '🌟🌟' : score >= 30 ? '🌟' : '💪';
  const resultMsg = score >= 80 ? '写得真好！' : score >= 60 ? '不错！继续练习~' : score >= 30 ? '再试试，你可以的！' : '要再认真一点哦～';

  return (
    <div className="writing-canvas-container">
      <div className="writing-header">
        {isDictation ? (
          <div className="dictation-header">
            <span className="writing-char-label">✍️ 听写默书：</span>
            <button className="btn btn-small btn-audio" onClick={onPlayAudio} title="听发音">
              🔊 听发音
            </button>
            {showCorrectChar && (
              <span className="dictation-answer">正确答案：{character}</span>
            )}
          </div>
        ) : (
          <>
            <span className="writing-char-label">写写看：</span>
            <span className="writing-target-char">{character}</span>
          </>
        )}
      </div>

      <div className="writing-area">
        <canvas ref={bgCanvasRef} className="writing-bg-canvas" />
        <canvas
          ref={canvasRef}
          className="writing-canvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      {showResult && (
        <div className="writing-result">
          <span className="writing-result-emoji">{resultEmoji}</span>
          <span className="writing-score">{score}分</span>
          <span className="writing-msg">{resultMsg}</span>
        </div>
      )}

      <div className="writing-actions">
        <button className="btn btn-secondary" onClick={clearCanvas}>
          🗑️ 重写
        </button>
        <button className="btn btn-primary" onClick={finishWriting} disabled={!hasDrawn}>
          ✅ 完成
        </button>
      </div>
    </div>
  );
}
