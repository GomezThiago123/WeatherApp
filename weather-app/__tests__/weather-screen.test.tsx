import { fireEvent, render, waitFor } from "@testing-library/react-native";

import HomeScreen from "../app/(tabs)/index";

const mockWeatherResponse = {
  current: {
    temperature_2m: 14,
    relative_humidity_2m: 53,
    surface_pressure: 1014,
    wind_speed_10m: 3,
    weather_code: 2,
  },
  daily: {
    time: ["2026-05-06", "2026-05-07", "2026-05-08"],
    temperature_2m_min: [8, 4, 9],
    temperature_2m_max: [17, 18, 19],
    temperature_2m_mean: [12, 14, 15],
    relative_humidity_2m_mean: [52, 53, 54],
    surface_pressure_mean: [1023, 1014, 1012],
    wind_speed_10m_mean: [2, 3, 4],
    weather_code: [1, 2, 61],
  },
};

describe("<HomeScreen />", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockWeatherResponse),
      }),
    ) as jest.Mock;
  });

  test("expone todos los testID obligatorios", async () => {
    const { getByTestId } = render(<HomeScreen />);

    await waitFor(() => {
      expect(getByTestId("header-city")).toBeTruthy();
    }, { timeout: 10000 });

    [
      "screen-weather",
      "header-city",
      "button-prev-day",
      "button-next-day",
      "navigation-current-day",
      "temp-current",
      "temp-min",
      "temp-max",
    ].forEach((id) => {
      expect(getByTestId(id)).toBeTruthy();
    });
  });

  test("renderiza ciudad, icono, metricas y temperaturas", async () => {
    const { getAllByTestId, getByTestId } = render(<HomeScreen />);

    await waitFor(() => {
      expect(getByTestId("header-city").props.children).toBe("VILLA LUGANO");
    });

    expect(getByTestId("icon-weather-cloudy")).toBeTruthy();
    expect(getAllByTestId("metric-item")).toHaveLength(3);
    expect(getAllByTestId("metric-icon")).toHaveLength(3);
    expect(getAllByTestId("metric-value")).toHaveLength(3);
    expect(getByTestId("temp-current").props.children).toContain("°");
    expect(getByTestId("temp-min").props.children).toContain("°");
    expect(getByTestId("temp-max").props.children).toContain("°");
  });

  test("permite navegar al dia siguiente", async () => {
    const { getByTestId } = render(<HomeScreen />);

    await waitFor(() => {
      expect(getByTestId("navigation-current-day").props.children).toBe("NOW");
    });

    fireEvent.press(getByTestId("button-next-day"));

    expect(getByTestId("navigation-current-day").props.children).toBe("AVG");
  });
});
