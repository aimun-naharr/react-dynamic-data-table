import columns from "../../configs/columns"
import data from '../../configs/fakeData.json'
import ResizableTable from "./DynamicDataTable"

export default {
    title: 'Resizable Table',
    component: 'Table',
    tags: ['autodocs'],

}

export const Default = () => <ResizableTable tableId='12' mainClass='123' columns={columns} data={data} />

export const ExpandableRows = () => <ResizableTable tableId='expandable-table' mainClass='123' columns={columns} data={data} expandableRows={true} />