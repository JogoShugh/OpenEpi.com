function dateDiff(firstDate, secondDate)
{
  // By Nilesh Surve, at
  //http://www.codeproject.com/Articles/18317/How-to-calculate-difference-between-two-dates-using-JavaScript.htm
  //
// Any source code blocks look like this
//


        t1="10/10/2006" ;

        t2="15/10/2006";


   //Total time for one day
        var one_day=1000*60*60*24;
//Here we need to split the inputed dates to convert them into standard format
//for furter execution
        var x=firstDate.split("/");
        var y=secondDate.split("/");
  //date format(Fullyear,month,date)

        var date1=new Date(x[2],(x[1]-1),x[0]);

        var date2=new Date(y[2],(y[1]-1),y[0])
        var month1=x[1]-1;
        var month2=y[1]-1;

        //Calculate difference between the two dates, and convert to days

       var diff=Math.ceil((date2.getTime()-date1.getTime())/(one_day));
//_Diff gives the diffrence between the two dates.
return diff;
}


function daysBetween(date1, date2) {
    //Copyright © 1995-2012 Paul McFedries and Logophilia Limited
    // The number of milliseconds in one day
    //Altered to return a negative value if date1 is later than date2
    var ONE_DAY = 1000 * 60 * 60 * 24

    // Convert both dates to milliseconds
    var date1 = new Date(date1);  //convert string to date
    var date2 = new Date(date2);
    var date1_ms = date1.getTime()
    var date2_ms = date2.getTime()

    // Calculate the difference in milliseconds
   // var difference_ms = Math.abs(date1_ms - date2_ms)
    var difference_ms = date2_ms-date1_ms


    if (typeof difference_ms =="number")
      {
         return Math.round(difference_ms/ONE_DAY)
      }
     else
     {
         return ("")
     }
}

function monthsBetween(date1, date2) {

    //Modified by Andy Dean.  Returns negative result if date2 is less than date 1
    // The number of milliseconds in one day
    var ONE_DAY = 1000 * 60 * 60 * 24
    var ONE_MONTH=ONE_DAY*365.25/12

    // Convert both dates to milliseconds
    var date1 = new Date(date1);  //convert string to date
    var date2 = new Date(date2);
    var date1_ms = date1.getTime()
    var date2_ms = date2.getTime()

    // Calculate the difference in milliseconds
   // var difference_ms = Math.abs(date1_ms - date2_ms)
    var difference_ms=date2_ms-date1_ms
    if (typeof difference_ms =="number")
      {
         return Math.round(difference_ms/ONE_MONTH)
      }
     else
     {
         return ("")
     }


}

//http://www.irt.org/script/29.htm

function getAge(dateString2,dateString,dateType) {
/*
   function getAge
   parameters: dateString dateType
   returns: boolean

   dateString is a date passed as a string in the following
   formats:

   type 1 : 19970529
   type 2 : 970529
   type 3 : 29/05/1997
   type 4 : 29/05/97

   dateType is a numeric integer from 1 to 4, representing
   the type of dateString passed, as defined above.

   Returns string containing the age in years, months and days
   in the format yyy years mm months dd days.
   Returns empty string if dateType is not one of the expected
   values.
*/

    var now = new Date(dateString2);
    var today = new Date(now.getYear(),now.getMonth(),now.getDate());

    var yearNow = now.getYear();
    var monthNow = now.getMonth();
    var dateNow = now.getDate();

    if (dateType == 1)
        var dob = new Date(dateString.substring(0,4),
                            dateString.substring(4,6)-1,
                            dateString.substring(6,8));
    else if (dateType == 2)
        var dob = new Date(dateString.substring(0,2),
                            dateString.substring(2,4)-1,
                            dateString.substring(4,6));
    else if (dateType == 3)
        var dob = new Date(dateString.substring(6,10),
                            dateString.substring(3,5)-1,
                            dateString.substring(0,2));
    else if (dateType == 4)
        var dob = new Date(dateString.substring(6,8),
                            dateString.substring(3,5)-1,
                            dateString.substring(0,2));
    else
        return '';

    var yearDob = dob.getYear();
    var monthDob = dob.getMonth();
    var dateDob = dob.getDate();

    yearAge = yearNow - yearDob;

    if (monthNow >= monthDob)
        var monthAge = monthNow - monthDob;
    else {
        yearAge--;
        var monthAge = 12 + monthNow -monthDob;
    }

    if (dateNow >= dateDob)
        var dateAge = dateNow - dateDob;
    else {
        monthAge--;
        var dateAge = 31 + dateNow - dateDob;

        if (monthAge < 0) {
            monthAge = 11;
            yearAge--;
        }
    }

    return yearAge + ' years ' + monthAge + ' months ' + dateAge + ' days';
}
