(function() {
  "use strict";
  // создаем и возвращаем заголовок приложения
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  // создаем и возвращаем форму для создания дела
  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';
    button.disabled = 'true';

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    input.addEventListener('input', function(e) {
      e.preventDefault();
      if (input.value.length > 0) {
        button.disabled = false;
      }
      else if (input.value.length == 0) {
        button.disabled = true;
      }
    });

    return {
      form,
      input,
      button,
    };
  }

  // создаем и возвращаем список элементов
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  // создаем и возвращаем дело
  function createTodoItem(task) {
    let item = document.createElement('li');
    // кнопки помещаем в элемент, который красиво покажет их в одной группе
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    // устанавливаем стили для элемента списка, а также для размещения кнопок
    // в его правой части с помощью flex
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    let deal = {};
    for (let key in task) {
      deal[key] = task[key];
    }
    item.textContent = deal.name;
    if(deal.done === true) {
      item.classList.add('list-group-item-success')
    }

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    // вкладывем кнопки в отдельный элемент, чтобы они объединились в один блок
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    // приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
    return {
      item,
      doneButton,
      deleteButton,
    };
  };

  // сохранение в хранилище
  function saveTask(deal, title) {
    let taskList = JSON.parse(localStorage.getItem(title)) || [];
    taskList.push(deal);
    localStorage.setItem(title, JSON.stringify(taskList));
  }

  // удаление из хранилища
  function deleteTask(itemName, title) {
    let taskList = JSON.parse(localStorage.getItem(title)) || [];
    for(let i = 0; i < taskList.length; i++) {
      if(taskList[i].name === itemName) {
        taskList.splice(i, 1);
        break;
      }
    }
    localStorage.setItem(title, JSON.stringify(taskList));
  }

  // добавляет таску
  function createTodoApp(container, title = 'Список дел') {

    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();
    let todoItems = JSON.parse(localStorage.getItem(title)) || [];

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    // добавление заготовленных заранее дел
    let arrObj = [];
    for(let i = 0; i < todoItems.length; i++) {
      let todoItem = createTodoItem(todoItems[i]);
      arrObj.push(todoItem);
      todoList.append(todoItem.item);
    }

    // добавляем обработчики на уже добавленные кнопки
    for(let i = 0; i < arrObj.length; i++) {
      addButtonHandler(arrObj[i]);
    }

    // функция обработки кнопок
    function addButtonHandler(task) {
      task.doneButton.addEventListener('click', function() {
        task.item.classList.toggle('list-group-item-success');
      });
      task.deleteButton.addEventListener('click', function() {
        if (confirm('Вы уверены?')) {
          task.item.remove();
          deleteTask(task.item.firstChild.textContent, title);
        }
      });
    }

    // браузер создает событие submit на форме по нажатию на Enter или на кнопку создания дела
    todoItemForm.form.addEventListener('submit', function(e) {
      // эта строчка необходима, чтобы предотвратить стандартные действия браузера
      // в данном случае мы не хотим, чтобы страница перезагружалась после отправки формы
      e.preventDefault();

      // игнорируем создание элемента, если пользователь ничего не ввел в поле
      if (!todoItemForm.input.value) {
        todoItemForm.button.disabled = 'true';
        return;
      }

      let preItem = {name: todoItemForm.input.value, done: false};
      let todoItem = createTodoItem(preItem);
      saveTask(preItem, title)

      // добавляем обработчики на кнопки
      addButtonHandler(todoItem, title);

      // создаем и добавляем в список новое дело с названием из поля для ввода
      todoList.append(todoItem.item);

      // обнуляем значение в поле, чтобы не пришлось стирать его вручную
      todoItemForm.input.value = '';
    });
  }

  window.createTodoApp = createTodoApp;
})();