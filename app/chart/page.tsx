'use client';

import Link from 'next/link';
import { useState } from 'react';
import BirthForm, { type BirthFormState } from '@/components/BirthForm';
import ChartBoard from '@/components/ChartBoard';
import InsightPanel from '@/components/InsightPanel';
import { generateChart } from '@/lib/ziwei/algorithm';
import type { BirthInfo, Palace, ZiweiChart } from '@/lib/ziwei/types';

export default function ChartPage() {
  const [chart, setChart] = useState<ZiweiChart | null>(null);
  const [form, setForm] = useState<BirthFormState>();
  const [selectedPalace, setSelectedPalace] = useState<Palace | null>(null);
  const [error, setError] = useState('');

  function handleSubmit(info: BirthInfo) {
    try {
      setChart(generateChart(info));
      setError('');
    } catch {
      setError('暂时无法生成命盘，请核对出生日期与时间后重试。');
    }
  }

  return (
    <main className="ziwei-wrap ziwei-chart">
      <div className="ziwei-chart-nav">
        <Link href="/" className="ziwei-text-link">← 紫微研究</Link>
        {chart && (
          <button type="button" className="btn-ghost" onClick={() => {
            setSelectedPalace(null);
            setChart(null);
          }}>
            修改出生资料
          </button>
        )}
      </div>
      {!chart ? (
        <div className="ziwei-chart-entry">
          <div>
            <h1>紫微斗数排盘</h1>
            <p>填写出生资料，即可生成本命盘，并查看大限和流年。出生地点用于校正真太阳时，可按需填写。</p>
          </div>
          <div>
            <BirthForm initialData={form} onFormSave={setForm} onSubmit={handleSubmit} />
            {error && <p className="ziwei-form-error" role="alert">{error}</p>}
          </div>
        </div>
      ) : (
        <>
          <h1 className="ziwei-result-title">紫微命盘</h1>
          <div className="ziwei-chart-results">
            <ChartBoard chart={chart} onPalaceSelect={setSelectedPalace} />
            <InsightPanel chart={chart} selectedPalace={selectedPalace} />
          </div>
        </>
      )}
    </main>
  );
}
