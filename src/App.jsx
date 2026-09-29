import { useState } from "react";
import {
  Search,
  CloudSun,
  CloudRain,
  Cloud,
  Sun,
  Droplets,
  Wind,
  Sunrise,
  Sunset,
  MapPin,
} from "lucide-react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchWeather(cityName) {
    if (!cityName.trim()) {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          cityName
        )}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error("City not found. Please try another city.");
      }

      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setWeather(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather(city);
  };

  const getWeatherIcon = () => {
    if (!weather) {
      return <CloudSun size={115} strokeWidth={1.4} />;
    }

    const condition = weather.weather[0].main.toLowerCase();

    if (condition.includes("rain")) {
      return <CloudRain size={115} strokeWidth={1.4} />;
    }

    if (condition.includes("cloud")) {
      return <Cloud size={115} strokeWidth={1.4} />;
    }

    if (condition.includes("clear")) {
      return <Sun size={115} strokeWidth={1.4} />;
    }

    return <CloudSun size={115} strokeWidth={1.4} />;
  };

  return (
    <main className="app">

      {/* Animated background */}
      <div className="sky-glow"></div>
      <div className="cloud cloud-1"></div>
      <div className="cloud cloud-2"></div>
      <div className="cloud cloud-3"></div>

      <div className="particle particle-1"></div>
      <div className="particle particle-2"></div>
      <div className="particle particle-3"></div>
      <div className="particle particle-4"></div>

      <section className="weather-card">

        {/* Header */}
        <header className="header">
          <div>
            <p className="mini-title">WEATHER DASHBOARD</p>
            <h1>Weatherly</h1>
            <p className="subtitle">
              Your daily weather companion
            </p>
          </div>

          <div className="header-weather-icon">
            <CloudSun size={58} strokeWidth={1.5} />
          </div>
        </header>

        {/* Search */}
        <form className="search-box" onSubmit={handleSearch}>
          <Search size={21} />

          <input
            type="text"
            placeholder="Search for a city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <button type="submit">
            Search
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="error-box">
            <span>⚠️</span>
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="loading">
            <div className="loader">
              <div></div>
            </div>
            <p>Finding the weather...</p>
          </div>
        )}

        {/* Weather result */}
        {weather && !loading && (
          <div className="weather-content">

            {/* Main weather */}
            <div className="main-weather">

              <div className="location">
                <MapPin size={18} />
                <span>
                  {weather.name}, {weather.sys.country}
                </span>
              </div>

              <div className="weather-icon">
                {getWeatherIcon()}
              </div>

              <div className="temperature">
                {Math.round(weather.main.temp)}
                <span>°C</span>
              </div>

              <h2>
                {weather.weather[0].description}
              </h2>

              <p className="feels">
                Feels like {Math.round(weather.main.feels_like)}°C
              </p>
            </div>

            {/* Details */}
            <div className="details-grid">

              <div className="detail-card">
                <div className="detail-icon water">
                  <Droplets size={25} />
                </div>

                <div>
                  <span>Humidity</span>
                  <strong>{weather.main.humidity}%</strong>
                </div>
              </div>

              <div className="detail-card">
                <div className="detail-icon wind">
                  <Wind size={25} />
                </div>

                <div>
                  <span>Wind Speed</span>
                  <strong>{weather.wind.speed} m/s</strong>
                </div>
              </div>

              <div className="detail-card">
                <div className="detail-icon pressure">
                  🌡️
                </div>

                <div>
                  <span>Pressure</span>
                  <strong>{weather.main.pressure} hPa</strong>
                </div>
              </div>

            </div>

            {/* Sunrise / Sunset */}
            <div className="sun-row">

              <div className="sun-card">
                <div className="sun-symbol">
                  <Sunrise size={29} />
                </div>

                <div>
                  <span>Sunrise</span>
                  <strong>
                    {new Date(
                      weather.sys.sunrise * 1000
                    ).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </strong>
                </div>
              </div>

              <div className="sun-card">
                <div className="sun-symbol">
                  <Sunset size={29} />
                </div>

                <div>
                  <span>Sunset</span>
                  <strong>
                    {new Date(
                      weather.sys.sunset * 1000
                    ).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </strong>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Initial screen */}
        {!weather && !loading && !error && (
          <div className="welcome">

            <div className="welcome-icon">
              <CloudSun size={105} strokeWidth={1.2} />
            </div>

            <h2>What's the weather like?</h2>

            <p>
              Search for any city to discover its current weather.
            </p>

          </div>
        )}

      </section>
    </main>
  );
}

export default App;