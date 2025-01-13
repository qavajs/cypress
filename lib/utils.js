/**
 * Parse 'x, y' string to coordinates array
 * @param {string} coords - 'x, y' string
 * @return {number[]} - coords array
 */
export function parseCoords(coords) {
    return coords.split(/\s?,\s?/).map(c => parseFloat(c ?? 0))
}

/**
 * Transform key-value data table to JS object
 * @param ctx
 * @param dataTable
 * @return {Object}
 */
export function dataTable2Object(ctx, dataTable) {
    const obj = {};
    for (const [key, value] of dataTable.raw()) {
        obj[key] = ctx.value(value);
    }
    return obj;
}

/**
 * Transform key-value data table to array
 * @param ctx
 * @param dataTable
 * @return {any[]}
 */
export function dataTable2Array(ctx, dataTable) {
    return dataTable.raw().map(([value]) => ctx.value(value));
}
