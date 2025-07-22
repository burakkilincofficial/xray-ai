import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Clock, 
  Tag,
  Search,
  Eye
} from 'lucide-react';

const TestCaseList = ({ testCases }) => {
  const [expandedTestCase, setExpandedTestCase] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('all');

  // Filter and search logic
  const filteredTestCases = testCases.filter(testCase => {
    const matchesSearch = testCase.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testCase.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPriority = selectedPriority === 'all' || testCase.priority === selectedPriority;
    
    return matchesSearch && matchesPriority;
  });

  const toggleExpanded = (testCaseId) => {
    setExpandedTestCase(expandedTestCase === testCaseId ? null : testCaseId);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityBorderColor = (priority) => {
    switch (priority) {
      case 'High': return 'border-red-200 bg-red-50';
      case 'Medium': return 'border-orange-200 bg-orange-50';
      case 'Low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getTestTypeIcon = (testType) => {
    switch (testType) {
      case 'Manual': return '🧪';
      case 'Automated': return '🤖';
      default: return '📋';
    }
  };

  const priorityStats = {
    high: testCases.filter(tc => tc.priority === 'High').length,
    medium: testCases.filter(tc => tc.priority === 'Medium').length,
    low: testCases.filter(tc => tc.priority === 'Low').length
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Test Case'ler ({filteredTestCases.length})
          </h3>
          <div className="flex space-x-2">
            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
              {priorityStats.high} Yüksek
            </span>
            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
              {priorityStats.medium} Orta
            </span>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              {priorityStats.low} Düşük
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-gray-50 p-4 rounded-lg">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Test case ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-xray-blue focus:border-transparent"
          />
        </div>

        {/* Priority Filter */}
        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xray-blue focus:border-transparent"
        >
          <option value="all">Tüm Öncelikler</option>
          <option value="High">Yüksek Öncelik</option>
          <option value="Medium">Orta Öncelik</option>
          <option value="Low">Düşük Öncelik</option>
        </select>
      </div>

      {/* Test Cases List */}
      <div className="space-y-3">
        {filteredTestCases.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Eye className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Arama kriterlerinize uygun test case bulunamadı.</p>
          </div>
        ) : (
          filteredTestCases.map((testCase) => (
            <div
              key={testCase.id}
              className={`
                test-case-card border-l-4 transition-all duration-200
                ${getPriorityBorderColor(testCase.priority)}
              `}
            >
              {/* Test Case Header */}
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleExpanded(testCase.id)}
              >
                <div className="flex items-center space-x-3 flex-1">
                  {/* Expand/Collapse Icon */}
                  {expandedTestCase === testCase.id ? (
                    <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  )}
                  
                  {/* Test Case Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-mono text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {testCase.id}
                      </span>
                      <span className="text-lg">{getTestTypeIcon(testCase.testType)}</span>
                      <span className={`
                        px-2 py-1 text-xs font-medium rounded-full
                        ${getPriorityColor(testCase.priority)}
                      `}>
                        {testCase.priority}
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">
                      {testCase.summary}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {testCase.description}
                    </p>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{testCase.estimatedTime}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Tag className="h-4 w-4" />
                    <span>{testCase.component}</span>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedTestCase === testCase.id && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                  
                  {/* Labels */}
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">🏷️ Etiketler</h5>
                    <div className="flex flex-wrap gap-2">
                      {testCase.labels.map((label, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Preconditions */}
                  {testCase.preconditions && testCase.preconditions.length > 0 && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">📋 Ön Koşullar</h5>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                        {testCase.preconditions.map((condition, index) => (
                          <li key={index}>{condition}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Test Steps */}
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">⚡ Test Adımları</h5>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                      {testCase.steps.map((step, index) => (
                        <li key={index} className="leading-relaxed">{step}</li>
                      ))}
                    </ol>
                  </div>

                  {/* Expected Results */}
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">✅ Beklenen Sonuçlar</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      {testCase.expectedResults.map((result, index) => (
                        <li key={index} className="leading-relaxed">{result}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Test Data */}
                  {testCase.testData && Object.keys(testCase.testData).length > 0 && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">📊 Test Verileri</h5>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                          {JSON.stringify(testCase.testData, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Meta Information */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span>Test Tipi: {testCase.testType}</span>
                      <span>Bileşen: {testCase.component}</span>
                    </div>
                    <span>
                      Oluşturulma: {new Date(testCase.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      {filteredTestCases.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">📈 Özet</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-blue-800 font-medium">Toplam Test Case:</span>
              <span className="ml-2 text-blue-900">{filteredTestCases.length}</span>
            </div>
            <div>
              <span className="text-blue-800 font-medium">Tahmini Süre:</span>
              <span className="ml-2 text-blue-900">
                {filteredTestCases.reduce((total, tc) => {
                  const time = parseInt(tc.estimatedTime.split(' ')[0]) || 0;
                  return total + time;
                }, 0)} dakika
              </span>
            </div>
            <div>
              <span className="text-blue-800 font-medium">Kapsanan Bileşenler:</span>
              <span className="ml-2 text-blue-900">
                {[...new Set(filteredTestCases.map(tc => tc.component))].length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestCaseList; 