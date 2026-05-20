import React, { useState, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { TreeView } from './components/TreeView';
import { useLocalStorage } from './hooks/useLocalStorage';

type TabType = 'validator' | 'formatter';
type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

function App() {
  // State'ler
  const [input, setInput] = useLocalStorage('jsonforge_input', `{
  "name": "JSONForge",
  "version": "1.0.0",
  "features": ["validate", "format"],
  "metadata": {
    "author": "Professional Developer",
    "created": "2024-01-01"
  }
}`);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('validator');
  const [viewMode, setViewMode] = useState<'raw' | 'tree'>('raw');
  const [indentSize, setIndentSize] = useLocalStorage('indentSize', 2);
  const [parsedData, setParsedData] = useState<JsonValue | null>(null);

  // Yardımcı Fonksiyon
  function calculateDepth(obj: JsonValue, depth = 1): number {
    if (typeof obj !== 'object' || obj === null) return depth;
    let maxDepth = depth;
    const values = Object.values(obj as Record<string, JsonValue>);
    for (const value of values) {
      maxDepth = Math.max(maxDepth, calculateDepth(value, depth + 1));
    }
    return maxDepth;
  }

  // Validator
  const handleValidate = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      setParsedData(parsed);
      const size = JSON.stringify(parsed).length;
      const lines = input.split('\n').length;
      const keys = !Array.isArray(parsed) && typeof parsed === 'object' && parsed !== null 
        ? Object.keys(parsed) : [];
      
      setOutput(`✓ Valid JSON

Summary:
├── Type: ${Array.isArray(parsed) ? 'Array' : typeof parsed}
├── Size: ${size} bytes
├── Lines: ${lines}
${keys.length ? `├── Keys: ${keys.slice(0, 5).join(', ')}${keys.length > 5 ? '...' : ''}` : ''}
└── Depth: ${calculateDepth(parsed)}`);
      setError('');
      setViewMode('raw');  // Validator'da raw view'e geç
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`✗ Invalid: ${errorMessage}`);
      setOutput('');
      setParsedData(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  // Formatter
  const handleFormat = () => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indentSize);
      setInput(formatted);
      setOutput(formatted);
      setError('');
      setParsedData(null);  // Formatter'da parsedData'yı temizle
      setViewMode('raw');   // Raw view'e geç
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Format Error: ${errorMessage}`);
    }
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setInput(minified);
      setOutput(minified);
      setError('');
      setParsedData(null);  // Minify'da parsedData'yı temizle
      setViewMode('raw');   // Raw view'e geç
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Minify Error: ${errorMessage}`);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output || input);
  };

  const downloadFile = () => {
    const blob = new Blob([output || input], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jsonforge_output.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setInput(event.target?.result as string);
        setParsedData(null);  // Yeni dosya yüklenince parsedData'yı temizle
        setOutput('');
        setError('');
      };
      reader.readAsText(file);
    }
  };

  const handleDragDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setInput(event.target?.result as string);
        setParsedData(null);  // Drag-drop ile yüklenince parsedData'yı temizle
        setOutput('');
        setError('');
      };
      reader.readAsText(file);
    }
  };

  // Tree view'den Raw'a dönüş
  const switchToRaw = () => {
    setViewMode('raw');
  };

  return (
    <div 
      style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #000000, #0a2c3f)',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDragDrop}
    >
      {/* Header */}
      <div style={{ 
        position: 'sticky', top: 0, zIndex: 10,
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(45, 212, 191, 0.15)',
        background: 'rgba(5, 20, 30, 0.95)'
      }}>
        <div style={{ padding: '16px 32px' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '600', color: '#2dd4bf', margin: 0 }}>JSONForge</h1>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0' }}>Professional JSON Toolkit</p>
          </div>

          {/* Tabs - Sadece Validator ve Formatter */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '20px', justifyContent: 'center' }}>
            <button 
              onClick={() => {
                setActiveTab('validator');
                setParsedData(null);
                setOutput('');
                setError('');
              }}
              style={{
                padding: '10px 32px',
                fontSize: '15px',
                fontWeight: '500',
                borderRadius: '8px',
                background: activeTab === 'validator' ? '#2dd4bf' : 'transparent',
                color: activeTab === 'validator' ? '#0a1a2a' : '#94a3b8',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Validator
            </button>
            <button 
              onClick={() => {
                setActiveTab('formatter');
                setParsedData(null);
                setOutput('');
                setError('');
              }}
              style={{
                padding: '10px 32px',
                fontSize: '15px',
                fontWeight: '500',
                borderRadius: '8px',
                background: activeTab === 'formatter' ? '#2dd4bf' : 'transparent',
                color: activeTab === 'formatter' ? '#0a1a2a' : '#94a3b8',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Formatter
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '24px', display: 'flex', gap: '24px', minHeight: 'calc(100vh - 180px)' }}>
        
        {/* Left Panel - Input */}
        <div style={{ flex: 1, borderRadius: '12px', border: '1px solid rgba(45, 212, 191, 0.2)', background: 'rgba(10, 30, 45, 0.8)', overflow: 'hidden', display: 'flex', flexDirection: 'column', backdropFilter: 'blur(8px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid rgba(45, 212, 191, 0.1)', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ color: '#2dd4bf', fontWeight: '500', fontSize: '14px' }}>Input</span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <label style={{ padding: '4px 12px', fontSize: '12px', borderRadius: '6px', background: 'rgba(45, 212, 191, 0.1)', border: '1px solid rgba(45, 212, 191, 0.25)', color: '#2dd4bf', cursor: 'pointer' }}>
                Upload
                <input type="file" accept=".json" onChange={uploadFile} style={{ display: 'none' }} />
              </label>
              
              {activeTab === 'validator' && (
                <button onClick={handleValidate} style={{ padding: '4px 16px', fontSize: '12px', borderRadius: '6px', background: '#2dd4bf', color: '#0a1a2a', border: 'none', cursor: 'pointer', fontWeight: '500' }}>Validate</button>
              )}
              
              {activeTab === 'formatter' && (
                <>
                  <button onClick={handleFormat} style={{ padding: '4px 12px', fontSize: '12px', borderRadius: '6px', background: '#2dd4bf', color: '#0a1a2a', border: 'none', cursor: 'pointer', fontWeight: '500' }}>Format</button>
                  <button onClick={handleMinify} style={{ padding: '4px 12px', fontSize: '12px', borderRadius: '6px', background: 'rgba(45, 212, 191, 0.1)', border: '1px solid rgba(45, 212, 191, 0.25)', color: '#2dd4bf', cursor: 'pointer' }}>Minify</button>
                  <select value={indentSize} onChange={(e) => setIndentSize(Number(e.target.value))} style={{ padding: '4px 8px', fontSize: '12px', borderRadius: '6px', background: 'rgba(45, 212, 191, 0.1)', border: '1px solid rgba(45, 212, 191, 0.25)', color: '#2dd4bf' }}>
                    <option value={2}>2 spaces</option>
                    <option value={4}>4 spaces</option>
                  </select>
                </>
              )}
              
              <button onClick={downloadFile} style={{ padding: '4px 12px', fontSize: '12px', borderRadius: '6px', background: 'rgba(45, 212, 191, 0.1)', border: '1px solid rgba(45, 212, 191, 0.25)', color: '#2dd4bf', cursor: 'pointer' }}>Download</button>
              <button onClick={copyToClipboard} style={{ padding: '4px 12px', fontSize: '12px', borderRadius: '6px', background: 'rgba(45, 212, 191, 0.1)', border: '1px solid rgba(45, 212, 191, 0.25)', color: '#2dd4bf', cursor: 'pointer' }}>Copy</button>
            </div>
          </div>
          
          <Editor 
            height="500px" 
            language="json" 
            value={input} 
            onChange={(value) => setInput(value || '')} 
            theme="vs-dark" 
            options={{ 
              fontSize: 13, 
              minimap: { enabled: false }, 
              wordWrap: 'on', 
              lineNumbers: 'on', 
              automaticLayout: true, 
              tabSize: indentSize, 
              bracketPairColorization: { enabled: true }, 
              folding: true 
            }} 
          />
        </div>

        {/* Right Panel - Output */}
        <div style={{ flex: 1, borderRadius: '12px', border: '1px solid rgba(45, 212, 191, 0.2)', background: 'rgba(10, 30, 45, 0.8)', overflow: 'hidden', display: 'flex', flexDirection: 'column', backdropFilter: 'blur(8px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid rgba(45, 212, 191, 0.1)' }}>
            <span style={{ color: '#2dd4bf', fontWeight: '500', fontSize: '14px' }}>Output</span>
            {activeTab === 'validator' && parsedData && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={switchToRaw}
                  style={{ 
                    padding: '4px 12px', 
                    fontSize: '12px', 
                    borderRadius: '6px', 
                    background: viewMode === 'raw' ? '#2dd4bf' : 'rgba(45, 212, 191, 0.1)', 
                    color: viewMode === 'raw' ? '#0a1a2a' : '#2dd4bf', 
                    border: 'none', 
                    cursor: 'pointer' 
                  }}
                >
                  Raw
                </button>
                <button 
                  onClick={() => setViewMode('tree')} 
                  style={{ 
                    padding: '4px 12px', 
                    fontSize: '12px', 
                    borderRadius: '6px', 
                    background: viewMode === 'tree' ? '#2dd4bf' : 'rgba(45, 212, 191, 0.1)', 
                    color: viewMode === 'tree' ? '#0a1a2a' : '#2dd4bf', 
                    border: 'none', 
                    cursor: 'pointer' 
                  }}
                >
                  Tree
                </button>
              </div>
            )}
          </div>
          
          {error ? (
            <div style={{ margin: '16px', padding: '16px', borderRadius: '8px', background: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.3)' }}>
              <pre style={{ color: '#f87171', fontSize: '13px', fontFamily: 'monospace', margin: 0, whiteSpace: 'pre-wrap' }}>{error}</pre>
            </div>
          ) : output && (activeTab === 'formatter' || (activeTab === 'validator' && viewMode === 'raw')) ? (
            <Editor 
              height="500px" 
              language="json" 
              value={output} 
              theme="vs-dark" 
              options={{ 
                fontSize: 13, 
                minimap: { enabled: false }, 
                wordWrap: 'on', 
                lineNumbers: 'on', 
                readOnly: true, 
                automaticLayout: true 
              }} 
            />
          ) : parsedData && activeTab === 'validator' && viewMode === 'tree' ? (
            <div style={{ padding: '16px', overflow: 'auto', height: '500px' }}>
              <TreeView data={parsedData} />
            </div>
          ) : (
            <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '48px', fontWeight: '300', color: '#2dd4bf', opacity: 0.3 }}>{activeTab === 'validator' ? '✓' : '{}'}</div>
              <p style={{ fontSize: '14px', margin: 0 }}>Ready</p>
              <p style={{ fontSize: '12px', margin: 0, opacity: 0.7 }}>Click Validate or Format to see results</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid rgba(45, 212, 191, 0.1)', padding: '12px 24px', textAlign: 'center', fontSize: '11px', color: '#475569', background: 'rgba(5, 20, 30, 0.5)' }}>
        <p style={{ margin: 0 }}>JSONForge | Validator | Formatter | Professional JSON Toolkit</p>
      </div>
    </div>
  );
}

export default App;