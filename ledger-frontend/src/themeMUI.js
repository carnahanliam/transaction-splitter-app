const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // palette values for light mode
          primary: {
            main: '#6969ad',
          },
          secondary: {
            main: '#b549c7',
          },
          background: {
            default: '#dcdce4',
            paper: '#f1f1f1',
          },
        }
      : {
          // palette values for dark mode
          primary: {
            main: '#6969ad',
          },
          secondary: {
            main: '#b549c7',
          },
          background: {
            default: '#2a2836',
            paper: '#3f4254',
          },
        }),
  },
})

export default getDesignTokens
