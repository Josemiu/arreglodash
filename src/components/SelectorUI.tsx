import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import { useState } from 'react';
import type { City } from '../types/DashboardTypes';

interface SelectorUIProps {
    onCityChange: (city: City) => void;
    }
    export default function SelectorUI({ onCityChange }: SelectorUIProps) {
        const [selectedCityName, setSelectedCityName] = useState('');

            const cities: City[] = [
                    { name: "guayaquil", latitude: -2.20, longitude: -79.90, timezone: "America/Guayaquil" },
                            { name: "quito", latitude: -0.23, longitude: -78.52, timezone: "America/Guayaquil" },
                                    { name: "manta", latitude: -0.95, longitude: -80.72, timezone: "America/Guayaquil" },
                                            { name: "cuenca", latitude: -2.90, longitude: -79.00, timezone: "America/Guayaquil" },
                                                ];

                                                    const handleChange = (event: SelectChangeEvent<string>) => {
                                                            const cityName = event.target.value;
                                                                    setSelectedCityName(cityName);

                                                                            const cityFound = cities.find(city => city.name === cityName);

                                                                                    if (cityFound) {
                                                                                                onCityChange(cityFound); // Notifica al padre con el objeto City completo
                                                                                                        }
                                                                                                            };




                                                                                                            return (
                                                                                                               <FormControl fullWidth>
                                                                                                                     <InputLabel id="city-select-label">Ciudad</InputLabel>
                                                                                                                           <Select
                                                                                                                                    labelId="city-select-label"
                                                                                                                                             id="city-simple-select"
                                                                                                                                                      label="Ciudad"
                                                                                                                                                               onChange={handleChange}
                                                                                                                                                                        value={selectedCityName}>
                                                                                                                                                                                 <MenuItem disabled value=""><em>Seleccione una ciudad</em></MenuItem>
                                                                                                                                                                                                 {cities.map((city) => (
                                                                                                                                                                                                                     <MenuItem key={city.name} value={city.name}>
                                                                                                                                                                                                                                             {city.name.charAt(0).toUpperCase() + city.name.slice(1)}
                                                                                                                                                                                                                                                                 </MenuItem>
                                                                                                                                                                                                                                                                                 ))}
                                                                                                                                                                                                                                                                                             </Select>
                                                                                                                                                                                                                                                                                                         {selectedCityName && (
                                                                                                                                                                                                                                                                                                                         <p>
                                                                                                                                                                                                                                                                                                                                             Información del clima en <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{selectedCityName}</span>
                                                                                                                                                                                                                                                                                                                                                             </p>
                                                                                                                                                                                                                                                                                                                                                                         )}
                                                                                                                                                                                                                                                                                                                                                                                 </FormControl>
                                                                                                                                                                                                                                                                                                                                                                                     );
                                                                                                                                                                                                                                                                                                                                                                                     }

                                                                                                                                                                                                                                                                                                                                                                                     