import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image, X, FileImage } from 'lucide-react';

const FileUpload = ({ onFileUpload, uploadedFile }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024 // 10MB limit
  });

  const removeFile = () => {
    onFileUpload(null);
  };

  if (uploadedFile) {
    return (
      <div className="space-y-4">
        {/* Uploaded File Display */}
        <div className="bg-success-green/10 border border-success-green/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-success-green/20 p-2 rounded-lg">
                <FileImage className="h-5 w-5 text-success-green" />
              </div>
              <div>
                <p className="font-medium text-success-green">
                  Dosya başarıyla yüklendi
                </p>
                <p className="text-sm text-gray-600">
                  {uploadedFile.name} ({(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Upload Another File */}
        <div
          {...getRootProps()}
          className={`
            dropzone cursor-pointer
            ${isDragActive ? 'active' : ''}
          `}
        >
          <input {...getInputProps()} />
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">
            Farklı bir dosya yüklemek için tıklayın
          </p>
          <p className="text-sm text-gray-500 mt-1">
            veya dosyayı buraya sürükleyin
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Dropzone */}
      <div
        {...getRootProps()}
        className={`
          dropzone cursor-pointer
          ${isDragActive ? 'active' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="text-center">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          
          {isDragActive ? (
            <div>
              <p className="text-lg font-medium text-xray-blue">
                Dosyayı buraya bırakın
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Ekran görüntüsü analiz edilecek
              </p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-medium text-gray-700 mb-2">
                Ekran görüntüsünü yükleyin
              </p>
              <p className="text-gray-600 mb-4">
                Test edilecek UI'ın ekran görüntüsünü sürükleyip bırakın
                <br />
                veya dosya seçmek için tıklayın
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-xray-blue text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Image className="h-4 w-4 mr-2" />
                Dosya Seç
              </div>
            </div>
          )}
        </div>
      </div>

      {/* File Format Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">📋 Desteklenen Formatlar</h4>
        <div className="flex flex-wrap gap-2">
          {['PNG', 'JPG', 'JPEG', 'GIF', 'BMP', 'WEBP'].map(format => (
            <span 
              key={format}
              className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-medium text-gray-600"
            >
              {format}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Maksimum dosya boyutu: 10MB
        </p>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">💡 İpuçları</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Yüksek çözünürlüklü ekran görüntüleri daha iyi sonuç verir</li>
          <li>• UI elementlerinin net görünür olduğundan emin olun</li>
          <li>• Form, buton, dropdown gibi interaktif elementleri içeren görüntüler ideal</li>
          <li>• Birden fazla sayfa varsa, her sayfa için ayrı test case oluşturun</li>
        </ul>
      </div>
    </div>
  );
};

export default FileUpload; 