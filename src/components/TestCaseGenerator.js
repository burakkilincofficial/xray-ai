import { v4 as uuidv4 } from 'uuid';

class TestCaseGenerator {
  
  // Ana test case üretimi fonksiyonu
  static async generateFromDescription(imageFile, description) {
    try {
      // Açıklamayı analiz et
      const analysis = this.analyzeDescription(description);
      
      // UI componentlerini tahmin et (gerçek projede image analysis kullanılabilir)
      const uiComponents = this.detectUIComponents(analysis);
      
      // Test case'leri üret
      const testCases = this.generateTestCases(uiComponents, analysis);
      
      return testCases;
      
    } catch (error) {
      console.error('Test case generation failed:', error);
      throw error;
    }
  }

  // Açıklamayı analiz ederek anahtar kelimeleri çıkar
  static analyzeDescription(description) {
    const lowerDesc = description.toLowerCase();
    
    const analysis = {
      components: [],
      testTypes: [],
      priority: 'Medium',
      userType: 'user',
      requirements: []
    };

    // UI Componentlerini tespit et
    const componentKeywords = {
      'dropdown': ['dropdown', 'açılır', 'seçim', 'liste', 'menü'],
      'button': ['buton', 'button', 'tıkla', 'bas'],
      'form': ['form', 'giriş', 'kayıt', 'doldur'],
      'input': ['input', 'alan', 'field', 'giriş'],
      'navigation': ['menü', 'nav', 'navigasyon', 'yönlendirme'],
      'table': ['tablo', 'table', 'liste', 'satır'],
      'modal': ['modal', 'popup', 'pencere'],
      'search': ['arama', 'search', 'filtre'],
      'upload': ['yükle', 'upload', 'dosya'],
      'login': ['giriş', 'login', 'oturum']
    };

    for (const [component, keywords] of Object.entries(componentKeywords)) {
      if (keywords.some(keyword => lowerDesc.includes(keyword))) {
        analysis.components.push(component);
      }
    }

    // Test tiplerini tespit et
    const testTypeKeywords = {
      'functional': ['işlevsel', 'functional', 'çalış'],
      'ui': ['görünüm', 'ui', 'arayüz', 'görsel'],
      'validation': ['doğrula', 'validation', 'kontrol', 'geçerli'],
      'accessibility': ['erişilebilir', 'accessibility', 'keyboard'],
      'performance': ['performans', 'hız', 'yavaş'],
      'negative': ['negative', 'hatalı', 'yanlış', 'geçersiz']
    };

    for (const [testType, keywords] of Object.entries(testTypeKeywords)) {
      if (keywords.some(keyword => lowerDesc.includes(keyword))) {
        analysis.testTypes.push(testType);
      }
    }

    // Varsayılan test tipleri
    if (analysis.testTypes.length === 0) {
      analysis.testTypes = ['functional', 'ui'];
    }

    // Öncelik belirleme
    if (lowerDesc.includes('kritik') || lowerDesc.includes('önemli') || lowerDesc.includes('high')) {
      analysis.priority = 'High';
    } else if (lowerDesc.includes('düşük') || lowerDesc.includes('low')) {
      analysis.priority = 'Low';
    }

    // Kullanıcı tipi
    if (lowerDesc.includes('admin') || lowerDesc.includes('yönetici')) {
      analysis.userType = 'admin';
    }

    return analysis;
  }

  // UI componentlerini tespit et
  static detectUIComponents(analysis) {
    const components = analysis.components.length > 0 ? 
      analysis.components : 
      ['button', 'form']; // varsayılan componentler

    return components.map(component => ({
      type: component,
      name: this.getComponentName(component),
      testScenarios: this.getComponentScenarios(component)
    }));
  }

  // Component isimleri
  static getComponentName(componentType) {
    const names = {
      'dropdown': 'Dropdown Menü',
      'button': 'Buton',
      'form': 'Form',
      'input': 'Giriş Alanı',
      'navigation': 'Navigasyon',
      'table': 'Tablo',
      'modal': 'Modal Pencere',
      'search': 'Arama',
      'upload': 'Dosya Yükleme',
      'login': 'Giriş Sistemi'
    };
    return names[componentType] || componentType;
  }

  // Component için test senaryoları
  static getComponentScenarios(componentType) {
    const scenarios = {
      'dropdown': [
        'Tüm seçeneklerin görüntülenmesi',
        'Seçim yapma işlemi',
        'Keyboard navigation',
        'Varsayılan değer kontrolü',
        'Boş seçim validation'
      ],
      'button': [
        'Buton tıklama işlevi',
        'Hover state kontrolü',
        'Disabled state kontrolü',
        'Loading state kontrolü'
      ],
      'form': [
        'Form doldurma işlemi',
        'Validation kuralları',
        'Submit işlemi',
        'Reset işlemi',
        'Error handling'
      ],
      'input': [
        'Veri girişi',
        'Validation kontrolleri',
        'Placeholder text',
        'Character limit',
        'Format kontrolü'
      ],
      'navigation': [
        'Menü öğelerine tıklama',
        'Sayfa yönlendirmeleri',
        'Breadcrumb kontrolü',
        'Mobile responsive'
      ],
      'table': [
        'Veri görüntüleme',
        'Sıralama işlemleri',
        'Filtreleme',
        'Pagination',
        'Row selection'
      ],
      'modal': [
        'Modal açılması',
        'Modal kapanması',
        'Overlay tıklama',
        'ESC tuşu ile kapanma'
      ],
      'search': [
        'Arama işlevi',
        'Sonuç görüntüleme',
        'Boş arama',
        'Filtre uygulama'
      ],
      'upload': [
        'Dosya seçimi',
        'Drag & drop',
        'Dosya validation',
        'Upload progress'
      ],
      'login': [
        'Başarılı giriş',
        'Hatalı giriş',
        'Şifre unuttum',
        'Session yönetimi'
      ]
    };

    return scenarios[componentType] || ['Temel işlevsellik kontrolü'];
  }

  // Test case'leri üret
  static generateTestCases(uiComponents, analysis) {
    const testCases = [];
    let testIdCounter = 1;

    uiComponents.forEach(component => {
      component.testScenarios.forEach(scenario => {
        analysis.testTypes.forEach(testType => {
          const testCase = this.createTestCase(
            testIdCounter++,
            component,
            scenario,
            testType,
            analysis
          );
          testCases.push(testCase);
        });
      });
    });

    // Edge case'ler ve negative testler ekle
    testCases.push(...this.generateEdgeCaseTests(uiComponents, analysis, testIdCounter));

    return testCases;
  }

  // Tek bir test case oluştur
  static createTestCase(id, component, scenario, testType, analysis) {
    const priority = this.determinePriority(scenario, testType, analysis);
    const steps = this.generateTestSteps(component, scenario, testType);
    
    return {
      id: `TC_${String(id).padStart(3, '0')}`,
      uuid: uuidv4(),
      summary: `${component.name} - ${scenario}`,
      description: `${component.name} bileşenindeki ${scenario.toLowerCase()} işlevselliğinin ${testType} testi`,
      testType: testType === 'functional' ? 'Manual' : 'Manual',
      priority: priority,
      component: component.name,
      labels: [testType, component.type, this.getTestLabel(scenario)],
      preconditions: this.generatePreconditions(component, analysis),
      steps: steps,
      expectedResults: this.generateExpectedResults(component, scenario),
      testData: this.generateTestData(component, scenario),
      estimatedTime: this.estimateTestTime(steps.length),
      createdAt: new Date().toISOString()
    };
  }

  // Test adımlarını üret
  static generateTestSteps(component, scenario, testType) {
    const baseSteps = [
      'Uygulamaya giriş yap',
      `${component.name} bileşenine git`
    ];

    let specificSteps = [];

    if (component.type === 'dropdown') {
      specificSteps = [
        'Dropdown menüsüne tıkla',
        'Tüm seçeneklerin görüntülendiğini kontrol et',
        'Bir seçenek seç',
        'Seçimin yapıldığını doğrula'
      ];
    } else if (component.type === 'form') {
      specificSteps = [
        'Form alanlarını doldur',
        'Gerekli alanları kontrol et',
        'Submit butonuna tıkla',
        'İşlem sonucunu kontrol et'
      ];
    } else if (component.type === 'button') {
      specificSteps = [
        'Butonun görünür olduğunu kontrol et',
        'Butona tıkla',
        'Beklenen aksiyonun gerçekleştiğini doğrula'
      ];
    } else {
      specificSteps = [
        `${component.name} ile etkileşim kur`,
        'Beklenen davranışı kontrol et'
      ];
    }

    return [...baseSteps, ...specificSteps];
  }

  // Beklenen sonuçları üret
  static generateExpectedResults(component, scenario) {
    const baseResults = [
      'Başarıyla giriş yapılır',
      `${component.name} bileşeni erişilebilir durumda`
    ];

    if (component.type === 'dropdown') {
      baseResults.push(
        'Dropdown menü açılır',
        'Tüm seçenekler listelenir',
        'Seçim işlemi başarıyla tamamlanır'
      );
    } else if (component.type === 'form') {
      baseResults.push(
        'Form alanları doldurulur',
        'Validation kuralları uygulanır',
        'Form başarıyla submit edilir'
      );
    } else {
      baseResults.push(
        'Bileşen beklenen şekilde çalışır',
        'İşlem başarıyla tamamlanır'
      );
    }

    return baseResults;
  }

  // Test verilerini üret
  static generateTestData(component, scenario) {
    const testData = {
      validUser: 'test_user@example.com',
      environment: 'Test Environment'
    };

    if (component.type === 'dropdown') {
      testData.options = ['Seçenek 1', 'Seçenek 2', 'Seçenek 3'];
    } else if (component.type === 'form') {
      testData.validInputs = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '5551234567'
      };
      testData.invalidInputs = {
        email: 'invalid-email',
        phone: '123'
      };
    }

    return testData;
  }

  // Edge case testleri üret
  static generateEdgeCaseTests(uiComponents, analysis, startId) {
    const edgeCases = [];
    
    // Performance test
    edgeCases.push({
      id: `TC_${String(startId).padStart(3, '0')}`,
      uuid: uuidv4(),
      summary: 'Performans Testi - Sayfa Yükleme',
      description: 'Sayfanın makul sürede yüklendiğinin kontrolü',
      testType: 'Manual',
      priority: 'Low',
      component: 'Page',
      labels: ['performance', 'loading'],
      preconditions: ['Browser açık', 'Internet bağlantısı mevcut'],
      steps: [
        'Sayfayı yenile',
        'Yükleme süresini ölç',
        'Tüm elementlerin yüklendiğini kontrol et'
      ],
      expectedResults: [
        'Sayfa 3 saniye içinde yüklenir',
        'Tüm elementler görünür durumda'
      ],
      testData: { maxLoadTime: '3 seconds' },
      estimatedTime: '5 minutes',
      createdAt: new Date().toISOString()
    });

    // Browser compatibility test
    edgeCases.push({
      id: `TC_${String(startId + 1).padStart(3, '0')}`,
      uuid: uuidv4(),
      summary: 'Cross-Browser Compatibility',
      description: 'Farklı tarayıcılarda uyumluluğun kontrolü',
      testType: 'Manual',
      priority: 'Medium',
      component: 'Application',
      labels: ['compatibility', 'browser'],
      preconditions: ['Farklı tarayıcılar yüklü'],
      steps: [
        'Chrome\'da uygulamayı aç',
        'Firefox\'ta uygulamayı aç',
        'Safari\'de uygulamayı aç (Mac)',
        'Her tarayıcıda işlevselliği test et'
      ],
      expectedResults: [
        'Tüm tarayıcılarda aynı görünüm',
        'İşlevsellik farklılığı yok'
      ],
      testData: { browsers: ['Chrome', 'Firefox', 'Safari', 'Edge'] },
      estimatedTime: '15 minutes',
      createdAt: new Date().toISOString()
    });

    return edgeCases;
  }

  // Yardımcı fonksiyonlar
  static determinePriority(scenario, testType, analysis) {
    if (testType === 'functional' || scenario.includes('Ana')) {
      return 'High';
    } else if (testType === 'validation' || testType === 'ui') {
      return 'Medium';
    }
    return 'Low';
  }

  static getTestLabel(scenario) {
    if (scenario.includes('Keyboard')) return 'accessibility';
    if (scenario.includes('Validation')) return 'validation';
    if (scenario.includes('Error')) return 'negative';
    return 'functional';
  }

  static generatePreconditions(component, analysis) {
    const basePreconditions = [
      'Test ortamında uygulama erişilebilir',
      'Geçerli kullanıcı hesabı mevcut'
    ];

    if (analysis.userType === 'admin') {
      basePreconditions.push('Admin yetkilerine sahip kullanıcı');
    }

    return basePreconditions;
  }

  static estimateTestTime(stepCount) {
    const baseTime = 3; // dakika
    const perStepTime = 1; // dakika per step
    return `${baseTime + (stepCount * perStepTime)} dakika`;
  }
}

export default TestCaseGenerator; 