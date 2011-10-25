#Overview
The birthday picker seeks to emulate the functionality of the birthday picker on the Facebook signup page. It uses three select boxes to choose a date, and tries to ensure that the date is valid by accounting for leap years, etc... It also has a number of options, making it somewhat customizable. The birthday picker generates the following markup:

    <fieldset class='birthday-picker'>
        <select class='birth-year' name='birth[year]'></select>
        <select class='birth-month' name='birth[month]'></select>
        <select class='birth-day' name='birth[day]'></select>
        <input type='hidden' name='birthdate' />
    </fieldset>

It also adds an option list to each of the select boxes, changing the options dynamically based on plugin settings and user interactions.

#Options
As with most plugins, the birthdaypicker can be passed a hash of options as follows:

    $("div").birthdaypicker(options={});

The following options are currently supported:

###maxAge (number)
#### Default value: 120 ####
The maxAge setting determines the oldest year you can pick for a birthday. So if you set the maxAge to 100 and the current year is 2010, then the oldest year you can pick will be 1910.

###minAge (number)
#### Default value: 0 ####
The opposite of maxAge. If current year is 2010 and minAge is set to 18, the earliest year that can be picked is 1992.

###futureDates (boolean)
####Default value: false
The futureDates setting determines whether birthdays in the future can be selected. Unless you need to support entering birthdays of unborn babies, this should generally be false.

###maxYear (number)
####Default value: current year
The maxYear setting allows you to set the maximum year that can be chosen, counting up from 0. If you pass in a year (such as 1980) then it uses that year. If you pass in a number under 1000 (such as 5) then it adds it to the current year, so if the year was 2010 then the maxYear would become 2015. If you want the maxYear to be in the future, you must set futureDates to true. If you want the maxYear in the past, you can pass in a negative number or a past year (if its over 1000).

###dateFormat (string)
####Default value: middleEndian
The dateFormat setting determines the order of the select fields in the markup and supports the following three values:

* middleEndian: Month, Day, Year
* littleEndian: Day, Month, Year
* bigEndian: Year, Month, Day

###monthFormat (string)
####Default value: short
The monthFormat setting determines the text displayed in the month select box. It can be either short, or long. i.e. Jan or January

###placeholder (boolean)
####Default value: true
The placeholder adds a default option to each select list just like Facebook does on their signup page. The default option just says Month, Day, or Year with a colon after it. If you keep this set to true, you will need to add logic, preferably on the client and server, to ensure this option isn't chosen. The value for these options is 0.

###defaultDate (string)
####Default value: false
The defaultDate must be a date that can be parsed by the Javascript date library. I recommend passing a string in one of the following formats: MM-DD-YYYY or YYYY-MM-DD.

###hiddenDate (boolean)
####Default Value: true
The hiddenDate adds a hidden input field named "birthdate" to the fieldset which concatenates all of the individual select boxes into a single date. This date is only available after the user has selected a date in each of the select boxes. It can make server side handling easier as you only have to worry about one field.

###legend (string)

####Default value: null
The legend setting adds a legend to the fieldset. You can pass in any string.