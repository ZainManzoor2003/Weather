import React, { useEffect, useState } from 'react'
import './Weather.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BiSearch } from 'react-icons/bi'


const Weather = () => {
    const [temperature, setTemperature] = useState('');
    const [wind, setWind] = useState('0');
    const [humidity, setHumidity] = useState('0');
    const [city, setCity] = useState('');
    const [icon, setIcon] = useState(null);
    const [searchHistory, setSearchHistory] = useState([]);
    const [input, setInput] = useState('Lahore');
    const [tempFormat, setTempFormat] = useState('metric');
    useEffect(() => {
        getWeatherData();
    }, [])
    const getWeatherData = async () => {
        if (input === '') {
            toast.error('Please Enter a city Name',{
                autoClose:1000,
                position:'top-center'
            });
        }
        else {
            let data = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=d8a9c532980ba8c2026efccce3f63ae4&units=${tempFormat}`)
            let res = await data.json();
            if (res.cod !== '404') {
                setInput('');
                setTemperature(Math.floor(res.main.temp));
                setHumidity(res.main.humidity);
                setCity(res.name);
                setIcon(res.weather[0].icon);
                setWind(Math.floor(res.wind.speed));
                icon!==null && manageHistory();
            }
            else {
                setInput('')
                toast.error('City Not Found',{
                    autoClose:1000,
                    position:'top-center'
                });
            }
        }
    }
    const manageHistory = () => {
            if (searchHistory.length < 4) {
                if (!searchHistory.includes(input))
                    setSearchHistory([...searchHistory, input])
            }
            else {
                if (!searchHistory.includes(input)) {
                    setSearchHistory(searchHistory.shift());
                    setSearchHistory([...searchHistory, input])
                }
            }
    }
    const changeTempFormat = (unit) => {
        setTempFormat(unit);
        let temp;
        if (unit === 'imperial' && tempFormat !== unit) {
            temp = temperature;
            temp = (9 / 5 * temp) + 32;
            setTemperature(temp);
        }
        else if (unit === 'metric' && tempFormat !== unit) {
            temp = temperature;
            temp = ((temp - 32) * 5 / 9);
            setTemperature(temp);
        }
    }
    return (
        <>
            <div class="container">
                <div class="weather-container">
                    <div class="input">
                        <input type="text" placeholder='Search' value={input} onChange={(e) => setInput(e.target.value)} />
                        <div class="icon" onClick={() => { getWeatherData();}}>
                            <BiSearch />
                        </div>
                    </div>
                    <div class="search-backup">
                        {searchHistory.map((searchHistory, index) => (
                            <h5 key={index} onClick={() => setInput(searchHistory)}>{searchHistory}</h5>
                        ))}
                    </div>
                    <div class="temp-changer">
                        <h5 onClick={() => changeTempFormat('metric')}>C | </h5><h5 onClick={() => changeTempFormat('imperial')}> F</h5>
                    </div>
                    <div class="weather-icon">
                        <img src={icon === '01d' || icon === '01n' ? './Images/clear.png' : icon === '02d' || icon === '02n' ? './Images/cloud.png' :
                            icon === '03d' || icon === '03n' || icon === '04d' || icon === '04n' ? './Images/drizzle.png' :
                                icon === '10d' || icon === '10n' || icon === '09d' || icon === '09n' ? './Images/rain.png' : icon === '13d' ||
                                    icon === '13n' ? './Images/snow.png' : icon === '50d' || icon === '50n' ? './Images/mist.png' : './Images/'} alt="" />
                    </div>
                    <div class="celcius ">
                        <h1>{Math.floor(temperature) + '°'} {tempFormat === 'metric' ? 'C' : 'F'}</h1>
                    </div>
                    <div class="city-name">
                        <h1>{city}</h1>
                    </div>
                    <div class="last-section">
                        <div class="humidity-section">
                            <div class="humidity-img">
                                <img src="./Images/humidity.png" alt=""/>
                            </div>
                            <div class="humidity-right-section">
                                <h3>{humidity} %</h3>
                                <h3>Humidity</h3>
                            </div>
                        </div>
                        <div class="wind-section">
                            <div class="wind-img">
                                <img src="./Images/wind.png" alt="" />
                            </div>
                            <div class="wind-right-section">
                                <h3>{Math.floor(wind)} km/h</h3>
                                <h3>Wind Speed</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer/>
        </>
    )
}
export default Weather

