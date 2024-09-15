// Function to parse CSV where fields may contain commas and are enclosed in quotes
function parseCSV(text) {
    const rows = [];
    let insideQuotes = false;
    let currentRow = [];
    let currentField = '';

    // Loop through each character in the CSV text
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (char === '"' && insideQuotes && nextChar === '"') {
            // If two consecutive double quotes are found, it's an escaped quote
            currentField += '"';
            i++; // Skip the next quote
        } else if (char === '"') {
            // Toggle the insideQuotes flag when encountering a quote
            insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
            // If it's a comma outside quotes, end the current field
            currentRow.push(currentField.trim());
            currentField = '';
        } else if (char === '\n' && !insideQuotes) {
            // If it's a newline outside quotes, end the current row
            currentRow.push(currentField.trim());
            rows.push(currentRow);
            currentRow = [];
            currentField = '';
        } else {
            // Otherwise, add the character to the current field
            currentField += char;
        }
    }

    // Push the last field and row if there’s data left
    if (currentField) {
        currentRow.push(currentField.trim());
    }
    if (currentRow.length > 0) {
        rows.push(currentRow);
    }

    return rows;
}

async function loadCSV() {
    try {
        // Fetch the CSV file
        const response = await fetch('library.csv');
        if (!response.ok) {
            throw new Error(`Error fetching the CSV file: ${response.statusText}`);
        }

        const data = await response.text();

        // Parse the CSV data using the custom parser
        const rows = parseCSV(data);

        // Reference to the table elements
        const tableHeader = document.getElementById('table-header');
        const tableBody = document.getElementById('table-body');

        // Ensure there are rows to process
        if (rows.length === 0) {
            throw new Error('CSV file is empty or improperly formatted.');
        }

        // Insert header (first row)
        const headers = rows[0];
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header.trim();
            tableHeader.appendChild(th);
        });

        // Insert the rest of the rows
        rows.slice(1).forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell.trim();
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });

        console.log('CSV data loaded successfully');
    } catch (error) {
        console.error('Error loading CSV:', error);
    }
}

// Load the CSV when the page loads
window.onload = loadCSV;
