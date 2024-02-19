import columns from '../configs/columns'
import allData from '../configs/fakeData.json'
import DynamicTable from '../src'
export default {
    title: 'Dynamic Table',
    component: 'Table',
    tags: ['autodocs'],
    // argTypes: {
    //     expandableRows: false
    // }

}

export const Default = () => <DynamicTable
    paginationServer

    columns={columns}

    data={allData}
    tableId='resizable-data-table-default'
    columnCache={false}
    progressPending={!true}

    selectableRows={false}
/>


export const ExpandableRows = () => <DynamicTable
    paginationServer
    expandableRows={true}
    columns={columns}

    data={allData}
    tableId='resizable-data-table-with-expandable-rows'
    columnCache={false}
    progressPending={!true}
    selectableRows={false}

/>


export const SelectableRows = () => <DynamicTable
    paginationServer
    columns={columns}
    onSelectedRowsChange={() => { }}
    data={allData}
    tableId='resizable-data-table-with-selectable-rows'
    columnCache={false}
    progressPending={!true}
    selectableRows={true}

/>