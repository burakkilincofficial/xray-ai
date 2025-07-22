import React, { useState } from 'react';
import { MessageSquare, Lightbulb, Target, Layers } from 'lucide-react';

const DescriptionInput = ({ description, onChange }) => {
  const [activeTab, setActiveTab] = useState('description');
  
  const examplePrompts = [
    {
      title: "Dropdown Test",
      description: "Bu ekranda bir dropdown menü var. Tüm seçeneklerin doğru görüntülendiğini ve seçim işlemlerinin çalıştığını test etmek istiyorum.",
      icon: "🔽"
    },
    {
      title: "Form Validation",
      description: "Login formundaki validation kurallarını test etmek istiyorum. Boş field'lar, geçersiz email format ve şifre kriterleri kontrol edilmeli.",
      icon: "📝"
    },
    {
      title: "Navigation Test",
      description: "Ana menü navigasyonunu test etmek istiyorum. Tüm menü öğelerinin doğru sayfalara yönlendirdiğini kontrol edilmeli.",
      icon: "🧭"
    },
    {
      title: "Button Actions",
      description: "Sayfadaki tüm butonların işlevselliğini test etmek istiyorum. Kaydet, iptal, düzenle gibi aksiyonlar kontrol edilmeli.",
      icon: "🔘"
    }
  ];

  const handleExampleClick = (exampleDescription) => {
    onChange(exampleDescription);
  };

  const tabs = [
    { id: 'description', label: 'Açıklama', icon: MessageSquare },
    { id: 'examples', label: 'Örnekler', icon: Lightbulb }
  ];

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex space-x-4 border-b border-gray-200">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`
              flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors duration-200
              ${activeTab === id 
                ? 'border-xray-blue text-xray-blue' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }
            `}
          >
            <Icon className="h-4 w-4" />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* Description Tab */}
      {activeTab === 'description' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <Target className="h-4 w-4 mr-1" />
              Test edilecek özellikler ve beklentilerinizi açıklayın
            </label>
            <textarea
              value={description}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Örnek: Bu ekranda bulunan dropdown menünün tüm seçeneklerini test etmek istiyorum. Seçeneklerin doğru görüntülendiği, seçim işlemlerinin çalıştığı ve validation kurallarının uygulandığını kontrol edilmeli..."
              className="form-input min-h-[120px] resize-y"
              rows={6}
            />
            <div className="text-right text-sm text-gray-500">
              {description.length}/1000 karakter
            </div>
          </div>

          {/* Tips for good descriptions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2 flex items-center">
              <Lightbulb className="h-4 w-4 mr-1" />
              İyi Açıklama İpuçları
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Spesifik olun:</strong> Hangi UI elementlerini test etmek istediğinizi belirtin</li>
              <li>• <strong>Senaryoları açıklayın:</strong> Normal kullanım ve edge case'leri tanımlayın</li>
              <li>• <strong>Beklentileri belirtin:</strong> Ne olması gerektiğini açıkça ifade edin</li>
              <li>• <strong>Kullanıcı tipini ekleyin:</strong> Admin, normal kullanıcı vs.</li>
            </ul>
          </div>

          {/* Quick suggestion buttons */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Hızlı Eklemeler:
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                "Functional testing gerekli",
                "UI validation kontrolü",
                "Negative test case'ler dahil",
                "Accessibility testleri",
                "Performance testleri",
                "Cross-browser compatibility"
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    const newDescription = description ? 
                      `${description}\n• ${suggestion}` : 
                      suggestion;
                    onChange(newDescription);
                  }}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors"
                >
                  + {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Examples Tab */}
      {activeTab === 'examples' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Aşağıdaki örnek açıklamaları kullanarak hızlıca başlayabilirsiniz:
          </p>
          
          <div className="grid gap-4">
            {examplePrompts.map((example, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:border-xray-blue hover:bg-xray-light/20 transition-all duration-200 cursor-pointer"
                onClick={() => handleExampleClick(example.description)}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{example.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {example.title}
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {example.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 mb-2">
              💡 Özelleştirme Önerisi
            </h4>
            <p className="text-sm text-yellow-800">
              Bu örnekleri kendi ekran görüntünüze göre uyarlayın. 
              Ne kadar detaylı açıklama verirseniz, o kadar hedefli test case'ler oluşur.
            </p>
          </div>
        </div>
      )}

      {/* Character count and validation */}
      {description.length > 800 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800 flex items-center">
            <Layers className="h-4 w-4 mr-1" />
            Harika! Detaylı açıklama daha kaliteli test case'ler oluşturacak.
          </p>
        </div>
      )}
    </div>
  );
};

export default DescriptionInput; 