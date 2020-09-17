# Dependencies
## Node
Version >12.0 see (https://nodejs.org/en/) for installation

## Yarn
Yarn is used for package management. See (https://classic.yarnpkg.com/en/) for installation

## Mocha
In order to execute tests, `mocha` must be installed. You can use yarn to install this by executing

`yarn global add mocha`

on the command line.

# Running the application / tests

## App
The app expects a file to be passed in as input. The entry point is `index.js` An example command is

`node index.js /path/to/my/file.txt`

## Tests
As stated above, `mocha` is required to execute the tests. In order to run all tests, execute

`yarn test`

# Thought Process

I decided to split the application up into three main parts:
* a parser whose job is to parse a file and return the contents
* a service whose job is to take a list of string commands and turn them into meaningful driver data
* a reporter whose job is to take driver data and return metrics

Splitting the application into these chunks I felt allowed me to separate concerns and easily test drive features.

## Parser
The parsers job is to simply take a filename, parse it line by line, and return each line in an array back to the caller. This function returns a promise that resolves once it has finished parsing and will throw an error if it encounters any while reading the file.

## Driver Service
The services job is to take a list of string commands and convert them into a list of driver data. Each driver has a name and list of trips, while a trip has a start time, end time, as well as a number of miles driven

When we encounter a driver command, we create a new driver with an empty number of trips. After we have processed all driver commands we then process the trips, that way if we were to by chance encounter a Driver and Trip command out of order we will still process them. 

When we encounter a trip command, we parse the miles driven as a float, and parse start and end time as date objects. We then find the associated driver in the list of drivers mentioned above, and add the trip to that drivers trips. If no driver is found, we simply do nothing. This was intentional as if we encounter a trip whose driver we do not have record of, we do not want to error.

## Reporter
This takes a list of drivers and returns a list of metrics. The metrics have contain the driver name, total miles driven, and the average miles per hour. I chose to transform the data in this way such that whoever is the caller can choose what to do with those metrics (in this case, it is `index.js`). In the end, we simply map the metrics to console.log statements.

## Index
This is the piece that ties all of the above together. We grab the arguments, if none are supplied we prompt the user to specify a file. If there is a file supplied, then we process the commands, create driver data, collect metrics, and output them to the console.

Overall, I wanted each chunk of the application to have it's own distinct responsibility. In doing so, this allowed me to easily test-drive the entire application and make it quite simple to tie all of the pieces together.