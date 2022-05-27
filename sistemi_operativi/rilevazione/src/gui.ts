
let g_n_table_rows = 2;
let g_n_table_columns = 3;

/**
 * Function that sets an observer on the DOM.
 * 
 * When an element changes a callback gets called.
*/
let observeDOM = (function(){
    let MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    return function(obj: HTMLElement|null, callback: (arg0: any) => void){
        if(!obj || obj.nodeType !== 1 ) {
            return; 
        }

        if(MutationObserver){
            // define a new observer
            let mutationObserver = new MutationObserver(callback);

            // have the observer observe foo for changes in children
            mutationObserver.observe( obj, { childList:true, subtree:true });
            return mutationObserver;
        }
        
        // browser support fallback
        obj.addEventListener('DOMNodeInserted', callback, false);
        obj.addEventListener('DOMNodeRemoved', callback, false);
    }
})();


/**
 * Detect when the input table changes.
 * 
 * When it changes set the correct number of rows and colums,
 * set the colspan correctly so that the "Alloc" and "Request" text aligns correctly with their columns.
 * Add a separator between the Alloc and Request "tables"
 */
observeDOM(document.querySelector("#input_table_body"), function(m: HTMLElement){
    
    const tbody = document.querySelector("#input_table_body")!;
    const n_rows = tbody.children.length;
    const n_elements = tbody.children[0].children.length;
    const n_elements_alloc = Math.floor((n_elements - 1) / 2);
    for (const row of tbody.children) {
        for (const column of row.children) {
            column.setAttribute("class", "");
        }
        row.children[n_elements_alloc].setAttribute("class", "separator");
    }
    
    (document.querySelector("#table_alloc_title")!).setAttribute("colspan", n_elements_alloc.toString());
    (document.querySelector("#table_request_title")!).setAttribute("colspan", n_elements_alloc.toString());

    g_n_table_rows = n_rows;
    g_n_table_columns = n_elements;
});



function create_input_td(){
    const input_td = document.createElement("td");
    const input = document.createElement("input");
    input.setAttribute("type", "number");
    input.setAttribute("class", "form-control");
    input_td.appendChild(input);
    return input_td;
}

/**
 * 
 * <tr>
 *      <td>Px</td><td><input type="number" class="form-control" /></td><td><input type="number" class="form-control" /></td>
 * </tr>
 * 
 */
function add_table_row(){
    const table = document.querySelector("#input_table_body")!;
    //const input_table_header = document.querySelector("#input_table_header");

    const row_tr = document.createElement("tr");

    // <td>Px</td>
    const process_td = document.createElement("td");
    process_td.textContent = "P" + (g_n_table_rows).toString();

    // create td with input 
    const input_td = create_input_td();

    row_tr.appendChild(process_td);
    
    // add copies of the input td as the number of cols-1
    for (let i = 0; i < g_n_table_columns-1; i++){
        row_tr.appendChild(input_td.cloneNode(true));
    }

    table.appendChild(row_tr);

    g_n_table_rows++;
}

function appendAfter(element: Node, reference: Node){
    (reference.parentNode!).insertBefore(element, reference.nextSibling);
}

function remove_table_row(){
    const table = document.querySelector("#input_table_body")!;   
    if (table.children.length > 2) {
        table.lastChild?.remove();
        g_n_table_rows--;
    }
}

/**
 * len = 3 : _ A A
 *           0 1 2
 * 
 * len = 5 : _ A B A B
 *           0 1 2 3 4
 *           
 * len = 7 : _ A B C A B C
 *           0 1 2 3 4 5 6
 * 
 * letter goes at (len - 1) // 2 and (len - 1)
 */
function add_table_col(){
    
    const table = document.querySelector("#input_table_body")!;
    const rows = table.querySelectorAll("tr");

    for (let i = 1; i < rows.length; i++){
        const row = rows[i];
        appendAfter(create_input_td(), row.querySelector(".separator")!)
        row.appendChild(create_input_td());
    }

    g_n_table_columns += 2;

    const header: HTMLElement = rows[0];
    const header_elements: Element[] = Array.from(header.children);

    const letter = String.fromCharCode('A'.charCodeAt(0) + (Math.floor(g_n_table_columns - 1) / 2) - 1);
    const td = document.createElement("td");
    td.textContent = letter;

    appendAfter(td.cloneNode(true), header.querySelector(".separator")!)
    header.appendChild(td.cloneNode(true));
}


function remove_table_col(){
    
    const table = document.querySelector("#input_table_body")!;
    const rows = table.querySelectorAll("tr");

    if (rows[0].children.length <= 3){
        return;
    }

    for (let i = 0; i < rows.length; i++){
        rows[i].removeChild(rows[i].lastChild!);
        rows[i].querySelector(".separator")?.remove();
    }

    g_n_table_columns -= 2;
}


function parse_table_input(){
    const tbody = document.querySelector("#input_table_body")!;

    let first_row = true;

    let values: number[][] = [];

    for (const row of tbody.children) {

        if (first_row){
            first_row = false;
            continue;
        }
        
        values.push([]);
        let first_col = true;

        for (const column of row.children) {

            if (first_col){
                first_col = false;
                continue;
            }

            const input = column.querySelector("input");
            if (input?.valueAsNumber !== undefined)
                values[values.length-1].push(input?.valueAsNumber);

            console.log(input?.valueAsNumber);
        }
        console.log("------");
    }

    return values;
}


function validate_input(matrix: number[][]){
    let result: {
        valid: boolean;
        details: string[];
    } = {"valid": true, "details": []};

    let prev_len: number = -1;

    for (const row of matrix) {
        if (prev_len === -1){
            prev_len = row.length;
        }
        else{
            if (row.length !== prev_len){
                result.details.push("Una riga ha meno elementi delle altre: inserire tutti i dati correttamente e riprovare");
                result.valid = false;
                return result;
            }

            prev_len = row.length;
        }

        for (const col of row) {
            if (Number.isNaN(col)){
                result.details.push("Inserire elementi numerici nella tabella in input");
                result.valid = false;
                return result;
            }
        }
    }

    return result;
}


function create_resource_arrays(matrix: number[][]){

    const result: {
        alloc: ProcessResource[];
        request: ProcessResource[];
    } = {"alloc": [], "request": []};

    let n_cols_per_array = Math.floor(matrix[0].length / 2);
    for (const row of matrix) {
        const alloc_resources: number[] = [];
        const requested_resources: number[] = [];
        for (let i = 0; i < n_cols_per_array; i++){
            alloc_resources.push(row[i]);
        }

        for (let i = n_cols_per_array; i < n_cols_per_array * 2; i++){
            requested_resources.push(row[i]);
        }

        result.alloc.push(new ProcessResource(alloc_resources));
        result.request.push(new ProcessResource(requested_resources));
    }

    return result;
}
