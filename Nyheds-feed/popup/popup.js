async function VejrBoks() {
    const weatherBox = document.getElementById("weather-box");
    if (!weatherBox) return;

    try {
        const vejrResponse = await fetch("https://api.open-meteo.com/v1/forecast?latitude=55.39594&longitude=10.38831&hourly=temperature_2m,rain,snowfall&daily=sunrise,sunset,daylight_duration,sunshine_duration,precipitation_sum&timezone=Europe%2FBerlin&forecast_days=3&models=dmi_seamless");

        if (!vejrResponse.ok) {
            throw new Error(`Vejr status: ${vejrResponse.status}`);
        }

        const vejrData = await vejrResponse.json();
        const TimeNu = new Date().getHours();

        const temp = vejrData.hourly.temperature_2m[TimeNu];
        const regn = vejrData.hourly.rain[TimeNu];
        const sne = vejrData.hourly.snowfall[TimeNu];
        
        const pers = vejrData.daily.precipitation_sum[0];
        
        const solopgang = vejrData.daily.sunrise[0].split("T")[1];
        const solnedgang = vejrData.daily.sunset[0].split("T")[1];
        const dagslysTimer = (vejrData.daily.daylight_duration[0] / 3600).toFixed(1);
        const solskinTimer = (vejrData.daily.sunshine_duration[0] / 3600).toFixed(1);

        // RETTET: Fjernet backslash fra \${sne}
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
    } catch (error) {
        console.error('Fejl under hentning af vejr:', error);
        weatherBox.textContent = "Kunne ikke hente vejr.";
    }
}

async function Nyheder() {
    const list = document.getElementById("feed");
    if (!list) return;

    try {
        // Vi beder background.js om at hente RSS-feedet for os for at omgå CORS helt
        const response = await browser.runtime.sendMessage({ action: "fetchNews" });

        if (!response || !response.success) {
            throw new Error(response ? response.error : "Ingen kontakt til baggrundsscriptet");
        }

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.data, "text/xml");
        const items = xmlDoc.getElementsByTagName("item");

        if (!items || items.length === 0) {
            throw new Error("Ingen nyhedsartikler fundet.");
        }

        list.innerHTML = "";

        // Loop igennem de 2 nyeste artikler
        for (let i = 0; i < Math.min(items.length, 2); i++) {
            const item = items[i];
            
            const titles = item.getElementsByTagName("title");
            const links = item.getElementsByTagName("link");

            if (titles.length === 0 || links.length === 0) continue;

            const titel = titles[0].textContent;
            const link = links[0].textContent;

            const li = document.createElement("li");
            const a = document.createElement("a");

            a.href = link;
            a.textContent = titel;
            a.style.cursor = "pointer";

            // Tvinger Firefox til at åbne fanebladet korrekt i browseren
            a.addEventListener('click', (e) => {
                e.preventDefault();
                browser.tabs.create({ url: link });
            });

            li.appendChild(a);
            list.appendChild(li);
        }
    } catch (error) {
        console.error('Kritiske detaljer fra Nyheder-fejl:', error.message);
        list.textContent = `Kunne ikke hente nyheder: ${error.message}`;
    }
}


document.addEventListener("DOMContentLoaded", () => {
    VejrBoks();
    Nyheder();
});
