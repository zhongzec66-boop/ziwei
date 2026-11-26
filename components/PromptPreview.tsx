'use client';
import { useState } from 'react';

interface PromptPreviewProps {
  text: string;
  title?: string;
}

const btnStyle: React.CSSProperties = {
  fontSize: 11,
  padding: '3px 10px',
  borderRadius: 6,
  border: '1px solid var(--ac-bdr)',
  background: 'var(--ac-bg)',
  color: 'var(--ac)',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

/** 开源版无 AI 后端：把组装好的完整提示词展示出来，供用户复制到在线模型 */
export default function PromptPreview({ text, title = '完整提示词（复制到任意在线模型）' }: PromptPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(true);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // http 局域网 IP 等非安全上下文没有 clipboard API，用 execCommand 兜底
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch { /* ignore */ }
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{
      margin: '8px 12px',
      border: '1px solid var(--ac-bdr)',
      background: 'var(--ac-bg)',
      borderRadius: 10,
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px' }}>
        <span style={{ fontSize: 11, color: 'var(--ac)', fontWeight: 600 }}>✦ {title}</span>
        <button onClick={() => setOpen(o => !o)} style={{ ...btnStyle, marginLeft: 'auto' }}>
          {open ? '收起' : '展开'}
        </button>
        <button onClick={handleCopy} style={btnStyle}>
          {copied ? '已复制 ✓' : '复制提示词'}
        </button>
      </div>
      {open && (
        <pre style={{
          margin: 0,
          padding: 10,
          maxHeight: 280,
          overflow: 'auto',
          fontSize: 11,
          lineHeight: 1.6,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          color: 'var(--tx-2)',
          background: 'var(--bg-card)',
          borderTop: '1px solid var(--bdr)',
          fontFamily: 'var(--font-mono, monospace)',
        }}>
          {text}
        </pre>
      )}
      <div style={{ padding: '6px 10px 8px', fontSize: 10, color: 'var(--tx-3)' }}>
        开源版不含 AI 接口，复制以上内容粘贴到在线模型对话框即可获得解读；再次提问会刷新为对应问题的提示词。
      </div>
    </div>
  );
}
