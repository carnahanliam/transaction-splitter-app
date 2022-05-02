const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // palette values for light mode
          primary: {
            main: '#1076f2',
          },
          secondary: {
            main: '#1076f2',
          },
          background: {
            default: '#f4f5f7',
            paper: '#fff',
          },
        }
      : {
          // palette values for dark mode
          primary: {
            main: '#1076f2',
          },
          secondary: {
            main: '#1076f2',
          },
          background: {
            default: '#070d19',
            paper: '#151d2e',
          },
        }),
  },
  components: {
    MuiPaper: {
      variants: [
        {
          props: { variant: 'card' },
          style: {
            borderRadius: '20px',
            border: '1px solid #d8d8d821',
            boxShadow: '0px 3px 12px rgb(0 0 0 / 5%)',
            // marginBottom: '10px',
          },
        },
        // {
        //   props: { variant: 'innerCard' },
        //   style: {
        //     display: 'flex',
        //     flexDirection: 'column',
        //     padding: '16px 16px 0 16px',
        //     borderRadius: '10px',
        //     overflow: 'hidden',
        // '&:hover': {
        //   cursor: 'pointer',
        // },
        //     width: '100%',
        //   },
        // },
      ],
    },
    MuiModal: {
      defaultProps: {
        disableScrollLock: true,
      },
    },
  },
})

export default getDesignTokens
