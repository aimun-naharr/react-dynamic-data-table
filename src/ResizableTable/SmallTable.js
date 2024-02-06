import classNames from "classnames";
import { Fragment, useEffect, useState } from "react";

export default function SmallTable( props ) {
    const { mergedColumns, expandableRows, selectableRows, filter, filterArray, progressPending, data, expandIcon = false, columnsData, setColumnsData, onSelectedRowsChange, selectableRowSelected } = props;

    const handleSelectAllRows = ( e ) => {
        const selectedRows = columnsData.map( d => ( { ...d, isSelected: e.target.checked } ) );
        setColumnsData( selectedRows );
        onSelectedRowsChange( selectedRows.filter( s => s.isSelected === true ) );
    };
    return (
        <table className='resize-and-fixed-table'>
            <thead>
                <tr>
                    {
                        selectableRows ? <th
                            style={{
                                width: '40px',
                                textAlign: 'center'
                            }}
                            className=''
                        >
                            <input
                                type='checkbox'
                                onChange={handleSelectAllRows}
                                checked={columnsData.every( elm => elm.isSelected === true )}
                            />
                        </th> : null
                    }
                    {expandableRows ? <th
                        style={{
                            width: '40px'
                        }}
                    >
                    </th> : null}
                    {
                        mergedColumns.map( c => {
                            return <th style={{
                                width: c.width ?? '100px'
                            }} key={c.id}>{c.name}</th>;
                        } )
                    }
                </tr>
            </thead>
            <tbody>
                <tr hidden={!filter} >
                    {expandableRows ? <td className='fixed-cell' style={{ left: 0 }}></td> : null}
                    {
                        mergedColumns?.map( ( c, indx ) => (
                            <td key={indx + 1} id={indx + 1}
                                style={{
                                    padding: '2px'

                                }}
                                className={`${c.isFixed ? 'fixed-cell' : ''}`}
                            >
                                {filterArray.find( f => f[c?.selector] )?.[c.selector] ?? null}
                            </td>
                        ) )
                    }

                </tr>
                {progressPending ? <tr>
                    <td
                        colSpan={expandableRows || selectableRows ? mergedColumns.length + 1 : mergedColumns.length}
                    >
                        <p>loading...</p>
                    </td>
                </tr> : data.length ? data?.map( ( row, index ) => (
                    <Fragment key={row.rowId}>
                        <TR
                            expandableRows={expandableRows}
                            expandIcon={expandIcon}
                            row={row}
                            index={index}
                            mergedColumns={mergedColumns}
                            // getLeftDistanceOfFixedColumn={getLeftDistanceOfFixedColumn}
                            // ExpandedComponent={ExpandedComponent}
                            selectableRows={selectableRows}
                            columnsData={columnsData}
                            setColumnsData={setColumnsData}
                            onSelectedRowsChange={onSelectedRowsChange}
                            selectableRowSelected={selectableRowSelected}
                        />
                    </Fragment>
                ) ) : <tr >
                    <td
                        colSpan={expandableRows ? mergedColumns.length + 1 : mergedColumns.length} style={{
                            textAlign: 'center',
                            paddingTop: '40px'
                        }}>
                        There is no data to show
                    </td>
                </tr>}


            </tbody>
        </table>
    );
}


const TR = ( props ) => {
    const { expandableRows,
        expandIcon,
        row,
        index,
        mergedColumns,
        ExpandedComponent,
        selectableRows,
        columnsData,
        setColumnsData,
        onSelectedRowsChange,
        selectableRowSelected
    } = props;
    const [expand, setExpand] = useState( false );

    const handleExpandedRow = () => {
        setExpand( prev => !prev );
    };
    const handleSelect = ( e ) => {
        const filteredData = columnsData.filter( c => c.id !== row.id );
        const modifiedRow = { ...row, isSelected: e.target.checked };
        const updated = filteredData.toSpliced( index, 0, modifiedRow );
        setColumnsData( updated );
        onSelectedRowsChange( updated.filter( u => u.isSelected === true ) );
    };

    useEffect( () => {
        if ( selectableRowSelected ) {
            const preSelectedRow = selectableRowSelected( row );
            if ( preSelectedRow?.rowId === row?.rowId ) {
                row.isSelected = true;
            }
        }
    }, [] );

    return <>
        <tr className={classNames( '', {
            'selected-row': row.isSelected
        } )}>
            {selectableRows ? <td
                style={{
                    textAlign: 'center'
                }}>
                <input
                    type="checkbox"
                    checked={row.isSelected}
                    onChange={handleSelect} />
            </td> : null}

            {expandableRows && <td

                style={{
                    textAlign: 'center',
                    cursor: 'pointer'
                }}
                onClick={() => handleExpandedRow( row, index )}
            >
                {expandIcon ? expandIcon : row.expanded ? <span style={{ fontSize: '1.5rem' }}>&#8722;</span> : <span
                    style={{ fontSize: '1.5rem' }}>&#43;</span>}
            </td>}
            {
                mergedColumns?.map( ( c, indx ) => (
                    <Fragment key={c.id}>
                        <td
                            id={`${c.id}${row.rowId?.toString()}d`}
                            style={{
                                width: c.width ?? '',
                                textAlign: c.type === 'action' || c.center ? 'center' : c.type === 'number' ? 'right' : 'left'


                            }}
                        >
                            <div style={{
                                width: '100%',
                                textAlign: c.type === 'action' || c.center ? 'center' : c.type === 'number' ? 'right' : 'left'

                            }}>
                                {c?.cell ? c.cell( row, index ) : row[c.selector]}
                            </div>

                        </td>

                    </Fragment>
                ) )
            }

        </tr>

        {/* expandable component ========================*/}
        {expand ? <tr
            key={`${row.rowId}`}
        >
            <td
                colSpan={mergedColumns.length + 1} >
                <div className='expandable-component'>
                    {ExpandedComponent ? <ExpandedComponent data={row} /> : <p>Add a custom component in ExpandedComponent prop</p>}
                </div>
            </td>
        </tr> : null}
        {/* expandable component ========================*/}
    </>;
};