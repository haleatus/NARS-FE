
let googleMapsPromise: Promise<void> | null = null;

export function loadGoogleMaps(apiKey: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  
  if (window.google?.maps) {
    return Promise.resolve();
  }
  
  if (!googleMapsPromise) {
    googleMapsPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,routes`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Google Maps script failed to load'));
      document.head.appendChild(script);
    });
  }
  
  return googleMapsPromise;
}