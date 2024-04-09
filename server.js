const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bodyParser=require('body-parser');
const fs = require('fs');
const fileUpload = require('express-fileupload');

const app = express();
app.use(fileUpload());


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
const db = new sqlite3.Database('zapisnici.db');

app.use('/skice', express.static(path.join(__dirname, 'Skice')));
//Svi zapisnici
app.get('/', (req, res) =>{
	db.all('SELECT * FROM Zapisnici', (err, rows) =>{
		if (err){
			console.error(err.message);
			res.status(500).send('Internal Server Error');
		} else{
			res.json(rows);
		}
	});
});

//Detalji o zapisniku
app.get('/details', (req, res) => {
	const id = req.query.id;
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