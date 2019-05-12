// PropType failures are printed to the console with console.error.
// They don't throw an error so it's difficult to test for them.
// By overwriting console.error to throw an exception when a text pattern
// is matched we can easily test prop failures by catching a
// thrown exception.

(function throwPropErrors() {
  console.error = (message, ...args) => {
    if (/(Invalid prop|Failed prop type)/gi.test(message)) {
      throw new Error(message)
    }
  }
})()
