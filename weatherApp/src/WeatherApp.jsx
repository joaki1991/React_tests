import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Vamos a crear un componente funcional que obtenga el clima actual usando la API de AEMET
const WeatherApp = () => {
  // Primero vamos a definir los estados que vamos a usar
  const [weatherData, setWeatherData] = useState(null); // Estado para almacenar los datos del clima
  const [location, setLocation] = useState({ lat: null, lon: null }); // Estado para almacenar la ubicación del usuario
  const [loading, setLoading] = useState(true); // Estado para manejar el estado de carga
  const [error, setError] = useState(null); // Estado para manejar errores

  const AEMET_API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb2FxdWlucGlxdWVyYXM5MUBnbWFpbC5jb20iLCJqdGkiOiJiZjcyMzAwYy1mN2VhLTRkYmQtYmQ2My03ZjIyOWY1ODFlMmEiLCJpc3MiOiJBRU1FVCIsImlhdCI6MTc0MzQ5MjYxMSwidXNlcklkIjoiYmY3MjMwMGMtZjdlYS00ZGJkLWJkNjMtN2YyMjlmNTgxZTJhIiwicm9sZSI6IiJ9.1vt-Lzs-mg9KPANl8qptBz92gy7-J-z2Cgm5mC7w0ME'; // Reemplaza con tu clave API

  // Función para obtener las coordenadas GPS
  function getCoordinates(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {            
          const { latitude, longitude } = position.coords;          
          setLocation({ lat: latitude, lon: longitude });
        },
        (err) => setError("No se pudo obtener la ubicación.")
      );
    } else {
      setError("La geolocalización no es compatible con este navegador.");
    }
  };

  // Función para obtener el clima usando la API de AEMET de forma asincrona
  async function getWeather(lat, lon) {
    try {
      setLoading(true);
      setError(null);

      // URL de la API de AEMET
      
      const response = await axios.get('/api/opendata/api/observacion/convencional/todas', {
        headers: {
          'api_key': AEMET_API_KEY,
        },
      });
      
      // Esta será la direccion donde ontener todos los datos
      console.log(response.data.datos);
      const weatherDataUrl = response.data.datos;
      const weatherResponse = await axios.get(weatherDataUrl);
      const weatherArray = weatherResponse.data;

      // Encontrar el objeto más cercano a las coordenadas proporcionadas
      const closestWeather = weatherArray.reduce((prev, curr) => {
        const prevDistance = Math.sqrt(
          Math.pow(prev.lat - lat, 2) + Math.pow(prev.lon - lon, 2)
        );
        const currDistance = Math.sqrt(
          Math.pow(curr.lat - lat, 2) + Math.pow(curr.lon - lon, 2)
        );
        if (curr.ta !== undefined && curr.hr !== undefined && curr.vv !== undefined) {
          return currDistance <= prevDistance ? curr : prev;
        }
        
        // Si la distancia es menor o igual que la anterior, devolver el objeto actual
      });

      setWeatherData({
        nombre: closestWeather.ubi,
        temperatura: closestWeather.ta,
        humedad_relativa: closestWeather.hr,
        velocidad_viento: closestWeather.vv,
      });

      
    } catch (err) {
      setError('Error al obtener los datos del clima.');
    } finally {
      setLoading(false);
    }
  };

  // Al cargar el componente, obtenemos la ubicación del usuario
  useEffect(() => {
    getCoordinates();
  }, []);

  // Cuando las coordenadas estén disponibles, obtener el clima
  useEffect(() => {
    if (location.lat && location.lon) {
      getWeather(location.lat, location.lon);
    }
  }, [location]);

  
  return (    
    <div>
    <h1>Clima Actual</h1>
    {loading && <p>Cargando...</p>}
    {error && <p>{error}</p>}
    {weatherData && !loading && !error && (
        <div>
        <h2>Ubicación: {weatherData.nombre}</h2>
        <p>Temperatura: {weatherData.temperatura} °C</p>
        <p>Humedad: {weatherData.humedad_relativa} %</p>
        <p>Viento: {weatherData.velocidad_viento} Km/h</p>
        </div>
    )}
    </div>        
  );
};

export default WeatherApp;