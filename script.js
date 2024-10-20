import Pagination from "./pagination.js";

window.onload = (event) => {
    const container = document.getElementById('items-list');
    const columns = [
        {
            label: "Numéro",
            value: "id"
        },
        {
            label: "Titre",
            value: "title"
        }
    ];
    const pagination = new Pagination(
        container,
        columns,
        null,
        `https://jsonplaceholder.typicode.com/posts`,
        function () {},
        {},
        10,
        "GET",
        true
    );
    pagination.init();
}