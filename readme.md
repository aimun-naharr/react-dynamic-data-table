# React Dynamic Datatable

```
import DynamicTable from 'react-dynamic-data-table-component;

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
         cell: (row) => row.documentType,
        sortable: true,
        width: "130px",

    }
]

const data=[
  {
    "id": 1,
    "name": "John Doe",
    "age": 25,
    "email": "johndoe@example.comdddddddddddddddd",
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


<DynamicTable data={data} columns={columns} tableId='AN_UNIQUE_ID' />
```
