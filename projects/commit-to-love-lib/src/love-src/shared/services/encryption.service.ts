import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  
  /**
   * Encrypts data using AES encryption
   * @param data - The data to encrypt
   * @param password - The password to use for encryption
   * @returns Encrypted string
   */
  encrypt(data: any, password: string): string {
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
   * Decrypts data using AES decryption
   * @param encryptedData - The encrypted string to decrypt
   * @param password - The password to use for decryption
   * @returns Decrypted object
   */
  decrypt(encryptedData: string, password: string): any {
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
   * Validates if the provided password can decrypt the data
   * @param encryptedData - The encrypted string
   * @param password - The password to validate
   * @returns True if password is correct, false otherwise
   */
  validatePassword(encryptedData: string, password: string): boolean {
    try {
      this.decrypt(encryptedData, password);
      return true;
    } catch {
      return false;
    }
  }
}

