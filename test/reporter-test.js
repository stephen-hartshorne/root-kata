const { getDriverMetrics } = require('../src/reporter');
const { expect } = require('chai');
const parse = require('date-fns/parse');

describe('Driver Reports', () => {
  it('will output the total miles driven as well as average mph', () => {
    const driver = {
      name: 'Dan',
      trips: [ 
        createTrip('07:00', '09:00', 120),
        createTrip('20:00', '23:00', 225)
      ]
    };

    const metrics = getDriverMetrics([ driver ]);

    expect(metrics).to.have.length(1);
    expect(metrics[0]).to.equal('Dan: 345 miles @ 69 mph')
  });

  it('will output 0 miles when no trips were taken', () => {
    const driver = {
      name: 'Dan',
      trips: []
    };

    const metrics = getDriverMetrics([driver]);

    expect(metrics).to.have.length(1);
    expect(metrics[0]).to.equal('Dan: 0 miles');
  });

  it('will round mph and miles driven to the nearest integer', () => {
    const driver = {
      name: 'Dan',
      trips: [ createTrip('06:12', '06:32', 21.8) ]
    }

    const metrics = getDriverMetrics([driver]);

    expect(metrics).to.have.length(1);
    expect(metrics[0]).to.equal('Dan: 22 miles @ 65 mph');
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
    expect(metrics[0]).to.equal('Dan: 5 miles @ 5 mph');
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
    expect(metrics[0]).to.equal('Dan: 99 miles @ 99 mph');
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
     expect(metrics[0]).to.equal('Lauren: 42 miles @ 34 mph');
     expect(metrics[1]).to.equal('Dan: 39 miles @ 47 mph');
     expect(metrics[2]).to.equal('Kumi: 0 miles');
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