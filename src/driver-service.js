const parse = require('date-fns/parse');

function createDriverData(commands) {
  let drivers = [];
  let trips = [];
  commands.forEach(command => {
    let parts = command.split(' ');
    let action = parts[0];
    let args = parts.slice(1, parts.length);
    
    if (action === 'Driver') {
      let driverName = args[0];
      let driver = { name: driverName, trips: [] };
      drivers.push(driver);
    }

    if (action === 'Trip') {
      const trip = createTrip(args);
      trips.push(trip);
    }
  });

  trips.forEach(trip => {
    const driver = drivers.find(d => d.name === trip.driverName);
    if (driver) {
      driver.trips.push({ 
        startTime: trip.startTime, 
        endTime: trip.endTime, 
        milesDriven: trip.milesDriven 
      });
    }
  });

  return drivers;
}

function createTrip([ driverName, startTime, endTime, milesDriven ]) {
  const date = new Date();
  return { 
    driverName,
    startTime: parse(startTime, 'HH:mm', date), 
    endTime: parse(endTime, 'HH:mm', date), 
    milesDriven: parseFloat(milesDriven) 
  };
}

module.exports = { createDriverData };