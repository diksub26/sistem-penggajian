function fieldTypeResolver (showPassword: boolean): string {
    return showPassword ? 'text' : 'password'
  }
  
  function revealerIconResolver (showPassword: boolean): string {
    return showPassword ? 'mdi-eye' : 'mdi-eye-off'
  }
  
  export { fieldTypeResolver, revealerIconResolver }