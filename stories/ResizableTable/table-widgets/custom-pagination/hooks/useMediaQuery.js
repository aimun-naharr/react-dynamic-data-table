import { useEffect, useState } from 'react';

function useMediaQuery( query ) {
    //in components
    // const isSmallScreen = useMediaQuery( "(max-width: 900px)" );
    const [matches, setMatches] = useState( () => window.matchMedia( query ).matches );

    useEffect( () => {
        const mediaQueryList = window.matchMedia( query );

        const handleMediaQueryChange = ( event ) => {
            setMatches( event.matches );
        };

        mediaQueryList.addListener( handleMediaQueryChange );
        setMatches( mediaQueryList.matches );

        return () => {
            mediaQueryList.removeListener( handleMediaQueryChange );
        };
    }, [query] );

    return matches;
}

export default useMediaQuery;