
import { toast } from '@/hooks/use-toast';

export type GeoLocation = {
  latitude: number;
  longitude: number;
  address: string;
};

export async function getCurrentLocation(): Promise<GeoLocation | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      toast({
        title: 'Geolocation not supported',
        description: 'Your browser does not support geolocation',
        variant: 'destructive',
      });
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const address = await getAddressFromCoordinates(latitude, longitude);
          resolve({
            latitude,
            longitude,
            address,
          });
        } catch (error) {
          console.error('Error getting location:', error);
          resolve(null);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast({
          title: 'Location error',
          description: 'Unable to get your current location',
          variant: 'destructive',
        });
        resolve(null);
      }
    );
  });
}

export async function getAddressFromCoordinates(
  latitude: number,
  longitude: number
): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
    );
    const data = await response.json();
    return data.display_name || 'Unknown location';
  } catch (error) {
    console.error('Error fetching address:', error);
    return 'Unknown location';
  }
}

export async function getCoordinatesFromAddress(address: string): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return null;
  }
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // Haversine formula to calculate distance between two points on Earth
  const R = 6371; // Radius of earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

function toRad(value: number): number {
  return (value * Math.PI) / 180;
}

export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${(distance * 1000).toFixed(0)} m`;
  }
  return `${distance.toFixed(1)} km`;
}
