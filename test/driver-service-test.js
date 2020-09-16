const { createDriverData } = require('../src/driver-service');
const { expect } = require('chai');
const parse = require('date-fns/parse');
describe('Driver Service', () => {
  describe('Driver Command', () => {
    it('Will parse a command to add a driver containing name and trips', () => {
      const commands = ['Driver Dan'];
      const drivers = createDriverData(commands);
  
      expect(drivers).to.have.length(1);
      expect(drivers[0].name).to.equal('Dan');
    });

    it('Will parse multiple driver commands and add multiple drivers', () => {
      const commands = [
        'Driver Dan',
        'Driver Bob',
        'Driver Jane'
      ];

      const drivers = createDriverData(commands);

      expect(drivers).to.have.length(3);
      
      expect(drivers[0].name).to.equal('Dan');
      expect(drivers[0].trips).to.have.length(0);
      
      expect(drivers[1].name).to.equal('Bob');
      expect(drivers[1].trips).to.have.length(0);
      
      expect(drivers[2].name).to.equal('Jane');
      expect(drivers[2].trips).to.have.length(0);
    });
  });

  describe('Trip Command', () => {
    it('Will record a trip for a driver given that driver exists', () => {
      const commands = [
        'Driver Dan',
        'Trip Dan 07:15 07:45 17.3'
      ];

      const expectedStartTime = parse('07:15', 'HH:mm', new Date());
      const expectedEndTime = parse('07:45', 'HH:mm', new Date());

      const drivers = createDriverData(commands);
      
      expect(drivers).to.have.length(1);
      expect(drivers[0].trips).to.have.length(1);
      const trip = drivers[0].trips[0];
      expect(trip.startTime).to.deep.equal(expectedStartTime);
      expect(trip.endTime).to.deep.equal(expectedEndTime);
      expect(trip.milesDriven).to.equal(17.3);
    });

    it('Will ignore a trip when the driver is not found', () => {
      const commands = [
        'Driver Dan',
        'Trip Bob 07:15 07:45 17.3'
      ];

      const drivers = createDriverData(commands);

      expect(drivers).to.have.length(1);
      expect(drivers[0].name).to.equal('Dan');
      expect(drivers[0].trips).to.have.length(0);
    });

    it('Will record trips when out of order', () => {
      const commands = [
        'Trip Dan 07:15 07:45 17.3',
        'Driver Dan'
      ];

      const expectedStartTime = parse('07:15', 'HH:mm', new Date());
      const expectedEndTime = parse('07:45', 'HH:mm', new Date());

      const drivers = createDriverData(commands);
      
      expect(drivers).to.have.length(1);
      expect(drivers[0].trips).to.have.length(1);
      const trip = drivers[0].trips[0];
      expect(trip.startTime).to.deep.equal(expectedStartTime);
      expect(trip.endTime).to.deep.equal(expectedEndTime);
      expect(trip.milesDriven).to.equal(17.3);
    });

    it('Will record trips for multiple drivers', () => {
      const commands = [
        'Driver Dan',
        'Trip Dan 07:15 07:45 17.3',
        'Driver Lisa',
        'Trip Lisa 12:15 14:45 100.84',
        'Trip Dan 17:00 20:00 180.12'
      ];

      const dansFirstTripStartTime = parse('07:15', 'HH:mm', new Date());
      const dansFirstTripEndTime = parse('07:45', 'HH:mm', new Date());
      const dansSecondTripStartTime = parse('17:00', 'HH:mm', new Date());
      const dansSecondTripEndTime = parse('20:00', 'HH:mm', new Date());
      const lisasFirstTripStartTime = parse('12:15', 'HH:mm', new Date());
      const lisasFirstTripEndTime = parse('14:45', 'HH:mm', new Date());

      const drivers = createDriverData(commands);
      
      expect(drivers).to.have.length(2);
      expect(drivers[0].trips).to.have.length(2);
      expect(drivers[1].trips).to.have.length(1);
      
      const dansTrips = drivers[0].trips;
      const lisasTrips = drivers[1].trips;
      
      expect(dansTrips[0].startTime).to.deep.equal(dansFirstTripStartTime);
      expect(dansTrips[0].endTime).to.deep.equal(dansFirstTripEndTime);
      expect(dansTrips[0].milesDriven).to.equal(17.3);
      
      expect(dansTrips[1].startTime).to.deep.equal(dansSecondTripStartTime);
      expect(dansTrips[1].endTime).to.deep.equal(dansSecondTripEndTime);
      expect(dansTrips[1].milesDriven).to.equal(180.12);

      expect(lisasTrips[0].startTime).to.deep.equal(lisasFirstTripStartTime);
      expect(lisasTrips[0].endTime).to.deep.equal(lisasFirstTripEndTime);
      expect(lisasTrips[0].milesDriven).to.equal(100.84);
    })
  });
});