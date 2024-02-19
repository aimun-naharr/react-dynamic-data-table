export const randomIdGenerator = () => {
    const id = Math.floor( Math.random() * Date.now() );
    return id;
};
