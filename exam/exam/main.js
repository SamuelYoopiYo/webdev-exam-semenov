function showNotification(message) {
    // Создаем контейнер для уведомлений, если он еще не создан
    let alertContainer = document.querySelector('.alert-container');
    if (!alertContainer) {
        alertContainer = document.createElement('div');
        alertContainer.classList.add('alert-container');
        document.body.appendChild(alertContainer);
    }
  
    // Создаем уведомление
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
  
// Пример вызова функции для показа уведомления
showNotification('Новое уведомление');


// Функция для создания кнопки "Выбрать" с уведомлением
function createSelectButton() {
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Выбрать';
    button.addEventListener('click', function() {
        showNotification('Выбран маршрут');
    });
    return button;
}

// Функция для проверки и обработки текста для сокращения и добавления кнопки "Развернуть"
function processText(text) {
    if (text.length > 50) {
        const shortText = text.slice(0, 50) + '...';
        const fullText = text;
        return `<span class="short-text">${shortText}</span><button class="btn btn-link btn-expand" data-fulltext="${fullText}">Развернуть</button>`;
    }
    return text;
}

// Функция для заполнения таблицы данными из API
async function fillTableFromAPI() {
    try {
        const response = await fetch('http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=5800a3ce-3a7d-4c48-bccc-54d2a6e448e7');
        const data = await response.json();

        const tableBody = document.querySelector('.table tbody');

        // Очистка таблицы перед заполнением новыми данными
        tableBody.innerHTML = '';

        // Заполнение таблицы данными из API
        data.forEach(route => {
            const row = tableBody.insertRow();
            const nameCell = row.insertCell(0);
            const descriptionCell = row.insertCell(1);
            const mainObjectsCell = row.insertCell(2);
            const selectCell = row.insertCell(3);

            nameCell.innerHTML = processText(route.name);
            descriptionCell.innerHTML = processText(route.description);

            // Разделение данных основных объектов по переносу строки
            const mainObjects = route.mainObject.split('-').join('\n');
            mainObjectsCell.innerHTML = processText(mainObjects);

            // Добавление кнопки "Выбрать" в ячейку
            const selectButton = createSelectButton();
            selectCell.appendChild(selectButton);
        });

        // Добавление обработчика событий для кнопок "Развернуть"
        tableBody.addEventListener('click', function(event) {
            if (event.target.classList.contains('btn-expand')) {
                const cell = event.target.parentNode;
                const span = cell.querySelector('.short-text');
                const fullText = event.target.getAttribute('data-fulltext');
                span.textContent = fullText;
                event.target.style.display = 'none';
            }
        });
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
    }
}

// Вызов функции для заполнения таблицы данными из API
fillTableFromAPI();
