import React, { useState, useCallback, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  Download, 
  Zap, 
  CheckCircle,
  Eye,
  Brain
} from 'lucide-react';
import TestCaseGenerator from './components/TestCaseGenerator';
import FileUpload from './components/FileUpload';
import DescriptionInput from './components/DescriptionInput';
import TestCaseList from './components/TestCaseList';
import ExportOptions from './components/ExportOptions';
import AIService from './services/AIService';

function App() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [description, setDescription] = useState('');
  const [generatedTestCases, setGeneratedTestCases] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [aiAvailable, setAiAvailable] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);

  // AI durumunu kontrol et
  useEffect(() => {
    const checkAI = async () => {
      try {
        const status = await AIService.checkAIAvailability();
        setAiAvailable(status.available);
      } catch (error) {
        console.error('AI availability check failed:', error);
        setAiAvailable(false);
      }
    };
    checkAI();
  }, []);

  const handleFileUpload = useCallback((file) => {
    setUploadedFile(file);
    setCurrentStep(2);
  }, []);

  const handleDescriptionChange = useCallback((desc) => {
    setDescription(desc);
    if (desc.trim() && uploadedFile) {
      setCurrentStep(3);
    }
  }, [uploadedFile]);

  const handleGenerateTestCases = useCallback(async () => {
    if (!uploadedFile || !description.trim()) return;

    setIsGenerating(true);
    
    try {
      let result;
      
      if (useAI && aiAvailable) {
        // AI ile test case üret
        result = await AIService.generateTestCasesWithAI(uploadedFile, description);
        setGeneratedTestCases(result.testCases);
        setAiAnalysis(result.analysis);
      } else {
        // Local generation
        const testCases = await TestCaseGenerator.generateFromDescription(
          uploadedFile, 
          description
        );
        setGeneratedTestCases(testCases);
        setAiAnalysis(null);
      }
      
      setCurrentStep(4);
    } catch (error) {
      console.error('Test case generation failed:', error);
      // Fallback to local generation
      try {
        const testCases = await TestCaseGenerator.generateFromDescription(
          uploadedFile, 
          description
        );
        setGeneratedTestCases(testCases);
        setCurrentStep(4);
      } catch (fallbackError) {
        console.error('Fallback generation also failed:', fallbackError);
      }
    } finally {
      setIsGenerating(false);
    }
  }, [uploadedFile, description, useAI, aiAvailable]);

  const resetApplication = () => {
    setUploadedFile(null);
    setDescription('');
    setGeneratedTestCases([]);
    setCurrentStep(1);
    setAiAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">

              
              {/* X-ray Icon */}
              <div className="bg-xray-blue p-2 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Test Royer Test Case Generator
                </h1>
                <p className="text-sm text-gray-600">
                  Ekran görüntüsünden otomatik test case oluşturucu
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* AI Toggle */}
              <div className="flex items-center space-x-2">
                <Brain className={`h-4 w-4 ${aiAvailable ? 'text-xray-blue' : 'text-gray-400'}`} />
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={useAI && aiAvailable}
                    onChange={(e) => setUseAI(e.target.checked)}
                    disabled={!aiAvailable}
                    className="rounded border-gray-300 text-xray-blue focus:ring-xray-blue disabled:opacity-50"
                  />
                  <span className={`${aiAvailable ? 'text-gray-700' : 'text-gray-400'}`}>
                    OpenAI {!aiAvailable && '(Kullanılamıyor)'}
                  </span>
                </label>
              </div>
              
              <button
                onClick={resetApplication}
                className="btn-secondary flex items-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>Yeni Proje</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-center space-x-8 mb-8">
          {[
            { number: 1, title: 'Ekran Görüntüsü', icon: Upload },
            { number: 2, title: 'Açıklama', icon: FileText },
            { number: 3, title: 'Oluştur', icon: Zap },
            { number: 4, title: 'Export', icon: Download }
          ].map(({ number, title, icon: Icon }) => (
            <div key={number} className="flex items-center space-x-2">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300
                ${currentStep >= number 
                  ? 'bg-xray-blue border-xray-blue text-white' 
                  : 'bg-white border-gray-300 text-gray-500'
                }
              `}>
                {currentStep > number ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>
              <span className={`
                text-sm font-medium transition-colors duration-300
                ${currentStep >= number ? 'text-xray-blue' : 'text-gray-500'}
              `}>
                {title}
              </span>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Panel - Input */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* File Upload */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Upload className="h-5 w-5 mr-2 text-xray-blue" />
                1. Ekran Görüntüsü Yükle
              </h2>
              <FileUpload 
                onFileUpload={handleFileUpload}
                uploadedFile={uploadedFile}
              />
            </div>

            {/* Description Input */}
            {uploadedFile && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-xray-blue" />
                  2. Açıklama ve Bağlam
                </h2>
                <DescriptionInput
                  description={description}
                  onChange={handleDescriptionChange}
                />
              </div>
            )}

            {/* Generate Button */}
            {uploadedFile && description.trim() && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-xray-blue" />
                  3. Test Case'leri Oluştur
                </h2>
                <div className="space-y-4">
                  <button
                    onClick={handleGenerateTestCases}
                    disabled={isGenerating}
                    className="btn-primary w-full py-3 text-lg flex items-center justify-center space-x-2"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span className="loading-dots">
                          {useAI && aiAvailable ? 'AI analiz ediyor...' : 'Test case\'ler oluşturuluyor'}
                        </span>
                      </>
                    ) : (
                      <>
                        {useAI && aiAvailable ? <Brain className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
                        <span>
                          {useAI && aiAvailable ? 'AI ile Test Case Oluştur' : 'Test Case Oluştur'}
                        </span>
                      </>
                    )}
                  </button>
                  
                  {useAI && aiAvailable && (
                    <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <Brain className="h-3 w-3 text-xray-blue" />
                        <span className="font-medium">AI Özellikleri Aktif</span>
                      </div>
                      <ul className="space-y-1 text-gray-500">
                        <li>• Görsel analiz ile akıllı test case üretimi</li>
                        <li>• Otomatik bileşen tespiti</li>
                        <li>• Kapsamlı test senaryoları</li>
                        <li>• Akıllı öneriler ve iyileştirmeler</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Preview & Results */}
          <div className="space-y-6">
            
            {/* File Preview */}
            {uploadedFile && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Eye className="h-4 w-4 mr-2" />
                  Önizleme
                </h3>
                <div className="relative">
                  <img
                    src={URL.createObjectURL(uploadedFile)}
                    alt="Uploaded screenshot"
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                    {uploadedFile.name}
                  </div>
                </div>
              </div>
            )}

            {/* AI Analysis */}
            {aiAnalysis && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Brain className="h-4 w-4 mr-2 text-xray-blue" />
                  AI Görsel Analizi
                </h3>
                <div className="space-y-4">
                  {/* Sayfa Bilgileri */}
                  <div className="grid grid-cols-2 gap-4">
                    {aiAnalysis.pageType && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Sayfa Tipi:</h4>
                        <span className="px-2 py-1 bg-turkcell-yellow text-turkcell-blue text-xs rounded-full">
                          {aiAnalysis.pageType}
                        </span>
                      </div>
                    )}
                    
                    {aiAnalysis.complexity && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Karmaşıklık:</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          aiAnalysis.complexity === 'Yüksek' ? 'bg-error-red text-white' :
                          aiAnalysis.complexity === 'Orta' ? 'bg-warning-orange text-white' :
                          'bg-success-green text-white'
                        }`}>
                          {aiAnalysis.complexity}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Tespit Edilen Bileşenler */}
                  {aiAnalysis.detectedComponents && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Tespit Edilen Bileşenler:</h4>
                      <div className="flex flex-wrap gap-2">
                        {aiAnalysis.detectedComponents.map((component, index) => (
                          <span key={index} className="px-2 py-1 bg-xray-light text-xray-blue text-xs rounded-full">
                            {component}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Kullanıcı Etkileşimleri */}
                  {aiAnalysis.userInteractions && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Kullanıcı Etkileşimleri:</h4>
                      <div className="flex flex-wrap gap-2">
                        {aiAnalysis.userInteractions.map((interaction, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {interaction}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Veri Giriş Alanları */}
                  {aiAnalysis.dataFields && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Veri Giriş Alanları:</h4>
                      <div className="flex flex-wrap gap-2">
                        {aiAnalysis.dataFields.map((field, index) => (
                          <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            {field}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Validation Noktaları */}
                  {aiAnalysis.validationPoints && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Validation Noktaları:</h4>
                      <div className="flex flex-wrap gap-2">
                        {aiAnalysis.validationPoints.map((point, index) => (
                          <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                            {point}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Önerileri */}
                  {aiAnalysis.suggestions && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">AI Önerileri:</h4>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <ul className="text-xs text-gray-700 space-y-2">
                          {aiAnalysis.suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-xray-blue mr-2 mt-0.5">💡</span>
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Test Sayısı */}
                  {aiAnalysis.estimatedTestCount && (
                    <div className="text-center p-3 bg-gradient-to-r from-xray-blue to-blue-600 rounded-lg text-white">
                      <div className="text-lg font-bold">{aiAnalysis.estimatedTestCount}</div>
                      <div className="text-xs opacity-90">Tahmini Test Sayısı</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            {generatedTestCases.length > 0 && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  📊 İstatistikler
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-xray-light rounded-lg">
                    <div className="text-2xl font-bold text-xray-blue">
                      {generatedTestCases.length}
                    </div>
                    <div className="text-sm text-gray-600">Test Case</div>
                  </div>
                  <div className="text-center p-3 bg-success-green/10 rounded-lg">
                    <div className="text-2xl font-bold text-success-green">
                      {generatedTestCases.filter(tc => tc.priority === 'High').length}
                    </div>
                    <div className="text-sm text-gray-600">Yüksek Öncelik</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Generated Test Cases */}
        {generatedTestCases.length > 0 && (
          <div className="mt-8 card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-success-green" />
                4. Oluşturulan Test Case'ler
              </h2>
              <ExportOptions testCases={generatedTestCases} />
            </div>
            <TestCaseList testCases={generatedTestCases} />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <div className="flex items-center justify-center space-x-6 mb-2">

            <span>×</span>
            <div className="flex items-center space-x-1">
              <Zap className="h-4 w-4 text-xray-blue" />
              <span>Test Royer</span>
            </div>
          </div>
          <p>
            🚀 Test Royer Test Case Generator v1.0 | 
            Ekran görüntülerinden otomatik test case üretimi
          </p>
          <p className="text-xs mt-1 text-gray-400">
            Turkcell Maya Test Automation Suite
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App; 