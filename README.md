# WeatherApp

Aplicación mobile de clima desarrollada con React Native y Expo. Muestra el clima actual y permite navegar entre el día de ayer, hoy y mañana.

## Tecnologías

- React Native 0.83 + Expo SDK 55
- TypeScript
- expo-location (GPS del dispositivo)
- Open-Meteo API (gratuita, sin API key)
- Jest + Testing Library (tests del hook)

## Funcionalidades

- Obtiene la ubicación real del dispositivo con GPS
- Consulta temperatura actual, mínima, máxima, humedad, presión y viento
- Navega entre ayer, hoy y mañana
- Muestra un ícono según la condición climática (soleado, nublado, lluvia, nieve, tormenta)
- Pantalla de carga mientras espera la respuesta de la API

## Estructura

```
app/(tabs)/index.tsx   pantalla principal
hooks/use-weather.ts   lógica del clima (fetch, estado, navegación)
__tests__/
  use-weather.test.ts  tests del hook
  descripcion-tests.txt descripción de cada test
```

## Instalación y uso

```bash
bun install
bun start
```

Escanear el QR con Expo Go (conectado a la misma red que la computadora).

## Tests

```bash
bun run tests
```

11 tests del hook `useWeather` que cubren:

- Estado inicial de carga
- Carga correcta de datos desde la API
- Selección de hoy como día inicial
- Datos `current` vs `daily` según el día seleccionado
- Navegación entre días
- Límites de navegación (no pasa del primero ni del último)
- Fechas adyacentes (`previousDate`, `nextDate`)
- Permiso de ubicación denegado

## API

Usa [Open-Meteo](https://open-meteo.com/). No requiere cuenta ni API key. Consulta datos de los últimos 1 día y próximos 2 días con los siguientes campos:

- `temperature_2m`, `temperature_2m_min`, `temperature_2m_max`
- `relative_humidity_2m`, `surface_pressure`, `wind_speed_10m`
- `weather_code`
