# Sistem Test Planı

## 1. Kullanıcı Kaydı ve Kimlik Doğrulama
- [ ] Yeni kullanıcı kaydı
- [ ] Email doğrulama
- [ ] Giriş/çıkış işlemleri
- [ ] Şifre sıfırlama
- [ ] Oturum sürekliliği
- [ ] Rol tabanlı erişim kontrolleri

## 2. Kullanıcı Paneli
- [ ] Profil bilgileri görüntüleme/düzenleme
- [ ] Coin bakiyesi görüntüleme
- [ ] İşlem geçmişi listeleme
- [ ] Filtreler ve arama
- [ ] Sayfalama kontrolleri
- [ ] Responsive tasarım

## 3. Ödeme İşlemleri
- [ ] Yeni ödeme talebi oluşturma
- [ ] Ağ seçimi ve validasyonlar
- [ ] Minimum miktar kontrolleri
- [ ] İşlem hash'i güncelleme
- [ ] Ödeme durumu takibi
- [ ] Bildirimler

## 4. Soğuk Cüzdan Sistemi
- [ ] Desteklenen ağlar için doğru adreslerin kontrolü:
  - [ ] ETH: 0x163c9a2fa9eaf8ebc5bb5b8f8e916eb8f24230a1
  - [ ] SOL: Gp4itYBqqkNRNYtC22QAPdThPB6Kzx8M1yy2rpXBGxbc
  - [ ] TRX: THbevzbdxMmUNaN3XFWPkaJe8oSq2C2739
  - [ ] BTC: bc1pzmdep9lzgzswy0nmepvwmexj286kufcfwjfy4fd6dwuedzltntxse9xmz8
- [ ] Her ağ için minimum miktar kontrolü
- [ ] Her ağ için doğru blok onay sayısı kontrolü
- [ ] İşlem doğrulama mekanizması
- [ ] Yanlış adrese yapılan ödemelerin reddi
- [ ] Ağa özel coin dağıtım oranları kontrolü

## 5. Coin Sistemi
- [ ] Bakiye hesaplama
- [ ] Coin dağıtımı
- [ ] Transfer limitleri
- [ ] İşlem kayıtları
- [ ] Admin kontrolleri

## 6. Admin Paneli
- [ ] Kullanıcı yönetimi
- [ ] Coin dağıtım kontrolleri
- [ ] Ödeme onayları
- [ ] Sistem ayarları
- [ ] İşlem geçmişi ve raporlar

## 7. Güvenlik Testleri
- [ ] XSS koruması
- [ ] CSRF koruması
- [ ] Rate limiting
- [ ] Input validasyonu
- [ ] SQL injection koruması
- [ ] Authentication bypass denemeleri

## 8. Performans Testleri
- [ ] Yük testi (eşzamanlı kullanıcılar)
- [ ] Stres testi (yüksek işlem hacmi)
- [ ] Veritabanı optimizasyonu
- [ ] API response süreleri
- [ ] WebSocket bağlantı limitleri

## 9. Entegrasyon Testleri
- [ ] Supabase entegrasyonu
- [ ] Blockchain API entegrasyonu
- [ ] WebSocket bildirimleri
- [ ] Email servisi
- [ ] Frontend-Backend iletişimi

## 10. Son Kullanıcı Testleri
- [ ] Kullanılabilirlik testi
- [ ] Browser uyumluluğu
- [ ] Mobile uyumluluk
- [ ] Hata mesajları
- [ ] Yardım/destek sistemi

## Test Ortamı Gereksinimleri
1. Test veritabanı
2. Test blockchain ağları
3. Test kullanıcıları
4. Test adminleri
5. Test soğuk cüzdan adresleri

## Raporlama
Her test sonucu aşağıdaki bilgileri içermelidir:
- Test tarihi
- Test edilen özellik
- Test senaryosu
- Beklenen sonuç
- Gerçek sonuç
- Hata/sorun varsa detayları
- Çözüm önerileri

## Kritik Başarı Kriterleri
1. Tüm ödeme işlemleri güvenli ve doğru şekilde işlenmeli
2. Coin dağıtımında hiçbir tutarsızlık olmamalı
3. Kullanıcı verileri güvenli şekilde korunmalı
4. Sistem performansı kabul edilebilir sınırlar içinde olmalı
5. Tüm kritik hatalar giderilmiş olmalı

## Zaman Çizelgesi
1. Test ortamı hazırlığı: 1 gün
2. Fonksiyonel testler: 2 gün
3. Güvenlik testleri: 2 gün
4. Performans testleri: 1 gün
5. Son kullanıcı testleri: 1 gün
6. Hata düzeltme ve regresyon testleri: 2 gün
7. Dokümantasyon ve raporlama: 1 gün

Toplam süre: 10 iş günü