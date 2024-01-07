let data; // Глобальная переменная для хранения данных

// Функция для показа уведомления
function showNotification(message) {
    let alertContainer = document.querySelector('.alert-container');
    if (!alertContainer) {
        alertContainer = document.createElement('div');
        alertContainer.classList.add('alert-container');
        document.body.appendChild(alertContainer);
    }

    const newAlert = document.createElement('div');
    newAlert.classList.add('alert', 'alert-custom');
    newAlert.textContent = message;

    const closeButton = document.createElement('button');
    closeButton.classList.add('close');
    closeButton.setAttribute('type', 'button');
    closeButton.setAttribute('data-dismiss', 'alert');
    closeButton.setAttribute('aria-label', 'Close');
    closeButton.innerHTML = '<span aria-hidden="true">&times;</span>';

    newAlert.appendChild(closeButton);
    alertContainer.appendChild(newAlert);
}

// Функция для обновления таблицы поиска и фильтра по объектам
function updateTable() {
    const mainObjectsFilter = document.querySelector('#mainObjectsFilter').value.toLowerCase();
    const searchValue = document.querySelector('#searchInput').value.trim().toLowerCase();

    data.forEach(route => {
        const row = document.querySelector(`#tableBody tr[data-id="${route.id}"]`);
        const routeData = Object.values(route).join(' ').toLowerCase();

        const nameCell = row.cells[0];
        const descriptionCell = row.cells[1];
        const mainObjectsCell = row.cells[2];

        nameCell.innerHTML = highlightMatches(route.name, searchValue);
        descriptionCell.innerHTML = highlightMatches(route.description, searchValue);
        mainObjectsCell.innerHTML = highlightMatches(route.mainObject, searchValue);

        const shouldDisplayByMainObject = mainObjectsFilter === '' || route.mainObject.toLowerCase().includes(mainObjectsFilter);
        const shouldDisplayBySearch = searchValue === '' || routeData.includes(searchValue);

        row.style.display = shouldDisplayByMainObject && shouldDisplayBySearch ? '' : 'none';
    });
}

// Функция для подсветки совпадений
function highlightMatches(text, searchTerm) {
    if (!searchTerm) return text;

    const regex = new RegExp(searchTerm, 'gi');
    return text.replace(regex, match => `<span class="highlight">${match}</span>`);
}

// Добавление обработчика события для поля поиска
const searchInput = document.querySelector('#searchInput');
searchInput.addEventListener('input', updateTable);

// Функция для создания кнопки "Выбрать" с уведомлением
function createSelectButton() {
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Выбрать';
    button.addEventListener('click', function () {
        showNotification('Выбран маршрут');
    });
    return button;
}

// Функция для заполнения таблицы данными из API
async function fillTableFromAPI() {
    try {
        const response = await fetch('http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=5800a3ce-3a7d-4c48-bccc-54d2a6e448e7');
        data = await response.json();

        const tableBody = document.querySelector('#tableBody');
        const mainObjectsFilter = document.querySelector('#mainObjectsFilter');

        // Очистка таблицы перед заполнением новыми данными
        tableBody.innerHTML = '';

        // Очистка фильтра перед заполнением
        mainObjectsFilter.innerHTML = '<option value="">Не выбрано</option>';

        // Создание списка уникальных объектов
        const objectsSet = new Set();
        data.forEach(route => {
            const objects = route.mainObject.split('-');
            objects.forEach(object => objectsSet.add(object.trim()));
        });

        // Добавление объектов в фильтр
        objectsSet.forEach(object => {
            const option = document.createElement('option');
            option.value = object.toLowerCase();
            option.textContent = object;
            mainObjectsFilter.appendChild(option);
        });

        // Заполнение таблицы данными из API
        data.forEach(route => {
            const row = tableBody.insertRow();
            row.dataset.id = route.id;

            const nameCell = row.insertCell(0);
            const descriptionCell = row.insertCell(1);
            const mainObjectsCell = row.insertCell(2);
            const selectCell = row.insertCell(3);

            nameCell.textContent = route.name;
            descriptionCell.textContent = route.description;
            mainObjectsCell.textContent = route.mainObject;

            const selectButton = createSelectButton();
            selectCell.appendChild(selectButton);
        });

        // Функция для обновления таблицы при выборе объекта в фильтре
        function updateByMainObject() {
            const selectedObject = mainObjectsFilter.value.toLowerCase();

            data.forEach(route => {
                const row = document.querySelector(`#tableBody tr[data-id="${route.id}"]`);
                const shouldDisplay = selectedObject === '' || route.mainObject.toLowerCase().includes(selectedObject);

                row.style.display = shouldDisplay ? '' : 'none';

                const cells = Array.from(row.cells);
                cells.forEach(cell => {
                    if (cell.textContent.toLowerCase().includes(selectedObject)) {
                        cell.innerHTML = highlightMatches(cell.textContent, selectedObject);
                    }
                });
            });
        }

        // Добавление обработчика события для фильтра по объектам
        mainObjectsFilter.addEventListener('change', updateByMainObject);
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
    }
}

// Вызов функции для заполнения таблицы данных из API и создания фильтра
fillTableFromAPI();