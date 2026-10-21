async function LoadExtensionData() {
    const list = document.getElementById("feed");
    const weatherBox = document.getElementById("weather-box");

    try {

        const [nyhedResponse, vejrResponse] = await Promise.all([
            fetch("https://www.dr.dk/nyheder/service/feeds/senestenyt"),
            fetch("https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min,daylight_duration,sunshine_duration,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours&forecast_days=3&models=dmi_seamless")
        ]);

        if (!nyhedResponse.ok || !vejrResponse.ok) {
            throw new Error(`Netværksfejl! DR: ${nyhedResponse.status}, Vejr: ${vejrResponse.status}`);
        }


const vejrData = await vejrResponse.json();

const maxTemp = vejrData.daily.temperature_2m_max[0];
const minTemp = vejrData.daily.temperature_2m_min[0];
const nedboerSum = vejrData.daily.precipitation_sum[0];
const regnSum = vejrData.daily.rain_sum[0];
const bygerSum = vejrData.daily.showers_sum[0];
const sneSum = vejrData.daily.snowfall_sum[0];
const nedboerTimer = vejrData.daily.precipitation_hours[0];


const solopgang = vejrData.daily.sunrise[0].split("T")[1];
const solnedgang = vejrData.daily.sunset[0].split("T")[1];


const dagslysTimer = (vejrData.daily.daylight_duration[0] / 3600).toFixed(1);
const solskinTimer = (vejrData.daily.sunshine_duration[0] / 3600).toFixed(1);


const nuvaerendeTime = new Date().getHours();
const nuTemp = vejrData.hourly.temperature_2m[nuvaerendeTime] || maxTemp;

if (weatherBox) {
    weatherBox.innerHTML = `
        <div style="font-weight: bold; font-size: 15px; margin-bottom: 6px; border-bottom: 1px solid #ccc; padding-bottom: 3px;">
             Odense: ${nuTemp}°C
        </div>
        <div style="font-size: 12px; color: #333; line-height: 1.5;">
             <b>Temperatur:</b> Høj ${maxTemp}°C / Lav ${minTemp}°C<br>
             <b>Sol:</b> Op kl. ${solopgang} / Ned kl. ${solnedgang}<br>
             <b>Dagslys:</b> ${dagslysTimer} t (Heraf solskin: ${solskinTimer} t)<br>
             <b>Nedbør i dag:</b> ${nedboerSum} mm (${nedboerTimer} timer)<br>
            <span style="font-size: 11px; color: #666;">
                (Regn: ${regnSum}mm | Byger: ${bygerSum}mm | Sne: ${sneSum}cm)
            </span>
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
