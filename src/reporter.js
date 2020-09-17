const differenceInMinutes = require('date-fns/differenceInMinutes');

function getDriverMetrics(driverData) {
  let metrics = driverData.map(driver => {
    let totalMilesDriven = 0;
    let totalMinutes = 0;
    
    driver.trips.forEach(trip => {
      let minutesSpentThisTrip = differenceInMinutes(trip.endTime, trip.startTime);
      let averageMPHThisTrip = trip.milesDriven / (minutesSpentThisTrip / 60);

      if ((averageMPHThisTrip >= 5) && (averageMPHThisTrip <= 100)) {
        totalMilesDriven += trip.milesDriven;
        totalMinutes += minutesSpentThisTrip;
      }
    });

    const averageMPH = totalMilesDriven > 0 ? totalMilesDriven / (totalMinutes / 60) : 0
    
    return {
      driverName: driver.name,
      totalMilesDriven: Math.round(totalMilesDriven),
      averageMPH: Math.round(averageMPH)
    };
  });
  
  return metrics.sort((a, b) => b.totalMilesDriven - a.totalMilesDriven);
}

module.exports = { getDriverMetrics };