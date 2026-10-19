function getUgeNummer() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function tjekans(){
    const iDag = new Date();
    const ugeDage = iDag.getDay();
    const uge=getUgeNummer();



    if (ugeDage>=1 || ugeDage>=2){
        chrome.storage.local.get(['sendtans'], (result)=>{
            const gemtUge = result.sendtans;
            if (!gemtUge || parseInt(gemtUge)!==uge){
                chrome.notifications.create("Husk-ans",{
                    type:"basic",
                    iconUrl:"icons/icon-48.png",
                    title:"Husk din ansøgning!",
                    message:"Det er en ny uge, husk at sende en ansøgning!"
                })
            }
        })
    }

    

    if (ugeDage>=4 || ugeDage>=6){
        chrome.storage.local.get(['sendtans'], (result)=>{
            const gemtUge = result.sendtans;
            if (!gemtUge || parseInt(gemtUge)!==uge){
                chrome.notifications.create("Husk-ans",{
                    type:"basic",
                    iconUrl:"icons/icon-48.png",
                    title:"Husk din ansøgning!",
                    message:"Det er sidst på ugen, husk at sende en ansøgning!"
                })
            }
        })
    }
}
chrome.runtime.onStartup.addListener(tjekans);
chrome.runtime.onInstalled.addListener(tjekans);

chrome.alarms.create("TjekAnsAlarm",{
    periodInMinutes:300
});
chrome.alarms.onAlarm.addListener((alarm)=>{
    if (alarm.name === "TjekAnsAlarm"){
        tjekans();
    }
});
