// const apiKey = 'TU_API_KEY';// Reemplaza con tu API Key
const apiKey = 'AIzaSyAhzb74zCJ6VYa39BnCyy7ORtJp7cyWPCA';
// const sheetId = 'TU_SHEET_ID';// Reemplaza con el ID de tu hoja de Google
const sheetName = 'misdatos';
const sheetId = '1iVVnO9rtg_h5BD2ZacX6R_vPYbRNyCnRLCB4rBp_Epg';
// https://docs.google.com/spreadsheets/d/1iVVnO9rtg_h5BD2ZacX6R_vPYbRNyCnRLCB4rBp_Epg/edit?usp=sharing

document.getElementById('formulario').addEventListener('submit', async function (e) {
    e.preventDefault();

    const documento = document.getElementById('documento').value;
    const apellidos = document.getElementById('apellidos').value;
    const nombres = document.getElementById('nombres').value;

    try {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`);
        if (!response.ok) {
            throw new Error('Error al obtener los datos de la hoja de Google Sheets');
        }

        const data = await response.json();
        console.log('Datos recibidos de Google Sheets:', data);

        if (!data.values) {
            throw new Error('No se encontraron valores en la respuesta de Google Sheets');
        }

        const rows = data.values;
        let found = false;
        for (let i = 1; i < rows.length; i++) {
            if (rows[i][0] === documento) {
                found = true;
                document.getElementById('apellidos').value = rows[i][1];
                document.getElementById('nombres').value = rows[i][2];
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
        alert(`Hubo un error al guardar los datos: ${error.message}`);
    }
});

async function updateRow(row, documento, apellidos, nombres) {
    try {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!A${row}:C${row}?valueInputOption=RAW&key=${apiKey}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                values: [[documento, apellidos, nombres]]
            })
        });

        if (!response.ok) {
            throw new Error('Error al actualizar la fila');
        }
    } catch (error) {
        console.error('Error en updateRow:', error);
        throw error;
    }
}

async function appendRow(documento, apellidos, nombres) {
    try {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!A:C:append?valueInputOption=RAW&key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                values: [[documento, apellidos, nombres]]
            })
        });

        if (!response.ok) {
            throw new Error('Error al añadir una nueva fila');
        }
    } catch (error) {
        console.error('Error en appendRow:', error);
        throw error;
    }
}
