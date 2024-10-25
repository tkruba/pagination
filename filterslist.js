const getFilters = (filterContainer) => {
    const filtersElements = filterContainer.querySelectorAll(`[data-filter="true"]`);
    const values = {};
    filtersElements.forEach(element => {
        if (element.type === 'checkbox') {
            values[element.name] = element.checked;
        } else if (element.type === 'radio') {
            if (element.checked) {
                values[element.name] = element.value;
            }
        } else {
            values[element.name] = element.value === "" ? null : element.value;
        }
    });
    return values;
}

export { getFilters }