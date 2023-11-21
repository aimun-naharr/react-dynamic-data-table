import PropTypes from 'prop-types';
import { Fragment, useEffect, useLayoutEffect, useState } from 'react';
import { randomIdGenerator } from '../../utility/utils';
import ResizableTable from './table-widgets/ColumnResizer';
import TH from './table-widgets/TH';
import Pagination from './table-widgets/custom-pagination';
import './table.css';




const DynamicDataTable = ( props ) => {
    const {
        tableId,
        columns = [],
        data,
        expandableRows = false,
        expandIcon,
        onSort,
        sortServer = false,
        paginationServer = false,
        className,
        filter = false,
        filterArray = [],
        columnCache = false,
        rowPerPage = 5,
        ExpandedComponent } = props;
    const totalPages = Math.ceil( data.length / rowPerPage );

    const allData = data.map( d => {
        return { ...d, rowId: randomIdGenerator() };
    } );
    const cachedCols = JSON.parse( localStorage.getItem( tableId ) ) ?? [];


    //states
    const [allColumns, setAllColumns] = useState( cachedCols?.length ? cachedCols : [...columns] );
    const fixedColumns = allColumns?.filter( el => el.isFixed );
    const resizeColumns = allColumns?.filter( el => !el.isFixed );
    const getData = () => {
        return allData;
    };
    const [columnsData, setColumnsData] = useState( [...allData] ); //states for table data
    const [currentPage, setCurrentPage] = useState( 1 );
    const [fixedWidthArr, setFixedWidthArr] = useState( [] ); //stores fixed column widths


    //gets widths of all fixed columns and stores it in an array
    const getWidthOfFixedColumns = () => {
        const tableContainer = document.getElementById( tableId );
        const fixedColumnElementsWidth = [];
        const fixed = tableContainer?.querySelectorAll( '.fixed-table-column' );
        fixed.forEach( element => {
            const clientWidth = element.getBoundingClientRect().width;
            fixedColumnElementsWidth.push( clientWidth );
        } );
        setFixedWidthArr( fixedColumnElementsWidth );
    };

    useLayoutEffect( () => {
        getWidthOfFixedColumns();
    }, [fixedColumns?.length] );
    useEffect( () => {
        if ( columnCache && !cachedCols?.length ) {
            localStorage.setItem( tableId, JSON.stringify( [...fixedColumns, ...resizeColumns] ) );
        } else if ( columnCache && cachedCols?.length ) {
            setAllColumns( cachedCols );
        }
    }, [] );
    useEffect( () => {
        setColumnsData( allData );
    }, [allData.length] );

    const mergedColumns = [...fixedColumns, ...resizeColumns]; // table columns


    //handles expandable row functionality
    const handleExpandedRow = ( col, index ) => {
        if ( col?.expanded ) {
            const updatedRows = columnsData.map( c => {
                if ( c.rowId === col.rowId ) {
                    return { ...c, expanded: false };
                }
                return c;
            } );
            setColumnsData( updatedRows );

        } else {
            const updatedRows = columnsData.map( c => {
                if ( c.rowId === col.rowId ) {
                    return { ...c, expanded: true };
                }
                return c;
            } );
            setColumnsData( updatedRows );
        }

    };


    // handles pagination
    const handlePage = ( page ) => {
        setCurrentPage( page );
    };

    let direction = 'asc'
    // sorts tabele data
    const handleSort = ( column ) => {
        if ( sortServer ) {
            onSort( column, direction );
            direction = direction === 'asc' ? 'desc' : 'asc';
        } else {
            if ( column.sortable ) {
                if ( column.type === 'number' ) {
                    columnsData.sort( ( a, b ) => {
                        // if sorting order is true it will sort in ascending order
                        return column.sortingOrder ? a[column.selector] - b[column.selector] : b[column.selector] - a[column.selector];
                    } );
                } else if ( column.type === 'date' ) {
                    columnsData.sort( ( a, b ) => {
                        return column.sortingOrder ? new Date( a[column.selector] ) - new Date( b[column.selector] ) : new Date( b[column.selector] ) - new Date( a[column.selector] );
                    } );
                } else {
                    columnsData.sort( ( a, b ) => {
                        // console.log( a[column.selector] );
                        return column.sortingOrder ? a[column.selector].localeCompare( b[column.selector] ) : b[column.selector].localeCompare( a[column.selector] );
                    } );
                }
            }
            const updatedData = allColumns.map( d => {
                if ( d.id === column.id ) {
                    if ( d?.sortingOrder ) {
                        d['sortingOrder'] = false;
                    } else {
                        d['sortingOrder'] = true;
                    }
                }
                return d;
            } );
            setAllColumns( updatedData );
        }
    };


    //returns sum of it's previous array elements to get the distance of sticky left property
    const getLeftDistanceOfFixedColumn = ( n = 0 ) => {
        if ( n === 0 ) {
            return 0;
        } else if ( n === 1 ) {
            const value = fixedWidthArr[0] ?? 0;
            return value;
        } else {
            let value = 0;
            for ( let i = 0; i < n; i++ ) {
                if ( typeof fixedWidthArr[i] === 'number' ) {
                    value += fixedWidthArr[i];
                }

            }
            return value;
        }
    };
    const indexOfLastData = currentPage * rowPerPage;
    const indexOfFirstData = indexOfLastData - rowPerPage;
    const dataSlice = columnsData.length > rowPerPage ? [...columnsData].slice( indexOfFirstData, indexOfLastData ) : [...columnsData];

    return (
        <>
            <div
                className={`fixed-and-resize-table-container ${className ? className : ''}`}
                id={tableId}
                style={
                    {
                        overflowX: 'scroll',
                        overflowY: 'hidden',
                        height: 'max-content',
                        minHeight: '200px'
                    }
                }
            >
                <ResizableTable
                    fixed={expandableRows ? fixedColumns?.length + 1 : fixedColumns.length}
                    responsive={true}
                    bordered
                    mainClass={`resizebom-${randomIdGenerator().toString()}`}
                    tableId={`bomTable-${randomIdGenerator().toString()}`}
                    className="">
                    <thead>
                        <tr>
                            {expandableRows ? <th
                                style={{
                                    width: '40px',
                                    left: 0,
                                    position: 'sticky',
                                    zIndex: 100
                                }}
                                className='fixed-table-column fixed-cell table-header ' >
                                <div className='empty-container'></div>
                            </th> : null}
                            {mergedColumns?.map( ( column, i ) => (
                                <TH key={column.id}
                                    column={column}
                                    index={i}
                                    getLeftDistanceOfFixedColumn={getLeftDistanceOfFixedColumn}
                                    expandableRows={expandableRows}
                                    handleSort={handleSort}
                                    setAllColumns={setAllColumns}
                                    allColumns={allColumns}
                                    tableId={tableId}
                                    columnCache={columnCache}
                                />
                            ) )}
                        </tr>
                    </thead>
                    <tbody >
                        {/* filtering row ========================*/}
                        <tr hidden={!filter} >
                            {expandableRows ? <td className='fixed-cell' style={{ left: 0 }}></td> : null}
                            {
                                mergedColumns?.map( ( c, indx ) => (
                                    <td key={indx + 1} id={indx + 1}
                                        style={{
                                            padding: '2px',
                                            left: c.isFixed && getLeftDistanceOfFixedColumn( expandableRows ? indx + 1 : indx )
                                        }}
                                        className={`${c.isFixed ? 'fixed-cell' : ''}`}
                                    >
                                        {filterArray.find( f => f[c?.selector] )?.[c.selector] ?? null}
                                    </td>
                                ) )
                            }

                        </tr>
                        {/* table data========================== */}
                        {data.length ? dataSlice?.map( ( column, index ) => (
                            // <TableRows key={column.id}
                            //     expandableRows={expandableRows}
                            //     handleExpandedRow={handleExpandedRow}
                            //     column={column}
                            //     index={index}
                            //     expandIcon={expandIcon}
                            //     mergedColumns={mergedColumns}
                            //     getLeftDistanceOfFixedColumn={getLeftDistanceOfFixedColumn}
                            //     columns={columns}
                            //     ExpandedComponent={ExpandedComponent}
                            // />
                            <Fragment key={column.id}>
                                <tr>
                                    {expandableRows && <td
                                        className='fixed-cell'
                                        style={{ textAlign: 'center', left: 0, cursor: 'pointer', position: 'sticky' }}
                                        onClick={() => handleExpandedRow( column, index )}
                                    >
                                        {expandIcon ? expandIcon : column.expanded ? <span style={{ fontSize: '1.5rem' }}>&#8722;</span> : <span
                                            style={{ fontSize: '1.5rem' }}>&#43;</span>}
                                    </td>}
                                    {
                                        mergedColumns?.map( ( c, indx ) => (
                                            <Fragment key={c.id}>
                                                <td
                                                    className={`${c.isFixed ? 'fixed-cell' : ''}`}
                                                    id={`${c.id}${column.rowId?.toString()}d`}
                                                    style={{
                                                        width: c.width ?? '',
                                                        textAlign: c.type === 'action' || c.center ? 'center' : c.type === 'number' ? 'right' : 'left',
                                                        left: c.isFixed && getLeftDistanceOfFixedColumn( expandableRows ? indx + 1 : indx )
                                                    }}
                                                >
                                                    {c?.cell ? c.cell( column, index ) : column[c.selector]}

                                                </td>
                                            </Fragment>
                                        ) )
                                    }
                                </tr>

                                {/* expandable component ========================*/}
                                {column.expanded ? <tr
                                    key={`${column.id}${index}`}
                                >
                                    <td
                                        style={{ position: 'sticky', left: 0 }}
                                        colSpan={columns.length + 1} >
                                        <div className='expandable-component'>
                                            {ExpandedComponent ? <ExpandedComponent data={column} /> : <p>Add a custom component in ExpandedComponent prop</p>}
                                        </div>
                                    </td>
                                </tr> : null}

                            </Fragment>
                        ) ) : <tr >
                            <td colSpan={expandableRows ? columns.length + 1 : columns.length} style={{ textAlign: 'center', paddingTop: '40px' }}>
                                There is no data to show
                            </td>
                        </tr>}


                    </tbody>
                </ResizableTable>
            </div>

            {!paginationServer && !!data.length ? <Pagination
                className="pagination-bar"
                currentPage={currentPage}
                totalCount={data.length}
                pageSize={rowPerPage}
                // onPageChange={page => setCurrentPage( page )}
                onPageChange={handlePage}
            /> : null}
        </>
    );
}

DynamicDataTable.propTypes = {
    tableId: PropTypes.string.isRequired,
    columns: PropTypes.arrayOf( PropTypes.shape( {
        id: PropTypes.string.isRequired

    } ) ),
    data: PropTypes.array.isRequired,
    expandableRows: PropTypes.bool,
    onSort: PropTypes.func,
    sortServer: PropTypes.bool,
    paginationServer: PropTypes.bool,
    className: PropTypes.string,
    filter: PropTypes.bool,
    filterArray: PropTypes.array,
    ExpandedComponent: PropTypes.node,
    columnCache: PropTypes.bool,
    rowPerPage: PropTypes.number
};

export default DynamicDataTable