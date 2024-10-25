import Pagination from "./pagination.js";
import Dialog from "./dialog.js";
import { getFilters } from "./filterslist.js";

window.onload = (event) => {
    const showBtn = document.querySelector('#openDialog');

    const content = document.createElement('div');
    const contentFilter = document.createElement('div');

    const nameFilter = document.createElement('input');
    nameFilter.type = "text";
    nameFilter.dataset.filter = "true";
    nameFilter.name = "name";
    nameFilter.value = "maximum";

    const searchButton = document.createElement('button');
    searchButton.innerText = 'Filtrer';

    contentFilter.append(nameFilter, searchButton);

    const contentPagination = document.createElement('div');
    contentPagination.classList.add('pagination-container');
    contentPagination.id = 'items-list';
    contentPagination.dataset.paginationName = 'test';

    content.append(contentFilter, contentPagination);

    const dialog = new Dialog(
        showBtn,
        "Title du turfu",
        content,
        null,
        null,
        () => {
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
                contentPagination,
                columns,
                searchButton,
                `https://jsonplaceholder.typicode.com/posts`,
                function (data) {
                    data.forEach(element => {
                        element.classList.add('clickable');
                        element.removeEventListener('click', (event));
                        element.addEventListener('click', (event) => {
                            if (event.currentTarget.firstElementChild.classList.contains('skeleton-element')) {
                                return;
                            }
                            dialog.closeDialog();
                        });
                    });
                },
                function () {},
                getFilters(contentFilter),
                10,
                "GET",
                false
            );
            pagination.init();
        }
    );
    dialog.init();
}