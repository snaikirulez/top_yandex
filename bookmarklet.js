console.log("Hello from GitHub Pages Bookmarklet!");

// Изменение фона страницы
document.body.style.backgroundColor = "lightblue";

// Добавление кнопки на страницу
var btn = document.createElement("button");
btn.innerText = "Click me!";
btn.style.position = "fixed";
btn.style.top = "10px";
btn.style.right = "10px";
btn.style.padding = "10px";
btn.style.fontSize = "16px";
btn.style.zIndex = "9999";
btn.onclick = function() {
    alert("Hello from bookmarklet.js!");
};
document.body.appendChild(btn);
