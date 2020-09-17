const { parseFile } = require('./src/file-parser');
const { createDriverData } = require('./src/driver-service');
const { getDriverMetrics } = require('./src/reporter');

(async () => {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('Please specify a file to process');
    process.exit(1);
  }
  
  const filename = args[0];
  
  try {
    const commands = await parseFile(filename);
    const driverData = createDriverData(commands);
    const metrics = getDriverMetrics(driverData);

    metrics.map(m => {
      if (m.totalMilesDriven === 0) {
        console.log(`${m.driverName}: 0 miles`);
      } else {
        console.log(`${m.driverName}: ${m.totalMilesDriven} miles @ ${m.averageMPH} mph`);
      }
    });
  } catch(error) {
    console.log('Unexpected error occurred');
    console.log(error);
  }
})()