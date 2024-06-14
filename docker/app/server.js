const express = require('express');
//const { Pool } = require('pg');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const mustacheExpress = require('mustache-express');
const dataAccess = require('./data-access');

const app = express();
app.use(fileUpload());

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine('html', mustacheExpress());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// PostgreSQL connection pool
/*const pool = new Pool({
    host: "localhost",
    database: "postgres",
    user: "postgres",
    password: "lovro2205",
    port: 5432
});*/

app.use('/skice', express.static(path.join(__dirname, 'Skice')));

// Fetch all records
app.get('/', async (req, res) => {
    try {
        const rows = await dataAccess.getAllRecords();
        //console.log("Results for getAllRecords");
        //console.log(rows);
        res.render('index', { rows: rows });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/map_details/:ID', async (req, res) => {
    const id = req.params.ID;
    if (!id) {
        return res.status(400).send('ID parameter is missing');
    }
    try {
        const rows = await dataAccess.getRecordById(id);
        if (rows.length === 0) {
            return res.status(404).send('ID not found in Database.');
        }
        //console.log("Results for getRecordById.");
        //console.log(rows);
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/records', async (req, res) => {
    try {
        const rows = await dataAccess.getAllRecords();
        //console.log("Results for getAllRecords")
        //console.log(rows);
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/osm', async (req, res) => {
    try {
        //const rows = await dataAccess.getAllRecords();
        res.render('osm');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/map', async (req, res) => {
    try {
        //const result = await dataAccess.getAllRecords();
        res.render('map');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/create', async (req, res) => {
    try {
        const rows = await dataAccess.getAllRecords();
        const form = {
            GKZona: new Set(),
            UNSektor: new Set(),
            OznakaUN: new Set(),
            Županija: new Set(),
            Općina: new Set(),
            Naselje: new Set(),
            VojskaID: new Set()
        };

        rows.forEach(row => {
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

        //console.log("Results for creating form info:");
        //console.log(form);
        res.render('create', { form: form });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/field/:ID', async (req, res) => {
    const rid = req.params.ID;
    if (!rid) {
        return res.status(400).send('ID parameter is missing');
    }

    try {
        const rows = await dataAccess.getFieldById(rid);
        //console.log(result.rows)
        const record = await dataAccess.getRecordById(rid);
        const colorCode = await dataAccess.getColor(record.TipPolja);
        //console.log(colorCode);
        //console.log("Results for getFieldById");
        //console.log(rows);
        res.render('field', { fields: rows, colorCode: colorCode});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/edit/:ID', async (req, res) => {
    try {
        const formResult = await dataAccess.getAllRecords();
        const form = {
            GKZona: new Set(),
            UNSektor: new Set(),
            OznakaUN: new Set(),
            Županija: new Set(),
            Općina: new Set(),
            Naselje: new Set(),
            VojskaID: new Set()
        };

        formResult.forEach(row => {
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

        const id = req.params.ID;
        if (!id) {
            return res.status(400).send('ID parameter is missing');
        }

        const result = await dataAccess.getRecordById(id);
        if (result.length === 0) {
            return res.status(404).send('ID not found in database');
        }
        //console.log("Results for creating form info and the record being edited:");
        //console.log(form, result);
        res.render('edit', { form: form, details: result });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/details/:ID', async (req, res) => {
    const id = req.params.ID;
    if (!id) {
        return res.status(400).send('ID parameter is missing');
    }

    try {
        const rows = await dataAccess.getRecordById(id);
        if (rows.length === 0) {
            return res.status(404).send('ID not found in Database.');
        }
        res.render('details', { details: rows });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/create', async (req, res) => {
    const formData = req.body;
    const { ID, GKZona, GKN, GKE, UNSektor, OznakaUN, Oznaka, Zupanija, Opcina, Naselje, VojskaID, Datum, POM, PPM, Ostala, Provjere, TipPolja } = formData;

    // Format date
    const dateParts = Datum.split("-");
    const formattedDate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
    
    const imageFile = req.files && req.files.image ? req.files.image : null;

    try {
        if (!(await dataAccess.checkRecord(ID))){
            console.log(`Record with the id ${ID} already exists.`)
            return res.status(400).json({ message: 'ID already exists in the database. Please choose a new ID.' });
        }

        await dataAccess.insertRecord({ ID, GKZona, GKN, GKE, UNSektor, OznakaUN, Oznaka, Zupanija, Opcina, Naselje, VojskaID, Datum: formattedDate, POM, PPM, Ostala, Provjere, TipPolja });
        if (imageFile && imageFile.data) {
            const buffer = Buffer.from(imageFile.data, 'base64');
            const imagePath = path.join(__dirname, 'Skice', `${ID}.png`);
            fs.writeFile(imagePath, buffer, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Internal Server Error.');
                }
                console.log('Image saved successfully:', imagePath);
                return res.status(200).json({ message: "Data inserted successfully" });
            });
        } else {
            console.log('No image found within the request.');
            return res.status(200).json({ message: "Data inserted successfully, NO IMAGE" });
        }
    } catch(err){
        console.error(err.message);
        res.status(500).send(err.message);
    }
});
app.post('/field', async (req, res) => {
    const { RecordID, Vrhovi, Operacija, Opis, Color } = req.body;

    try {
        const insertedID = await dataAccess.insertField({ RecordID, Vrhovi, Operacija, Opis, Color });
        //const insertedID = result.rows[0].id;
        console.log('New field inserted successfully.');
        //console.log("Returning ID of inserted field:")
        //console.log(insertedID);
        return res.status(200).json({ message: "Polje uspješno uneseno.", insertedID: insertedID });
    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error.');
    }
});

app.delete('/delete/:id', async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).send('ID parameter is missing');
    }
    try {
        await dataAccess.deleteRecord(id)
        res.json({ message: 'Record deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});

app.delete('/field', async (req, res) => {
    const { ID } = req.body;

    try {
        await dataAccess.deleteField(ID)
        console.log('Polje izbrisano.');
        return res.status(200).json({ message: 'Polje uspješno izbrisano.' });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Internal Server Error');
    }
});

app.post('/fieldEdit', async (req, res) => {
    const { ID, Operacija, Opis, Color } = req.body;
    //console.log(ID);
    const query = `UPDATE "Polja" 
                   SET "Operacija" = $1, "Opis" = $2, "Color" = $3 
                   WHERE "ID" = $4`;
    const values = [Operacija, Opis, Color, ID];

    try {
        await dataAccess.updateField({ ID, Operacija, Opis, Color });
        console.log('Update on field successful.');
        return res.status(200).json({ message: "Polje uspješno uređeno." });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Internal Server Error');
    }
});

app.post('/update', async (req, res) => {
    const formData = req.body;
    const { ID, GKZona, GKN, GKE, UNSektor, OznakaUN, Oznaka, Zupanija, Opcina, Naselje, VojskaID, Datum, POM, PPM, Ostala, Provjere, TipPolja } = formData;
    const dateParts = Datum.split("-");
    const formattedDate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
    const imageFile = req.files && req.files.image ? req.files.image : null;

    try {
        

        if (!(dataAccess.checkRecord(ID))) {
            return res.status(400).json({ message: 'Nemoguće pronaći zapisnik u bazi' });
        }

        await dataAccess.updateRecord(ID, {GKZona, GKN, GKE, UNSektor, OznakaUN, Oznaka, Zupanija, Opcina, Naselje, VojskaID, Datum: formattedDate, POM, PPM, Ostala, Provjere, TipPolja })
        console.log("Update successful.");

        // Check if there is an image
        if (imageFile && imageFile.data) {
            const buffer = Buffer.from(imageFile.data, 'base64');
            const imagePath = path.join(__dirname, 'Skice', `${ID}.png`);
            fs.writeFile(imagePath, buffer, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Internal Server Error.');
                }
                console.log('Image saved successfully:', imagePath);
                return res.status(200).json({ message: "Data updated successfully" });
            });
        } else {
            console.log('No image found within the request.');
            return res.status(200).json({ message: "Data updated successfully, Image unchanged." });
        }
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Internal Server Error');
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
