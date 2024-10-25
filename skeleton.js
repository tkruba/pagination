
const createSkeletonTable = (rows = 10, columns = 2) => {
    const skeletonRows = [];
    for (let i = 0; i < rows; i++) {
        const skeletonColumns = [];
        for (let y = 0; y < columns; y++) {
            const td = document.createElement('td');
            td.classList.add('skeleton-element');
            skeletonColumns.push(td);
        }
        skeletonRows.push(skeletonColumns);
    }
    return skeletonRows;
}

export { createSkeletonTable as skeletonTable }