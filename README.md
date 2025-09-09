# Camera App

แอพกล้องถ่ายรูปสำหรับ iOS และ Android พัฒนาด้วย React Native และ Expo

![Screenshot Preview Mode](./docs/preview.png)
![Screenshot Camera Mode](./docs/camera.png)

## ฟีเจอร์
- 📸 ถ่ายภาพด้วยกล้องหน้า/หลัง
- 🔄 สลับกล้องหน้า-หลัง
- 💡 เปิด/ปิดแฟลช
- 💾 บันทึกรูปลงอัลบั้ม
- 🎯 Preview รูปก่อนบันทึก
- 🔄 ถ่ายรูปใหม่ได้
- 🎨 UI สวยงาม ใช้งานง่าย

## การติดตั้ง

1. Clone repository:
```bash
git clone https://github.com/your-username/camera-app.git
cd camera-app
```

2. ติดตั้ง dependencies:
```bash
npm install
```

3. รันแอพ:
```bash
npm start
# หรือ
npx expo start
```

4. สแกน QR Code ด้วย Expo Go app (iOS/Android)

## สิทธิ์ที่จำเป็น
- Camera Permission - สำหรับการถ่ายภาพ
- Media Library Permission - สำหรับบันทึกรูปลงอัลบั้ม

## เทคโนโลยีที่ใช้
- React Native
- Expo
- expo-camera
- expo-media-library
- @expo/vector-icons

## การพัฒนา

### โครงสร้างโปรเจค
```
camera-app/
├── App.tsx           # หน้าหลักของแอพ
├── app.json          # คอนฟิก Expo
├── package.json      # dependencies
├── assets/          # รูปภาพและไอคอน
└── docs/            # เอกสารและภาพประกอบ
```

### วิธีการพัฒนาต่อ
1. Fork repository นี้
2. สร้าง branch ใหม่: `git checkout -b feature/amazing-feature`
3. Commit การเปลี่ยนแปลง: `git commit -m 'Add amazing feature'`
4. Push ไปยัง branch: `git push origin feature/amazing-feature`
5. เปิด Pull Request

## หมายเหตุ
- สำหรับ Android: เพื่อทดสอบฟีเจอร์ Media Library เต็มรูปแบบ ให้สร้าง development build
- บางฟีเจอร์อาจต้องการสิทธิ์เพิ่มเติมบางอุปกรณ์

## License
MIT License - ดูรายละเอียดใน [LICENSE](LICENSE) ไฟล์
