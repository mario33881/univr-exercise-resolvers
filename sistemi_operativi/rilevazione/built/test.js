"use strict";
function test_find_deadlock() {
    let alloc = [
        new ProcessResource([0, 1, 0]),
        new ProcessResource([2, 0, 0]),
        new ProcessResource([3, 0, 3]),
        new ProcessResource([2, 1, 1]),
        new ProcessResource([0, 0, 2]),
    ];
    let request = [
        new ProcessResource([0, 0, 0]),
        new ProcessResource([2, 0, 2]),
        new ProcessResource([0, 0, 0]),
        new ProcessResource([1, 0, 0]),
        new ProcessResource([0, 0, 2]),
    ];
    let result = find_deadlock(alloc, request);
    console.log("should be false:", result.deadlock);
}
