# MinskiZapisniciWeb

Pozicionirati se u direktorij gdje se nalazi server.js i upisati komandu `npm install`

# Direktno pokretanje
Prije pokretanja servera potrebno je u PgAdminu ili nekom drugom sql server manageru uploadati bazu podataka minskiZapisnici.sql te u datoteci data-access.js na vrhu za varijablu pool urediti podatke za prijavu na server. Server se može pokrenuti s `npm start` ili `node server.js` a zatim se aplikaciji može pristupiti na adresi **localhost:3000**.

# Docker
Moguće je i pokretanje korištenjem Dockera pozicioniranjem u /docker datoteku te pozivom `docker build -t node-app .` a zatim `docker compose up --build`. Aplikacija se sada može putelj Docker sučelja pokretati i zaustavljati na adresi **localhost:13000**.
