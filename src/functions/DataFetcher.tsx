import { useEffect, useState } from 'react';
import type { OpenMeteoResponse, CityCoordinates  } from '../types/DashboardTypes';

const CACHE_EXPIRATION_MINUTES = 10;
const CACHE_EXPIRATION_MS = CACHE_EXPIRATION_MINUTES * 60 * 1000;

interface CachedData {
    timestamp: number;
    data: OpenMeteoResponse;
}

interface DataFetcherProps {
    coordinates: CityCoordinates | undefined; 
}
interface DataFetcherOutput {
    data: OpenMeteoResponse | null;
    loading: boolean;
    error: string | null;
}

export default function DataFetcher({ coordinates }: DataFetcherProps): DataFetcherOutput {
    const [data, setData] = useState<OpenMeteoResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!coordinates?.latitude || !coordinates?.longitude || !coordinates?.timezone) {
            setData(null);
            setError(null);
            setLoading(false);
            return;
        }
        const cache=`weather_cache_${coordinates.latitude}_${coordinates.longitude}`;
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            let cachedData : CachedData | null = null;
            const cachedDataString = localStorage.getItem(cache);
           
            if (cachedDataString) {
                try {
                    cachedData = JSON.parse(cachedDataString);
                    
                    if (cachedData) { 
                        const now = new Date().getTime();
                        const timeSinceCache = now - cachedData.timestamp;
                        if (timeSinceCache < CACHE_EXPIRATION_MS) {
                            console.log(`Usando datos recientes del caché para ${cache}`);
                            setData(cachedData.data);
                            setLoading(false);
                            return; 
                        } else {
                        console.log(`Caché expirado para ${cache}. Refrescando datos...`);
                        }
                    }
                    } catch (e) {
                    console.error("Error al leer o parsear el caché. Se forzará la llamada a la API.", e);
                    localStorage.removeItem(cache); 
                }
            }
        
        

        const encodedTimezone = encodeURIComponent(coordinates.timezone);
        
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&hourly=temperature_2m,wind_speed_10m&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m&timezone=${encodedTimezone}`;

       

            try {
                console.log(`Realizando llamada a la API: ${url}`);
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
                }

                const result: OpenMeteoResponse = await response.json();
           
                const dataToCache: CachedData = {
                    timestamp: new Date().getTime(),
                    data: result,
                };
                setData(result);
                localStorage.setItem(cache, JSON.stringify(dataToCache));
                console.log(`Nuevos datos guardados en caché para ${cache}`);
                console.log("Respuesta completa de la API:", result);
                console.log("Datos horarios (tiempo):", result.hourly?.time);
                console.log("Datos horarios (temperatura):", result.hourly?.temperature_2m);
                console.log("Datos horarios (viento):", result.hourly?.wind_speed_10m);
            } catch (err: unknown) {
                console.error("Error al hacer fetch a la API:", err);
                
                if (cachedData) {
                    try {
                        console.warn(`API falló. Usando datos caducados del caché como fallback para ${cache}.`);
                        setData(cachedData.data);
                    } catch (e) {
                        console.error("No se pudieron usar los datos de fallback del caché", e);
                        const errorMessage = err instanceof Error ? err.message : "Ocurrió un error desconocido.";
                        setError(errorMessage);
                    }
                } else {
                    const errorMessage = err instanceof Error ? err.message : "Ocurrió un error desconocido.";
                    setError(errorMessage);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();

    }, [coordinates]); 

    return { data, loading, error };

}