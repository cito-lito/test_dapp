const sx_header = {
    backgroundColor: (theme) =>
        theme.palette.mode === 'dark'
            ? theme.palette.grey[500]
            : theme.palette.grey[400],
}
const sx_card = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    mb: 2,
}
export {sx_header, sx_card}