import columns from '../configs/columns'
import allData from '../configs/fakeData.json'
import ResizableTable from "../src/ResizableTable"

export default {
    title: 'Resizable Table',
    component: 'Table',
    tags: ['autodocs'],
    // argTypes: {
    //     expandableRows: false
    // }

}

export const Default = () => <ResizableTable
    paginationServer

    columns={columns}

    data={allData}
    tableId='resizable-data-table-default'
    columnCache={false}
    progressPending={!true}

    selectableRows={false}
/>


export const ExpandableRows = () => <ResizableTable
    paginationServer
    expandableRows={true}
    columns={columns}

    data={allData}
    tableId='resizable-data-table-with-expandable-rows'
    columnCache={false}
    progressPending={!true}
    selectableRows={false}

/>


export const SelectableRows = () => <ResizableTable
    paginationServer
    columns={columns}
    onSelectedRowsChange={() => { }}
    data={allData}
    tableId='resizable-data-table-with-selectable-rows'
    columnCache={false}
    progressPending={!true}
    selectableRows={true}

/>