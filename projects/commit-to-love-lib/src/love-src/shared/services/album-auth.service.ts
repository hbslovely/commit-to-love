import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EncryptionService } from './encryption.service';

@Injectable({
  providedIn: 'root'
})
export class AlbumAuthService {
  private readonly STORAGE_KEY = 'album_auth_state';
  private readonly PASSWORD_STORAGE_KEY = 'album_passwords';
  
  private authenticatedAlbumsSubject = new BehaviorSubject<Set<string>>(new Set());
  public authenticatedAlbums$ = this.authenticatedAlbumsSubject.asObservable();
  
  // Store passwords temporarily in session storage for decryption
  private albumPasswords: Map<string, string> = new Map();

  constructor(private encryptionService: EncryptionService) {
    console.log('AlbumAuthService constructor called');
    this.loadAuthState();
    this.loadPasswordState();
    console.log('After loading state - authenticated albums:', Array.from(this.authenticatedAlbumsSubject.value));
    console.log('After loading state - passwords:', Array.from(this.albumPasswords.keys()));
  }

  /**
   * Checks if an album is authenticated
   */
  isAlbumAuthenticated(albumId: string): boolean {
    return this.authenticatedAlbumsSubject.value.has(albumId);
  }

  /**
   * Authenticates an album with the provided password by attempting decryption
   */
  authenticateAlbum(albumId: string, password: string, encryptedData: string): boolean {
    try {
      // Try to decrypt the data with the provided password
      const decryptedData = this.encryptionService.decrypt(encryptedData, password);
      
      // If decryption succeeds and produces valid JSON, password is correct
      if (decryptedData && Array.isArray(decryptedData)) {
        const authenticatedAlbums = new Set(this.authenticatedAlbumsSubject.value);
        authenticatedAlbums.add(albumId);
        this.authenticatedAlbumsSubject.next(authenticatedAlbums);
        
        // Store the password for this session
        this.albumPasswords.set(albumId, password);
        
        this.saveAuthState();
        this.savePasswordState();
        return true;
      }
    } catch (error) {
      // Decryption failed, password is incorrect
      console.log('Authentication failed for album:', albumId);
    }
    return false;
  }

  /**
   * Removes authentication for an album
   */
  deauthenticateAlbum(albumId: string): void {
    const authenticatedAlbums = new Set(this.authenticatedAlbumsSubject.value);
    authenticatedAlbums.delete(albumId);
    this.authenticatedAlbumsSubject.next(authenticatedAlbums);
    
    // Remove stored password
    this.albumPasswords.delete(albumId);
    
    this.saveAuthState();
    this.savePasswordState();
  }

  /**
   * Clears all authentication states
   */
  clearAllAuth(): void {
    this.authenticatedAlbumsSubject.next(new Set());
    this.albumPasswords.clear();
    this.saveAuthState();
    this.savePasswordState();
  }

  /**
   * Decrypts album data if authenticated
   */
  decryptAlbumData(encryptedData: string, albumId: string): any {
    console.log('Decrypting album data for:', albumId);
    console.log('Is authenticated:', this.isAlbumAuthenticated(albumId));
    console.log('Available passwords:', Array.from(this.albumPasswords.keys()));
    console.log('Authenticated albums:', Array.from(this.authenticatedAlbumsSubject.value));
    
    if (!this.isAlbumAuthenticated(albumId)) {
      throw new Error('Album not authenticated');
    }
    
    const password = this.albumPasswords.get(albumId);
    if (!password) {
      console.error('Password not found for album:', albumId);
      console.error('Available passwords map:', this.albumPasswords);
      throw new Error('Password not found for authenticated album');
    }
    
    return this.encryptionService.decrypt(encryptedData, password);
  }

  /**
   * Gets the stored password for an authenticated album
   */
  getAlbumPassword(albumId: string): string | undefined {
    return this.albumPasswords.get(albumId);
  }

  /**
   * Saves authentication state to session storage
   */
  private saveAuthState(): void {
    const authArray = Array.from(this.authenticatedAlbumsSubject.value);
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(authArray));
  }

  /**
   * Loads authentication state from session storage
   */
  private loadAuthState(): void {
    try {
      const stored = sessionStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const authArray = JSON.parse(stored);
        this.authenticatedAlbumsSubject.next(new Set(authArray));
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
      this.clearAllAuth();
    }
  }

  /**
   * Saves password state to session storage
   */
  private savePasswordState(): void {
    try {
      const passwordObj = Object.fromEntries(this.albumPasswords);
      sessionStorage.setItem(this.PASSWORD_STORAGE_KEY, JSON.stringify(passwordObj));
    } catch (error) {
      console.error('Error saving password state:', error);
    }
  }

  /**
   * Loads password state from session storage
   */
  private loadPasswordState(): void {
    try {
      console.log('Loading password state from sessionStorage...');
      const stored = sessionStorage.getItem(this.PASSWORD_STORAGE_KEY);
      console.log('Stored password data:', stored);
      if (stored) {
        const passwordObj = JSON.parse(stored);
        console.log('Parsed password object:', passwordObj);
        this.albumPasswords = new Map(Object.entries(passwordObj));
        console.log('Loaded passwords into Map:', Array.from(this.albumPasswords.entries()));
      } else {
        console.log('No stored password data found');
      }
    } catch (error) {
      console.error('Error loading password state:', error);
      this.albumPasswords.clear();
    }
  }
}
