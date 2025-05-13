  const loadBtn = document.getElementById('loadBtn');
  const clearBtn = document.getElementById('clearBtn');
  const urlInput = document.getElementById('urlInput');
  const messageDiv = document.getElementById('message');
  const tablePrompt = document.getElementById('tablePrompt');
  const tableContainer = document.getElementById('tableContainer');

  let jsonData = [];
  let originalData = [];
  let sortColumn = null;
  let sortDirection = 'asc';

  loadBtn.onclick = () => {
    const url = urlInput.value;
    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
        return response.json();
      })
      .then(data => {
        jsonData = [...data];
        originalData = [...data];
        messageDiv.innerHTML = `<p class="success">Дані формату JSON успішно завантажено. Кількість записів рівна ${data.length}.</p>`;
        showTablePrompt();
        loadBtn.disabled = true;
        clearBtn.disabled = false;
      })
      .catch(err => {
        messageDiv.innerHTML = `<p class="error">Помилка: ${err.message}</p>`;
      });
  };

  clearBtn.onclick = () => {
    urlInput.value = '';
    messageDiv.innerHTML = '';
    tablePrompt.innerHTML = '';
    tableContainer.innerHTML = '';
    loadBtn.disabled = false;
    clearBtn.disabled = true;
    sortColumn = null;
    sortDirection = 'asc';
    jsonData = [];
    originalData = [];
  };

  function showTablePrompt() {
    tablePrompt.innerHTML = `
      <p>ВІДОБРАЗИТИ ВАШ ВАРІАНТ ТАБЛИЦІ?</p>
      <button class="yes" onclick="showTable()">ТАК</button>
      <button class="no" onclick="resetAll()">НІ</button>
    `;
  }

  function resetAll() {
    clearBtn.click();
  }

function showTable(sortKey = null) {
    if (sortKey) {
        if (sortColumn === sortKey) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            sortDirection = 'asc';
        }
        sortColumn = sortKey;
        jsonData.sort((a, b) => {
            let valA = getValueByPath(a, sortKey);
            let valB = getValueByPath(b, sortKey);
            if (typeof valA === 'string') valA = valA.toLowerCase();
            if (typeof valB === 'string') valB = valB.toLowerCase();
            if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }

    const headers = ['id', 'address.city', 'address.zipcode', 'phone'];
    const headerTitles = ['ID', 'CITY', 'ZIPCODE', 'PHONE'];

    let tableHTML = `
  <h4>ТАБЛИЦЯ ДЛЯ ВАРІАНТУ 4</h4>
  <div style="text-align: right; margin-bottom: 10px;">
    <button class="clear-sort-btn" id="clearSortBtn">ОЧИСТИТИ СОРТУВАННЯ</button>
  </div>
  <table>
    <thead><tr>
`;

    headers.forEach((key, index) => {
        const isActive = sortColumn === key;
        tableHTML += `
    <th class="sortable ${isActive ? 'active' : ''}" onclick="showTable('${key}')">
      ${headerTitles[index]} <span class="arrow">${isActive ? (sortDirection === 'asc' ? '↑' : '↓') : '↑↓'}</span>
    </th>
  `;
    });

tableHTML += `</tr></thead><tbody><tr style="height: 20px;"></tr>`;

    jsonData.forEach(user => {
      tableHTML += `
        <tr>
          <td>${user.id}</td>
          <td>${user.address.city}</td>
          <td>${user.address.zipcode}</td>
          <td>${user.phone}</td>
        </tr>
      `;
    });

    tableHTML += `</tbody></table>`;
    tableContainer.innerHTML = tableHTML;

    document.getElementById('clearSortBtn').addEventListener('click', () => {
      sortColumn = null;
      sortDirection = 'asc';
      jsonData = [...originalData];
      showTable();
    });
  }

  function getValueByPath(obj, path) {
    return path.split('.').reduce((o, p) => (o ? o[p] : undefined), obj);
  }