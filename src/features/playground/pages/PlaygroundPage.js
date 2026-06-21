import React from 'react';
import { useSearchParams } from 'react-router-dom';
import CodePlayground from '../components/CodePlayground';
import './PlaygroundPage.css';

export default function PlaygroundPage() {
  const [searchParams] = useSearchParams();
  const initLang = searchParams.get('lang') || 'javascript';
  const initCode = searchParams.get('code')
    ? decodeURIComponent(searchParams.get('code'))
    : undefined;

  return (
    <div className="playground-page">
      <div className="playground-page-header">
        <div className="pph-top">
          <h1><span className="pph-icon">⬡</span> Code Playground</h1>
          <p className="pph-sub">
            Write code, run it in the browser or local simulation, and read output in the console below.
          </p>
        </div>
      </div>

      <div className="playground-page-body">
        <CodePlayground
          initialLanguage={initLang}
          initialCode={initCode}
        />
      </div>
    </div>
  );
}
