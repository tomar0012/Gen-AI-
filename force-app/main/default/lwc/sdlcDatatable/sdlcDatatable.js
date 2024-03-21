import LightningDatatable from "lightning/datatable";
import richTextColumnType from "./richTextColumnType.html";
export default class SdlcDatatable extends LightningDatatable  {
    static customTypes={
        // custom type definition
        richText: {
            template: richTextColumnType,
            standardCellLayout: true
        }
    }
}