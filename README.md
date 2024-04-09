# MinskiZapisniciWeb

Za pokretanje se u command lineu treba pozicionirati u glavni direktorij (gdje se nalazi server.js) i pozvati ga naredbom `node server.js`. Nakon toga moguće je otvoriti početnu stranicu index.html.

Ako se u kojem slučaju podaci ne prikazuju, pomoću inspekt elementa provjeriti da li u konzoli postoji greška: "Access to fetch at 'http://localhost:3000/' from origin 'null' has been blocked by CORS policy...". Ako ta greška postoji moguće je rješenje napraviti novi prečac do web preglednika (npr. novi Google Chrome shortcut, otići tamo gdje je instaliran i napraviti novi shortcut do chrome.exe). 

Nakon što je napravljen otvoriti properties tab i u polje gdje piše target nakon puta prečaca koji izgleda kao: 
` "C:\Program Files\Google\Chrome\Application\chrome.exe"; `
dodati sljedeće 
` "--disable-web-security --disable-gpu --user-data-dir=%LOCALAPPDATA%\Google\chromeTemp" ` 

Cijelo target polje onda izgleda nešto kao ovo(uključujući i navodne znakove): 
` "C:\Program Files\Google\Chrome\Application\chrome.exe" --disable-web-security --disable-gpu --user-data-dir=%LOCALAPPDATA%\Google\chromeTemp`
