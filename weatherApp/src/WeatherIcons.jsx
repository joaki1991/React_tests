// Componente para mostrar los iconos del clima
// Este componente recibe un código de clima y muestra el icono y la descripción correspondientes
import React from "react";
import clearDayIcon from './assets/clear-day.svg';
import partlyCloudyDayIcon from './assets/partly-cloudy-day.svg';
import overcastDayIcon from './assets/overcast-day.svg';
import fogIcon from './assets/fog.svg';
import drizzleIcon from './assets/drizzle.svg';
import rainIcon from './assets/rain.svg';
import snowIcon from './assets/snow.svg';
import hailIcon from './assets/hail.svg';
import thunderstormsIcon from './assets/thunderstorms.svg';
import thunderstormsSnowIcon from './assets/thunderstorms-snow.svg';


const WeatherIcons = ({ weatherCode }) => {    

    const icons = {
        0: { icon: clearDayIcon, description: "Cielo despejado" },
        1: { icon: partlyCloudyDayIcon, description: "Parcialmente despejado" },
        2: { icon: partlyCloudyDayIcon, description: "Parcialmente nublado" },
        3: { icon: overcastDayIcon, description: "Nublado" },
        45: { icon: fogIcon, description: "Niebla" },
        48: { icon: fogIcon, description: "Niebla y escarcha" },
        51: { icon: drizzleIcon, description: "Llovizna ligera" },
        53: { icon: drizzleIcon, description: "Llovizna moderada" },
        55: { icon: drizzleIcon, description: "Llovizna intensa" },
        56: { icon: drizzleIcon, description: "Llovizna helada ligera" },
        57: { icon: drizzleIcon, description: "Llovizna helada intensa" },
        61: { icon: rainIcon, description: "Lluvia ligera" },
        63: { icon: rainIcon, description: "Lluvia moderada" },
        65: { icon: rainIcon, description: "Lluvia intensa" },
        66: { icon: rainIcon, description: "Lluvia helada ligera" },
        67: { icon: rainIcon, description: "Lluvia helada intensa" },
        71: { icon: snowIcon, description: "Nieve ligera" },
        73: { icon: snowIcon, description: "Nieve moderada" },
        75: { icon: snowIcon, description: "Nieve intensa" },
        77: { icon: hailIcon, description: "Granizo pequeño" },
        80: { icon: rainIcon, description: "Chubascos ligeros" },
        81: { icon: rainIcon, description: "Chubascos moderados" },
        82: { icon: rainIcon, description: "Chubascos intensos" },
        85: { icon: snowIcon, description: "Chubascos de nieve ligeros" },
        86: { icon: snowIcon, description: "Chubascos de nieve intensos" },
        95: { icon: thunderstormsIcon, description: "Tormenta ligera o moderada" },
        96: { icon: thunderstormsSnowIcon, description: "Tormenta con granizo ligero" },
        99: { icon: thunderstormsSnowIcon, description: "Tormenta con granizo fuerte" }
    };

    const weather = icons[weatherCode];

    

    // Devolvemos un elemento JSX que muestra el icono y la descripción del clima
    return (
        <div>
            <img src={weather.icon} alt={weather.description} />
            <p>{weather.description}</p>
        </div>
    );
};

export default WeatherIcons;
