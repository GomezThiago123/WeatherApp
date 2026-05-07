import { act, renderHook, waitFor } from "@testing-library/react-native";
import { useWeather } from "../hooks/use-weather";

jest.mock("expo-location", () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
}));

import * as Location from "expo-location";

const formatDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const mockResponse = {
  current: {
    temperature_2m: 14,
    relative_humidity_2m: 53,
    surface_pressure: 1014,
    wind_speed_10m: 3,
    weather_code: 2,
  },
  daily: {
    time: [formatDate(yesterday), formatDate(today), formatDate(tomorrow)],
    temperature_2m_min: [8, 4, 9],
    temperature_2m_max: [17, 18, 19],
    temperature_2m_mean: [12, 14, 15],
    relative_humidity_2m_mean: [52, 53, 54],
    surface_pressure_mean: [1023, 1014, 1012],
    wind_speed_10m_mean: [2, 3, 4],
    weather_code: [1, 2, 61],
  },
};

describe("useWeather", () => {
  beforeEach(() => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "granted",
    });
    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
      coords: { latitude: -34.6, longitude: -58.4 },
    });
    global.fetch = jest.fn(() =>
      Promise.resolve({ json: () => Promise.resolve(mockResponse) })
    ) as unknown as typeof fetch;
  });

  test("empieza en estado de carga", () => {
    const { result } = renderHook(() => useWeather());
    expect(result.current.isLoading).toBe(true);
  });

  test("carga los días correctamente desde la API", async () => {
    const { result } = renderHook(() => useWeather());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.forecast).toHaveLength(3);
  });

  test("selecciona hoy como día inicial", async () => {
    const { result } = renderHook(() => useWeather());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.selectedDay).toBe(1);
    expect(result.current.isToday).toBe(true);
  });

  test("el día actual usa los datos de current de la API", async () => {
    const { result } = renderHook(() => useWeather());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.weather.current).toBe(14);
    expect(result.current.weather.humidity).toBe(53);
    expect(result.current.weather.pressure).toBe(1014);
    expect(result.current.weather.wind).toBe(3);
  });

  test("los días que no son hoy usan datos de daily", async () => {
    const { result } = renderHook(() => useWeather());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => result.current.goToPrevDay());

    expect(result.current.weather.current).toBe(12);
    expect(result.current.weather.humidity).toBe(52);
  });

  test("navegar al día siguiente incrementa selectedDay", async () => {
    const { result } = renderHook(() => useWeather());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => result.current.goToNextDay());

    expect(result.current.selectedDay).toBe(2);
    expect(result.current.isToday).toBe(false);
  });

  test("navegar al día anterior decrementa selectedDay", async () => {
    const { result } = renderHook(() => useWeather());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => result.current.goToPrevDay());

    expect(result.current.selectedDay).toBe(0);
  });

  test("no se puede ir antes del primer día", async () => {
    const { result } = renderHook(() => useWeather());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.goToPrevDay();
      result.current.goToPrevDay();
    });

    expect(result.current.selectedDay).toBe(0);
  });

  test("no se puede ir después del último día", async () => {
    const { result } = renderHook(() => useWeather());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.goToNextDay();
      result.current.goToNextDay();
    });

    expect(result.current.selectedDay).toBe(2);
  });

  test("previousDate y nextDate corresponden a los días adyacentes", async () => {
    const { result } = renderHook(() => useWeather());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const [y, m, d] = formatDate(yesterday).split("-");
    const [, tm, td] = formatDate(tomorrow).split("-");

    expect(result.current.previousDate).toBe(`${d}/${m}`);
    expect(result.current.nextDate).toBe(`${td}/${tm}`);
  });

  test("sin permiso de ubicación termina la carga sin pedir datos", async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "denied",
    });

    const { result } = renderHook(() => useWeather());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(fetch).not.toHaveBeenCalled();
    expect(result.current.forecast).toHaveLength(1);
  });
});
