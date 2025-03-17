javascript:(function(){
    var d = document.querySelector(".content__left"),
        s = Array.from(d.getElementsByClassName("serp-item")),
        o = document.createElement("ol");
    o.style.paddingLeft = "20px";
    var l = [], c = {Товар: 0, Категория: 0, Информационная: 0, Главная: 0, Неизвестная: 0};
    
    function getType(u) {
        if (/yandex\.ru\/images\//.test(u)) return null;
        if (/\/(category|catalog)\/[^\/]+\/?$/.test(new URL(u).pathname)) return "Категория";
        if (/\/blog\/|\/articles\/|\/review\/|\/wiki\/|\/forum\//i.test(u)) return "Информационная";
        return u === "/" ? "Главная" : "Неизвестная";
    }

    s.forEach((e, i) => {
        var a = e.querySelector("a");
        if (!a) return;
        var u = a.href, y = getType(u);
        if (!y) return;
        c[y]++; l.push({url: u});
        var li = document.createElement("li");
        li.innerHTML = `<a href="${u}" target="_blank" rel="noopener noreferrer">${u}</a>`;
        o.appendChild(li);
        e.innerHTML = `<p><b>${i + 1} (${y})</b></p>` + e.innerHTML;
    });

    function openAll() {
        l.forEach((e, i) => setTimeout(() => {
            var w = window.open(e.url, '_blank', 'noopener,noreferrer');
            if (w) w.blur();
            window.focus();
        }, i * 500));
    }

    function copyAll() {
        var t = document.createElement("textarea");
        t.value = l.map(e => e.url).join("\n");
        document.body.appendChild(t);
        t.select();
        document.execCommand("copy");
        t.remove();
    }

    var b = document.createElement("div"),
        ob = document.createElement("button"),
        cb = document.createElement("button"),
        stats = document.createElement("p");
    ob.innerText = "Открыть все"; cb.innerText = "Скопировать ссылки";
    [ob, cb].forEach(btn => {
        btn.style.padding = "5px 10px"; btn.style.marginRight = "10px"; btn.style.cursor = "pointer";
    });
    ob.onclick = openAll; cb.onclick = copyAll;
    b.appendChild(ob); b.appendChild(cb);
    stats.innerHTML = Object.entries(c).filter(e => e[1] > 0).map(e => `${e[0]}: ${e[1]}`).join(", ");
    if (stats.innerHTML) d.prepend(stats);
    d.prepend(b); d.prepend(document.createElement("hr"));
    d.prepend(o); d.prepend(document.createElement("hr"));
})();
