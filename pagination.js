export default class Pagination {
    constructor(container, columns, searchButton, searchUrl, callback, options, perPage = 10, method = "GET", autoload = false) {
        this.container = container;
        this.columns = columns;
        this.searchButton = searchButton;
        this.searchUrl = searchUrl;
        this.callback = callback;
        this.options = options;
        this.perPage = perPage;
        this.method = method;
        this.autoload = autoload;
        this.order = [];
        this.currentPage = 1;
        this.maxPage = 10;
    }

    init = async () => {
        if (this.autoload) {
            this.createSkeleton();
            const data = await this.fetchData();
            this.removeSkeleton();
            if (data instanceof Error) {
                this.createError(data.message);
                return;
            }
            const table = this.createTable();
            this.container.append(table);
            this.appendData(data);
            this.totalItems = 97; // data.total;
            this.maxPage = 10; // Math.ceil(data.total / this.perPage);
            this.createPaginationBar();
            this.updatePaginationBar();
        }
        if (this.searchButton) {
            this.searchButton.addEventListener('click', async (event) => {
                event.preventDefault();
                this.createSkeleton();
                const data = await this.fetchData();
                this.removeSkeleton();
                if (data instanceof Error) {
                    this.createError(data.message);
                    return;
                }
            });
        }
    }

    createTable = () => {
        const table = document.createElement('table');
        table.id = `table-${this.container.dataset.paginationName}`;
        const thead = document.createElement('thead');
        const theadTr = document.createElement('tr');
        const order = [];
        this.columns.forEach(column => {
            const th = document.createElement('th');
            th.innerText = column.label;
            th.dataset.value = column.value;
            order.push(column.value)
            theadTr.append(th);
        });
        this.order = order;
        thead.append(theadTr);
        table.append(thead);
        return table;
    }

    removeTable = () => {
        const table = this.container.querySelector(`#table-${this.container.dataset.paginationName}`);
        if (table) {
            table.remove();
        }
    }

    appendData = (data) => {
        const table = this.container.querySelector(`#table-${this.container.dataset.paginationName}`);
        const tbody = document.createElement('tbody');
        data.forEach(element => {
            const tr = document.createElement('tr');
            this.order.forEach(order => {
                const td = document.createElement('td');
                td.innerText = element[order];
                tr.append(td);
            });
            tbody.append(tr);
        });
        table.append(tbody);
    }

    removeData = () => {
        const table = this.container.querySelector(`#table-${this.container.dataset.paginationName}`);
        if (!table) {
            return;
        }
        const tableBody = table.querySelector('tbody');
        if (tableBody) {
            tableBody.remove();
        }
    }

    fetchData = async () => {
        try {
            const response = await fetch(`${this.searchUrl}?_page=${this.currentPage}&_limit=${this.perPage}`);
            if (!response.ok) {
                throw new Error("Une erreur est survenue.");
            }

            const data = await response.json();
            return data;
        } catch(error) {
            console.error(error);
            return error;
        }
    }

    createSkeleton = () => {
        const skeleton = document.createElement('div');
        skeleton.classList.add('skeleton', 'skeleton-table');
        skeleton.id = `skeleton-data-${this.container.dataset.paginationName}`;
        const table = this.container.querySelector(`#table-${this.container.dataset.paginationName}`);
        if (table) {
            table.append(skeleton);
        } else {
            this.container.append(skeleton);
        }
    }

    removeSkeleton = () => {
        const skeleton = this.container.querySelector(`#skeleton-data-${this.container.dataset.paginationName}`);
        if (skeleton) {
            skeleton.remove();
        }
    }

    createError = (message) => {
        const error = document.createElement('div');
        error.classList.add('error');
        error.id = `error-data-${this.container.dataset.paginationName}`;
        const errorMessage = document.createElement('span');
        errorMessage.innerText = message;
        error.append(errorMessage);
        this.container.append(error);
    }

    removeError = () => {
        const error = this.container.querySelector(`#error-data-${this.container.dataset.paginationName}`);
        if (error) {
            error.remove();
        }
    }

    createNoData = () => {
        const noData = document.createElement('div');
        noData.classList.add('noData');
        noData.id = `nodata-data-${this.container.dataset.paginationName}`;
        const noDataMessage = document.createElement('span');
        noDataMessage.innerText = "Aucune donnée trouvée.";
        error.append(noDataMessage);
        this.container.append(noData);
    }

    removeNoData = () => {
        const noData = this.container.querySelector(`#nodata-data-${this.container.dataset.paginationName}`);
        if (noData) {
            noData.remove();
        }
    }

    createPaginationBar = () => {
        const paginationBar = document.createElement('div');
        paginationBar.id = `pagination-bar-${this.container.dataset.paginationName}`;

        const paginationInfos = document.createElement('span');
        const paginationButtonPrev = document.createElement('button');
        const paginationButtonNext = document.createElement('button');

        paginationInfos.id = `pagination-infos-${this.container.dataset.paginationName}`;
        paginationInfos.dataset.element = "infos";
        paginationInfos.innerText = `0 - 0 de 0`;

        const paginationButtonContainer = document.createElement('div');
        paginationButtonContainer.id = `pagination-buttons-${this.container.dataset.paginationName}`;

        paginationButtonPrev.dataset.direction = "prev";
        paginationButtonPrev.innerText = "Previous";
        paginationButtonPrev.addEventListener('click', (event) => {
            event.preventDefault();
            this.updatePagination('prev');
        });

        paginationButtonNext.dataset.direction = "next";
        paginationButtonNext.innerText = "Next";
        paginationButtonNext.addEventListener('click', (event) => {
            event.preventDefault();
            this.updatePagination('next');
        });

        paginationButtonContainer.append(paginationButtonPrev, paginationButtonNext);

        paginationBar.append(paginationInfos, paginationButtonContainer);
        this.container.append(paginationBar);
    }

    removePaginationBar = () => {
        const paginationBar = this.container.querySelector(`#pagination-bar-${this.container.dataset.paginationName}`);
        if (paginationBar) {
            paginationBar.remove();
        }
    }

    updatePagination = async (direction) => {
        try {
            switch (direction) {
                case 'prev':
                    if (this.currentPage > 1) {
                        this.currentPage--;
                    }
                    break;
                case 'next':
                    if (this.currentPage < this.maxPage) {
                        this.currentPage++;
                    }
                    break;
                default:
                    throw new Error(`Direction "${direction}" inconnue.`);
            }
        } catch (error) {
            console.error(error);
            return;
        }
        this.removeData();
        this.createSkeleton();
        const data = await this.fetchData();
        this.removeSkeleton();
        if (data instanceof Error) {
            this.createError(data.message);
            this.removeTable();
            this.removePaginationBar();
            return;
        }
        this.appendData(data);
        this.totalItems = 100; // data.total;
        this.maxPage = 10; // Math.ceil(data.total / this.perPage);

        this.updatePaginationBar();
    }

    updatePaginationBar = () => {
        const paginationBar = this.container.querySelector(`#pagination-bar-${this.container.dataset.paginationName}`);
        if (!paginationBar) {
            return;
        }
        const paginationInfos = paginationBar.querySelector('[data-element="infos"]');
        if (!paginationInfos) {
            return;
        }

        const startingElement = (this.currentPage - 1) * this.perPage + 1;
        const lastElement = Math.min(this.currentPage * this.perPage, this.totalItems);
        paginationInfos.innerText = `${startingElement} - ${lastElement} de ${this.totalItems}`;

        const paginationButtonPrev = paginationBar.querySelector('[data-direction="prev"]');
        const paginationButtonNext = paginationBar.querySelector('[data-direction="next"]');

        paginationButtonPrev.disabled = false;
        paginationButtonNext.disabled = false;

        if (this.currentPage === 1) {
            paginationButtonPrev.disabled = true;
        }
        if (this.currentPage === this.maxPage) {
            paginationButtonNext.disabled = true;
        }
    }
}