import classNames from "classnames";
import { Fragment, useEffect, useState } from "react";

const TR = ( props ) => {
    const { expandableRows,
        expandIcon,
        row,
        index,
        mergedColumns,
        getLeftDistanceOfFixedColumn,
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

    return (
        <>
            <tr className={classNames( '', {
                'selected-row': row.isSelected
            } )}>
                {selectableRows ? <td
                    className='fixed-cell'
                    style={{
                        textAlign: 'center',
                        left: 0
                    }}>
                    <input
                        type="checkbox"
                        checked={row.isSelected}
                        onChange={handleSelect} />
                </td> : null}

                {expandableRows && <td
                    className='fixed-cell'
                    style={{
                        textAlign: 'center',
                        left: selectableRows ? getLeftDistanceOfFixedColumn( 1 ) : 0,
                        cursor: 'pointer',
                        position: 'sticky'
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
                                className={classNames( {
                                    'fixed-cell': c.isFixed
                                } )}
                                id={`${c.id}${row.rowId?.toString()}d`}
                                style={{
                                    width: c.width ?? '',
                                    textAlign: c.type === 'action' || c.center ? 'center' : c.type === 'number' ? 'right' : 'left',
                                    left: c.isFixed && getLeftDistanceOfFixedColumn( expandableRows && selectableRows ? indx + 2 : expandableRows || selectableRows ? indx + 1 : indx )

                                }}
                            >
                                {/* <div style={{
                                    width: '100%',
                                    textAlign: c.type === 'action' || c.center ? 'center' : c.type === 'number' ? 'right' : 'left',
                                    margin: '0 auto'

                                }}> */}
                                {c?.cell ? c.cell( row, index ) : row[c.selector]}
                                {/* </div> */}

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
                    style={{ position: 'sticky', left: 0 }}
                    colSpan={mergedColumns.length + 1} >
                    <div className='expandable-component'>
                        {ExpandedComponent ? <ExpandedComponent data={row} /> : <p>Add a custom component in ExpandedComponent prop</p>}
                    </div>
                </td>
            </tr> : null}
            {/* expandable component ========================*/}
        </>
    );
};

export default TR;