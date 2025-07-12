import { fetchWeatherApi } from 'openmeteo';

// Weather code mapping
const weatherCodes = {
    0: { description: "Clear sky", icon: "☀️" },
    1: { description: "Mainly clear", icon: "🌤️" },
    2: { description: "Partly cloudy", icon: "⛅" },
    3: { description: "Overcast", icon: "☁️" },
    45: { description: "Foggy", icon: "🌫️" },
    48: { description: "Depositing rime fog", icon: "🌫️" },
    51: { description: "Light drizzle", icon: "🌧️" },
    53: { description: "Moderate drizzle", icon: "🌧️" },
    55: { description: "Dense drizzle", icon: "🌧️" },
    61: { description: "Slight rain", icon: "🌧️" },
    63: { description: "Moderate rain", icon: "🌧️" },
    65: { description: "Heavy rain", icon: "🌧️" },
    71: { description: "Slight snow fall", icon: "❄️" },
    73: { description: "Moderate snow fall", icon: "❄️" },
    75: { description: "Heavy snow fall", icon: "❄️" },
    77: { description: "Snow grains", icon: "❄️" },
    80: { description: "Slight rain showers", icon: "🌦️" },
    81: { description: "Moderate rain showers", icon: "🌦️" },
    82: { description: "Violent rain showers", icon: "🌊" },
    85: { description: "Slight snow showers", icon: "🌨️" },
    86: { description: "Heavy snow showers", icon: "🌨️" },
    95: { description: "Thunderstorm", icon: "⛈️" },
    96: { description: "Thunderstorm with light hail", icon: "🌩️" },
    99: { description: "Thunderstorm with heavy hail", icon: "🌩️" }
};

const params = {
    latitude: 52.52,
    longitude: 13.41,
    hourly: "temperature_2m,apparent_temperature,uv_index,weathercode",
    timezone: "Pacific/Auckland"
};

const url = "https://api.open-meteo.com/v1/forecast";
const responses = await fetchWeatherApi(url, params);

const response = responses[0];
const utcOffsetSeconds = response.utcOffsetSeconds();
const hourly = response.hourly()!;

// Calculate total hours available (should cover multiple days, including 24+ hours)
const totalHours = (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval();

const weatherDataHourly = {
    hourly: {
        time: [...Array(totalHours)].map(
            (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
        ),
        temperature2m: hourly.variables(0)!.valuesArray()!,
        apparentTemperature: hourly.variables(1)!.valuesArray()!,
        uvIndex: hourly.variables(2)!.valuesArray()!,
        weatherCode: hourly.variables(3)!.valuesArray()!
    },
};

// Log all available hourly data (including full 24 hours)
for (let i = 0; i < weatherDataHourly.hourly.time.length; i++) {
    const code = weatherDataHourly.hourly.weatherCode[i];
    const weatherInfo = weatherCodes[code] || { description: "Unknown", icon: "❓" };
    console.log(
        weatherDataHourly.hourly.time[i].toISOString(),
        "Actual Temp:", weatherDataHourly.hourly.temperature2m[i],
        "Feels Like:", weatherDataHourly.hourly.apparentTemperature[i],
        "UV Index:", weatherDataHourly.hourly.uvIndex[i],
        "Weather:", weatherInfo.description, weatherInfo.icon
    );
}

// const weekly = response.weekly()!;
// const weatherDataWeekly = {
//      weekly: {
//          time: [...Array((Number(weekly.timeEnd()) - Number(weekly.time())) / weekly.interval())].map(
//              (_, i) => new Date((Number(weekly.time()) + i * weekly.interval() + utcOffsetSeconds) * 1000)
//          ),
//          temperature2m: weekly.variables(0)!.valuesArray()!,
//          apparentTemperature: weekly.variables(1)!.valuesArray()!,
//          uvIndex: weekly.variables(2)!.valuesArray()!
//      },
// };

// for (let i = 0; i < weatherDataWeekly.weekly.time.length; i++) {
//     console.log(
//         weatherDataWeekly.weekly.time[i].toISOString(),
//         "Actual Temp:", weatherDataWeekly.weekly.temperature2m[i],
//         "Feels Like:", weatherDataWeekly.weekly.apparentTemperature[i],
//         "UV Index:", weatherDataWeekly.weekly.uvIndex[i]
//     );
// }s
