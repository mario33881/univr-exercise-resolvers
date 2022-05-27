
function find_deadlock(alloc: ProcessResource[], requests: ProcessResource[]) {
    
    const result: {deadlock: boolean, steps: string[]} = {deadlock: false, steps: []};

    const n_resources: number = alloc[0].length();
    const n_processes: number = alloc.length;

    const work_values: number[] = initialize_array(0, n_resources);  // [0] * n_resources
    const work: ProcessResource = new ProcessResource(work_values);  
    const finish: boolean[] = initialize_array(false, n_processes);  // [false] * n_processes

    result.steps.push("Ho creato un array work da " + n_resources.toString() + " zeri (tutte le risorse sono allocate) e un array da " + n_processes + " false (uno per processo)");

    let found: boolean = true;

    while (found){
        found = false;
        for (let i: number = 0; i < n_processes && (!found); i++){
            const requested_message: string = "Il processo P_" + i.toString() + " desidera " + requests[i].toString() + " risorse (work: " + work.toString() + ")";
            if (!finish[i] && requests[i].lessOrEqualThan(work)){
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

    for (let i: number = 0; i < n_processes; i++){
        if (finish[i] == false){
            result.steps.push("Il processo P_" + i.toString() + " e' in deadlock");
            result.deadlock = true;
        }
    }

    if (result.deadlock) {
        result.steps.push("E' stato rilevato che qualche processo e' in deadlock");
    }
    else{
        result.steps.push("E' stato rilevato che NESSUN processo e' in deadlock");
    }

    return result;
}


function initialize_array(value: any, n_elements: number) : any[] {
    const array = [];
    for (let i = 0; i < n_elements; i++){
        array.push(value);
    }
    return array;
}


class ProcessResource {
    values: number[];

    constructor(values: number[]) {
        this.values = values;
    }

    lessThan(other: ProcessResource) : boolean {
        if (this.values.length != other.values.length) {
            throw new Error("values must have the same length");
        }
        
        for (let i: number = 0; i < this.values.length; i++){
            if (this.values[i] > other.values[i]){
                return false;
            }
        }
        return true;
    }

    equals(other: ProcessResource) : boolean {
        if (this.values.length != other.values.length) {
            throw new Error("values must have the same length");
        }

        for (let i: number = 0; i < this.values.length; i++){
            if (this.values[i] != other.values[i]){
                return false;
            }
        }
        return true;
    }

    lessOrEqualThan(other: ProcessResource) : boolean {
        return this.lessThan(other) || this.equals(other);
    }

    greaterThan(other: ProcessResource) : boolean {
        return !this.lessOrEqualThan(other);
    }

    greaterOrEqualThan(other: ProcessResource) : boolean {
        return this.greaterThan(other) || this.equals(other);
    }

    length() : number {
        return this.values.length;
    }

    incrementBy(other: ProcessResource) : void {
        if (this.values.length != other.values.length) {
            throw new Error("values must have the same length");
        }

        for (let i: number = 0; i < this.values.length; i++){
            this.values[i] += other.values[i];
        }        
    }

    toString() : string {
        return "(" + this.values.toString() + ")";
    }
}