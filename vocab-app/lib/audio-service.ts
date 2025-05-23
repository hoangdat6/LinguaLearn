// Singleton AudioService để quản lý việc phát âm thanh trên toàn ứng dụng
class AudioService {
  private static instance: AudioService;
  private audioElement: HTMLAudioElement | null = null;
  private isSpeaking: boolean = false;
  private playPromise: Promise<void> | null = null;

  private constructor() {
    // Private constructor để áp dụng singleton pattern
  }

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  /**
   * Phát âm thanh từ URL
   */
  public playAudioFromUrl(url: string): Promise<void> {
    // Properly handle any existing play operation before starting a new one
    return this.stopAll().then(() => {
      return new Promise((resolve, reject) => {
        try {
          this.audioElement = new Audio(url);
          
          this.audioElement.onended = () => {
            resolve();
          };
          
          this.audioElement.onerror = (error) => {
            reject(error);
          };
          
          // Store and handle the play promise
          this.playPromise = this.audioElement.play();
          if (this.playPromise !== null) {
            this.playPromise
              .then(() => {
                // Play started successfully
              })
              .catch(error => {
                // Only log real errors, not abort errors from intentional stops
                if (error.name !== 'AbortError') {
                }
                reject(error);
              });
          }
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  /**
   * Phát âm thanh từ văn bản sử dụng SpeechSynthesis API
   */
  public speakText(text: string, lang: string = 'en-US'): Promise<void> {
    this.stopAll(); // Dừng mọi âm thanh đang phát
    
    return new Promise((resolve, reject) => {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        
        utterance.onend = () => {
          this.isSpeaking = false;
          resolve();
        };
        
        utterance.onerror = (event) => {
          this.isSpeaking = false;
          reject(event);
        };
        
        this.isSpeaking = true;
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        this.isSpeaking = false;
        reject(error);
      }
    });
  }

  /**
   * Dừng tất cả âm thanh đang phát
   */
  public stopAll(): Promise<void> {
    return new Promise((resolve) => {
      // Handle the existing play promise before pausing
      const handlePause = () => {
        // Dừng Audio nếu đang phát
        if (this.audioElement) {
          this.audioElement.pause();
          this.audioElement.currentTime = 0;
        }
        
        // Dừng SpeechSynthesis
        if (window.speechSynthesis && this.isSpeaking) {
          window.speechSynthesis.cancel();
          this.isSpeaking = false;
        }
        
        resolve();
      };

      // If we have a pending play operation, wait for it to finish or fail before stopping
      if (this.playPromise) {
        this.playPromise
          .then(handlePause)
          .catch(() => handlePause())
          .finally(() => {
            this.playPromise = null;
          });
      } else {
        handlePause();
      }
    });
  }
}

// Export instance duy nhất của AudioService
export const audioService = AudioService.getInstance();
