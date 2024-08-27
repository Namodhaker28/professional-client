import axios from 'axios';
import React, { useEffect, useState } from 'react'

export const useLocation = () => {
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [city, setCity] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
          },
          (error) => {
            console.error('Error fetching location:', error);
            setError('Error fetching location. Please try again.');
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
        setError('Geolocation is not supported by this browser.');
      }
    }, []);

    useEffect(() => {
      if (location.latitude && location.longitude) {
        const fetchCity = async () => {
          try {
            const response = await axios.get(
              `https://api.opencagedata.com/geocode/v1/json?q=${location.latitude}+${location.longitude}&key=4f9d2b3912e84851b66d0d73b32477c9`
            );
            const city = response.data.results[0].components.city || response.data.results[0].components.town;
            console.log("city: ", city);
            setCity(city);
          } catch (error) {
            console.error('Error fetching city:', error);
            setError('Error fetching city. Please try again.');
          }
        };
        fetchCity();
      }
    }, [location]);

    return city;

}
