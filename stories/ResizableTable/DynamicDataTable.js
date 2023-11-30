import PropTypes from 'prop-types';
import { Fragment, useEffect, useLayoutEffect, useState } from 'react';
import { randomIdGenerator } from '../../utility/utils';
import SmallTable from './SmallTable';
import ResizableTable from './table-widgets/ColumnResizer';
import TH from './table-widgets/TH';
import TR from './table-widgets/TR';
import Pagination from './table-widgets/custom-pagination';
import useMediaQuery from './table-widgets/custom-pagination/hooks/useMediaQuery';
import './table.css';



const DynamicDataTable = ( props ) => {
    const {
        tableId,
        columns = [],
        data = [],
        expandableRows = false,
        expandIcon,
        onSort,
        sortServer = false,
        paginationServer = false,
        className = '',
        filter = false,
        filterArray = [],
        columnCache = false,
        rowPerPage = 10,
        progressPending,
        selectableRows = false,
        onSelectedRowsChange,
        selectableRowSelected,
        ExpandedComponent } = props;

    const allData = data?.map( d => (
        { ...d, rowId: randomIdGenerator(), isSelected: false }
    ) );
    const isSmallScreen = useMediaQuery( "(max-width: 800px)" );
    const cachedCols = JSON.parse( localStorage.getItem( tableId ) ) ?? [];
    const columnsModified = columns.map( c => ( { ...c, sortingOrder: 'asc' } ) );

    //states
    const [allColumns, setAllColumns] = useState( cachedCols?.length ? cachedCols : [...columnsModified] );
    const fixedColumns = allColumns?.filter( el => el.isFixed );
    const resizeColumns = allColumns?.filter( el => !el.isFixed );

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
    }, [data] );


    const mergedColumns = [...fixedColumns, ...resizeColumns]; // table columns

    // handles pagination
    const handlePage = ( page ) => {
        setCurrentPage( page );
    };


    // sorts tabele data
    const handleSort = ( column ) => {
        console.log( column.sortingOrder )
        const direction = column.sortingOrder === 'asc' ? 'desc' : 'asc';
        if ( sortServer ) {
            onSort( column, direction );
        } else {
            if ( column.sortable ) {
                if ( column.type === 'number' ) {
                    console.log( column )
                    columnsData.sort( ( a, b ) => {
                        // if sorting order is true it will sort in ascending order
                        return column.sortingOrder === 'asc' ? a[column.selector] - b[column.selector] : b[column.selector] - a[column.selector];
                    } );
                } else if ( column.type === 'date' ) {
                    columnsData.sort( ( a, b ) => {
                        return column.sortingOrder === 'asc' ? new Date( a[column.selector] ) - new Date( b[column.selector] ) : new Date( b[column.selector] ) - new Date( a[column.selector] );
                    } );
                } else {
                    columnsData.sort( ( a, b ) => {
                        // console.log( a[column.selector] );
                        return column.sortingOrder === 'asc' ? a[column.selector].localeCompare( b[column.selector] ) : b[column.selector].localeCompare( a[column.selector] );
                    } );
                }
            }

        }
        column.sortingOrder = direction;
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


    const handleSelectAllRows = ( e ) => {
        const selectedRows = allData.map( d => ( { ...d, isSelected: e.target.checked } ) );
        setColumnsData( selectedRows );
        onSelectedRowsChange( selectedRows.filter( s => s.isSelected === true ) );
    };


    const indexOfLastData = currentPage * rowPerPage;
    const indexOfFirstData = indexOfLastData - rowPerPage;
    const dataSlice = data.length > rowPerPage ? [...columnsData].slice( indexOfFirstData, indexOfLastData ) : [...columnsData];

    return (
        <>
            <div
                className={`fixed-and-resize-table-container
                ${className ? className : ''}`}
                id={tableId}
                style={
                    {
                        overflowX: 'scroll',
                        overflowY: 'auto',
                        height: 'max-content',
                        minHeight: '200px'
                    }
                }
            >
                {!isSmallScreen ? <ResizableTable
                    fixed={expandableRows && selectableRows ? fixedColumns?.length + 2 : expandableRows || selectableRows ? fixedColumns.length + 1 : 0}
                    // fixed={0}
                    responsive={true}
                    bordered
                    mainClass={`resizebom-${randomIdGenerator().toString()}`}
                    tableId={`bomTable-${randomIdGenerator().toString()}`}
                    className="">
                    <thead>
                        <tr>
                            {
                                selectableRows ? <th
                                    style={{
                                        width: '40px',
                                        left: 0,
                                        position: 'sticky',
                                        zIndex: 1,
                                        textAlign: 'center'
                                    }}

                                    className='fixed-cell table-header fixed-table-column'
                                >
                                    <input type='checkbox' onChange={handleSelectAllRows} checked={columnsData.every( elm => elm.isSelected === true )} />
                                </th> : null
                            }

                            {expandableRows ? <th
                                style={{
                                    width: '40px',
                                    left: selectableRows ? getLeftDistanceOfFixedColumn( 0 ) : 0,
                                    position: 'sticky',
                                    zIndex: 1
                                }}
                                className='fixed-table-column fixed-cell table-header ' >
                            </th> : null}
                            {mergedColumns?.map( ( column, i ) => (
                                <Fragment
                                    key={column.id}
                                >
                                    <TH
                                        column={column}
                                        index={i}
                                        getLeftDistanceOfFixedColumn={getLeftDistanceOfFixedColumn}
                                        expandableRows={expandableRows}
                                        handleSort={handleSort}
                                        setAllColumns={setAllColumns}
                                        allColumns={allColumns}
                                        tableId={tableId}
                                        columnCache={columnCache}
                                        selectableRows={selectableRows}

                                    />
                                </Fragment>
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
                        {progressPending ? <tr>
                            <td colSpan={expandableRows || selectableRows ? columns.length + 1 : columns.length} >
                                <p>loading...</p></td>
                        </tr> : data.length ? dataSlice?.map( ( row, index ) => (
                            <Fragment key={row.rowId}>
                                <TR
                                    expandableRows={expandableRows}
                                    expandIcon={expandIcon}
                                    row={row}
                                    index={index}
                                    mergedColumns={mergedColumns}
                                    getLeftDistanceOfFixedColumn={getLeftDistanceOfFixedColumn}
                                    ExpandedComponent={ExpandedComponent}
                                    selectableRows={selectableRows}
                                    columnsData={columnsData}
                                    setColumnsData={setColumnsData}
                                    onSelectedRowsChange={onSelectedRowsChange}
                                    selectableRowSelected={selectableRowSelected}
                                />
                            </Fragment>
                        ) ) : <tr >
                            <td
                                colSpan={expandableRows ? columns.length + 1 : columns.length} style={{
                                    textAlign: 'center',
                                    paddingTop: '40px'
                                }}>
                                There is no data to show
                            </td>
                        </tr>}


                    </tbody>
                </ResizableTable> : <SmallTable
                    mergedColumns={mergedColumns}
                    expandableRows={expandableRows}
                    handleSort={handleSort}
                    setAllColumns={setAllColumns}
                    allColumns={allColumns}
                    tableId={tableId}
                    columnCache={columnCache}
                    selectableRows={selectableRows}
                    filter={filter}
                    filterArray={filterArray}
                    progressPending={progressPending}
                    data={dataSlice}
                    columnsData={columnsData}
                    onSelectedRowsChange={onSelectedRowsChange}
                    setColumnsData={setColumnsData}
                    selectableRowSelected={selectableRowSelected}

                />}
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
        id: PropTypes.string.isRequired,
        selector: PropTypes.string.isRequired

    } ) ),
    data: PropTypes.array.isRequired,
    expandableRows: PropTypes.bool,
    onSort: PropTypes.func,
    sortServer: PropTypes.bool,
    paginationServer: PropTypes.bool,
    className: PropTypes.string,
    filter: PropTypes.bool,
    filterArray: PropTypes.array,
    ExpandedComponent: PropTypes.elementType,
    columnCache: PropTypes.bool,
    rowPerPage: PropTypes.number,
    selectableRows: PropTypes.bool,
    onSelectedRowsChange: PropTypes.func,
    selectableRowSelected: PropTypes.func
};

export default DynamicDataTable