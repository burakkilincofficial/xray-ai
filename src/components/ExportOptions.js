import React, { useState } from 'react';
import { 
  Download, 
  FileJson, 
  FileSpreadsheet, 
  FileCode,
  Copy,
  Check,
  Settings
} from 'lucide-react';
import { saveAs } from 'file-saver';

const ExportOptions = ({ testCases }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState(null);
  const [exportSettings, setExportSettings] = useState({
    includeSteps: true,
    includeExpectedResults: true,
    includeTestData: true,
    includePreconditions: true
  });

  // JSON Export
  const exportToJSON = () => {
    const formattedData = {
      project: "X-ray Test Cases",
      generatedAt: new Date().toISOString(),
      totalTestCases: testCases.length,
      testCases: testCases.map(tc => filterTestCaseData(tc))
    };

    const blob = new Blob([JSON.stringify(formattedData, null, 2)], {
      type: 'application/json;charset=utf-8'
    });
    saveAs(blob, `xray-test-cases-${new Date().toISOString().split('T')[0]}.json`);
  };

  // CSV Export
  const exportToCSV = () => {
    const headers = [
      'Test Case ID',
      'Summary',
      'Priority',
      'Test Type',
      'Component',
      'Labels',
      'Preconditions',
      'Test Steps',
      'Expected Results',
      'Test Data',
      'Estimated Time'
    ];

    const csvContent = [
      headers.join(','),
      ...testCases.map(tc => [
        tc.id,
        `"${tc.summary}"`,
        tc.priority,
        tc.testType,
        tc.component,
        `"${tc.labels.join(', ')}"`,
        exportSettings.includePreconditions ? `"${tc.preconditions.join('; ')}"` : '""',
        exportSettings.includeSteps ? `"${tc.steps.join('; ')}"` : '""',
        exportSettings.includeExpectedResults ? `"${tc.expectedResults.join('; ')}"` : '""',
        exportSettings.includeTestData ? `"${JSON.stringify(tc.testData).replace(/"/g, '""')}"` : '""',
        tc.estimatedTime
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `xray-test-cases-${new Date().toISOString().split('T')[0]}.csv`);
  };

  // Gherkin Export
  const exportToGherkin = () => {
    const gherkinContent = generateGherkinContent(testCases);
    const blob = new Blob([gherkinContent], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `test-scenarios-${new Date().toISOString().split('T')[0]}.feature`);
  };

  // Copy to Clipboard
  const copyToClipboard = async (format) => {
    let content = '';
    
    switch (format) {
      case 'json':
        content = JSON.stringify({
          project: "X-ray Test Cases",
          testCases: testCases.map(tc => filterTestCaseData(tc))
        }, null, 2);
        break;
      case 'gherkin':
        content = generateGherkinContent(testCases);
        break;
      case 'csv':
        // CSV için temel format
        content = testCases.map(tc => 
          `${tc.id},${tc.summary},${tc.priority},${tc.component}`
        ).join('\n');
        break;
      default:
        return;
    }

    try {
      await navigator.clipboard.writeText(content);
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 2000);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  };

  // Helper Functions
  const filterTestCaseData = (testCase) => {
    const filtered = { ...testCase };
    
    if (!exportSettings.includeSteps) delete filtered.steps;
    if (!exportSettings.includeExpectedResults) delete filtered.expectedResults;
    if (!exportSettings.includeTestData) delete filtered.testData;
    if (!exportSettings.includePreconditions) delete filtered.preconditions;
    
    return filtered;
  };

  const generateGherkinContent = (testCases) => {
    const featureContent = `Feature: Generated Test Scenarios
  Test case'ler otomatik olarak oluşturulmuştur
  
  Background:
    Given Uygulama test ortamında çalışır durumda
    And Geçerli kullanıcı ile giriş yapılmış

${testCases.map((tc, index) => `
  @${tc.labels.join(' @')}
  Scenario${testCases.length > 1 ? ` ${index + 1}` : ''}: ${tc.summary}
    ${tc.steps.map(step => `When ${step}`).join('\n    ')}
    ${tc.expectedResults.map(result => `Then ${result}`).join('\n    ')}
`).join('')}`;

    return featureContent;
  };

  const exportFormats = [
    {
      id: 'json',
      name: 'JSON',
      description: 'X-ray REST API import için',
      icon: FileJson,
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100',
      action: exportToJSON
    },
    {
      id: 'csv',
      name: 'CSV',
      description: 'Excel/Spreadsheet import için',
      icon: FileSpreadsheet,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      action: exportToCSV
    },
    {
      id: 'gherkin',
      name: 'Gherkin',
      description: 'BDD/Cucumber için',
      icon: FileCode,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      action: exportToGherkin
    }
  ];

  return (
    <div className="relative">
      {/* Main Export Button */}
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="btn-primary flex items-center space-x-2"
      >
        <Download className="h-4 w-4" />
        <span>Export Test Cases</span>
      </button>

      {/* Export Options Dropdown */}
      {showOptions && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-900 mb-1">Export Seçenekleri</h3>
            <p className="text-sm text-gray-600">
              {testCases.length} test case'i farklı formatlarda export edin
            </p>
          </div>

          {/* Export Settings */}
          <div className="p-4 border-b border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <Settings className="h-4 w-4 mr-1" />
              Export Ayarları
            </h4>
            <div className="space-y-2">
              {[
                { key: 'includeSteps', label: 'Test adımları dahil et' },
                { key: 'includeExpectedResults', label: 'Beklenen sonuçlar dahil et' },
                { key: 'includeTestData', label: 'Test verileri dahil et' },
                { key: 'includePreconditions', label: 'Ön koşullar dahil et' }
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={exportSettings[key]}
                    onChange={(e) => setExportSettings({
                      ...exportSettings,
                      [key]: e.target.checked
                    })}
                    className="rounded border-gray-300 text-xray-blue focus:ring-xray-blue"
                  />
                  <span className="text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Export Formats */}
          <div className="p-4 space-y-3">
            {exportFormats.map(({ id, name, description, icon: Icon, color, bgColor, action }) => (
              <div
                key={id}
                className={`${bgColor} border border-gray-200 rounded-lg p-3 transition-colors duration-200`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-5 w-5 ${color}`} />
                    <div>
                      <div className="font-medium text-gray-900">{name}</div>
                      <div className="text-sm text-gray-600">{description}</div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {/* Copy Button */}
                    <button
                      onClick={() => copyToClipboard(id)}
                      className="p-1 hover:bg-white rounded transition-colors"
                      title="Panoya kopyala"
                    >
                      {copiedFormat === id ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                    {/* Download Button */}
                    <button
                      onClick={action}
                      className="px-3 py-1 bg-white hover:bg-gray-50 border border-gray-300 rounded text-sm transition-colors"
                    >
                      İndir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Info */}
          <div className="p-4 bg-gray-50 rounded-b-lg">
            <div className="text-xs text-gray-600 space-y-1">
              <p>💡 <strong>JSON:</strong> X-ray REST API ile direkt import</p>
              <p>📊 <strong>CSV:</strong> Excel'de düzenleme ve toplu import</p>
              <p>🥒 <strong>Gherkin:</strong> Cucumber/SpecFlow entegrasyonu</p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setShowOptions(false)}
            className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded transition-colors"
          >
            ×
          </button>
        </div>
      )}

      {/* Background Overlay */}
      {showOptions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowOptions(false)}
        />
      )}
    </div>
  );
};

export default ExportOptions; 