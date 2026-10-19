function getUgeNummer() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

const checkbox=document.getElementById('cb1');
const statusTekst=document.getElementById('status-tekst')
const undoKnap=document.getElementById('undo')
const uge=getUgeNummer();

async function startApp() {
    const data = await chrome.storage.local.get('sendtans');
    const gemtUge = data.sendtans;

if (gemtUge && parseInt(gemtUge)=== uge){
    checkbox.checked = true;
    checkbox.disabled = true;
    statusTekst.textContent = "Godt gået med at sende en ansøgning. Jeg er så stolt af dig!"
    undoKnap.style.display = "block"
} else{
    checkbox.checked=false;
    checkbox.disabled=false;
    statusTekst.textContent="";
    undoKnap.style.display="none";
}
} 

startApp();

checkbox.addEventListener('change', async function() {
    if (checkbox.checked){
        await chrome.storage.local.set({ 'sendtans': uge });
        statusTekst.textContent = "Godt gået med at sende en ansøgning. Jeg er så stolt af dig!";
        checkbox.disabled = true;
        undoKnap.style.display = "block"
    }
})

undoKnap.addEventListener('click',async function(){
    await chrome.storage.local.remove('sendtans');
    checkbox.checked = false;
    checkbox.disabled = false;
    statusTekst.textContent = "";
    undoKnap.style.display = "none";
})

if (ugeDage >=1 && ugeDage<=2){
        chrome.notifications.create("Husk-ans",{
            type:"basic",
            iconUrl:"icons/icon-48.png",
            title:"Husk din ansøgning!",
            message:"Det er en ny uge, husk at sende en ansøgning!"
        })
    }