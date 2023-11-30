import columns from '../../configs/columns'
import allData from '../../configs/fakeData.json'
import DynamicDataTable from "./DynamicDataTable"

export default {
    title: 'Resizable Table',
    component: 'Table',
    tags: ['autodocs'],

}

export const Default = () => <DynamicDataTable
    paginationServer
    // expandableRows={true}
    columns={columns}
    // onSort={handleSort}
    // className="react-custom-dataTable"
    data={allData}
    tableId='master-document-all-data-list'
    columnCache={false}
    progressPending={!true}
    // onSelectedRowsChange={() => { }}
    // selectableRowSelected={() => { }}
    selectableRows={false}
/>

export const ExpandableRows = () => <DynamicDataTable
    paginationServer
    expandableRows={true}
    columns={columns}

    data={allData}
    tableId='master-document-all-data-list-2'
    columnCache={false}
    progressPending={!true}
    selectableRows={false}

/>


export const SelectableRows = () => <DynamicDataTable
    paginationServer
    columns={columns}
    onSelectedRowsChange={() => { }}
    data={allData}
    tableId='master-document-all-data-list-2'
    columnCache={false}
    progressPending={!true}
    selectableRows={true}

/>