import Pagination from "./pagination.js";
import Dialog from "./dialog.js";

window.onload = (event) => {
    const showBtn = document.querySelector('#openDialog');

    const content = document.createElement('div');
    content.classList.add('pagination-container');
    content.id = 'items-list';
    content.dataset.paginationName = 'test';

    const contentCallback = () => {
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
            content,
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

    const dialog = new Dialog(
        showBtn,
        "Title du turfu",
        content,
        null,
        null,
        contentCallback
    );
    dialog.init();
}