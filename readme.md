# React Dynamic Datatable

 Welcome to React Dynamic DataTable, a powerful and flexible React data table library designed to supercharge your data presentation in web applications. Whether you're building a robust dashboard, a comprehensive management system, or a data-driven application, our library empowers you with a feature-rich and customizable data table component.

 ## Key features
* Resizable Columns
* Fixed Columns
* Sorting
* Pagination
* Selectable rows
* Responsive
* Expandable rows


 ### Installation
 ```
npm i react-dynamic-data-table-component
```
### Let's try to use it
```
import DynamicTable from 'react-dynamic-data-table-component';

const columns = [
    {
        id: 'nameId', //must provide a id
        name: "Name",
        selector: "name",
        sortable: true,
        width: "130px",
        isFixed: true,
        unResizable: true
    },
    {
        id: 'addressId',
        name: "Address",
         cell: (row) => row.address,
        sortable: true,
        width: "130px",

    }
]

const data=[
  {
    "id": 1,
    "name": "John Doe",
    "age": 25,
    "email": "johndoe@example.com",
    "address": "142 Center Street, Los Angeles, CA 90012",
    "city": "Anytown",
    "country": "USA",
   
  },
  {
    "id": 2,
    "name": "Alice Smith",
    "age": 30,
    "email": "alice.smith@example.com",
    "address": "456 Elm St",
    "city": "Otherville",
    "country": "Canada",
   
  }
]


<DynamicTable
data={data}
columns={columns}
tableId='AN_UNIQUE_ID'
/>
```

### Selectable rows

```
const handleSelectedRows=()=>{}

<DynamicTable
data={data}
columns={columns}
tableId='AN_UNIQUE_ID'
selectableRows
onSelectedRowsChange={handleSelectedRows}
/>
```

### Expandable Rows

```
const ExpandableComponent=()=>{}

<DynamicTable
data={data}
columns={columns}
tableId='AN_UNIQUE_ID'
expandableRows
ExpandedComponent={ExpandableComponent}
/>
```



