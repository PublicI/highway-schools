var journalize = require('journalize'),
    timeFormat = require('d3-time-format'),
    Dateline = require('dateline');
    //titleCase = require('ap-style-title-case');

var stateLookup = [['Alabama',1,'AL'],
    ['Alaska',2,'AK'],
    ['Arizona',4,'AZ'],
    ['Arkansas',5,'AR'],
    ['California',6,'CA'],
    ['Colorado',8,'CO'],
    ['Connecticut',9,'CT'],
    ['Delaware',10,'DE'],
    ['District of Columbia',11,'DC'],
    ['Florida',12,'FL'],
    ['Georgia',13,'GA'],
    ['Hawaii',15,'HI'],
    ['Idaho',16,'ID'],
    ['Illinois',17,'IL'],
    ['Indiana',18,'IN'],
    ['Iowa',19,'IA'],
    ['Kansas',20,'KS'],
    ['Kentucky',21,'KY'],
    ['Louisiana',22,'LA'],
    ['Maine',23,'ME'],
    ['Maryland',24,'MD'],
    ['Massachusetts',25,'MA'],
    ['Michigan',26,'MI'],
    ['Minnesota',27,'MN'],
    ['Mississippi',28,'MS'],
    ['Missouri',29,'MO'],
    ['Montana',30,'MT'],
    ['Nebraska',31,'NE'],
    ['Nevada',32,'NV'],
    ['New Hampshire',33,'NH'],
    ['New Jersey',34,'NJ'],
    ['New Mexico',35,'NM'],
    ['New York',36,'NY'],
    ['North Carolina',37,'NC'],
    ['North Dakota',38,'ND'],
    ['Ohio',39,'OH'],
    ['Oklahoma',40,'OK'],
    ['Oregon',41,'OR'],
    ['Pennsylvania',42,'PA'],
    ['Rhode Island',44,'RI'],
    ['South Carolina',45,'SC'],
    ['South Dakota',46,'SD'],
    ['Tennessee',47,'TN'],
    ['Texas',48,'TX'],
    ['Utah',49,'UT'],
    ['Vermont',50,'VT'],
    ['Virginia',51,'VA'],
    ['Washington',53,'WA'],
    ['West Virginia',54,'WV'],
    ['Wisconsin',55,'WI'],
    ['Wyoming',56,'WY']];

module.exports = {
    /*
    titlecase: function (words) {
        if (words.match(/[a-z]/)) {
            return words;
        }

        words = titleCase(words); // .toLowerCase()

        words = words.replace(/Us\W/,'US ');
        words = words.replace(/Ii\W/,'II ');
        words = words.replace(/Llc/,'LLC');

        return words;
    },*/
    formatPercent: function (percent) {
        return Math.round(percent*100);
    },
    intcomma: journalize.intcomma,
    apstate: function (state) {
        return journalize.apstate(journalize.postal(state,true));
    },
    numberFormat: function (n,abbrev) {
        if (n >= 1000000000) {
            return +((n/1000000000).toFixed(1)) + 'B';
        }
        else if (n >= 1000000) {
            return +((n/1000000).toFixed(1)) + 'M';
        }
        return journalize.intcomma(n);
    },
    numberFormatFull: function (n,abbrev) {
        if (n >= 1000000000) {
            return +((n/1000000000).toFixed(1)) + ' billion';
        }
        else if (n >= 1000000) {
            return +((n/1000000).toFixed(1)) + ' million';
        }
        return journalize.intcomma(n);
    },
    timeParse: timeFormat.timeParse('%Y-%m-%d'),
    timeFormat: timeFormat.timeFormat('%Y-%-m-%-d'),
    apdate: function (d) {
        return Dateline(d).getAPDate();
    },
    postaltostate: function (postal) {
        return journalize.postal(postal.toUpperCase(),true);
    },
    fipstopostal: function (fips) {
        var postal = fips;

        stateLookup.forEach(function (row) {
            if (row[1] == fips) {
                postal = row[2];
            }
        });

        return postal;
    },
    postaltofips: function (postal) {
        var fips = postal;

        stateLookup.forEach(function (row) {
            if (row[2] == postal) {
                fips = row[1];
            }
        });

        return fips;
    }
};
