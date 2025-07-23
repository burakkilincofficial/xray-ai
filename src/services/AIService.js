class AIService {
  constructor() {
    this.apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1';
  }

  // Ana AI test case üretimi fonksiyonu
  async generateTestCasesWithAI(imageFile, description) {
    try {
      // Resmi base64'e çevir
      const imageBase64 = await this.convertImageToBase64(imageFile);
      
      // AI prompt'unu hazırla
      const prompt = this.createTestCasePrompt(description);
      
      // OpenAI API'ye gönder
      const response = await this.callOpenAI(prompt, imageBase64);
      
      // Response'u parse et
      const testCases = this.parseAIResponse(response);
      
      return testCases;
      
    } catch (error) {
      console.error('AI test case generation failed:', error);
      // Fallback to local generation
      return this.fallbackGeneration(description);
    }
  }

  // Resmi base64'e çevir
  async convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // AI prompt'unu oluştur
  createTestCasePrompt(description) {
    return `Aşağıdaki ekran görüntüsünü detaylı analiz et ve kapsamlı test case'leri oluştur:

Açıklama: ${description}

GÖRSEL ANALİZ TALİMATLARI:
1. Ekrandaki tüm UI elementlerini tespit et (butonlar, formlar, dropdown'lar, tablolar, linkler, ikonlar)
2. Sayfa tipini belirle (login, dashboard, form, liste, detay sayfası, vb.)
3. Kullanıcı etkileşim noktalarını belirle
4. Veri giriş alanlarını tespit et
5. Navigasyon elementlerini bul
6. Validation mesajları için alanları belirle
7. Responsive tasarım elementlerini tespit et

TEST CASE ÜRETİM KURALLARI:
- Her UI elementi için ayrı test case'ler oluştur
- Positive ve negative test senaryoları dahil et
- Edge case'leri unutma (boş alanlar, maksimum karakter, özel karakterler)
- Accessibility testleri ekle (keyboard navigation, screen reader)
- Cross-browser compatibility testleri dahil et
- Performance testleri ekle (yükleme süreleri, büyük veri setleri)
- Security testleri ekle (XSS, SQL injection, input validation)
- Mobile responsive testleri dahil et

Lütfen aşağıdaki formatta JSON response döndür:

{
  "testCases": [
    {
      "id": "TC_001",
      "summary": "Detaylı test case başlığı",
      "description": "Kapsamlı açıklama",
      "testType": "Manual|Automated",
      "priority": "High|Medium|Low",
      "component": "Spesifik bileşen adı",
      "labels": ["functional", "ui", "validation", "accessibility", "security", "performance"],
      "preconditions": ["Detaylı ön koşullar"],
      "steps": ["Adım adım test adımları"],
      "expectedResults": ["Beklenen sonuçlar"],
      "testData": {
        "validInputs": {"alan": "geçerli değer"},
        "invalidInputs": {"alan": "geçersiz değer"},
        "edgeCases": ["sınır değerler"],
        "specialCharacters": ["özel karakterler"]
      },
      "estimatedTime": "Tahmini süre",
      "automationPotential": "Yüksek|Orta|Düşük"
    }
  ],
  "analysis": {
    "detectedComponents": ["Tespit edilen tüm bileşenler"],
    "pageType": "Sayfa tipi",
    "userInteractions": ["Kullanıcı etkileşimleri"],
    "dataFields": ["Veri giriş alanları"],
    "validationPoints": ["Validation noktaları"],
    "suggestions": [
      "Test stratejisi önerileri",
      "Otomasyon fırsatları",
      "Risk analizi",
      "Performans önerileri",
      "Güvenlik önerileri"
    ],
    "complexity": "Düşük|Orta|Yüksek",
    "estimatedTestCount": "Tahmini test sayısı"
  }
}

ÖNEMLİ: Görsel analizi çok detaylı yap ve her UI elementi için test case üret. Turkcell Maya Test Automation Suite için optimize et.`;
  }

  // OpenAI API'yi çağır
  async callOpenAI(prompt, imageBase64) {
    if (!this.apiKey || this.apiKey === 'your_openai_api_key_here') {
      throw new Error('Geçerli OpenAI API key bulunamadı');
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: prompt
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${imageBase64}`
                  }
                }
              ]
            }
          ],
          max_tokens: 2000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('OpenAI API Error Details:', errorData);
        throw new Error(`OpenAI API error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API call failed:', error);
      throw error;
    }
  }

  // AI response'unu parse et
  parseAIResponse(response) {
    try {
      // JSON'u extract et
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('JSON response bulunamadı');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      // Test case'leri formatla
      const formattedTestCases = parsed.testCases.map((tc, index) => ({
        ...tc,
        uuid: this.generateUUID(),
        createdAt: new Date().toISOString(),
        id: tc.id || `TC_${String(index + 1).padStart(3, '0')}`
      }));

      return {
        testCases: formattedTestCases,
        analysis: parsed.analysis || {},
        aiGenerated: true
      };

    } catch (error) {
      console.error('AI response parsing failed:', error);
      throw error;
    }
  }

  // Fallback generation (AI çalışmazsa)
  fallbackGeneration(description) {
    // Basit test case'ler oluştur
    const testCases = [
      {
        id: 'TC_001',
        uuid: this.generateUUID(),
        summary: 'Temel İşlevsellik Testi',
        description: `Açıklama: ${description} - Temel işlevsellik kontrolü`,
        testType: 'Manual',
        priority: 'High',
        component: 'Ana Bileşen',
        labels: ['functional', 'basic'],
        preconditions: ['Uygulama açık', 'Kullanıcı giriş yapmış'],
        steps: [
          'Sayfayı aç',
          'Ana işlevselliği test et',
          'Sonuçları kontrol et'
        ],
        expectedResults: [
          'Sayfa başarıyla yüklenir',
          'İşlevsellik çalışır',
          'Beklenen sonuçlar alınır'
        ],
        testData: { description },
        estimatedTime: '5 dakika',
        createdAt: new Date().toISOString()
      }
    ];

    return {
      testCases,
      analysis: { detectedComponents: ['basic'], pageType: 'unknown' },
      aiGenerated: false
    };
  }

  // UUID oluştur
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // AI özelliklerini kontrol et
  async checkAIAvailability() {
    const hasValidKey = this.apiKey && 
                       this.apiKey !== 'your_openai_api_key_here' && 
                       this.apiKey.startsWith('sk-');
    
    return {
      available: hasValidKey,
      model: 'gpt-4o',
      features: ['image-analysis', 'test-case-generation', 'smart-suggestions'],
      keyStatus: hasValidKey ? 'valid' : 'invalid_or_missing'
    };
  }

  // Akıllı öneriler al
  async getSmartSuggestions(description) {
    try {
      const prompt = `Aşağıdaki test senaryosu için akıllı öneriler ver:

${description}

Lütfen şu kategorilerde öneriler ver:
1. Test Stratejisi
2. Risk Analizi  
3. Otomasyon Fırsatları
4. Test Verisi Önerileri
5. Edge Case'ler

JSON formatında döndür:
{
  "suggestions": {
    "strategy": ["Öneri 1", "Öneri 2"],
    "risks": ["Risk 1", "Risk 2"],
    "automation": ["Otomasyon 1", "Otomasyon 2"],
    "testData": ["Veri 1", "Veri 2"],
    "edgeCases": ["Edge case 1", "Edge case 2"]
  }
}`;

      const response = await this.callOpenAI(prompt);
      return this.parseAIResponse(response);

    } catch (error) {
      console.error('Smart suggestions failed:', error);
      return {
        suggestions: {
          strategy: ['Temel fonksiyonel testler yapın'],
          risks: ['Kullanıcı deneyimi riskleri'],
          automation: ['UI elementlerini otomatikleştirin'],
          testData: ['Geçerli ve geçersiz veriler test edin'],
          edgeCases: ['Sınır değerleri kontrol edin']
        }
      };
    }
  }

  // Test case kalitesini değerlendir
  async evaluateTestQuality(testCases) {
    try {
      const prompt = `Aşağıdaki test case'lerin kalitesini değerlendir:

${JSON.stringify(testCases, null, 2)}

Lütfen şu kriterlere göre değerlendir:
1. Kapsamlılık (Completeness)
2. Doğruluk (Accuracy)  
3. Uygulanabilirlik (Executability)
4. Bakım Kolaylığı (Maintainability)

JSON formatında döndür:
{
  "evaluation": {
    "overallScore": 85,
    "completeness": 90,
    "accuracy": 85,
    "executability": 80,
    "maintainability": 85,
    "improvements": ["İyileştirme 1", "İyileştirme 2"],
    "missingTests": ["Eksik test 1", "Eksik test 2"]
  }
}`;

      const response = await this.callOpenAI(prompt);
      return this.parseAIResponse(response);

    } catch (error) {
      console.error('Test quality evaluation failed:', error);
      return {
        evaluation: {
          overallScore: 75,
          completeness: 80,
          accuracy: 75,
          executability: 70,
          maintainability: 75,
          improvements: ['Daha detaylı adımlar ekleyin'],
          missingTests: ['Negative test case\'ler ekleyin']
        }
      };
    }
  }
}

const aiService = new AIService();
export default aiService; 