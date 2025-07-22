Feature: Turkcell Maya - Devir Tipi Dropdown Functionality
  As a Turkcell Maya user
  I want to select appropriate transfer type from dropdown
  So that I can initiate the correct type of line transfer

  Background:
    Given Maya uygulamasına başarıyla giriş yapmışım
    And Devir işlemi sayfasında bulunuyorum

  @UI @Critical
  Scenario: Devir Tipi dropdown seçeneklerinin doğru şekilde görüntülenmesi
    When Devir Tipi dropdown'ına tıklarım
    Then Aşağıdaki seçeneklerin görüntülendiğini doğrularım:
      | Seçiniz                           |
      | Şirket->Şirket                    |
      | Şirket->Şahıs                     |
      | Eskek Devir Şirket->Şahıs         |
      | Eskek Devir Şirket->Şirket        |
      | Eskek Toplu Devir Şirket->Şirket  |
      | Toplu Şirket->Şirket              |

  @Functional @Medium
  Scenario Outline: Devir tipi seçimi yapma
    When Devir Tipi dropdown'ını açarım
    And "<devir_tipi>" seçeneğini seçerim
    Then Dropdown kapanır
    And Seçilen değer "<devir_tipi>" olarak field'da görüntülenir

    Examples:
      | devir_tipi                       |
      | Şirket->Şirket                   |
      | Şirket->Şahıs                    |
      | Eskek Devir Şirket->Şahıs        |
      | Eskek Devir Şirket->Şirket       |
      | Eskek Toplu Devir Şirket->Şirket |
      | Toplu Şirket->Şirket             |

  @Accessibility @Low
  Scenario: Keyboard ile devir tipi seçimi
    When Tab tuşu ile Devir Tipi field'ına giderim
    And Enter tuşuna basarım
    Then Dropdown menü açılır
    When Arrow tuşları ile "Şirket->Şirket" seçeneğine giderim
    And Enter tuşuna basarım
    Then "Şirket->Şirket" değeri seçilir
    And Dropdown kapanır

  @Negative @Validation
  Scenario: Devir tipi seçmeden form gönderme
    Given Devir Tipi dropdown'ında "Seçiniz" değeri seçili
    When Form gönderme butonuna tıklarım
    Then "Lütfen devir tipini seçiniz" hata mesajı görüntülenir
    And Form gönderilmez

  @UI @Edge_Case
  Scenario: Dropdown dış tıklama ile kapanma
    Given Devir Tipi dropdown'ı açık
    When Dropdown dışındaki bir alana tıklarım
    Then Dropdown kapanır
    And Önceki seçili değer korunur

  @Performance
  Scenario: Dropdown açılma hızı
    When Devir Tipi dropdown'ına tıklarım
    Then Dropdown 2 saniye içinde açılır
    And Tüm seçenekler yüklenir 