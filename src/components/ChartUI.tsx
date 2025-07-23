import { LineChart } from '@mui/x-charts/LineChart';
import Typography from '@mui/material/Typography';
import type { OpenMeteoResponse } from '../types/DashboardTypes';

interface ChartUIProps {
    data: OpenMeteoResponse | null;
}

export default function ChartUI({ data }: ChartUIProps) {

    if (!data || !data.hourly?.time || !data.hourly?.temperature_2m) {
        return (
            <Typography variant="h6" component="div" sx={{ mt: 2 }}>
                Esperando datos del clima para el gráfico...
            </Typography>
        );
    }
    console.log("ChartUI - Datos de tiempo para el gráfico:", data.hourly.time);
    console.log("ChartUI - Datos de temperatura para el gráfico:", data.hourly.temperature_2m);

    const chartLabels = data.hourly.time.map((timeString: string) => {
        const date = new Date(timeString);
        return date.getHours() + ':00';
    });
    const chartTemperatures = data.hourly.temperature_2m;

    return (
        <>
            <Typography variant="h5" component="div">
                Temperatura por Hora ({data.current_units.temperature_2m})
            </Typography>
            <LineChart
                height={300}
                series={[
                    {
                        data: chartTemperatures,
                        label: 'Temperatura (2m)',
                        // ¡CORRECCIÓN AQUÍ! Cambiado de yAxisKey a yAxisId
                        yAxisId: 'temperatureAxis'
                    },
                ]}
                xAxis={[{
                    scaleType: 'point',
                    data: chartLabels,
                    label: 'Hora'
                }]}
                // Definición de los ejes Y. Asegúrate de que el 'id' coincida con 'yAxisId' en la serie
                yAxis={[{
                    id: 'temperatureAxis', // El ID debe coincidir con yAxisId de la serie
                    label: `Temperatura (${data.current_units.temperature_2m})`
                }]}
            />
        </>
    );
}