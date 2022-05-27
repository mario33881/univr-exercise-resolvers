"use strict";
function find_deadlock(alloc, requests) {
    const result = { deadlock: false, steps: [] };
    const n_resources = alloc[0].length();
    const n_processes = alloc.length;
    const work_values = initialize_array(0, n_resources); // [0] * n_resources
    const work = new ProcessResource(work_values);
    const finish = initialize_array(false, n_processes); // [false] * n_processes
    result.steps.push("Ho creato un array work da " + n_resources.toString() + " zeri (tutte le risorse sono allocate) e un array da " + n_processes + " false (uno per processo)");
    let found = true;
    while (found) {
        found = false;
        for (let i = 0; i < n_processes && (!found); i++) {
            const requested_message = "Il processo P_" + i.toString() + " desidera " + requests[i].toString() + " risorse (work: " + work.toString() + ")";
            if (!finish[i] && requests[i].lessOrEqualThan(work)) {
                work.incrementBy(alloc[i]);
                finish[i] = true;
                found = true;
                result.steps.push(requested_message + ".\r\nPosso soddisfare la richiesta (ottimisticamente il processo sara' in grado di terminare).\r\nOra work vale " + work.toString());
            }
            else if (finish[i]) {
                result.steps.push("Il processo P_" + i.toString() + " e' gia' stato soddisfatto");
            }
            else if (!requests[i].lessOrEqualThan(work)) {
                result.steps.push(requested_message + ".\r\nNon ho risorse a sufficienza per soddisfare il processo P_" + i.toString());
            }
        }
    }
    for (let i = 0; i < n_processes; i++) {
        if (finish[i] == false) {
            result.steps.push("Il processo P_" + i.toString() + " e' in deadlock");
            result.deadlock = true;
        }
    }
    if (result.deadlock) {
        result.steps.push("E' stato rilevato che qualche processo e' in deadlock");
    }
    else {
        result.steps.push("E' stato rilevato che NESSUN processo e' in deadlock");
    }
    return result;
}
function initialize_array(value, n_elements) {
    const array = [];
    for (let i = 0; i < n_elements; i++) {
        array.push(value);
    }
    return array;
}
class ProcessResource {
    constructor(values) {
        this.values = values;
    }
    lessThan(other) {
        if (this.values.length != other.values.length) {
            throw new Error("values must have the same length");
        }
        for (let i = 0; i < this.values.length; i++) {
            if (this.values[i] > other.values[i]) {
                return false;
            }
        }
        return true;
    }
    equals(other) {
        if (this.values.length != other.values.length) {
            throw new Error("values must have the same length");
        }
        for (let i = 0; i < this.values.length; i++) {
            if (this.values[i] != other.values[i]) {
                return false;
            }
        }
        return true;
    }
    lessOrEqualThan(other) {
        return this.lessThan(other) || this.equals(other);
    }
    greaterThan(other) {
        return !this.lessOrEqualThan(other);
    }
    greaterOrEqualThan(other) {
        return this.greaterThan(other) || this.equals(other);
    }
    length() {
        return this.values.length;
    }
    incrementBy(other) {
        if (this.values.length != other.values.length) {
            throw new Error("values must have the same length");
        }
        for (let i = 0; i < this.values.length; i++) {
            this.values[i] += other.values[i];
        }
    }
    toString() {
        return "(" + this.values.toString() + ")";
    }
}
