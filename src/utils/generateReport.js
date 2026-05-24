export async function generatePDFReport(analysis, languageName) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to download/print the report.');
    return;
  }

  const escapeHtml = (str) => {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const getVerdictLabel = (rating) => {
    switch (rating) {
      case 'SIGN_SAFE': return 'हस्ताक्षर करना सुरक्षित है / Safe to Sign';
      case 'SIGN_WITH_CAUTION': return 'सावधानी के साथ हस्ताक्षर करें / Sign with Caution';
      case 'DO_NOT_SIGN': return 'हस्ताक्षर न करें / Do Not Sign';
      case 'GET_LEGAL_HELP': return 'कानूनी सहायता लें / Get Legal Help';
      default: return rating || 'Verdict';
    }
  };

  const getVerdictColor = (rating) => {
    switch (rating) {
      case 'SIGN_SAFE': return '#16A34A';
      case 'SIGN_WITH_CAUTION': return '#D97706';
      case 'DO_NOT_SIGN': return '#DC2626';
      case 'GET_LEGAL_HELP': return '#2563EB';
      default: return '#57534E';
    }
  };

  const getVerdictBg = (rating) => {
    switch (rating) {
      case 'SIGN_SAFE': return '#F0FDF4';
      case 'SIGN_WITH_CAUTION': return '#FFFBEB';
      case 'DO_NOT_SIGN': return '#FEF2F2';
      case 'GET_LEGAL_HELP': return '#EFF6FF';
      default: return '#FAFAF7';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'DANGEROUS': return '#DC2626';
      case 'SUSPICIOUS': return '#D97706';
      case 'UNFAIR': return '#EA580C';
      default: return '#57534E';
    }
  };

  const getSeverityBg = (severity) => {
    switch (severity) {
      case 'DANGEROUS': return '#FEF2F2';
      case 'SUSPICIOUS': return '#FFFBEB';
      case 'UNFAIR': return '#FFF7ED';
      default: return '#FAFAF7';
    }
  };

  const verdict = analysis.overallVerdict || {};
  const summary = analysis.summary || {};
  const dangerFlags = analysis.dangerFlags || [];
  const yourRights = analysis.yourRights || [];
  const sectionBreakdown = analysis.sectionBreakdown || [];

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="hi" class="notranslate">
    <head>
      <meta charset="UTF-8">
      <meta name="google" content="notranslate">
      <title>Nyay Sahayak - Analysis Report</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Hindi&family=Noto+Sans:wght@400;600;700&family=Noto+Sans+Devanagari:wght@400;600;700&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Noto Sans', 'Noto Sans Devanagari', sans-serif;
          color: #1C1917;
          background: white;
          margin: 0;
          padding: 40px;
          line-height: 1.6;
        }
        @media print {
          body {
            padding: 20px;
          }
          .no-print {
            display: none;
          }
        }
        .header {
          border-bottom: 3px solid #E2DDD6;
          padding-bottom: 16px;
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .title-area h1 {
          font-family: 'Tiro Devanagari Hindi', serif;
          color: #1A3A6B;
          margin: 0;
          font-size: 26px;
        }
        .title-area p {
          margin: 4px 0 0 0;
          color: #E8680A;
          font-weight: 700;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .logo-mark {
          font-size: 2.5rem;
        }
        .meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 24px;
        }
        .meta-item {
          background: #FAFAF7;
          border: 1px solid #E2DDD6;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
        }
        .meta-item strong {
          color: #57534E;
          display: block;
          margin-bottom: 2px;
          font-size: 11px;
          text-transform: uppercase;
        }
        .section-title {
          font-family: 'Tiro Devanagari Hindi', serif;
          color: #1A3A6B;
          border-bottom: 2px solid #E8680A;
          padding-bottom: 4px;
          margin-top: 32px;
          margin-bottom: 16px;
          font-size: 20px;
          font-weight: 700;
        }
        .verdict-box {
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
          border-left: 6px solid ${getVerdictColor(verdict.rating)};
          background: ${getVerdictBg(verdict.rating)};
        }
        .verdict-header {
          font-family: 'Tiro Devanagari Hindi', serif;
          font-size: 20px;
          font-weight: 700;
          color: ${getVerdictColor(verdict.rating)};
          margin-bottom: 8px;
        }
        .verdict-reason {
          font-size: 15px;
          margin-bottom: 14px;
          color: #1C1917;
        }
        .actions-label {
          font-weight: 700;
          color: #1C1917;
          margin-bottom: 6px;
          font-size: 13px;
          text-transform: uppercase;
        }
        .actions-list {
          margin: 0;
          padding-left: 20px;
        }
        .actions-list li {
          margin-bottom: 4px;
          font-size: 14px;
        }
        .summary-box {
          font-size: 15px;
          color: #1C1917;
          margin-bottom: 20px;
        }
        .parties-list {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 8px;
        }
        .party-chip {
          background: #E8EEF8;
          color: #1A3A6B;
          padding: 4px 10px;
          border-radius: 14px;
          font-size: 12px;
          font-weight: 600;
        }
        .flag-card {
          border: 1px solid #E2DDD6;
          border-left: 5px solid;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
          page-break-inside: avoid;
        }
        .flag-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
        }
        .flag-tag {
          font-size: 10px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
          text-transform: uppercase;
        }
        .flag-title {
          font-weight: 700;
          font-size: 16px;
          color: #1C1917;
          margin: 0 0 6px 0;
        }
        .flag-explanation {
          font-size: 14px;
          color: #57534E;
          margin-bottom: 12px;
        }
        .cite-box {
          background: #FEF9C3;
          border-left: 3px solid #CA8A04;
          padding: 10px 14px;
          font-size: 13px;
          margin-bottom: 12px;
          border-radius: 0 6px 6px 0;
        }
        .cite-loc {
          font-weight: 700;
          color: #713F12;
          margin-bottom: 4px;
        }
        .cite-text {
          font-style: italic;
          color: #57534E;
        }
        .law-box {
          background: #E8EEF8;
          padding: 12px 14px;
          border-radius: 8px;
          font-size: 13px;
          border: 1px solid #BFDBFE;
        }
        .law-header {
          font-weight: 700;
          color: #1E40AF;
          margin-bottom: 4px;
        }
        .law-body {
          margin-bottom: 4px;
        }
        .law-protection {
          color: #166534;
          font-weight: 600;
        }
        .right-item {
          padding: 10px 0;
          border-bottom: 1px solid #E2DDD6;
          font-size: 14px;
        }
        .right-item:last-child {
          border-bottom: none;
        }
        .right-title {
          font-weight: 600;
          color: #166534;
        }
        .right-source {
          font-size: 11px;
          color: #1E40AF;
          background: #EFF6FF;
          padding: 2px 6px;
          border-radius: 4px;
          margin-left: 6px;
          font-weight: 600;
        }
        .print-btn-bar {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
        }
        .print-btn {
          background: #E8680A;
          color: white;
          border: none;
          padding: 12px 24px;
          font-size: 15px;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: all 0.2s;
        }
        .print-btn:hover {
          background: #B84E00;
          transform: translateY(-1px);
        }
        .disclaimer {
          font-size: 11px;
          color: #A8A29E;
          text-align: center;
          margin-top: 48px;
          border-top: 1px solid #E2DDD6;
          padding-top: 16px;
        }
      </style>
    </head>
    <body>
      <div class="print-btn-bar no-print">
        <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
      </div>

      <div class="header">
        <div class="title-area">
          <h1>न्याय सहायक | Nyay Sahayak</h1>
          <p>AI-Powered Legal Advice Report</p>
        </div>
        <div class="logo-mark">⚖️</div>
      </div>

      <div class="meta-grid">
        <div class="meta-item">
          <strong>दस्तावेज़ का प्रकार / Document Type</strong>
          ${escapeHtml(analysis.documentType || 'Legal Document')}
        </div>
        <div class="meta-item">
          <strong>रिपोर्ट की भाषा / Report Language</strong>
          ${escapeHtml(languageName)}
        </div>
        <div class="meta-item">
          <strong>दिनांक / Date</strong>
          ${new Date().toLocaleDateString(languageName === 'Hindi' ? 'hi-IN' : 'en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
        <div class="meta-item">
          <strong>महत्वपूर्ण आंकड़े / Key Amounts & Dates</strong>
          ${escapeHtml(summary.keyAmounts?.join(', ') || 'None')}${summary.keyDates?.length ? ' | Dates: ' + escapeHtml(summary.keyDates.join(', ')) : ''}
        </div>
      </div>

      <!-- Overall Verdict -->
      <div class="verdict-box">
        <div class="verdict-header">
          ⚖️ ${escapeHtml(getVerdictLabel(verdict.rating))}
        </div>
        <div class="verdict-reason">
          ${escapeHtml(verdict.reason)}
        </div>
        ${verdict.immediateActions?.length ? `
          <div class="actions-label">त्वरित कार्रवाई / Immediate Actions:</div>
          <ul class="actions-list">
            ${verdict.immediateActions.map(action => `<li>${escapeHtml(action)}</li>`).join('')}
          </ul>
        ` : ''}
      </div>

      <!-- Plain Summary -->
      <div class="section-title">दस्तावेज़ का सारांश / Document Summary</div>
      <div class="summary-box">
        ${escapeHtml(summary.plain)}
        ${summary.parties?.length ? `
          <div style="margin-top: 12px; font-size: 13px; font-weight: 700; color: #57534E;">
            शामिल पक्ष / Parties Involved:
          </div>
          <div class="parties-list">
            ${summary.parties.map(p => `<span class="party-chip">${escapeHtml(p)}</span>`).join('')}
          </div>
        ` : ''}
      </div>

      <!-- Warning Flags -->
      ${dangerFlags.length ? `
        <div class="section-title">चेतावनी और चिंताएं / Warning Flags & Concerns</div>
        <div>
          ${dangerFlags.map(flag => `
            <div class="flag-card" style="border-color: ${getSeverityColor(flag.severity)};">
              <div class="flag-header">
                <h3 class="flag-title">${escapeHtml(flag.title)}</h3>
                <span class="flag-tag" style="background: ${getSeverityBg(flag.severity)}; color: ${getSeverityColor(flag.severity)};">
                  ${escapeHtml(flag.severity)}
                </span>
              </div>
              <div class="flag-explanation">
                ${escapeHtml(flag.explanation)}
              </div>
              
              ${flag.source?.originalText ? `
                <div class="cite-box">
                  <div class="cite-loc">📍 ${escapeHtml(flag.source.location || 'Original Text')}</div>
                  <div class="cite-text">"${escapeHtml(flag.source.originalText)}"</div>
                </div>
              ` : ''}

              ${flag.applicableLaw?.actName ? `
                <div class="law-box">
                  <div class="law-header">⚖️ ${escapeHtml(flag.applicableLaw.actName)} (${escapeHtml(flag.applicableLaw.section)})</div>
                  <div class="law-body">${escapeHtml(flag.applicableLaw.whatItSays)}</div>
                  <div class="law-protection">👉 ${escapeHtml(flag.applicableLaw.howItProtectsYou)}</div>
                </div>
              ` : ''}

              ${flag.recommendation ? `
                <div style="margin-top: 10px; font-size: 13px; font-weight: 600; color: #166534;">
                  💡 सलाह / Recommendation: ${escapeHtml(flag.recommendation)}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Your Rights -->
      ${yourRights.length ? `
        <div class="section-title">आपके अधिकार / Your Legal Rights</div>
        <div style="background: #FAFAF7; border: 1px solid #E2DDD6; border-radius: 8px; padding: 16px;">
          ${yourRights.map(r => `
            <div class="right-item">
              <span class="right-title">✔️ ${escapeHtml(r.right)}</span>
              <span class="right-source">${escapeHtml(r.source)}</span>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Section Breakdown -->
      ${sectionBreakdown.length ? `
        <div class="section-title">धारा-वार विश्लेषण / Clause Breakdown</div>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px;">
          <thead>
            <tr style="background: #FAFAF7; border-bottom: 2px solid #E2DDD6;">
              <th style="padding: 10px; text-align: left; border: 1px solid #E2DDD6; width: 25%;">Clause / Section</th>
              <th style="padding: 10px; text-align: left; border: 1px solid #E2DDD6; width: 55%;">Plain Explanation</th>
              <th style="padding: 10px; text-align: center; border: 1px solid #E2DDD6; width: 20%;">Fairness</th>
            </tr>
          </thead>
          <tbody>
            ${sectionBreakdown.map(sec => `
              <tr style="border-bottom: 1px solid #E2DDD6;">
                <td style="padding: 10px; border: 1px solid #E2DDD6; font-weight: 600; color: #1A3A6B;">
                  ${escapeHtml(sec.sectionTitle)}
                  <div style="font-size: 10px; color: #A8A29E; font-weight: 400; margin-top: 2px;">
                    📍 ${escapeHtml(sec.paragraph || `Page ${sec.page || 1}`)}
                  </div>
                </td>
                <td style="padding: 10px; border: 1px solid #E2DDD6;">
                  ${escapeHtml(sec.plainExplanation)}
                  ${sec.concern ? `<div style="color: #DC2626; font-size: 11px; margin-top: 4px; font-weight: 600;">⚠️ Concern: ${escapeHtml(sec.concern)}</div>` : ''}
                </td>
                <td style="padding: 10px; border: 1px solid #E2DDD6; text-align: center; font-weight: 700; color: ${sec.isFair ? '#166534' : '#DC2626'}; background: ${sec.isFair ? '#F0FDF4' : '#FEF2F2'};">
                  ${sec.isFair ? 'Fair ✔️' : 'Unfair ❌'}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : ''}

      <div class="disclaimer">
        <strong>⚠️ अस्वीकरण / Disclaimer:</strong> यह रिपोर्ट केवल सूचनात्मक और एआई-विश्लेषण के उद्देश्यों के लिए है। यह पेशेवर कानूनी सलाह का विकल्प नहीं है। किसी भी दस्तावेज पर हस्ताक्षर करने से पहले कृपया एक योग्य वकील से परामर्श करें।<br>
        This report is generated by AI for informational purposes only and does not constitute formal legal advice. Please consult a qualified legal professional before signing.
      </div>

      <script>
        // Auto trigger the print dialog for instant save-to-pdf options
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 500);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
