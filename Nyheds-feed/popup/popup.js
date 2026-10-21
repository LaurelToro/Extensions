async function LoadExtensionData() {
    const list = document.getElementById("feed");
    const weatherBox = document.getElementById("weather-box");

    try {

        const [nyhedResponse, vejrResponse] = await Promise.all([
            fetch("https://www.dr.dk/nyheder/service/feeds/senestenyt"),
            fetch("https://api.open-meteo.com/v1/forecast?latitude=55.39594&longitude=10.38831&hourly=temperature_2m,rain,snowfall&daily=sunrise,sunset,daylight_duration,sunshine_duration,precipitation_sum&forecast_days=3&models=dmi_seamless")
        ]);

        if (!nyhedResponse.ok || !vejrResponse.ok) {
            throw new Error(`Netværksfejl! DR: ${nyhedResponse.status}, Vejr: ${vejrResponse.status}`);
        }


const vejrData = await vejrResponse.json();
        const TimeNu = new Date().getHours();

        //TIME data, ikke dagligt
        const temp = vejrData.hourly.temperature_2m[TimeNu];
        const regn = vejrData.hourly.rain[TimeNu];
        const sne = vejrData.hourly.snowfall[TimeNu];
        //Samlede regn og sne for dagen.
        const pers = vejrData.daily.precipitation_sum[0];
        //Solopgang og nedgang plus timer med sollys
        const solopgang = vejrData.daily.sunrise[0].split("T")[1];
        const solnedgang = vejrData.daily.sunset[0].split("T")[1];
        const dagslysTimer = (vejrData.daily.daylight_duration[0] / 3600).toFixed(1);
        const solskinTimer = (vejrData.daily.sunshine_duration[0] / 3600).toFixed(1);

if (weatherBox) {
    weatherBox.innerHTML = `
        <div class="vejr-container">
            <div class="vejr-title">
                Odense lige nu: ${temp}°C
            </div>
            <div class="vejr-details">
                <b>Regn lige nu:</b> ${regn} mm<br>
                ${sne > 0 ? `<b>Sne lige nu:</b> \${sne} cm<br>` : ''}
                <b>Samlet nedbør i dag:</b> ${pers} mm<br>
                <b>Solopgang:</b> ${solopgang}<br>
                <b>Solnedgang:</b> ${solnedgang}<br>
                <b>Dagslys:</b> ${dagslysTimer} t (Solskin: ${solskinTimer} t)
            </div>
        </div>
    `;
}


        const rssText = await nyhedResponse.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(rssText, "text/xml");
        const items = xmlDoc.getElementsByTagName("item");

        if (list) list.innerHTML = "";

        for (let i = 0; i < Math.min(items.length, 2); i++) {
            const titel = items[i].getElementsByTagName("title")[0].textContent;
            const link = items[i].getElementsByTagName("link")[0].textContent;

            const li = document.createElement("li");
            const a = document.createElement("a");

            a.href = link;
            a.target = "_blank";
            a.textContent = titel;

            li.appendChild(a);
            if (list) list.appendChild(li);
        }

    } catch (error) {
        console.error('Fejl under hentning af data:', error);
        if (weatherBox) weatherBox.textContent = "Kunne ikke hente vejr.";
        if (list) list.textContent = "Kunne ikke hente nyheder.";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    LoadExtensionData();
});