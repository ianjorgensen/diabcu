var _ = require('underscore');

exports.display = function(data) {
	var weeks = statify(normalize(data));
	
	var week = new Date().getWeek();

	var displayweek = [];

	for (var i = week; i > week-8; i--) {
		var displa = [];	
		displa.push(4); // first is always magenta

		for (var j = 0; j < 7; j++) {
			
			var percent = ((weeks[i] || [])[j] || {}).percent;
			
			var color = 0; // 0 - black , 1 - red , 2 - yellow , 3 - green, 4 - magenta

			if (percent >= 0) {
				color = 1;
			}
			if (percent > 0.5) {
				color = 2;
			}
			if (percent > 0.7) {
				color = 3
			}
			
			displa.push(color);
		};
		displayweek.push(displa);
	};

	var displ = [];
	
	for (var i = displayweek.length - 1; i >= 0; i--) for (var j = 0; j < displayweek[i].length; j++) {
		displ.push(displayweek[i][j]);
	}
	
	return displ;	
};

var statify = function(data) {
	for(var week in data) {
		for(var day in data[week]) {
			var stat = {
				total:0,
				readings: data[week][day],
				good:0,

			};

			for(var i = 0; i < data[week][day].length; i++) {
				var reading = parseFloat(data[week][day][i].value);
				
				stat.total = stat.total + reading;
				
				if (reading > 5 && reading < 11) {
					stat.good++;
				}
			}
			stat.count = stat.readings.length;
			stat.average = stat.total / stat.readings.length;
			stat.percent = stat.good / stat.readings.length;
			data[week][day] = stat;
		}
	}
	return data;
}
var normalize = function(data) {
	var readings = [];
	
	var rows = data.sheets.sheet[0].rows.row;

	var date_sort_desc = function (reading1, reading2) {
	  if (reading1.date > reading2.date) return -1;
	  if (reading1.date < reading2.date) return 1;
	  return 0;
	};

	for(var i = 5; i < rows.length; i++) {
		var cell = rows[i].cell;

		readings.push({
			date: new Date(cell[0]['#']),
			value: cell[1]['#']
		});
	}

	readings = readings.sort(date_sort_desc)
	readings = groupBy(readings);

	return readings;
};

var groupBy = function(arr) {
	arr = _.groupBy(arr, function(reading) {
		return reading.date.getWeek();
	});
	for(var prop in arr) {
		arr[prop] = _.groupBy(arr[prop], function(reading) {
			return reading.date.getDay();
		});
	}
	return arr;
};

Date.prototype.getWeek = function (dowOffset) {
/*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */

	dowOffset = typeof(dowOffset) == 'int' ? dowOffset : 0; //default dowOffset to zero
	var newYear = new Date(this.getFullYear(),0,1);
	var day = newYear.getDay() - dowOffset; //the day of week the year begins on
	day = (day >= 0 ? day : day + 7);
	var daynum = Math.floor((this.getTime() - newYear.getTime() - 
	(this.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;
	var weeknum;
	//if the year starts before the middle of a week
	if(day < 4) {
		weeknum = Math.floor((daynum+day-1)/7) + 1;
		if(weeknum > 52) {
			nYear = new Date(this.getFullYear() + 1,0,1);
			nday = nYear.getDay() - dowOffset;
			nday = nday >= 0 ? nday : nday + 7;
			/*if the next year starts before the middle of
 			  the week, it is week #1 of that year*/
			weeknum = nday < 4 ? 1 : 53;
		}
	}
	else {
		weeknum = Math.floor((daynum+day-1)/7);
	}
	return weeknum;
};