// const apiKey = 'TU_API_KEY';
const apiKey = 'AIzaSyAhzb74zCJ6VYa39BnCyy7ORtJp7cyWPCA';
// const sheetId = 'TU_SHEET_ID';
const sheetId = '1iVVnO9rtg_h5BD2ZacX6R_vPYbRNyCnRLCB4rBp_Epg';
// https://docs.google.com/spreadsheets/d/1iVVnO9rtg_h5BD2ZacX6R_vPYbRNyCnRLCB4rBp_Epg/edit?usp=sharing
const sheetName = 'misdatos';

document.getElementById('formulario').addEventListener('submit', async function (e) {
    e.preventDefault();

    const documento = document.getElementById('documento').value;
    const apellidos = document.getElementById('apellidos').value;
    const nombres = document.getElementById('nombres').value;

    try {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!A:C?key=${apiKey}`);
        const data = await response.json();
        const rows = data.values;

        let found = false;
        for (let i = 1; i < rows.length; i++) {
            if (rows[i][0] === documento) {
                found = true;
                rows[i][1] = apellidos;
                rows[i][2] = nombres;
                await updateRow(i + 1, documento, apellidos, nombres);
                break;
            }
        }

        if (!found) {
            await appendRow(documento, apellidos, nombres);
        }

        alert('Datos guardados/actualizados con éxito.');
    } catch (error) {
        console.error('Error al acceder a la hoja de Google Sheets:', error);
        alert('Hubo un error al guardar los datos.');
    }
});

async function updateRow(row, documento, apellidos, nombres) {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!A${row}:C${row}?valueInputOption=RAW&key=${apiKey}`, {
        method: 'PUT',
        body: JSON.stringify({
            values: [[documento, apellidos, nombres]]
        })
    });

    if (!response.ok) {
        throw new Error('Error al actualizar la fila');
    }
}

async function appendRow(documento, apellidos, nombres) {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!A:C:append?valueInputOption=RAW&key=${apiKey}`, {
        method: 'POST',
        body: JSON.stringify({
            values: [[documento, apellidos, nombres]]
        })
    });

    if (!response.ok) {
        throw new Error('Error al añadir una nueva fila');
    }
}
