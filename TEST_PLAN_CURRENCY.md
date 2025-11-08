# Para Birimi Spesifik Test Senaryoları

## Ethereum (ETH) Ödemeleri
1. Doğru Adres Testi
   - Adres: 0x163c9a2fa9eaf8ebc5bb5b8f8e916eb8f24230a1
   - Min. Miktar: 0.01 ETH
   - Beklenen Coin: 0.01 * 10000 = 100 coin
   - Onay Sayısı: 12 blok

2. Test Senaryoları
   - [ ] 0.01 ETH altında ödeme reddi
   - [ ] Yanlış ETH adresine ödeme reddi
   - [ ] 12 blok onayı öncesi tamamlanmama
   - [ ] Doğru coin dağıtım oranı (1 ETH = 10000 coin)

## Solana (SOL) Ödemeleri
1. Doğru Adres Testi
   - Adres: Gp4itYBqqkNRNYtC22QAPdThPB6Kzx8M1yy2rpXBGxbc
   - Min. Miktar: 1 SOL
   - Beklenen Coin: 1 * 1000 = 1000 coin
   - Onay Sayısı: 32 blok

2. Test Senaryoları
   - [ ] 1 SOL altında ödeme reddi
   - [ ] Yanlış SOL adresine ödeme reddi
   - [ ] 32 blok onayı öncesi tamamlanmama
   - [ ] Doğru coin dağıtım oranı (1 SOL = 1000 coin)

## TRON (TRX) Ödemeleri
1. Doğru Adres Testi
   - Adres: THbevzbdxMmUNaN3XFWPkaJe8oSq2C2739
   - Min. Miktar: 100 TRX
   - Beklenen Coin: 100 * 100 = 10000 coin
   - Onay Sayısı: 20 blok

2. Test Senaryoları
   - [ ] 100 TRX altında ödeme reddi
   - [ ] Yanlış TRX adresine ödeme reddi
   - [ ] 20 blok onayı öncesi tamamlanmama
   - [ ] Doğru coin dağıtım oranı (1 TRX = 100 coin)

## Bitcoin (BTC) Ödemeleri
1. Doğru Adres Testi
   - Adres: bc1pzmdep9lzgzswy0nmepvwmexj286kufcfwjfy4fd6dwuedzltntxse9xmz8
   - Min. Miktar: 0.001 BTC
   - Beklenen Coin: 0.001 * 100000 = 100 coin
   - Onay Sayısı: 6 blok

2. Test Senaryoları
   - [ ] 0.001 BTC altında ödeme reddi
   - [ ] Yanlış BTC adresine ödeme reddi
   - [ ] 6 blok onayı öncesi tamamlanmama
   - [ ] Doğru coin dağıtım oranı (1 BTC = 100000 coin)

## Genel Test Senaryoları
1. Ağlar Arası Testler
   - [ ] Farklı ağlarda eşzamanlı ödemeler
   - [ ] Ağlar arası çapraz ödeme denemeleri
   - [ ] Her ağ için ayrı blok onay süresi kontrolü

2. Hata Senaryoları
   - [ ] Bakım modunda ödeme reddi
   - [ ] Ağ kesintilerinde hata yönetimi
   - [ ] İşlem hash'i doğrulama başarısızlığı
   - [ ] Yetersiz blok onayı durumu

3. Performans Testleri
   - [ ] Çoklu ağdan eşzamanlı ödemeler
   - [ ] Yüksek hacimli işlem doğrulama
   - [ ] Blok onay takibi performansı

## Test Raporlama
Her test için aşağıdaki bilgiler kaydedilmelidir:
1. Test Tarihi/Saati
2. Test Edilen Ağ
3. İşlem Detayları
   - Gönderen Adres
   - Miktar
   - İşlem Hash'i
4. Beklenen Sonuç
5. Gerçek Sonuç
6. Blok Onay Süresi
7. Dağıtılan Coin Miktarı
8. Varsa Hatalar/Sorunlar