# 🚀 X-ray Test Case Generator

Ekran görüntüsünden otomatik test case oluşturucu React uygulaması. Kullanıcılar UI ekran görüntülerini yükleyip açıklama yazarak X-ray Test Management ile uyumlu test case'leri otomatik olarak oluşturabilir.

## ✨ Özellikler

### 🎯 Ana Özellikler
- **Drag & Drop File Upload** - Ekran görüntülerini sürükleyip bırakma
- **AI-Powered Analysis** - Açıklama bazlı test case üretimi
- **Multiple Export Formats** - JSON, CSV, Gherkin formatları
- **Real-time Preview** - Anlık görüntü önizleme
- **Smart Filtering** - Test case arama ve filtreleme

### 📋 Test Case Özellikleri
- Akıllı UI component detection
- Priority-based test organization
- Comprehensive test steps generation
- Expected results automation
- Test data generation
- Estimated time calculation

### 🔧 Teknik Özellikler
- Modern React 18 + Hooks
- Tailwind CSS styling
- Responsive design
- TypeScript ready
- File download integration
- Clipboard API support

## 🚀 Kurulum

### Ön Gereksinimler
- Node.js 16+ 
- npm veya yarn

### Adım 1: Bağımlılıkları Yükle
```bash
npm install
```

### Adım 2: Uygulamayı Başlat
```bash
npm start
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde açılacaktır.

## 📖 Kullanım

### 1. Ekran Görüntüsü Yükle
- Drag & drop alanına ekran görüntüsünü sürükleyin
- Veya "Dosya Seç" butonuna tıklayın
- Desteklenen formatlar: PNG, JPG, JPEG, GIF, BMP, WEBP

### 2. Açıklama Yaz
- Test edilecek özellikleri detaylı açıklayın
- Örnek promptları kullanabilirsiniz
- Beklentilerinizi net şekilde belirtin

### 3. Test Case'leri Oluştur
- "AI ile Test Case Oluştur" butonuna tıklayın
- Sistem otomatik olarak test case'leri üretecektir
- Sonuçları önizleyebilirsiniz

### 4. Export Edin
- JSON formatında X-ray import için
- CSV formatında Excel düzenleme için  
- Gherkin formatında BDD için

## 🎨 UI Components

### Ana Bileşenler
- **FileUpload** - Dosya yükleme işlemleri
- **DescriptionInput** - Açıklama girişi ve örnekler
- **TestCaseGenerator** - Test case üretim mantığı
- **TestCaseList** - Test case'leri listeleme ve görüntüleme
- **ExportOptions** - Multiple format export

### Özelleştirilebilir Ayarlar
- Export içerik seçenekleri
- Test case filtreleme
- Priority renklendirme
- Component kategorileri

## 🔄 Export Formatları

### 1. JSON Format (X-ray Import)
```json
{
  "project": "X-ray Test Cases",
  "testCases": [
    {
      "id": "TC_001",
      "summary": "Dropdown Menü - Tüm seçeneklerin görüntülenmesi",
      "priority": "High",
      "steps": [...],
      "expectedResults": [...]
    }
  ]
}
```

### 2. CSV Format (Excel Import)
```csv
Test Case ID,Summary,Priority,Test Type,Component
TC_001,"Dropdown test",High,Manual,Dropdown
```

### 3. Gherkin Format (BDD)
```gherkin
Feature: Generated Test Scenarios
  @functional @dropdown
  Scenario: Dropdown Menü Test
    When Dropdown menüsüne tıklarım
    Then Tüm seçenekler görüntülenir
```

## 🧠 AI Logic

### Component Detection
Uygulama açıklamadaki anahtar kelimeleri analiz ederek UI componentlerini tespit eder:

- **Dropdown**: açılır, dropdown, seçim, liste
- **Button**: buton, button, tıkla
- **Form**: form, giriş, kayıt
- **Navigation**: menü, nav, yönlendirme

### Test Type Analysis
- **Functional**: işlevsel, çalışma testleri
- **UI**: görünüm, arayüz testleri  
- **Validation**: doğrulama, kontrol testleri
- **Accessibility**: erişilebilirlik testleri

### Priority Assignment
- **High**: kritik, önemli işlevler
- **Medium**: standard işlevsellik
- **Low**: edge cases, performans

## 🎯 Örnekler

### Dropdown Test Açıklaması
```
Bu ekranda bir dropdown menü var. Tüm seçeneklerin doğru 
görüntülendiğini ve seçim işlemlerinin çalıştığını test 
etmek istiyorum. Keyboard navigation da kontrol edilmeli.
```

### Form Validation Açıklaması  
```
Login formundaki validation kurallarını test etmek istiyorum. 
Boş field'lar, geçersiz email format ve şifre kriterleri 
kontrol edilmeli. Negative test case'ler de dahil.
```

## 🛠️ Geliştirme

### Build
```bash
npm run build
```

### Test
```bash
npm test
```

### Lint
```bash
npm run lint
```

## 🎨 Styling

Uygulama Tailwind CSS kullanmaktadır:
- **Primary Color**: X-ray Blue (#0052CC)
- **Success**: Green (#00875A)  
- **Warning**: Orange (#FF8B00)
- **Error**: Red (#DE350B)

### Custom Classes
- `.btn-primary` - Ana butonlar
- `.btn-secondary` - İkincil butonlar
- `.card` - Kart containerlar
- `.form-input` - Form giriş alanları

## 📱 Responsive Design

- **Desktop**: Full featured experience
- **Tablet**: Adapted layout
- **Mobile**: Touch-optimized interface

## 🔧 Configuration

### Environment Variables
```bash
REACT_APP_API_URL=your_api_url
REACT_APP_VERSION=1.0.0
```

### Tailwind Customization
`tailwind.config.js` dosyasında renk paleti ve component'lar özelleştirilebilir.

## 🤝 Katkıda Bulunma

1. Repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add AmazingFeature'`)
4. Branch'i push edin (`git push origin feature/AmazingFeature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🐛 Sorun Giderme

### Common Issues

**Problem**: `npm start` çalışmıyor
**Çözüm**: `npm install` çalıştırıp dependencies'leri yeniden yükleyin

**Problem**: Tailwind CSS yüklenmiyor  
**Çözüm**: `postcss.config.js` ve `tailwind.config.js` dosyalarını kontrol edin

**Problem**: File upload çalışmıyor
**Çözüm**: Browser HTTPS requirement'ını kontrol edin

## 📞 Destek

- GitHub Issues için sorun bildirin
- Feature request'ler için discussion açın
- Documentation için wiki'yi kontrol edin

---

🚀 **Happy Testing!** X-ray Test Case Generator ile test case'lerinizi otomatik oluşturun! 