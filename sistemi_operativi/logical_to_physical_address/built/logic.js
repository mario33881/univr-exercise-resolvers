"use strict";
/**
 * Returns the real address given a logical address.
 *
 * @param {number} logical_address Logical address to convert
 * @param {number} page_size Size of a page
 * @param {...number} page_table List of frame numbers
 * @returns Real address
 */
function calculate_real_address(logical_address, page_size, page_table) {
    // calculate page number
    const page_number = Math.floor(logical_address / page_size);
    // calculate relative zero
    const frame_number = page_table[page_number];
    const relative_zero = frame_number * page_size;
    // calculate offset
    const virtual_zero = page_size * page_number;
    const offset = logical_address - virtual_zero;
    // calculate real address
    const real_address = relative_zero + offset;
    return real_address;
}
/**
 * Checks if all the inputs of the algorithm are correct.
 *
 * @param {number} logical_address Logical address to convert
 * @param {number} page_size Size of a page
 * @param {...number} page_table List of frame numbers
 * @returns Input errors
 */
function check_inputs(logical_address, page_size, page_table) {
    const errors = [];
    if (logical_address < 0) {
        errors.push("L'indirizzo logico non puo' essere negativo");
    }
    if (page_size <= 0) {
        errors.push("La dimensione delle pagine deve essere maggiore di 0");
    }
    if (!check_all_positive(page_table)) {
        errors.push("La page table deve contenere valori positivi");
    }
    if (errors.length == 0) {
        const page_number = Math.floor(logical_address / page_size);
        if (page_number >= page_table.length) {
            errors.push("Un numero di pagina (" + page_number + ") va fuori range dalla page table: forse non si sono inseriti tutti i valori necessari nella page table?");
        }
    }
    return errors;
}
/**
 * Checks if all the numbers contained in list are positive.
 *
 * @param {...number} list List of numbers
 * @returns true if all numbers are positive, false otherwise
 */
function check_all_positive(list) {
    for (const element of list) {
        if (element < 0) {
            return false;
        }
    }
    return true;
}
//# sourceMappingURL=logic.js.map