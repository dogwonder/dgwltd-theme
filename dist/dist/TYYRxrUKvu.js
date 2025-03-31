// Returns an array of color objects
  let colors = await getImageColors("./images/delorian.jpg");
  // Get hex values
  colors.map(c => c.colorjs.toString({format: "hex"}));
  console.log(colors);