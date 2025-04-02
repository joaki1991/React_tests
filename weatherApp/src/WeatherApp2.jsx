import React, { useEffect, useState, useCallback } from 'react';
// Vamos a crear un componente funcional que obtenga el clima actual usando la API abierta de OpenMeteo
const WeatherApp2 = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Custom hook para obtener coordenadas
  const getCoordinates = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
        },
        (err) => {
          console.error("Error al obtener la ubicación:", err.message);
          setError("No se pudo obtener la ubicación.");
        }
      );
    } else {
      console.error("La geolocalización no es compatible con este navegador.");
      setError("La geolocalización no es compatible con este navegador.");
    }
  };

  // Función para redondear la hora al intervalo más cercano (por ejemplo, 30 minutos)
  const getRoundedTime = () => {
    const now = new Date();
    const roundedMinutes = now.getMinutes() >= 30 ? 60 : 0;
    const roundedTime = new Date(now.setMinutes(roundedMinutes, 0, 0));
    return roundedTime.toISOString().slice(0, 16); // Devuelve en formato YYYY-MM-DDTHH:MM
  };

  // Función para obtener el clima usando Open-Meteo API
  const getWeather = useCallback(async (lat, lon) => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error('Error al obtener los datos del clima');
      }

      const data = await response.json();
      const time = getRoundedTime();

      const currentIndex = data.hourly.time.findIndex((t) => t === time);
      const relative_humidity_2m = data.hourly.relative_humidity_2m[currentIndex];
      const weather_code = data.hourly.weather_code[currentIndex];

      return {
        temperatura: data.current.temperature_2m,
        fecha: time,
        velocidad_viento: data.current.wind_speed_10m,
        humedad: relative_humidity_2m,
        codigo_clima: weather_code,
      };
    } catch (err) {
      console.error(`Error al obtener los datos del clima: ${err.message}`);
      setError(`Error al obtener los datos del clima: ${err.message}`);      
    }
  }, []);

  // Función para obtener la localidad más cercana
  const getNearestLocation = async (lat, lon) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Error al obtener la localidad más cercana');
      }

      const data = await response.json();
      return data.address.city || 'Localidad desconocida';
    } catch (err) {
      console.error(`Error al obtener la localidad más cercana: ${err.message}`);
      setError(`Error al obtener la localidad más cercana: ${err.message}`);     
    }
  };

  // Efecto para obtener las coordenadas del usuario
  useEffect(() => {
    getCoordinates();
  }, []);

  // Efecto para obtener el clima y la localidad cuando las coordenadas estén disponibles
  useEffect(() => {
    if (location.lat && location.lon) {
      const fetchWeatherAndLocation = async () => {
        try {
          // Obtener tanto el clima como la localidad
          const localidad = await getNearestLocation(location.lat, location.lon);
          const weather = await getWeather(location.lat, location.lon);

          if (weather) {
            // Actualizar el estado del weatherData con la localidad y el clima
            setWeatherData({
              ...weather,
              localidad: localidad,
            });
          }
        } catch (err) {
            console.error(`Error al cargar los datos: ${err.message}`);
            setError(`Error al cargar los datos: ${err.message}`);
        } finally {
          setLoading(false);
        }
      };

      fetchWeatherAndLocation();
    }
  }, [location, getWeather]);
  
  


  
  return (    
    <div>
      <h1>Clima Actual</h1>
      {loading && (
        <div>
          <p>Cargando...</p>
          <img 
            src="https://i.gifer.com/ZZ5H.gif" 
            alt="Cargando" 
            style={{ width: '50px', height: '50px' }} 
          />
        </div>
      )}     
      {!loading && error && <p>Información no disponible actualmente</p>}     
      {weatherData && !loading && !error &&(
        <div>
          <h2>Ubicación: {weatherData.localidad || '-'}</h2>
          <p>Temperatura: {weatherData.temperatura || '-'} °C</p>
          <p>Humedad: {weatherData.humedad || '-'} %</p>
          <p>Viento: {weatherData.velocidad_viento || '-'} Km/h</p>
        </div>
      )}
    </div>        
  );
};

export default WeatherApp2;