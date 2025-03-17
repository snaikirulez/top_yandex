(function() {
    // Скрываем элемент с классом .content__right
    document.styleSheets[0].addRule(".content__right", "display:none !important");

    // Получаем контейнер с классом .content__left и все элементы с классом .serp-item
    var d = document.querySelector(".content__left"),
        s = Array.from(d.getElementsByClassName("serp-item")),
        o = document.createElement("ol");  // Список для хранения ссылок
    o.style.paddingLeft = "20px";  // Отступ слева

    var l = [], j = 1, c = {Товар: 0, Категория: 0, Информационная: 0, Главная: 0, Неизвестная: 0};  // Статистика для подсчета типов

    // Функция для определения типа страницы по URL
    function getType(e, u) {
        if (/yandex\.ru\/images\//.test(u)) return null;  // Игнорируем изображения
        if (e.querySelector(".EPrice-Content")) return "Товар";
        if (e.querySelector(".GoodsHeader")) return "Категория";
        if (/\/blog\/|\/articles\/|\/review\/|\/wiki\/|\/forum\//i.test(u)) return "Информационная";
        try {
            var p = new URL(u).pathname;
            if (p === "/") return "Главная";  // Главная страница
            if (/\/(category|catalog)\/[^\/]+\/?$/.test(p) || /^https:\/\/market\.yandex\.ru\/catalog--/.test(u)) return "Категория";
        } catch (e) {}
        return "Неизвестная";  // Неизвестный тип
    }

    // Проходим по каждому элементу и добавляем ссылки в список
    s.forEach(e => {
        if (e.querySelector(".AdvLabel-Text")) {
            e.remove();  // Убираем рекламные объявления
            return;
        }
        var a = e.querySelector("a");
        if (!a) return;  // Если ссылки нет, пропускаем
        var u = a.href, y = getType(e, u);
        if (!y) { e.remove(); return; }  // Если не удалось определить тип, убираем элемент
        c[y]++;  // Увеличиваем счетчик для соответствующего типа
        l.push({ url: u, type: y });  // Добавляем ссылку и её тип в список

        // Создаем элемент списка для вывода ссылки и её типа
        var li = document.createElement("li"), lnk = document.createElement("a");
        lnk.href = u;
        lnk.target = "_blank";  // Открывать в новой вкладке
        lnk.rel = "noopener noreferrer";  // Безопасность
        lnk.innerText = u;
        li.appendChild(lnk);
        li.innerHTML += " - <b>" + y + "</b>";
        o.appendChild(li);  // Добавляем ссылку в список
        e.innerHTML = "<p><b>" + (j++) + " (" + y + ")</b></p>" + e.innerHTML;  // Добавляем индекс и тип
    });

    // Функция для открытия всех ссылок
    function openAll() {
        l.forEach((e, i) => setTimeout(() => {
            var w = window.open(e.url, '_blank', 'noopener,noreferrer');
            if (w) w.blur();  // Убираем фокус с нового окна
            window.focus();  // Возвращаем фокус на текущую вкладку
        }, i * 500));  // Задержка для открытия ссылок поочередно
    }

    // Функция для копирования всех ссылок в буфер обмена
    function copyAll() {
        var t = document.createElement("textarea");
        t.value = l.map(e => e.url + " - " + e.type).join("\n");  // Создаем строку со всеми ссылками и типами
        document.body.appendChild(t);
        t.select();  // Выделяем текст
        document.execCommand("copy");  // Копируем в буфер обмена
        t.remove();  // Убираем временное поле ввода
    }

    // Создаем кнопки и добавляем их на страницу
    var b = document.createElement("div"),
        ob = document.createElement("button"),
        cb = document.createElement("button"),
        stats = document.createElement("p");

    ob.innerText = "Открыть все";  // Кнопка для открытия всех ссылок
    cb.innerText = "Скопировать ссылки";  // Кнопка для копирования ссылок

    // Стили для кнопок
    [ob, cb].forEach(btn => {
        btn.style.padding = "5px 10px";
        btn.style.marginRight = "10px";
        btn.style.cursor = "pointer";
    });

    // Назначаем обработчики для кнопок
    ob.onclick = openAll;
    cb.onclick = copyAll;

    // Добавляем кнопки на страницу
    b.appendChild(ob);
    b.appendChild(cb);

    // Статистика по типам ссылок
    stats.innerHTML = Object.entries(c).filter(e => e[1] > 0).map(e => e[0] + ": " + e[1]).join(", ");
    if (stats.innerHTML) d.prepend(stats);  // Добавляем статистику в начало страницы

    // Добавляем разделители и список на страницу
    d.prepend(b);
    d.prepend(document.createElement("hr"));
    d.prepend(o);
    d.prepend(document.createElement("hr"));
})();
