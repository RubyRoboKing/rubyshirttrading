function initGoogleSheetsAPI() {
    gapi.load('client', loadSheetsAPI);
}

function loadSheetsAPI() {
    gapi.client.init({
        apiKey: 'AIzaSyB6vx_mNL4qc0JGVJR4ioUI-ojbJ2CcnIY',
        discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
    }).then(function () {
        return gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '1KCXlG19AFMzhCz5GbA0IZQOy4I3LXENinWHzCA-gcFY',
            range: 'Inventory!A2:L',
        });
    }).then(response => {
        const data = response.result.values;
        if (data) {
            populateTable(data);
        } else {
            console.error('No data found.');
        }
    }).catch(error => {
        console.error('Error fetching data from Google Sheets:', error);
    });
}

function populateTable(data) {
    const tableBody = document.getElementById('inventory-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear any existing rows

    data.forEach(row => {
        const tableRow = document.createElement('tr');

        if (row[9] === 'TRUE') {
            tableRow.classList.add('highlighted');
        }

        // Team Icon
        const iconCell = document.createElement('td');
        const iconImg = document.createElement('img');
        iconImg.src = row[2];
        iconImg.alt = 'Team Icon';
        iconImg.style.width = '50px';
        iconCell.appendChild(iconImg);
        tableRow.appendChild(iconCell);

        // Other columns
        ['0', '2', '3', '4', '5', '7', '8'].forEach((index, i) => {
            const cell = document.createElement('td');
            let cellText = document.createTextNode(row[index]);
            if (index == '3') { // Adjust size values
                const sizeMapping = {
                    'S': 'Small',
                    'M': 'Medium',
                    'L': 'Large',
                    'XL': 'X-Large',
                    'XXL': '2XL',
                    'XXXL': '3XL',
                    'XXXXL': '4XL',
                    'XXXXXL': '5XL',
                    'XXXXXXL': '6XL'
                };
                cellText = document.createTextNode(sizeMapping[row[index]] || row[index]);
            }
            cell.appendChild(cellText);
            tableRow.appendChild(cell);
        });

        // Photos column
        const photosCell = document.createElement('td');
        const photosLink = document.createElement('a');
        photosLink.href = '#';
        photosLink.textContent = 'View Photos';
        photosLink.addEventListener('click', function () {
            openPhotoPopup(row[10], row[11]);
        });
        photosCell.appendChild(photosLink);
        tableRow.appendChild(photosCell);

        tableBody.appendChild(tableRow);
    });
}

function openPhotoPopup(photo1Url, photo2Url) {
    const popup = window.open('', 'Photo Popup', 'width=600,height=400');
    popup.document.write('<html><head><title>Photos</title></head><body>');
    popup.document.write('<img src="' + photo1Url + '" style="width:100%;"><br>');
    popup.document.write('<img src="' + photo2Url + '" style="width:100%;">');
    popup.document.write('</body></html>');
}

// Search functionality
document.getElementById('search-bar').addEventListener('input', function () {
    const filter = this.value.toLowerCase();
    const rows = document.querySelectorAll('#inventory-table tbody tr');

    rows.forEach(row => {
        const cells = row.getElementsByTagName('td');
        let showRow = false;

        for (let i = 0; i < cells.length; i++) {
            const cellText = cells[i].textContent.toLowerCase();
            if (cellText.includes(filter)) {
                showRow = true;
                break;
            }
        }

        row.style.display = showRow ? '' : 'none';
    });
});

window.onload = function() {
    initGoogleSheetsAPI();
}
