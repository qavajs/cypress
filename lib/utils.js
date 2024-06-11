/**
 * Parse 'x, y' string to coordinates array
 * @param {string} coords - 'x, y' string
 * @return {number[]} - coords array
 */
export function parseCoords(coords) {
    return coords.split(/\s?,\s?/).map(c => parseFloat(c ?? 0))
}

export function equalOrIncludes(value, argument) {
    return Array.isArray(value)
        ? value.includes(argument)
        : value === argument;
}

export async function throwTimeoutError(fn, message) {
    try {
        await fn()
    } catch (err) {
        if (err.message.includes('exceeded while waiting on the predicate')) {
            throw new Error(message);
        }
        throw err
    }
}

/**
 * Transform key-value data table to JS object
 * @param ctx
 * @param dataTable
 * @return {Object}
 */
export async function dataTable2Object(ctx, dataTable) {
    const obj = {};
    for (const [key, value] of dataTable.raw()) {
        obj[key] = await ctx.value(value);
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
