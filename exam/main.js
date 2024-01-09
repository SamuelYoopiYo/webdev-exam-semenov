// Функция для показа уведомления
function showNotification(message, type) {
    // Создаем контейнер для уведомлений, если он еще не создан
    let alertContainer = document.querySelector('.alert-container');
    if (!alertContainer) {
        alertContainer = document.createElement('div');
        alertContainer.classList.add('alert-container');
        document.body.appendChild(alertContainer);
    }

    // Создаем уведомление
    const newAlert = document.createElement('div');
    newAlert.classList.add('alert', type, 'alert-dismissible', 'fade', 'show');
    newAlert.textContent = message;

    const closeButton = document.createElement('button');
    closeButton.classList.add('btn-close');
    closeButton.setAttribute('type', 'button');
    closeButton.setAttribute('data-bs-dismiss', 'alert');
    closeButton.setAttribute('aria-label', 'Close');

    newAlert.appendChild(closeButton);
    alertContainer.appendChild(newAlert);
}

// Функция для создания кнопки "Выбрать" с уведомлением
function createSelectButton() {
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-purple');
    button.textContent = 'Выбрать';
    return button;
}

// ф-ция получения данных с АПИ
async function getData() {
    try {
        const response = await fetch('http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=5800a3ce-3a7d-4c48-bccc-54d2a6e448e7');
        const data = await response.json();
        return data;
    } catch (error) {
        showNotification('Ошибка при загрузке данных', 'alert-danger');
    }
    
}

// Основная функция (с ней мне удобней работать, т.к. мэйню плюсы)
async function main() {

    const recordsData = await getData();
    let currentPage = 1;
    let rows = 10;

    
    const mainObjectsFilter = document.querySelector('#mainObjectsFilter');

    // Очистка фильтра перед заполнением
    mainObjectsFilter.innerHTML = '<option value="">Не выбрано</option>';

    // Создание списка уникальных объектов
    const mainObjectsSet = new Set();
    recordsData.forEach(route => {
        const objects = route.mainObject.split('-');
        objects.forEach(object => mainObjectsSet.add(object));
    });

    // Добавление объектов в фильтр
    mainObjectsSet.forEach(object => {
        const option = document.createElement('option');
        option.classList.add('option-custom');
        option.value = object.toLowerCase();
        option.textContent = object;
        mainObjectsFilter.appendChild(option);
    });
    
    // Функция для постраничного отображения
    function displayList(arrData, rowsPerPage, page) {
        tableBody = document.querySelector('.tableBody');
        tableBody.innerHTML = "";
        page--; 

        const start = rowsPerPage * page;
        const end = start + rowsPerPage;
        const paginatedData = arrData.slice(start, end);

        paginatedData.forEach(element => {
            const recordEl = tableBody.insertRow();

            const nameCell = recordEl.insertCell(0);
            const descriptionCell = recordEl.insertCell(1);
            const mainObjectsCell = recordEl.insertCell(2);
            const selectCell = recordEl.insertCell(3);

            nameCell.textContent = element.name;
            descriptionCell.textContent = element.description;
            mainObjectsCell.textContent = element.mainObject.split(' - ').join('; ');

            const selectButton = createSelectButton();
            selectCell.appendChild(selectButton);
        });
    }

    // Функция для создания кнопок пагинации
    function displayPaginationBtn(page) {
        const liEl = document.createElement("li");
        liEl.classList.add("page-item");
        const aEl = document.createElement("a");
        aEl.classList.add("page-link");
        aEl.innerText = page;

        if (currentPage == page) {
            liEl.classList.add("active");
        }

        aEl.addEventListener('click', () => {
            currentPage = page;
            displayList(recordsData, rows, currentPage);

            let currentItemLi = document.querySelector('li.active');
            currentItemLi.classList.remove('active');

            liEl.classList.add("active");
        });
        liEl.appendChild(aEl);

        return liEl;
    }

    // Функция для отображения пагинации
    function displayPagination(arrData, rowsPerPage) {
        const paginationEl = document.querySelector(".pagination");
        paginationEl.innerHTML = '';
        const pagesCount = Math.ceil(arrData.length / rowsPerPage);
        const ulEl = document.createElement("ul");
        ulEl.classList.add("pagination");

        for (let i = 0; i < pagesCount; i++) {
            const liEl = displayPaginationBtn(i + 1);
            ulEl.appendChild(liEl); 
        }
        paginationEl.appendChild(ulEl);
    }

    // Добавление обработчика события для поля поиска
    const form = document.querySelector("form");
    const searchInput = document.querySelector('.form-control');

    // Для поиска
    form.addEventListener('input', (e) => {
        e.preventDefault();

        let searchedData = [];
        
        recordsData.forEach(record => {
            let toChek = record.name.toLowerCase();

            if (toChek.includes(searchInput.value.toLowerCase())) {
                searchedData.push(record);
            }
        });

        displayList(searchedData, rows, currentPage);
        displayPagination(searchedData, rows);
    });

    // Для фильтра
    mainObjectsFilter.addEventListener('change', (e) => {
        e.preventDefault();

        filtredData = [];
        
        recordsData.forEach(record => {
            let toChek = record.mainObject.toLowerCase();

            if (toChek.includes(mainObjectsFilter.value.toLowerCase())) {
                filtredData.push(record);
            }
        });

        displayList(filtredData, rows, currentPage);
        displayPagination(filtredData, rows);
    });
    
    displayList(recordsData, rows, currentPage);
    displayPagination(recordsData, rows);

}
// Просто показать функцианальность
showNotification('Алерты работают', 'alert-mint');

main();
