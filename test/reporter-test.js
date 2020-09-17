const { getDriverMetrics } = require('../src/reporter');
const { expect } = require('chai');
const parse = require('date-fns/parse');

describe('Driver Reports', () => {
  it('will return metrics containing the driver name, total miles driven, and average mph', () => {
    const driver = {
      name: 'Dan',
      trips: [ 
        createTrip('07:00', '09:00', 120),
        createTrip('20:00', '23:00', 225)
      ]
    };

    const metrics = getDriverMetrics([ driver ]);

    expect(metrics).to.have.length(1);
    expect(metrics[0].driverName).to.equal('Dan');
    expect(metrics[0].totalMilesDriven).to.equal(345);
    expect(metrics[0].averageMPH).to.equal(69);
  });

  it('will output 0 miles and 0 average mph when no trips were taken', () => {
    const driver = {
      name: 'Dan',
      trips: []
    };

    const metrics = getDriverMetrics([driver]);

    expect(metrics).to.have.length(1);
    expect(metrics[0].driverName).to.equal('Dan');
    expect(metrics[0].totalMilesDriven).to.equal(0);
    expect(metrics[0].averageMPH).to.equal(0);
  });

  it('will round mph and miles driven to the nearest integer', () => {
    const driver = {
      name: 'Dan',
      trips: [ createTrip('06:12', '06:32', 21.8) ]
    }

    const metrics = getDriverMetrics([driver]);

    expect(metrics).to.have.length(1);
    expect(metrics[0].driverName).to.equal('Dan');
    expect(metrics[0].totalMilesDriven).to.equal(22);
    expect(metrics[0].averageMPH).to.equal(65);
  });

  it('will filter out any trip that averages less than 5 mph', () => {
    const driver = {
      name: 'Dan',
      trips: [
        createTrip('20:00', '21:00', 4.9),
        createTrip('21:00', '22:00', 5)
      ]
    };

    const metrics = getDriverMetrics([driver]);

    expect(metrics).to.have.length(1);
    expect(metrics[0].driverName).to.equal('Dan');
    expect(metrics[0].totalMilesDriven).to.equal(5);
    expect(metrics[0].averageMPH).to.equal(5);
  });

  it('will filter out any trip that averages more than 100mph', () => {
    const driver = {
      name: 'Dan',
      trips: [
        createTrip('05:00', '06:00', 101),
        createTrip('06:00', '07:00', 99)
      ]
    };

    const metrics = getDriverMetrics([driver]);

    expect(metrics).to.have.length(1);
    expect(metrics[0].driverName).to.equal('Dan');
    expect(metrics[0].totalMilesDriven).to.equal(99);
    expect(metrics[0].averageMPH).to.equal(99);
  });

  it('will sort driver metrics based on most miles driven to least', () => {
    const dan = {
      name: 'Dan',
      trips: [
        createTrip('07:15', '07:45', 17.3),
        createTrip('06:12', '06:32', 21.8)
      ]
    };
    
    const lauren = {
      name: 'Lauren',
      trips: [ createTrip('12:01', '13:16', 42.0) ]
    }
    
    const kumi = {
      name: 'Kumi',
      trips: []
    }

     const metrics = getDriverMetrics([dan, lauren, kumi]);

    expect(metrics).to.have.length(3);
    expect(metrics[0].driverName).to.equal('Lauren');
    expect(metrics[0].totalMilesDriven).to.equal(42);
    expect(metrics[0].averageMPH).to.equal(34);
    
    expect(metrics[1].driverName).to.equal('Dan');
    expect(metrics[1].totalMilesDriven).to.equal(39);
    expect(metrics[1].averageMPH).to.equal(47);

    expect(metrics[2].driverName).to.equal('Kumi');
    expect(metrics[2].totalMilesDriven).to.equal(0);
    expect(metrics[2].averageMPH).to.equal(0);
  });
});

function createTrip(startTime, endTime, milesDriven) {
  const date = new Date();
  return {
    startTime: parse(startTime, 'HH:mm', date), 
    endTime: parse(endTime, 'HH:mm', date),
    milesDriven
  }
}