const { Pool } = require('pg');

// PostgreSQL connection pool
const pool = new Pool({
    host: "db",
    database: "postgres",
    user: "postgres",
    password: "lovro2205",
    port: 5432
});

async function getAllRecords() {
    try {
        const result = await pool.query('SELECT * FROM "Zapisnici"');
        return result.rows;
    } catch (err) {
        throw new Error(err.message);
    }
}

async function getRecordById(id) {
    try {
        const result = await pool.query('SELECT * FROM "Zapisnici" WHERE "ID" = $1', [id]);
        if (result.rows.length === 0) {
            throw new Error('ID not found in Database.');
        }
        return result.rows[0];
    } catch (err) {
        throw new Error(err.message);
    }
}

async function checkRecord(id) {
    try {
        const result = await pool.query('SELECT * FROM "Zapisnici" WHERE "ID" = $1', [id]);
        if (result.rows.length === 0) {
            return true;
        }
        return false;
    } catch (err) {
        throw new Error(err.message);
    }
}


async function insertRecord(data) {
    const { ID, GKZona, GKN, GKE, UNSektor, OznakaUN, Oznaka, Zupanija, Opcina, Naselje, VojskaID, Datum, POM, PPM, Ostala, Provjere, TipPolja } = data;

    //const dateParts = Datum.split("-");
    //const formattedDate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;

    try {
        const checkQuery = 'SELECT * FROM "Zapisnici" WHERE "ID" = $1';
        const checkResult = await pool.query(checkQuery, [ID]);

        if (checkResult.rowCount > 0) {
            throw new Error('ID already exists in the database. Please choose a new ID.');
        }

        const insertQuery = `INSERT INTO "Zapisnici" ("ID", "GKZona", "GKN", "GKE", "UNSektor", "OznakaUN", "Oznaka", "Županija", "Općina", "Naselje", "VojskaID", "Datum", "POM", "PPM", "Ostala", "Provjere", "TipPolja")
                             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`;
        const insertValues = [ID, GKZona, GKN, GKE, UNSektor, OznakaUN, Oznaka, Zupanija, Opcina, Naselje, VojskaID, Datum, POM, PPM, Ostala, Provjere, TipPolja];

        await pool.query(insertQuery, insertValues);
    } catch (err) {
        throw new Error(err.message);
    }
}

async function updateRecord(id, data) {
    const { GKZona, GKN, GKE, UNSektor, OznakaUN, Oznaka, Zupanija, Općina, Naselje, VojskaID, Datum, POM, PPM, Ostala, Provjere, TipPolja } = data;

    //const dateParts = Datum.split("-");
    //const formattedDate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;

    try {
        await pool.query(`UPDATE "Zapisnici"
                          SET "GKZona" = $1, "GKN" = $2, "GKE" = $3, "UNSektor" = $4, "OznakaUN" = $5, "Oznaka" = $6, "Županija" = $7, "Općina" = $8, "Naselje" = $9, "VojskaID" = $10, "Datum" = $11, "POM" = $12, "PPM" = $13, "Ostala" = $14, "Provjere" = $15, "TipPolja" = $16
                          WHERE "ID" = $17`,
            [GKZona, GKN, GKE, UNSektor, OznakaUN, Oznaka, Zupanija, Općina, Naselje, VojskaID, Datum, POM, PPM, Ostala, Provjere, TipPolja, id]);
    } catch (err) {
        throw new Error(err.message);
    }
}

async function deleteRecord(id) {
    try {
        const result = await pool.query('DELETE FROM "Zapisnici" WHERE "ID" = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            throw new Error('ID not found in Database.');
        }
    } catch (err) {
        throw new Error(err.message);
    }
}

async function getFieldById(rid) {
    try {
        const result = await pool.query('SELECT * FROM "Polja" WHERE "RecordID" = $1', [rid]);
        return result.rows;
    } catch (err) {
        throw new Error(err.message);
    }
}

async function insertField(data) {
    const { RecordID, Vrhovi, Operacija, Opis, Color } = data;

    const query = `INSERT INTO "Polja" ("RecordID", "Vrhovi", "Operacija", "Opis", "Color") VALUES ($1, $2, $3, $4, $5) RETURNING "ID"`;
    const values = [RecordID, Vrhovi, Operacija, Opis, Color];

    try {
        const result = await pool.query(query, values);
        return result.rows[0].ID;
    } catch (err) {
        throw new Error(err.message);
    }
}

async function updateField(data) {
    const { ID, Operacija, Opis, Color } = data;

    const query = `UPDATE "Polja" 
                   SET "Operacija" = $1, "Opis" = $2, "Color" = $3 
                   WHERE "ID" = $4`;
    const values = [Operacija, Opis, Color, ID];

    try {
        await pool.query(query, values);
    } catch (err) {
        throw new Error(err.message);
    }
}

async function deleteField(id) {
    const query = 'DELETE FROM "Polja" WHERE "ID" = $1';
    const values = [id];

    try {
        await pool.query(query, values);
    } catch (err) {
        throw new Error(err.message);
    }
}

async function getColor(TipPolja){
    const query = 'SELECT * FROM "ŠifarnikBoja" WHERE "TipPolja" = $1';
    const values = [TipPolja];

    try{
        const result = await pool.query(query, values);
        //const result = await pool.query('SELECT * FROM "ŠifarnikBoja"');
        //console.log("GET COLOR:");
        //console.log(TipPolja,result);
       
        return result.rows[0].Color;
    } catch (err) {
        throw new Error(err.message);
    }
}

module.exports = {
    pool,
    getAllRecords,
    getRecordById,
    checkRecord,
    insertRecord,
    updateRecord,
    deleteRecord,
    insertField,
    updateField,
    deleteField,
    getFieldById,
    getColor
};