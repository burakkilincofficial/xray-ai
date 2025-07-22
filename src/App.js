import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  FileText, 
  Download, 
  Zap, 
  CheckCircle, 
  AlertCircle,
  Eye,
  Code,
  FileSpreadsheet
} from 'lucide-react';
import TestCaseGenerator from './components/TestCaseGenerator';
import FileUpload from './components/FileUpload';
import DescriptionInput from './components/DescriptionInput';
import TestCaseList from './components/TestCaseList';
import ExportOptions from './components/ExportOptions';

function App() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [description, setDescription] = useState('');
  const [generatedTestCases, setGeneratedTestCases] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

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
      // Simulate AI processing with realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate test cases based on description
      const testCases = await TestCaseGenerator.generateFromDescription(
        uploadedFile, 
        description
      );
      
      setGeneratedTestCases(testCases);
      setCurrentStep(4);
    } catch (error) {
      console.error('Test case generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [uploadedFile, description]);

  const resetApplication = () => {
    setUploadedFile(null);
    setDescription('');
    setGeneratedTestCases([]);
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Turkcell Logo */}
              <div className="flex items-center">
                <img 
                  src="/simple-turkcell-logo.svg" 
                  alt="Turkcell Logo" 
                  className="h-8 w-auto"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div 
                  className="px-3 py-1 bg-turkcell-yellow text-turkcell-blue font-bold text-sm rounded hidden"
                  style={{ display: 'none' }}
                >
                  TURKCELL
                </div>
              </div>
              
              {/* X-ray Icon */}
              <div className="bg-xray-blue p-2 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  X-ray Test Case Generator
                </h1>
                <p className="text-sm text-gray-600">
                  Ekran görüntüsünden otomatik test case oluşturucu
                </p>
              </div>
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
                <button
                  onClick={handleGenerateTestCases}
                  disabled={isGenerating}
                  className="btn-primary w-full py-3 text-lg flex items-center justify-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span className="loading-dots">Test case'ler oluşturuluyor</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5" />
                      <span>AI ile Test Case Oluştur</span>
                    </>
                  )}
                </button>
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
            <div className="flex items-center">
              <img 
                src="/simple-turkcell-logo.svg" 
                alt="Turkcell" 
                className="h-5 w-auto opacity-60"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'inline-block';
                }}
              />
              <span 
                className="px-2 py-1 bg-turkcell-yellow text-turkcell-blue text-xs font-bold rounded opacity-60 hidden"
                style={{ display: 'none' }}
              >
                TURKCELL
              </span>
            </div>
            <span>×</span>
            <div className="flex items-center space-x-1">
              <Zap className="h-4 w-4 text-xray-blue" />
              <span>X-ray</span>
            </div>
          </div>
          <p>
            🚀 X-ray Test Case Generator v1.0 | 
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