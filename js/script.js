let weather = {

    maxDifDay: document.querySelector('.taskOne .day'),
    temp: document.querySelector('.taskOne .temp'),

    maxDayLight: document.querySelector('.taskTwo .day'),
    maxDayLightDuration: document.querySelector('.taskTwo .temp'),

    apiKey: "fd33659fd8e8f44e71edf5d3bfd618c2",
    coordinates: [54.7,32.04],


    async getWeather () {
        try {
            let response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${this.coordinates[0]}&lon=${this.coordinates[1]}&units=metric&exclude=current,minutely,hourly&appid=${this.apiKey}`);
            let data = await response.json();
            return data
        } catch(error) {
            alert(error);
        }
    },

    getForecast() {
        this.getWeather().then(data => {
            const {daily} = data
            console.log(daily)
            const dt = daily.map(el => el.dt)

            const tempDifference = daily.map(el => Math.abs(el.feels_like.night - el.temp.night))
            const minTempDifference = Math.min.apply(null, tempDifference)
            const dtMinTempDifference = dt[tempDifference.indexOf(minTempDifference)]


            const dayLightDuration = daily.slice(0,5)
                                          .map(el => el.sunset - el.sunrise)
            const maxDayLight = Math.max.apply(null, dayLightDuration)
            const dtMaxDayLight = dt[dayLightDuration.indexOf(maxDayLight)]

            this.getView(minTempDifference,dtMinTempDifference,maxDayLight,dtMaxDayLight)

        }).catch()
    },



    getView(minTempDifference,dtMinTempDifference,maxDayLight,dtMaxDayLight) {
        const minDate = new Date(dtMinTempDifference * 1000).toLocaleDateString("ru-RU")
        const maxDate = new Date(dtMaxDayLight * 1000).toLocaleDateString("ru-RU")

        this.temp.textContent = `${Math.round(minTempDifference)}\xB0C`
        this.maxDifDay.textContent = minDate
        this.maxDayLight.textContent = maxDate
        this.maxDayLightDuration.textContent = this.unixTohms(maxDayLight)
    },

    unixTohms(maxDayLight) {
        const h = Math.floor(maxDayLight / 3600);
        const m = Math.floor(maxDayLight % 3600 / 60);
        const s = Math.floor(maxDayLight % 3600 % 60);
        const hDisplay = h > 0 ? h + (h === 1 ? " час, " : " часов, ") : "";
        const mDisplay = m > 0 ? m + (m === 1 ? " минута, " : " минут, ") : "";
        const sDisplay = s > 0 ? s + (s === 1 ? " секунда" : " секунд") : "";
        const res = hDisplay + mDisplay + sDisplay
        return res
    }


}

weather.getForecast()




