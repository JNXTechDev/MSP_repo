import React, { useState, useRef } from 'react';
import './App.css';
// ModelMetrics component
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Get API base URL from environment or default to localhost
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// FeatureEngineering component
const FeatureEngineering = () => {
  const [openIdx, setOpenIdx] = React.useState(null);
  const steps = [
    { title: 'Tokenization and Vocabulary Construction', description: 'The cleaned email corpus is tokenized, and a vocabulary of unique terms is created.' },
    { title: 'Term Frequency Calculation (TF)', description: 'For every term in every email, term frequency is calculated.' },
    { title: 'Inverse Document Frequency Calculation (IDF)', description: 'IDF captures term rarity across all emails.' },
    { title: 'TF-IDF Matrix Construction', description: 'Product of TF and IDF forms high-dimensional sparse vectors.' },
    { title: 'Free-vs-Custom Domain Flag', description: 'Binary flag if sender domain is a free service.' },
  ];

  return (
    <section>
      <h2>Feature Engineering</h2>
      {steps.map((step, i) => (
        <div key={i} className="feature-step">
          <button onClick={() => setOpenIdx(openIdx === i ? null : i)} className="feature-title">
            {step.title}
          </button>
          {openIdx === i && <p className="feature-desc">{step.description}</p>}
        </div>
      ))}
    </section>
  );
};


const ModelMetrics = () => {
  const [metrics, setMetrics] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/metrics`);
        if (!res.ok) throw new Error('Failed to fetch metrics');
        const data = await res.json();
        if (data.success && data.metrics) {
          // Use enhanced model metrics
          setMetrics(data.metrics.enhanced);
        } else {
          setError('No metrics available');
        }
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };
    fetchMetrics();
  }, []);

  if (loading) {
    return <section><h2>Model Performance</h2><p>Loading metrics...</p></section>;
  }

  if (error) {
    return <section><h2>Model Performance</h2><p style={{color:'red'}}>Error: {error}</p></section>;
  }

  if (!metrics) {
    return <section><h2>Model Performance</h2><p>No metrics available</p></section>;
  }

  const data = [
    { name: 'Accuracy', value: Math.round(metrics.accuracy * 10000) / 100 },
    { name: 'Precision', value: Math.round(metrics.precision * 10000) / 100 },
    { name: 'Recall', value: Math.round(metrics.recall * 10000) / 100 },
    { name: 'F1-Score', value: Math.round(metrics.f1_score * 10000) / 100 },
  ];

  return (
    <section style={{ marginBottom: '30px' }}>
      <h2>🎯 Model Performance Metrics (Verified on Test Set)</h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '15px',
        marginBottom: '20px'
      }}>
        {data.map(item => (
          <div key={item.name} style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>{item.name}</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '10px' }}>{item.value}%</div>
          </div>
        ))}
      </div>
      <table className="metrics-table">
        <thead>
          <tr>
            <th>Metric</th>
            <th>Enhanced Model Score</th>
          </tr>
        </thead>
        <tbody>
          {data.map(({name, value}) => (
            <tr key={name}>
              <td>{name}</td>
              <td>{value}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

// SpamPredictionDemo component
const SpamPredictionDemo = () => {
  const [emailContent, setEmailContent] = React.useState('');
  const [senderEmail, setSenderEmail] = React.useState('');
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email_content: emailContent, sender_email: senderEmail }),
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setResult(data);
    } catch {
      setError('Failed to get prediction');
    }
    setLoading(false);
  };

  return (
    <section>
      <h2>Spam Detection Demo</h2>
      <form onSubmit={handleSubmit} className="demo-form">
        <label>
          Sender Email:
          <input type="email" value={senderEmail} onChange={e => setSenderEmail(e.target.value)} required />
        </label>
        <label>
          Email Content:
          <textarea value={emailContent} onChange={e => setEmailContent(e.target.value)} rows="4" required />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Analyzing...' : 'Predict Spam/Ham'}
        </button>
      </form>
      {error && <p className="error-msg">{error}</p>}
      {result && (
        <div className="prediction-result">
          <h3>Prediction: {result.prediction === 1 ? 'Spam' : 'Ham'}</h3>
          <p>Confidence: {(result.confidence * 100).toFixed(2)}%</p>
          <p>Domain Flag: {result.domain_flag ? 'Free Domain' : 'Custom Domain'}</p>
        </div>
      )}
    </section>
  );
};

// EthicalConsiderations component
const EthicalConsiderations = () => (
  <section>
    <h2>Ethical Considerations & Tools</h2>
    <p>Only public, anonymized datasets used with privacy protections.</p>
    <p>All findings are for academic purposes.</p>
    <p>Tools: Python, scikit-learn, pandas, numpy, Flask, React/Expo.</p>
  </section>
);


function App() {
  const [formData, setFormData] = useState({
    senderEmail: '',
    emailContent: '',
    rawHeaders: '',
    useEnhanced: false
  });

  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const name = selectedFile.name || '';
      if (!name.toLowerCase().endsWith('.eml')) {
        setError('Please select a .eml file');
        setFile(null);
        return;
      }
      setError(null);

      // Read the .eml file and try to auto-fill sender and content fields
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target.result || '';
        // Split headers and body on first blank line
        const parts = text.split(/\r?\n\r?\n/);
        const rawHeadersText = parts[0] || '';
        const bodyText = parts.slice(1).join('\n\n').trim();

        // Simple header parsing
        const headerLines = rawHeadersText.split(/\r?\n/);
        let from = '';
        let subject = '';
        headerLines.forEach((line) => {
          const l = line.trim();
          if (l.toLowerCase().startsWith('from:')) {
            from = l.substring(5).trim();
          } else if (l.toLowerCase().startsWith('subject:')) {
            subject = l.substring(8).trim();
          }
        });

        setFormData((prev) => ({
          ...prev,
          senderEmail: from || prev.senderEmail,
          emailContent: (subject ? subject + '\n\n' + bodyText : bodyText) || prev.emailContent,
          rawHeaders: rawHeadersText || prev.rawHeaders,
        }));
      };
      reader.readAsText(selectedFile);

      setFile(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    setError(null);
    setResults(null);
    setLoading(true);

    try {
      let response;

      if (file) {
        // Analyze .eml file
        const formDataObj = new FormData();
        formDataObj.append('file', file);
        formDataObj.append('use_enhanced', formData.useEnhanced);

        response = await fetch(`${API_BASE_URL}/api/analyze-file`, {
          method: 'POST',
          body: formDataObj
        });
      } else {
        // Analyze text input
        if (!formData.senderEmail || !formData.emailContent) {
          setError('Please provide both sender email and email content');
          setLoading(false);
          return;
        }

        response = await fetch(`${API_BASE_URL}/api/analyze`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sender_email: formData.senderEmail,
            email_content: formData.emailContent,
            raw_headers: formData.rawHeaders,
            use_enhanced: formData.useEnhanced
          })
        });
      }

      const data = await response.json();

      if (data.success) {
        setResults(data);
      } else {
        setError(data.error || 'Analysis failed');
      }
    } catch (err) {
      setError('Failed to connect to server: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      senderEmail: '',
      emailContent: '',
      rawHeaders: '',
      useEnhanced: false
    });
    setFile(null);

    // Clear native file input selection so browser forgets selected file
    if (fileInputRef && fileInputRef.current) {
      try {
        fileInputRef.current.value = '';
      } catch (err) {
        // ignore
      }
    }

    setResults(null);
    setError(null);
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>📧Meta Sender Protect: Email Spam Detection System</h1>
          <p className="subtitle">Using TF-IDF + Linear SVM with Domain Metadata</p>
        </header>

        <ModelMetrics />

        <div className="main-content">
          {/* Input Section */}
          <div className="input-section">
            <h2>Input Email Data</h2>

            <div className="form-group">
              <label htmlFor="senderEmail">From (Sender Email) *</label>
              <input
                type="email"
                id="senderEmail"
                name="senderEmail"
                value={formData.senderEmail}
                onChange={handleInputChange}
                placeholder="sender@example.com"
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="emailContent">Email Content (Subject/Body) *</label>
              <textarea
                id="emailContent"
                name="emailContent"
                value={formData.emailContent}
                onChange={handleInputChange}
                placeholder="Enter email subject and body content..."
                className="textarea-field"
                rows="6"
              />
            </div>

            <div className="advanced-section">
              <h3>Advanced Options</h3>

              <div className="form-group">
                <label htmlFor="rawHeaders">Paste Raw Headers (Optional)</label>
                <textarea
                  id="rawHeaders"
                  name="rawHeaders"
                  value={formData.rawHeaders}
                  onChange={handleInputChange}
                  placeholder="From: sender@example.com\nTo: recipient@example.com\nSubject: Email subject\nDate: Mon, 1 Jan 2024 10:00:00..."
                  className="textarea-field"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label htmlFor="fileUpload">Or Upload .eml File (Optional)</label>
                <input
                  type="file"
                  id="fileUpload"
                  accept=".eml"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="file-input"
                />
                {file && <p className="file-name">Selected: {file.name}</p>}
              </div>

              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="useEnhanced"
                  name="useEnhanced"
                  checked={formData.useEnhanced}
                  onChange={handleInputChange}
                />
                <label htmlFor="useEnhanced">
                  Use Enhanced Model (+Domain Flag)
                </label>
              </div>
            </div>

            <div className="button-group">
              <button 
                onClick={handleAnalyze} 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Analyzing...' : '🔍 Analyze'}
              </button>
              <button 
                onClick={handleReset} 
                className="btn btn-secondary"
              >
                🔄 Reset
              </button>
            </div>

            {error && (
              <div className="error-message">
                ⚠️ {error}
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="results-section">
            <h2>Prediction Results</h2>

            {!results ? (
              <div className="placeholder">
                <p>📊 Results will appear here after analysis</p>
              </div>
            ) : (
              <>
                <div className="prediction-card">
                  <h3>Main Prediction ({formData.useEnhanced ? 'Enhanced Model' : 'Baseline Model'})</h3>
                  <div className={`prediction-badge ${formData.useEnhanced ? results.enhanced.prediction : results.baseline.prediction}`}>
                    {(formData.useEnhanced ? results.enhanced.prediction : results.baseline.prediction).toUpperCase()}
                  </div>
                  <p className="confidence">
                    Confidence: {(formData.useEnhanced ? results.enhanced.confidence : results.baseline.confidence).toFixed(2)}%
                  </p>
                  <p className="explanation">
                    <strong>What does this mean?</strong><br/>
                    {(formData.useEnhanced ? results.enhanced.prediction : results.baseline.prediction) === 'spam' 
                      ? `This email is classified as SPAM. Our AI detected common spam characteristics such as: suspicious urgency language ("Act now!", "Limited time"), promotional keywords, requests for personal information, or unverified sender claims. The confidence score of ${(formData.useEnhanced ? results.enhanced.confidence : results.baseline.confidence).toFixed(2)}% means we're very confident this is spam based on word patterns${formData.useEnhanced ? ' and sender domain analysis' : ''}.`
                      : `This email is classified as HAM (legitimate). It appears to be a genuine message with natural business or personal communication. We didn't find the suspicious patterns typical of spam, such as excessive urgency, unknown sender claims, or requests for sensitive information. The confidence score of ${(formData.useEnhanced ? results.enhanced.confidence : results.baseline.confidence).toFixed(2)}% means we're very confident this is a legitimate email${formData.useEnhanced ? ' based on text analysis and sender domain reputation' : ''}.`}
                  </p>
                </div>

                <div className="metadata-card">
                  <h3>📧 Email Metadata Information</h3>
                  <div className="metadata-item">
                    <strong>Sender Domain:</strong> <span className="metadata-value">{results.metadata.sender_domain}</span>
                  </div>
                  <div className="metadata-item">
                    <strong>Domain Type:</strong> <span className="metadata-value">{results.metadata.domain_type}</span>
                    <p className="meta-explanation">
                      {results.metadata.domain_type === 'Free Email' 
                        ? "Free email services (Gmail, Yahoo, Outlook) are commonly used for both legitimate and spam emails." 
                        : "Custom domains are typically associated with businesses and organizations, which can indicate legitimacy."}
                    </p>
                  </div>
                  <div className="metadata-item">
                    <strong>Free Domain Flag:</strong> <span className="metadata-value">{results.metadata.domain_flag ? '⚠️ Yes' : '✓ No'}</span>
                    <p className="meta-explanation">
                      {results.metadata.domain_flag 
                        ? "This email uses a free email service, which requires more careful analysis." 
                        : "This email comes from a custom domain, which is often a good sign."}
                    </p>
                  </div>
                </div>

                <div className="comparison-card">
                  <h3>🔍 Detailed Model Analysis</h3>
                  <div className="model-note">
                    <strong>💡 Why might the percentages differ?</strong>
                    <p>
                      The baseline model uses only text analysis (word patterns), while the enhanced model also considers the sender's domain type. 
                      Even though both models make the same prediction (spam or ham), their confidence levels can differ slightly because they process 
                      information differently. The enhanced model's domain information adds an extra layer of analysis, which may increase or decrease 
                      confidence depending on whether the domain reinforces or questions the text-based prediction.
                    </p>
                  </div>

                  <div className="model-result">
                    <h4>📊 {results.baseline.model_name}</h4>
                    <div className="result-row">
                      <span>Classification:</span>
                      <span className={`badge ${results.baseline.prediction}`}>
                        {results.baseline.prediction.toUpperCase()}
                      </span>
                    </div>
                    <div className="result-row">
                      <span>Confidence Level:</span>
                      <span className="confidence-value">{results.baseline.confidence.toFixed(2)}%</span>
                    </div>
                    <p className="model-explanation">
                      This model analyzes word patterns and language features. A high confidence means the email's words and structure strongly match known spam or legitimate emails.
                    </p>
                  </div>

                  {formData.useEnhanced && (
                    <div className="model-result enhanced">
                      <h4>⭐ {results.enhanced.model_name}</h4>
                      <div className="result-row">
                        <span>Classification:</span>
                        <span className={`badge ${results.enhanced.prediction}`}>
                          {results.enhanced.prediction.toUpperCase()}
                        </span>
                      </div>
                      <div className="result-row">
                        <span>Confidence Level:</span>
                        <span className="confidence-value">{results.enhanced.confidence.toFixed(2)}%</span>
                      </div>
                      <p className="model-explanation">
                        This model adds domain information on top of word analysis. It considers whether the sender's domain is from a free email service, adding an extra layer of scrutiny.
                      </p>
                    </div>
                  )}
                </div>

                {results.parsed_data && (
                  <div className="parsed-data-card">
                    <h3>Parsed Email Data</h3>
                    <div className="metadata-item">
                      <strong>Sender:</strong> {results.parsed_data.sender}
                    </div>
                    <div className="metadata-item">
                      <strong>Subject:</strong> {results.parsed_data.subject}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
