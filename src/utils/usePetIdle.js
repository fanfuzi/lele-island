import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * 宠物空闲检测 Hook
 *
 * 三级空闲状态：
 * - active: 正常
 * - idle: 30s 无操作 → 轻摆
 * - sleepy: 60s 无操作 → 半闭眼
 * - attention: 90s 无操作 → 弹跳求关注
 *
 * 使用:
 *   const { idleState, resetIdleTimer } = usePetIdle({ enabled: true });
 *   // 在交互时调用 resetIdleTimer()
 */
export function usePetIdle({
  timeout = 30000,
  sleepyTimeout = 60000,
  attentionTimeout = 90000,
  enabled = true,
} = {}) {
  const [idleState, setIdleState] = useState('active');
  const timerRef = useRef(null);
  const sleepyTimerRef = useRef(null);
  const attentionTimerRef = useRef(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (sleepyTimerRef.current) clearTimeout(sleepyTimerRef.current);
    if (attentionTimerRef.current) clearTimeout(attentionTimerRef.current);
    timerRef.current = null;
    sleepyTimerRef.current = null;
    attentionTimerRef.current = null;
  }, []);

  const resetIdleTimer = useCallback(() => {
    if (!enabled) return;
    clearTimers();
    setIdleState('active');

    // 重新设置三级定时器
    timerRef.current = setTimeout(() => {
      setIdleState('idle');
    }, timeout);

    sleepyTimerRef.current = setTimeout(() => {
      setIdleState('sleepy');
    }, sleepyTimeout);

    attentionTimerRef.current = setTimeout(() => {
      setIdleState('attention');
    }, attentionTimeout);
  }, [enabled, timeout, sleepyTimeout, attentionTimeout, clearTimers]);

  // 启用/禁用时管理定时器
  useEffect(() => {
    if (enabled) {
      resetIdleTimer();
    } else {
      clearTimers();
      setIdleState('active');
    }
    return clearTimers;
  }, [enabled, resetIdleTimer, clearTimers]);

  return { idleState, resetIdleTimer };
}

export default usePetIdle;
