const petContainer = document.createElement('div')
petContainer.id = "firefox-tab-pet";

const petSprite = document.createElement('span');
petSprite.id = "pet-sprite";
petSprite.textContent = '😺';
petContainer.appendChild(petSprite);

const petSpeech = document.createElement('div');
petSpeech.id = 'pet-speech';
petSpeech.textContent = 'Hai!!';
petContainer.appendChild(petSpeech);

document.body.appendChild(petContainer);

petContainer.addEventListener('click',()=>{
    petSprite.textContent = '😸';
    petSpeech.textContent = 'Rrrr';
    setTimeout(() => {
        petSprite.textContent = '😺';
        petSpeech.textContent = 'What are we looking at?'
    }, 2000);
});

setInterval(()=>{
    const phrase = [
        "I'm boreeeeeed, can't we just sleep? ",
        "Whatcha doiiiiiing?",
        "So tired... Yawwwwnnnnnnn 💤",
        "Remember to save!!"
    ];
    const randomPhrase = phrase[Math.floor(Math.random()*phrase.length)];
    if (randomPhrase.includes("sleep")) {
        petSprite.textContent = '😾';
    } else if (randomPhrase.includes("Yawwwwnnnnnnn")) {
        petSprite.textContent = '😴💤';
    } else {
        petSprite.textContent = '😺';
    }

    petSpeech.textContent = randomPhrase;
}, 15000);

