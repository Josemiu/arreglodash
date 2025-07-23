import { Grid, Paper, Typography } from '@mui/material';
import { useState } from 'react';
import HeaderUI from './components/HeaderUI';
import AlertUI from './components/AlertUI';
import SelectorUI from './components/SelectorUI';
import IndicatorUI from './components/IndicatorUI';
import DataFetcher from './functions/DataFetcher';
import TableUI from './components/TableUI';
import ChartUI from './components/ChartUI';
import type { City, CityCoordinates } from './types/DashboardTypes';
import CohereAssistant from './components/CohereAssistant';


function App() {
    const defaultCity: CityCoordinates = {
        latitude: -2.20, 
        longitude: -79.90, 
        timezone: "America/Guayaquil" 
    };
   const [selectedCityCoordinates, setSelectedCityCoordinates] = useState<CityCoordinates | undefined>(defaultCity);

   const handleCityChange = (city: City) => {
      setSelectedCityCoordinates({
         latitude: city.latitude,
         longitude: city.longitude,
         timezone: city.timezone
      });
   };

   const dataFetcherOutput = DataFetcher({coordinates: selectedCityCoordinates });
   return (
      <Grid container spacing={5} justifyContent="center" alignItems="center">

         {/* Encabezado */}
         <Grid style={{ width: '100%' }}>
            <Grid container justifyContent="center" alignItems="center">
               <HeaderUI />
            </Grid>
         </Grid>

         {/* Contenido en una fila */}
         <Grid container spacing={3} justifyContent="center" alignItems="center" style={{ width: '100%' }}>

            {/* Alertas */}
            <Grid>
               <AlertUI description="No se preveen lluvias" />
            </Grid>

            {/* Selector */}
            <Grid>
               <SelectorUI onCityChange={handleCityChange} />
            </Grid>

            {/* Indicadores */}
            <Grid container size={{ xs: 12, md: 9 }} >

                 {/* Estado de carga */}
                 {dataFetcherOutput.loading && (
                     <Grid size={{ xs: 12 }}>
                         <p>Cargando datos...</p>
                     </Grid>
                 )}

                 {/* Estado de error */}
                 {dataFetcherOutput.error && (
                     <Grid size={{ xs: 12 }}>
                         <p style={{ color: 'red' }}>Error: {dataFetcherOutput.error}</p>
                     </Grid>
                 )}

                 {/* Datos obtenidos exitosamente */}
                 {dataFetcherOutput.data && !dataFetcherOutput.loading && !dataFetcherOutput.error && (
                 <>
                     {/* Indicadores con datos obtenidos */}
                     <Grid size={{ xs: 12, md: 3 }} >
                         <IndicatorUI
                             title='Temperatura (2m)'
                             description={dataFetcherOutput.data.current.temperature_2m + " " + dataFetcherOutput.data.current_units.temperature_2m} />
                     </Grid>

                     <Grid size={{ xs: 12, md: 3 }}>
                         <IndicatorUI
                             title='Temperatura aparente'
                             description={dataFetcherOutput.data.current.apparent_temperature + " " + dataFetcherOutput.data.current_units.apparent_temperature} />
                     </Grid>

                     <Grid size={{ xs: 12, md: 3 }}>
                         <IndicatorUI
                             title='Velocidad del viento'
                             description={dataFetcherOutput.data.current.wind_speed_10m + " " + dataFetcherOutput.data.current_units.wind_speed_10m} />
                     </Grid>

                     <Grid size={{ xs: 12, md: 3 }}>
                         <IndicatorUI
                             title='Humedad relativa'
                             description={dataFetcherOutput.data.current.relative_humidity_2m + " " + dataFetcherOutput.data.current_units.relative_humidity_2m} />
                     </Grid>
                 </>
                 )}

            </Grid>

            {/* Gráfico */}
            <Grid size={{ xs: 6, md: 6 }} sx={{ display: { xs: "none", md: "block" } }}>
              <ChartUI data={dataFetcherOutput.data} />
           </Grid>
            {/* Tabla */}
            <Grid size={{ xs: 6, md: 6 }} sx={{ display: { xs: "none", md: "block" } }}>
              <TableUI data={dataFetcherOutput.data} />
           </Grid>
            <Grid size={{ xs: 6, md: 6 }}></Grid><Grid size={{ xs: 6, md: 6 }}></Grid>
            {/* Información adicional */}
            <Grid size={{ xs: 3, md:3 }} sx={{ display: { xs: "none", md: "block" } }}>
                <Paper sx={{ textAlign: 'center', padding: '1rem' }}>
                    <Typography variant="body1" color="text.primary">
                        Información Adicional del Dashboard
                    </Typography>

                </Paper>
            </Grid>
            {/* === Asistente Cohere === */}
            <Grid size={{ xs: 12, md: 6 }}>
                <CohereAssistant apiKey={import.meta.env.VITE_COHERE_KEY} />
            </Grid>

         </Grid>

      </Grid>
   );
}

export default App;