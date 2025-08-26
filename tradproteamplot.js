// Global translation helper function
        function getTranslation(key, defaultText) {
            // Split the key into parts (e.g., "tooltip.xg-line-title" -> ["tooltip", "xg-line-title"])
            const keys = key.split('.');
            
            // Try to find the translation in the current language
            try {
                let currentTranslations = window.currentTranslations || {};
                for (const k of keys) {
                    if (currentTranslations && currentTranslations[k]) {
                        currentTranslations = currentTranslations[k];
                    } else {
                        return defaultText;
                    }
                }
                return currentTranslations;
            } catch (e) {
                return defaultText;
            }
        }
        
  
  function getPreferredLanguage() {
    // PRIORITY 1: Check URL parameter first
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    if (langParam) {
      return langParam;
    }
    // PRIORITY 2: Check localStorage
    const storedLang = localStorage.getItem('preferredLanguage');
    if (storedLang) {
      return storedLang;
    }
    // PRIORITY 3: Use browser language
    return getBrowserLanguage() || 'en';
  }

  function getBrowserLanguage() {
    return navigator.language.slice(0, 2);
  }

  function applyLanguage(language) {
    console.log(language);

    if (language === 'en') {
      return;
    }

    
    fetch(`locales/${language}.json`)
      .then(response => {
        // Don't throw an error, just return null if response is not OK
        return response.ok ? response.json() : null;
      })
      .then(translations => {
        // Only proceed if translations exist
        if (translations) {
            window.currentTranslations = translations;
          document.querySelectorAll('[data-i18n]').forEach(element => {
            const keys = element.getAttribute('data-i18n').split('.');
            let value = translations;
            for (const key of keys) {
              if (value === undefined || value === null) break;
              value = value[key];
            }
            if (value) {
              if (element.tagName === 'INPUT') {
              element.setAttribute('placeholder', value);
          } else if (value.includes('<')) {
              element.innerHTML = value;
          } else {
              element.textContent = value;
          }          }
          });
        }
      })
      .catch(() => {
        // Completely empty catch block to silently ignore any errors
      });
  }
  
  const preferredLanguage = getPreferredLanguage();
  applyLanguage(preferredLanguage);
  

function toggleDarkMode() {
            const body = document.querySelector("body");
            body.classList.toggle("dark-mode");
            
            const isDarkMode = body.classList.contains("dark-mode");
            localStorage.setItem("darkMode", isDarkMode);
            
        }
        
        document.addEventListener('DOMContentLoaded', function() {
            const storedDarkMode = localStorage.getItem("darkMode");
            
            if (storedDarkMode === "true") {
                const body = document.querySelector("body");
                body.classList.add("dark-mode");
            }
            
 
        });

        function takeScreenshot() {
            const chartContainer = document.querySelector('.chart-container');
            const isDarkMode = document.body.classList.contains('dark-mode');
            
            html2canvas(chartContainer, {
                scale: 2, // Higher quality
                backgroundColor: isDarkMode ? '#2c2c2c' : '#FFFFFF',
                allowTaint: true,
                useCORS: true,
                logging: false
            }).then(function(renderedCanvas) {
                const finalCanvas = document.createElement('canvas');
                finalCanvas.width = renderedCanvas.width;
                finalCanvas.height = renderedCanvas.height;
                const finalCtx = finalCanvas.getContext('2d');
                finalCtx.drawImage(renderedCanvas, 0, 0);
                
                // Load the watermark
                const watermarkImg = new Image();
                watermarkImg.crossOrigin = "Anonymous";
                
                watermarkImg.onload = function() {
                    const watermarkWidth = finalCanvas.width * 0.3;
                    const watermarkHeight = (watermarkWidth / watermarkImg.width) * watermarkImg.height;
                    
                    const x = (finalCanvas.width - watermarkWidth) / 2;
                    const y = (finalCanvas.height - watermarkHeight) / 2;
                    
                    finalCtx.save();
                    finalCtx.globalAlpha = 0.04;
                    finalCtx.drawImage(watermarkImg, x, y, watermarkWidth, watermarkHeight);
                    finalCtx.restore();
                    
                    const dataURL = finalCanvas.toDataURL('image/png', 1.0);
                    const link = document.createElement('a');
                    link.download = 'DataMB Screenshot.png';
                    link.href = dataURL;
                    link.click();
                };
                watermarkImg.src = 'https://datamb.football/logo.png';
            }).catch(function(error) {
            });
        }