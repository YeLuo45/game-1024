import React, { useState } from 'react';
import { GRID_SIZES } from '../utils/modes';

export function BoardSizeSwitcher({ currentSize, onSizeChange, skin, isInDailyChallenge }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingSize, setPendingSize] = useState(null);

  if (isInDailyChallenge) {
    return null;
  }

  const handleSwitchClick = (size) => {
    if (size === currentSize) return;
    setPendingSize(size);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    onSizeChange(pendingSize);
    setShowConfirm(false);
    setPendingSize(null);
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setPendingSize(null);
  };

  return (
    <>
      <div className="board-size-switcher" style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '12px' }}>
        {Object.entries(GRID_SIZES).map(([key, config]) => (
          <button
            key={key}
            onClick={() => handleSwitchClick(key)}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              cursor: key === currentSize ? 'default' : 'pointer',
              fontWeight: key === currentSize ? 'bold' : 'normal',
              backgroundColor: key === currentSize ? skin.buttonBg : skin.cellBackground,
              color: skin.textColor,
              opacity: key === currentSize ? 1 : 0.7,
            }}
          >
            {config.label}
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
              切换棋盘大小将重新开始当前游戏
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
