import React, { useState } from 'react';
import { useStorage } from '../hooks/useStorage';
import { MODES, MODE_KEY_STORAGE } from '../utils/modes';

export function ModeSwitcher({ currentMode, onModeChange, skin }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingMode, setPendingMode] = useState(null);

  const handleSwitchClick = (mode) => {
    if (mode === currentMode) return;
    setPendingMode(mode);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    onModeChange(pendingMode);
    setShowConfirm(false);
    setPendingMode(null);
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setPendingMode(null);
  };

  return (
    <>
      <div className="mode-switcher" style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '12px' }}>
        {Object.keys(MODES).map((mode) => (
          <button
            key={mode}
            onClick={() => handleSwitchClick(mode)}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              cursor: mode === currentMode ? 'default' : 'pointer',
              fontWeight: mode === currentMode ? 'bold' : 'normal',
              backgroundColor: mode === currentMode ? skin.buttonBg : skin.cellBackground,
              color: skin.textColor,
              opacity: mode === currentMode ? 1 : 0.7,
            }}
          >
            {mode === '2048' ? '2048模式' : '无限模式'}
          </button>
        ))}
      </div>

      {showConfirm && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="modal" style={{
            backgroundColor: skin.background,
            padding: '24px',
            borderRadius: '12px',
            textAlign: 'center',
            maxWidth: '300px'
          }}>
            <p style={{ color: skin.textColor, marginBottom: '16px' }}>
              切换模式将重新开始当前游戏
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={handleCancel}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  backgroundColor: skin.cellBackground,
                  color: skin.textColor
                }}
              >
                取消
              </button>
              <button
                onClick={handleConfirm}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  backgroundColor: skin.buttonBg,
                  color: skin.textColor
                }}
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
