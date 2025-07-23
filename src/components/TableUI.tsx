import Box from '@mui/material/Box';
import { DataGrid,type GridColDef,type GridRenderCellParams } from '@mui/x-data-grid'; 
import Typography from '@mui/material/Typography';
import type { OpenMeteoResponse } from '../types/DashboardTypes';


interface TableUIProps {
    data: OpenMeteoResponse | null;
}


interface HourlyRow {
    id: number;
    time: string;
    temperature_2m: number;
    wind_speed_10m: number;
}

export default function TableUI({ data }: TableUIProps) {

    if (!data || !data.hourly?.time || !data.hourly?.temperature_2m || !data.hourly?.wind_speed_10m) {
        return (
            <Typography variant="h6" component="div" sx={{ mt: 2 }}>
                Esperando datos del clima para la tabla...
            </Typography>
        );
    }

    console.log("TableUI - Datos de tiempo para la tabla:", data.hourly.time);
    console.log("TableUI - Datos de temperatura horaria:", data.hourly.temperature_2m);
    console.log("TableUI - Datos de viento horario:", data.hourly.wind_speed_10m);

    const rows: HourlyRow[] = data.hourly.time.map((timeString: string, index: number) => {
        const date = new Date(timeString);
        const formattedTime = date.getHours() + ':00';

        const rowData: HourlyRow = {
            id: index,
            time: formattedTime,
            temperature_2m: data.hourly.temperature_2m[index],
            wind_speed_10m: data.hourly.wind_speed_10m[index],
        };
        console.log(`TableUI - Fila ${index}:`, rowData);
        return rowData;
    });

    const columns: GridColDef<HourlyRow>[] = [ 
        { field: 'id', headerName: 'ID', width: 50 },
        {
            field: 'time',
            headerName: 'Hora',
            width: 100,
        },
        {
            field: 'temperature_2m',
            headerName: `Temp. (${data.current_units.temperature_2m})`,
            width: 150,
            
            renderCell: (params: GridRenderCellParams<HourlyRow, number>) => {
                const value = params.row.temperature_2m; 
                console.log("renderCell Temp - Valor para renderizar:", value); 
                return value !== null && value !== undefined ? `${value} ${data.current_units.temperature_2m}` : '';
            },
           
        },
        {
            field: 'wind_speed_10m',
            headerName: `Viento (${data.current_units.wind_speed_10m})`,
            width: 150,
          
            renderCell: (params: GridRenderCellParams<HourlyRow, number>) => {
                const value = params.row.wind_speed_10m; 
                console.log("renderCell Viento - Valor para renderizar:", value); 
                return value !== null && value !== undefined ? `${value} ${data.current_units.wind_speed_10m}` : '';
            },
          
        },
    ];
    return (
        <Box sx={{ height: 350, width: '100%' }}>
            <Typography variant="h5" component="div" sx={{ mb: 2 }}>
                Datos Horarios del Clima
            </Typography>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                }}
                pageSizeOptions={[5, 10, 25]}
                disableRowSelectionOnClick
            />
        </Box>
    );
}