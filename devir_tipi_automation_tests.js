/**
 * Turkcell Maya - Devir Tipi Dropdown Automation Tests
 * X-ray Test Management Integration
 * Test Framework: Selenium WebDriver + Jest
 */

const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

describe('Turkcell Maya - Devir Tipi Dropdown Tests', () => {
  let driver;
  
  beforeAll(async () => {
    // Chrome driver setup
    const options = new chrome.Options();
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
    
    // Maya uygulamasına giriş yap
    await driver.get('https://mayaprp.turkcell.com.tr/mayanext/menu/menu.xhtml?faces-redirect=true');
    await loginToMaya();
    await navigateToDevirPage();
  });

  afterAll(async () => {
    await driver.quit();
  });

  // @XrayTest(key = "TC_DT_001")
  test('Devir Tipi Dropdown - Tüm Seçeneklerin Görüntülenmesi', async () => {
    // Devir Tipi dropdown'ını bul ve tıkla
    const devirTipiDropdown = await driver.findElement(By.id('devirTipi')); // ID'yi gerçek değerle değiştir
    await devirTipiDropdown.click();
    
    // Dropdown açılmasını bekle
    await driver.wait(until.elementLocated(By.css('.dropdown-menu')), 5000);
    
    // Tüm seçenekleri al
    const options = await driver.findElements(By.css('.dropdown-menu option'));
    
    // Beklenen seçenekler
    const expectedOptions = [
      'Seçiniz',
      'Şirket->Şirket',
      'Şirket->Şahıs',
      'Eskek Devir Şirket->Şahıs',
      'Eskek Devir Şirket->Şirket',
      'Eskek Toplu Devir Şirket->Şirket',
      'Toplu Şirket->Şirket'
    ];
    
    // Seçeneklerin sayısını kontrol et
    expect(options.length).toBe(expectedOptions.length);
    
    // Her seçeneğin metnini kontrol et
    for (let i = 0; i < options.length; i++) {
      const optionText = await options[i].getText();
      expect(optionText).toBe(expectedOptions[i]);
    }
  });

  // @XrayTest(key = "TC_DT_002")
  test('Devir Tipi Seçimi - Şirket->Şirket', async () => {
    await selectDevirTipi('Şirket->Şirket');
    
    // Seçilen değeri kontrol et
    const selectedValue = await getSelectedDevirTipiValue();
    expect(selectedValue).toBe('Şirket->Şirket');
  });

  // @XrayTest(key = "TC_DT_003")
  test('Devir Tipi Seçimi - Şirket->Şahıs', async () => {
    await selectDevirTipi('Şirket->Şahıs');
    
    const selectedValue = await getSelectedDevirTipiValue();
    expect(selectedValue).toBe('Şirket->Şahıs');
  });

  // @XrayTest(key = "TC_DT_008")
  test('Devir Tipi Dropdown - Keyboard Navigation', async () => {
    const devirTipiDropdown = await driver.findElement(By.id('devirTipi'));
    
    // Tab ile field'a git
    await devirTipiDropdown.sendKeys('\t');
    
    // Enter ile dropdown'ı aç
    await devirTipiDropdown.sendKeys('\n');
    
    // Arrow key ile seçim yap
    await devirTipiDropdown.sendKeys('\uE015'); // Arrow Down
    await devirTipiDropdown.sendKeys('\n'); // Enter
    
    // Seçimin yapıldığını doğrula
    const selectedValue = await getSelectedDevirTipiValue();
    expect(selectedValue).not.toBe('Seçiniz');
  });

  // @XrayTest(key = "TC_DT_009")
  test('Devir Tipi Dropdown - Negative Test (Boş Seçim)', async () => {
    // Default "Seçiniz" değerini bırak
    await resetDevirTipiToDefault();
    
    // Form submit butonunu bul ve tıkla
    const submitButton = await driver.findElement(By.id('submitButton'));
    await submitButton.click();
    
    // Validation mesajını bekle ve kontrol et
    const errorMessage = await driver.wait(
      until.elementLocated(By.css('.error-message')), 
      5000
    );
    
    const errorText = await errorMessage.getText();
    expect(errorText).toContain('Lütfen devir tipini seçiniz');
  });

  // @XrayTest(key = "TC_DT_010")
  test('Devir Tipi Dropdown - Dış Tıklama ile Kapanma', async () => {
    // Dropdown'ı aç
    const devirTipiDropdown = await driver.findElement(By.id('devirTipi'));
    await devirTipiDropdown.click();
    
    // Dropdown açık olduğunu doğrula
    await driver.wait(until.elementLocated(By.css('.dropdown-menu')), 5000);
    
    // Dropdown dışına tıkla
    const outsideElement = await driver.findElement(By.css('body'));
    await outsideElement.click();
    
    // Dropdown'ın kapandığını kontrol et
    const dropdownMenu = await driver.findElements(By.css('.dropdown-menu:visible'));
    expect(dropdownMenu.length).toBe(0);
  });

  // @XrayTest(key = "TC_DT_011")
  test('Devir Tipi Dropdown - Performans Testi', async () => {
    const startTime = Date.now();
    
    const devirTipiDropdown = await driver.findElement(By.id('devirTipi'));
    await devirTipiDropdown.click();
    
    // Dropdown açılmasını bekle
    await driver.wait(until.elementLocated(By.css('.dropdown-menu')), 5000);
    
    const endTime = Date.now();
    const loadTime = endTime - startTime;
    
    // 2 saniye (2000ms) içinde açılmalı
    expect(loadTime).toBeLessThan(2000);
    
    // Tüm seçeneklerin yüklendiğini kontrol et
    const options = await driver.findElements(By.css('.dropdown-menu option'));
    expect(options.length).toBeGreaterThan(0);
  });

  // Helper Functions
  async function loginToMaya() {
    // Login işlemleri burada yapılır
    const usernameField = await driver.findElement(By.id('username'));
    const passwordField = await driver.findElement(By.id('password'));
    const loginButton = await driver.findElement(By.id('loginButton'));
    
    await usernameField.sendKeys(process.env.MAYA_USERNAME || 'test_user');
    await passwordField.sendKeys(process.env.MAYA_PASSWORD || 'test_password');
    await loginButton.click();
    
    // Giriş başarılı olduğunu bekle
    await driver.wait(until.urlContains('menu'), 10000);
  }

  async function navigateToDevirPage() {
    // Devir sayfasına gitme işlemleri
    const devirMenu = await driver.findElement(By.linkText('Devir İşlemi'));
    await devirMenu.click();
    
    await driver.wait(until.elementLocated(By.id('devirTipi')), 5000);
  }

  async function selectDevirTipi(value) {
    const devirTipiDropdown = await driver.findElement(By.id('devirTipi'));
    await devirTipiDropdown.click();
    
    const option = await driver.findElement(By.xpath(`//option[text()='${value}']`));
    await option.click();
  }

  async function getSelectedDevirTipiValue() {
    const devirTipiDropdown = await driver.findElement(By.id('devirTipi'));
    const selectedOption = await devirTipiDropdown.findElement(By.css('option:checked'));
    return await selectedOption.getText();
  }

  async function resetDevirTipiToDefault() {
    await selectDevirTipi('Seçiniz');
  }
});

// Test Data
const testData = {
  devirTipleri: [
    'Şirket->Şirket',
    'Şirket->Şahıs',
    'Eskek Devir Şirket->Şahıs',
    'Eskek Devir Şirket->Şirket',
    'Eskek Toplu Devir Şirket->Şirket',
    'Toplu Şirket->Şirket'
  ],
  maxLoadTime: 2000, // ms
  expectedElementId: 'devirTipi'
};

module.exports = testData; 