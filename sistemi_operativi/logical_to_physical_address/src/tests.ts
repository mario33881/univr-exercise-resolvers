
/**
 * Show an error message if the output of an expression is false.
 *
 * @param {boolean} expr Expression output
 * @param {string} error_msg Error message
 */
function assert(expr: boolean, error_msg: string) : void {
    if (!expr){
        console.error(error_msg);
    }
}


/**
 * Test the function that
 * checks if all the numbers in an array are positive.
 */
function test_check_all_positive() : void {
    assert(check_all_positive([]) === true, "no numbers: 'everything' is positive");
    assert(check_all_positive([-1]) === false, "-1 is negative");
    assert(check_all_positive([0]) === true, "0 is positive");
}


/**
 * Test the function that checks if the input is valid.
 */
function test_check_inputs() : void {
    assert(check_inputs(-1, 100, [1, 2, 3]).length > 0, "the logical address must be positive");
    assert(check_inputs(123, 0, [1, 2, 3]).length > 0, "the page size must be greater than 0");
    assert(check_inputs(936, 1024, []).length > 0, "the calculation can't be done: there is no data in the page table");
    assert(check_inputs(936, 1024, [1, 4, 3, 7]).length === 0, "this input is correct");
}


/**
 * Test the function that calculates the physical address from the logical address.
 */
function test_calculate_real_address() : void {
    assert(calculate_real_address(936, 1024, [1, 4, 3, 7]) === 1960, "936 should convert into 1960");
    assert(calculate_real_address(2049, 1024, [1, 4, 3, 7]) === 3073, "2049 should convert into 3073");
}


/**
 * Run all the tests.
 */
function test_all() : void {
    test_calculate_real_address();
    test_check_inputs();
    test_check_all_positive();
    console.log("no errors and undefined output means that everything worked correctly");
}
