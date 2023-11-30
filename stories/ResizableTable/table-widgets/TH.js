const { randomIdGenerator } = require( "../../../utility/utils" );


const ChevronIcon = () => {
    return <>
        <svg xmlns="http://www.w3.org/2000/svg"
            height="0.8rem" viewBox="0 0 448 512" fill='gray'>
            <path d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z" />
        </svg>
    </>;
};
const PinIcon = ( { column } ) => {
    return <>
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill={column.isFixed ? "green" : 'gray'} viewBox="0 0 16 16">
            <path d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A5.921 5.921 0 0 1 5 6.708V2.277a2.77 2.77 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354zm1.58 1.408-.002-.001.002.001zm-.002-.001.002.001A.5.5 0 0 1 6 2v5a.5.5 0 0 1-.276.447h-.002l-.012.007-.054.03a4.922 4.922 0 0 0-.827.58c-.318.278-.585.596-.725.936h7.792c-.14-.34-.407-.658-.725-.936a4.915 4.915 0 0 0-.881-.61l-.012-.006h-.002A.5.5 0 0 1 10 7V2a.5.5 0 0 1 .295-.458 1.775 1.775 0 0 0 .351-.271c.08-.08.155-.17.214-.271H5.14c.06.1.133.191.214.271a1.78 1.78 0 0 0 .37.282z" />
        </svg>
    </>;
};

const TH = ( props ) => {
    const { column, index: i, getLeftDistanceOfFixedColumn, expandableRows, handleSort, setAllColumns, allColumns, tableId, columnCache, selectableRows } = props;
    const theadId = randomIdGenerator();
    const makeFixColumn = () => {
        const updatedData = allColumns.map( c => {
            if ( c.id === column.id ) {
                if ( c?.isFixed ) {
                    return { ...c, isFixed: false };
                }
                return { ...c, isFixed: true };
            }
            return c;
        } );
        setAllColumns( updatedData );
        if ( columnCache ) {
            localStorage.setItem( tableId, JSON.stringify( updatedData ) );
        }
        const thead = document.getElementById( theadId );
        const divNodes = thead.querySelectorAll( 'div' );

        divNodes.forEach( elm => {
            thead.removeChild( elm );
        } );
    };

    return <th
        className={`${column.isFixed ? 'fixed-table-column fixed-cell ' : ''} table-header`}
        scope="col"
        style={{
            cursor: column.sortable && 'pointer',
            width: column.width ? column.width : '100px',
            minWidth: column.minWidth ? column.minWidth : '80px',
            textAlign: column.type === 'action' ? 'center' : column.type === 'number' ? 'center' : 'left',
            left: column.isFixed && getLeftDistanceOfFixedColumn( expandableRows && selectableRows ? i + 2 : expandableRows || selectableRows ? i + 1 : i )
        }}
        id={theadId}
    >
        <p style={{
            margin: 0,
            width: '100%'
        }}>
            <span
                onClick={() => handleSort( column )}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}
            >
                <span>{column.name}</span>
                {column.sortable ? <span style={{ rotate: column.sortingOrder === 'desc' ? '180deg' : '', transition: 'all 0.3s' }}><ChevronIcon
                    size={16}
                /></span> : null
                }
            </span>
            {!column?.unResizable ? <span
                onClick={makeFixColumn}
                title='Fix' className='fixed-icon'
                style={
                    {
                        color: column.isFixed ? 'green' : 'gray',
                        display: column.isFixed ? 'block' : ''
                    }
                }
            >

                <PinIcon column={column} />
            </span> : null}
        </p>
    </th>;

};

export default TH;