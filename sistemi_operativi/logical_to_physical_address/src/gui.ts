
/// row counter for the page table
let frame_number_counter: number = 1;


/**
 * Adds a row to the end of the page table.
 *
 * A page table row has this structure:
 * <tr>
 *     <td>{{ frame_number_counter }}</td>
 *     <td><input type="number" class="form-control frame_number" /></td>
 *     <td></td>
 * </tr>
 */
function add_page_table_row() {
    const page_table: HTMLElement = document.getElementById("page_table")!;
    const page_table_row: HTMLTableRowElement = document.createElement("tr");

    // <td>{{ frame_number_counter }}</td>
    const page_number_th: HTMLTableCellElement = document.createElement("th");
    page_number_th.textContent = frame_number_counter.toString();

    // <td><input type="number" class="form-control frame_number" /></td>
    const frame_number_input_th: HTMLTableCellElement = document.createElement("th");
    const frame_number_input: HTMLInputElement = document.createElement("input");
    frame_number_input.setAttribute("type", "number");
    frame_number_input.className = "form-control frame_number";
    frame_number_input_th.appendChild(frame_number_input);

    // add the 3 colums to the row
    page_table_row.appendChild(page_number_th);
    page_table_row.appendChild(frame_number_input_th);
    page_table_row.appendChild(document.createElement("th"));

    // add the row to the page table and increase the row counter
    page_table.appendChild(page_table_row);
    frame_number_counter++;
}


/**
 * Removes the last row from the page table.
 */
function remove_page_table_row() {
    // at least one row must be present in the table
    if (frame_number_counter <= 1){
        frame_number_counter = 1;
        return;
    }

    // try to remove the row: if that works decrease the row counter
    const page_table: HTMLElement = document.getElementById("page_table")!;
    const last_row: ChildNode = page_table.lastChild!;
    if (last_row.nodeName.toLowerCase() === "tr"){
        page_table.removeChild(last_row);
        frame_number_counter--;
    }
}


/**
 * Parse the user input from the GUI.
 */
function parse_input() : {success: boolean; logical_address: null | number; page_size: null | number; page_table: number[]; } {
    const success : {
        success: boolean;
        logical_address: null | number;
        page_size: null | number;
        page_table: number[];
    } = {"success": true, "logical_address": null, "page_size": null, "page_table": []};

    // try to parse the logical address
    const logical_address_el: HTMLInputElement = <HTMLInputElement> document.getElementById("logical_address");
    const logical_address: number = logical_address_el.valueAsNumber;
    if (!Number.isNaN(logical_address)){
        logical_address_el.className = "form-control";
        success.logical_address = logical_address;
    }
    else{
        logical_address_el.className = "form-control invalid-input";
        success.success = false;
    }

    // try to parse the page size
    const page_size_el: HTMLInputElement = <HTMLInputElement> document.getElementById("page_size");
    const page_size: number = page_size_el.valueAsNumber;
    if (!Number.isNaN(page_size)){
        page_size_el.className = "form-control";
        success.page_size = page_size;
    }
    else{
        page_size_el.className = "form-control invalid-input";
        success.success = false;
    }

    // try to parse each row of the page table
    const page_table_el: HTMLElement = document.getElementById("page_table")!;
    for (const child of page_table_el.children) {
        if (child.nodeName.toLowerCase() === "tr"){
            const value: number = child.getElementsByTagName("input")[0].valueAsNumber;
            if (Number.isNaN(value)){
                child.className = "invalid-input";
            }
            else{
                child.className = "";
                success.page_table.push(value);
            }
        }
    }

    return success;
}
