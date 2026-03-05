
const WEATHER_CACHE_KEY = 'atab_weather_cache';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in ms

export async function initWeather(settings) {
    const widget = document.getElementById('weather-widget');
    if (!settings.weatherEnabled) {
        if (widget) widget.classList.add('hidden');
        return;
    }
    
    if (widget) widget.classList.remove('hidden');

    try {
        if (!widget.hasChildNodes()) {
            renderLoading(widget);
        }

        const cached = await getCachedWeather();
        let shouldFetch = !cached || !isFresh(cached.timestamp);
        
        if (cached && isFresh(cached.timestamp)) {
            // Check if settings changed
            if (cached.settings.city !== settings.weatherCity || 
                cached.settings.unit !== settings.weatherUnit) {
                shouldFetch = true;
            }
        }

        if (shouldFetch) {
            renderLoading(widget);
            const weatherData = await fetchWeather(settings);
            if (weatherData) {
                await saveWeatherCache(weatherData, settings);
                renderWeather(widget, weatherData);
            }
        } else {
            renderWeather(widget, cached.data);
        }
    } catch (error) {
        console.error('Weather init error:', error);
        renderError(widget);
    }
}

function getCachedWeather() {
    return new Promise((resolve) => {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            chrome.storage.local.get([WEATHER_CACHE_KEY], (result) => {
                resolve(result[WEATHER_CACHE_KEY]);
            });
        } else {
            resolve(null);
        }
    });
}

function saveWeatherCache(data, settings) {
    return new Promise((resolve) => {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            const cache = {
                data,
                settings: { city: settings.weatherCity, unit: settings.weatherUnit },
                timestamp: Date.now()
            };
            chrome.storage.local.set({ [WEATHER_CACHE_KEY]: cache }, resolve);
        } else {
            resolve();
        }
    });
}

function isFresh(timestamp) {
    return (Date.now() - timestamp) < CACHE_DURATION;
}

async function fetchWeather(settings) {
    let lat, lon, city = settings.weatherCity;

    if (city && city.trim() !== '') {
        // Geocoding
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();
        
        if (!geoData.results || geoData.results.length === 0) {
            throw new Error('City not found');
        }
        
        lat = geoData.results[0].latitude;
        lon = geoData.results[0].longitude;
        city = geoData.results[0].name;
    } else {
        // Auto-detect
        try {
            const pos = await getPosition();
            lat = pos.coords.latitude;
            lon = pos.coords.longitude;
            city = "Local"; 
        } catch (e) {
            console.warn("Geolocation failed, defaulting to London", e);
            lat = 51.5074;
            lon = -0.1278;
            city = "London (Default)";
        }
    }

    const unit = settings.weatherUnit === 'fahrenheit' ? 'fahrenheit' : 'celsius';
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=${unit}`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error('Weather API error');
    
    const data = await res.json();
    
    return {
        temp: data.current_weather.temperature,
        unit: settings.weatherUnit === 'fahrenheit' ? '°F' : '°C',
        code: data.current_weather.weathercode,
        city: city
    };
}

function getPosition() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation not supported"));
            return;
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
    });
}

function renderLoading(widget) {
    if (widget) {
        widget.innerHTML = '<div class="weather-loading">Checking weather...</div>';
    }
}

function renderError(widget) {
    if (widget) {
        widget.innerHTML = '<div class="weather-error" title="Check settings/connection">Weather Unavailable</div>';
    }
}

function renderWeather(widget, data) {
    if (!widget) return;

    const iconInfo = getWeatherIconInfo(data.code);
    const icon = iconInfo.icon;
    const desc = iconInfo.desc;
    
    widget.innerHTML = `
        <div class="weather-content">
            <div class="weather-icon">${icon}</div>
            <div class="weather-info">
                <div class="weather-temp">${Math.round(data.temp)}${data.unit}</div>
                <div class="weather-city">${data.city}</div>
            </div>
        </div>
    `;
    
    widget.title = `${desc} in ${data.city}`;
}

function getWeatherIconInfo(code) {
    // WMO Weather interpretation codes (WW)
    const map = {
        0: { icon: '☀️', desc: 'Clear sky' },
        1: { icon: '🌤️', desc: 'Mainly clear' },
        2: { icon: '⛅', desc: 'Partly cloudy' },
        3: { icon: '☁️', desc: 'Overcast' },
        45: { icon: '🌫️', desc: 'Fog' },
        48: { icon: '🌫️', desc: 'Fog' },
        51: { icon: '🌦️', desc: 'Light Drizzle' },
        53: { icon: '🌦️', desc: 'Moderate Drizzle' },
        55: { icon: '🌧️', desc: 'Dense Drizzle' },
        56: { icon: '🌨️', desc: 'Light Freezing Drizzle' },
        57: { icon: '🌨️', desc: 'Dense Freezing Drizzle' },
        61: { icon: '🌦️', desc: 'Slight Rain' },
        63: { icon: '🌧️', desc: 'Moderate Rain' },
        65: { icon: '🌧️', desc: 'Heavy Rain' },
        66: { icon: '🌨️', desc: 'Light Freezing Rain' },
        67: { icon: '🌨️', desc: 'Heavy Freezing Rain' },
        71: { icon: '❄️', desc: 'Slight Snow' },
        73: { icon: '❄️', desc: 'Moderate Snow' },
        75: { icon: '❄️', desc: 'Heavy Snow' },
        77: { icon: '❄️', desc: 'Snow grains' },
        80: { icon: '🌦️', desc: 'Slight Rain Showers' },
        81: { icon: '🌧️', desc: 'Moderate Rain Showers' },
        82: { icon: '🌧️', desc: 'Violent Rain Showers' },
        85: { icon: '❄️', desc: 'Slight Snow Showers' },
        86: { icon: '❄️', desc: 'Heavy Snow Showers' },
        95: { icon: '⚡', desc: 'Thunderstorm' },
        96: { icon: '⛈️', desc: 'Thunderstorm with hail' },
        99: { icon: '⛈️', desc: 'Thunderstorm with heavy hail' }
    };
    
    return map[code] || { icon: '❓', desc: 'Unknown' };
}
