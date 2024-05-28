const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bodyParser=require('body-parser');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const mustacheExpress = require('mustache-express');

const app = express();
app.use(fileUpload());

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
/*app.use((req, res, next) => {
  if (req.url.endsWith('.css')) {
    res.header('Content-Type', 'text/css');
  }
  next();
});*/

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.engine('html', mustacheExpress());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
const db = new sqlite3.Database('zapisnici.db');

app.use('/skice', express.static(path.join(__dirname, 'Skice')));
//Svi zapisnici
/*db.all('SELECT * FROM Zapisnici', (err, rows) =>{
    res.render('indexM', {rows: rows});
});*/

app.get('/', (req, res) =>{
    //console.log("Request recieved")
    db.all('SELECT * FROM Zapisnici', (err, rows) =>{
        if (err){
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        } else{
            
            res.render('index', {rows: rows});
        }
    });
});

app.get('/map_details/:ID', (req, res) => {
    
    const id = req.params.ID;
    //console.log("ID: ", id);
    if (!id){
        return res.status(400).send('ID parameter is missing');
    }

    db.get('SELECT * FROM Zapisnici WHERE ID = ?', [id], (err, row) =>{
        if (err){
            console.error(err.message);
            return res.status(500).send('Internal Server Error');

        }
        if(!row){
            return res.status(404).send('ID not found in Database.');
        }
        res.json(row);
    });
});
app.get('/records', (req, res) =>{
    db.all('SELECT * FROM Zapisnici', (err, rows) =>{
        if (err){
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        } else{
            res.json(rows);
        }
    });
});
app.get('/osm', (req, res) =>{
    db.all('SELECT ID, GKN, GKE, Naselje FROM Zapisnici', (err, rows) =>{
        if (err){
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        } else{
            //console.log(rows);
            res.render('osm', {rows: rows});
        }
    });
});

app.get('/map', (req, res) =>{
    db.all('SELECT ID, GKN, GKE, Naselje FROM Zapisnici', (err, rows) =>{
        if (err){
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        } else{
            //console.log(rows);
            res.render('map', {rows: rows});
        }
    });
});

app.get('/create', (req, res) => {
    db.all('SELECT DISTINCT GKZona, UNSektor, OznakaUN, Županija, Općina, Naselje, VojskaID FROM Zapisnici', (err, rows) => {
        if (err){
            res.status(500).send('Internal Server Error');
        } else{
            //console.log("yo");
            const form = {
                GKZona: new Set(),
                UNSektor: new Set(),
                OznakaUN: new Set(),
                Županija: new Set(),
                Općina: new Set(),
                Naselje: new Set(),
                VojskaID: new Set()
            };

            rows.forEach(row =>{
                form.GKZona.add(row.GKZona);
                form.UNSektor.add(row.UNSektor);
                form.OznakaUN.add(row.OznakaUN);
                form.Županija.add(row.Županija);
                form.Općina.add(row.Općina);
                form.Naselje.add(row.Naselje);
                form.VojskaID.add(row.VojskaID);
            });

            form.GKZona = Array.from(form.GKZona);
            form.UNSektor = Array.from(form.UNSektor);
            form.OznakaUN = Array.from(form.OznakaUN);
            form.Županija = Array.from(form.Županija);
            form.Općina = Array.from(form.Općina);
            form.Naselje = Array.from(form.Naselje);
            form.VojskaID = Array.from(form.VojskaID);
            //console.log(form.GKZona);
            res.render('create', {form: form})
        }
    });
});

app.get('/field/:ID', (req, res) =>{
    const rid = req.params.ID;
    console.log(rid);
    if (!rid){
        return res.status(400).send('ID parameter is missing');
    }

    db.all('SELECT * FROM Polja WHERE RecordID = ?', [rid], (err, rows) => {
    //db.all('SELECT * FROM Polja', (err, rows) => {
       if (err){
            console.error(err.message);
            return res.status(500).send('Internal Server Error');

        } else {
            console.log(rows);
            res.render('field', {fields: rows})
        } 
    });
});
app.get('/edit/:ID', (req, res) => {
    db.all('SELECT DISTINCT GKZona, UNSektor, OznakaUN, Županija, Općina, Naselje, VojskaID FROM Zapisnici', (err, rows) => {
        if (err){
            res.status(500).send('Internal Server Error');
        } else{
            //console.log("yo");
            const form = {
                GKZona: new Set(),
                UNSektor: new Set(),
                OznakaUN: new Set(),
                Županija: new Set(),
                Općina: new Set(),
                Naselje: new Set(),
                VojskaID: new Set()
            };

            rows.forEach(row =>{
                form.GKZona.add(row.GKZona);
                form.UNSektor.add(row.UNSektor);
                form.OznakaUN.add(row.OznakaUN);
                form.Županija.add(row.Županija);
                form.Općina.add(row.Općina);
                form.Naselje.add(row.Naselje);
                form.VojskaID.add(row.VojskaID);
            });

            form.GKZona = Array.from(form.GKZona);
            form.UNSektor = Array.from(form.UNSektor);
            form.OznakaUN = Array.from(form.OznakaUN);
            form.Županija = Array.from(form.Županija);
            form.Općina = Array.from(form.Općina);
            form.Naselje = Array.from(form.Naselje);
            form.VojskaID = Array.from(form.VojskaID);
            //console.log(form.GKZona);

            const id = req.params.ID;

            if (!id){
                return res.status(400).send('ID parameter is missing');
            }

            db.get('SELECT * FROM Zapisnici WHERE ID = ?', [id], (err, row) =>{
                if (err){
                    console.error(err.message);
                    return res.status(500).send('Internal server error');
                }
                if (!row){
                    return res.status(404).send('Id not found in database');
                }
                else{

                }
                res.render('edit', {form: form, details: row})
            });
            
        }
    });
});
//Detalji o zapisniku
app.get('/details/:ID', (req, res) => {
    
	const id = req.params.ID;
    //console.log("ID: ", id);
	if (!id){
		return res.status(400).send('ID parameter is missing');
	}

	db.get('SELECT * FROM Zapisnici WHERE ID = ?', [id], (err, row) =>{
		if (err){
			console.error(err.message);
			return res.status(500).send('Internal Server Error');

		}
		if(!row){
			return res.status(404).send('ID not found in Database.');
		}
		res.render('details', {details: row});
	});
});

//Upload novog zapisnika u baz
app.post('/create', (req, res) => {
    const formData = req.body;
    //console.log(formData);
    const { ID, GKZona, GKN, GKE, UNSektor, OznakaUN, Oznaka, Zupanija, Opcina, Naselje, VojskaID, Datum, POM, PPM, Ostala, Provjere, TipPolja } = formData;
    
    //formatiraj datum
    const dateParts = Datum.split("-");
    const formattedDate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
    
    const imageFile = req.files && req.files.image ? req.files.image : null;

    // Check if ID already exists in the database
    db.get('SELECT * FROM Zapisnici WHERE ID = ?', [ID], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Internal Server Error');
        }
        if (row) {
            // Provjeri da zapis vec nije u bazi
            return res.status(400).json({ message: 'ID already exists in the database. Please choose a new ID.' });
        } else {
            
            db.run(`INSERT INTO Zapisnici (ID, GKZona, GKN, GKE, UNSektor, OznakaUN, Oznaka, Županija, Općina, Naselje, VojskaID, Datum, POM, PPM, Ostala, Provjere, TipPolja)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [ID, GKZona, GKN, GKE, UNSektor, OznakaUN, Oznaka, Zupanija, Opcina, Naselje, VojskaID, formattedDate, POM, PPM, Ostala, Provjere, TipPolja],
                function (err) {
                    if (err) {
                        console.error(err.message);
                        return res.status(500).send('Internal Server Error');
                    } else {
                        console.log("Form data inserted.");

                        //Provjeri postoji li slika
                        if (imageFile && imageFile.data) {
                            const buffer = Buffer.from(imageFile.data, 'base64');
                            const imagePath = path.join(__dirname, 'Skice', `${ID}.png`);
                            fs.writeFile(imagePath, buffer, (err) => {
                                if (err) {
                                    console.error(err);
                                    return res.status(500).send('Internal Server Error.');
                                }
                                console.log('Image saved successfully:', imagePath);
                                return res.status(200).json({ message: "Data and IMAGE inserted successfully" });
                            });
                        } else {
                            console.log('No image found within the request.');
                            return res.status(200).json({ message: "Data inserted successfully, NO IMAGE" });
                        }
                    }
                });
        }
    });
});

app.post('/field', (req, res) => {
    
    const {RecordID, Vrhovi, Operacija, Opis, Color} = req.body;
    db.run(`INSERT INTO POLJA (RecordID, Vrhovi, Operacija, Opis, Color) VALUES (?, ?, ?, ?, ?)`, [RecordID, Vrhovi, Operacija, Opis, Color],
        function(err){
            if(err){
                console.error(err);
                return res.status(500).send('Internal Server Error.');
            }
            const insertedID = this.lastID;
            console.log('New field inserted successfully.')
            return res.status(200).json({message:"Polje uspješno uneseno.", insertedID: insertedID})
        });
    
});
//Makni zapis iz baze podataka
app.delete('/delete/:id', (req, res) => {
	const id = req.params.id;
	const imagePath = path.join(__dirname, 'Skice', `${id}.png`);

	fs.unlink(imagePath, (err) =>{
		if (err && err.code !== 'ENOENT') { // ENOENT = ne postoji
			console.error(err);
			return res.status(500).send('Internat server Error deleting image');
		}
	});

	db.run('DELETE FROM Zapisnici WHERE ID = ?', [id], function (err){
		if(err){
			console.error(err.message);
			return res.status(500).send('Internal server Error');	
		}
		console.log(`Zapisnik ${id} uklonjen iz baze podataka.`);
		res.status(200).send('Record deleted successfully.');
	});
});

app.delete('/field', (req, res) => {
    const {ID} = req.body;
    db.run('DELETE FROM Polja WHERE ID = ?', [ID], function (err){
        if(err){
            console.error(err.message);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Polje izbrisano.');
        res.status(200).json({message: 'Polje uspješno izbrisano.'});
    });
});
app.post('/fieldEdit', (req, res) => {

    const {ID, Operacija, Opis, Color} = req.body;

    db.run(`UPDATE Polja 
        SET Operacija=?, Opis=?, Color=?
        WHERE ID=?`, [Operacija, Opis, Color, ID], function(err) {
            if (err){
                console.error(err.message);
                return res.status(500).send('Internal Server Error');
            } else {
                console.log('Update on field successful.');
                return res.status(200).json({message:"Polje uspješno uređeno."});
            }
        });
});
app.post('/update', (req, res) => {
	//console.log("Legooo")
    const formData = req.body;
    console.log(formData);
    const { ID, GKZona, GKN, GKE, UNSektor, OznakaUN, Oznaka, Zupanija, Opcina, Naselje, VojskaID, Datum, POM, PPM, Ostala, Provjere, TipPolja } = formData;
    console.log(ID)
    //formatiraj datum
    const dateParts = Datum.split("-");
    const formattedDate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;    
    const imageFile = req.files && req.files.image ? req.files.image : null;

    // Check if ID already exists in the database
    db.get('SELECT * FROM Zapisnici WHERE ID = ?', [ID], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Internal Server Error');
        }
        if (!row) {
            // Provjeri da zapis vec nije u bazi
            return res.status(400).json({ message: 'Zapisnik ne postoji u bazi' });
        
        } else {            
            db.run(`UPDATE Zapisnici 
            		SET GKZona=?, GKN=?, GKE=?, UNSektor=?, OznakaUN=?, Oznaka=?, Županija=?, Općina=?, Naselje=?, VojskaID=?, Datum=?, POM=?, PPM=?, Ostala=?, Provjere=?, TipPolja=?
            		WHERE ID=?`,
                [GKZona, GKN, GKE, UNSektor, OznakaUN, Oznaka, Zupanija, Opcina, Naselje, VojskaID, formattedDate, POM, PPM, Ostala, Provjere, TipPolja, ID],
                function (err) {
                    if (err) {
                        console.error(err.message);
                        return res.status(500).send('Internal Server Error');
                    } else {
                        console.log("Update successful."); 

                        //Provjeri postoji li slika
                        if (imageFile && imageFile.data) {
                            const buffer = Buffer.from(imageFile.data, 'base64');
                            const imagePath = path.join(__dirname, 'Skice', `${ID}.png`);
                            fs.writeFile(imagePath, buffer, (err) => {
                                if (err) {
                                    console.error(err);
                                    return res.status(500).send('Internal Server Error.');
                                }
                                console.log('Image saved successfully:', imagePath);
                                return res.status(200).json({ message: "Data and IMAGE updated successfully" });
                            });
                        } else {
                            console.log('No image found within the request.');
                            return res.status(200).json({ message: "Data updated successfully, Image unchanged." });
                        }
     
                    }
                });
        }
    });
});


const port = 3000


app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});




function editPolygon(ID){
    
}