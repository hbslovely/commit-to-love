#!/usr/bin/env node

/**
 * Album Encryption Helper Script
 * 
 * This script helps encrypt album photo data for the "Khoảnh Khắc Đôi Ta" album.
 * Usage: node encrypt-album-helper.js
 * 
 * The script will:
 * 1. Read the raw photo data from the rawAlbumData constant below
 * 2. Encrypt it using the passcode 131299
 * 3. Output the encrypted string that can be used in album-data.json
 */

const CryptoJS = require('crypto-js');

// Passcode for encryption/decryption
const PASSCODE = '131299';

// Raw album data - modify this array when you need to update the locked album
const rawAlbumData = [
  {
    "id": "together-1",
    "url": "assets/images/phat/phat-quyen-ben-nhau.png",
    "title": "Hạnh Phúc Bên Nhau",
    "description": "Khoảnh khắc ngọt ngào của đôi ta trong cuộc sống hàng ngày"
  },
  {
    "id": "together-2",
    "url": "assets/images/ki-niem/cung-nhau.jpg",
    "title": "Những Ngày Đầu",
    "description": "Những khoảnh khắc đầu tiên khi chúng mình mới yêu nhau"
  },
  {
    "id": "together-3",
    "url": "assets/images/ki-niem/cuoi-hoi.png",
    "title": "Ngày Vui Trọng Đại",
    "description": "Khoảnh khắc hạnh phúc trong ngày cưới của chúng mình"
  },
  {
    "id": "together-4",
    "url": "assets/images/ki-niem/dam-cuoi-nha-hang.png",
    "title": "Tiệc Cưới Hạnh Phúc",
    "description": "Niềm vui ngập tràn trong tiệc cưới của đôi ta"
  },
  {
    "id": "together-5",
    "url": "assets/images/ki-niem/gap-mat-gia-dinh.png",
    "title": "Gặp Gỡ Gia Đình",
    "description": "Những buổi sum vầy ấm áp cùng gia đình hai bên"
  },
  {
    "id": "together-6",
    "url": "assets/images/ki-niem/ky-niem-quen-nhau.png",
    "title": "Kỷ Niệm Quen Nhau",
    "description": "Nhìn lại những kỷ niệm đẹp từ ngày đầu quen biết"
  },
  {
    "id": "together-7",
    "url": "assets/images/ki-niem/lan-dau-gap-nhau.png",
    "title": "Lần Đầu Gặp Gỡ",
    "description": "Khoảnh khắc đáng nhớ của lần đầu tiên gặp nhau"
  },
  {
    "id": "together-8",
    "url": "assets/images/ki-niem/trao-duyen.png",
    "title": "Trao Duyên",
    "description": "Giây phút thiêng liêng khi chúng mình trao nhau lời hẹn ước"
  },
  {
    "id": "together-9",
    "url": "assets/images/gallery/ben-nhau.png",
    "title": "Bên Nhau Mỗi Ngày",
    "description": "Những khoảnh khắc bình dị nhưng đầy ý nghĩa khi ở bên nhau"
  },
  {
    "id": "together-10",
    "url": "assets/images/gallery/nam-tay-yeu-thuong.png",
    "title": "Nắm Tay Nhau",
    "description": "Cùng nắm tay nhau đi qua mọi khoảnh khắc của cuộc sống"
  }
];

/**
 * Encrypts the album data using AES encryption
 */
function encryptAlbumData(data, password) {
  try {
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, password).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypts the album data using AES decryption (for testing)
 */
function decryptAlbumData(encryptedData, password) {
  try {
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, password);
    const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedString) {
      throw new Error('Invalid password or corrupted data');
    }
    
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data - invalid password');
  }
}

/**
 * Main function
 */
function main() {
  console.log('🔐 Album Encryption Helper');
  console.log('==========================');
  console.log();
  
  console.log(`📊 Raw album data contains ${rawAlbumData.length} photos`);
  console.log();
  
  try {
    // Encrypt the data
    console.log('🔄 Encrypting album data...');
    const encryptedData = encryptAlbumData(rawAlbumData, PASSCODE);
    
    console.log('✅ Encryption successful!');
    console.log();
    
    // Test decryption to verify
    console.log('🔄 Testing decryption...');
    const decryptedData = decryptAlbumData(encryptedData, PASSCODE);
    
    if (JSON.stringify(decryptedData) === JSON.stringify(rawAlbumData)) {
      console.log('✅ Decryption test passed!');
    } else {
      console.log('❌ Decryption test failed!');
      return;
    }
    
    console.log();
    console.log('📋 Encrypted Data (copy this to album-data.json):');
    console.log('='.repeat(60));
    console.log(`"encryptedPhotos": "${encryptedData}"`);
    console.log('='.repeat(60));
    console.log();
    
    console.log('📝 Instructions:');
    console.log('1. Copy the encrypted data above');
    console.log('2. Replace the "encryptedPhotos" field in album-data.json');
    console.log('3. Make sure the album has "isLocked": true');
    console.log('4. Remove the "photos" array if it exists');
    console.log();
    
    console.log('🔑 Passcode: 131299');
    console.log();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  encryptAlbumData,
  decryptAlbumData,
  rawAlbumData,
  PASSCODE
};

