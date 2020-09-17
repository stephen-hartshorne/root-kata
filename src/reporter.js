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
      totalMilesDriven,
      averageMPH
    };
  });

  let sortedMetrics = metrics.sort((a, b) => b.totalMilesDriven - a.totalMilesDriven);
  
  return sortedMetrics.map(metric => {
    if (metric.totalMilesDriven === 0) {
      return `${metric.driverName}: 0 miles`;
    } else {
      return `${metric.driverName}: ${Math.round(metric.totalMilesDriven)} miles @ ${Math.round(metric.averageMPH)} mph`;
    }
  });
}

module.exports = { getDriverMetrics };