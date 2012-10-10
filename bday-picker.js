/*!
 * jQuery Birthday Picker: v1.4 - 10/16/2011
 * http://abecoffman.com/stuff/birthdaypicker
 *
 * Copyright (c) 2010 Abe Coffman
 * Dual licensed under the MIT and GPL licenses.
 *
 */

(function( $ ){

  // plugin variables
  var months = {
    "short": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    "long": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] },
      todayDate = new Date(),
      todayYear = todayDate.getFullYear(),
      todayMonth = todayDate.getMonth() + 1,
      todayDay = todayDate.getDate();


  $.fn.birthdaypicker = function( options ) {

    var settings = {
      "maxAge"        : 120,
      "minAge"        : 0,
      "futureDates"   : false,
      "maxYear"       : todayYear,
      "dateFormat"    : "middleEndian",
      "monthFormat"   : "short",
      "monthValue"    : "number",
      "placeholder"   : true,
      "legend"        : "",
      "defaultDate"   : false,
      "fieldName"     : "birthdate",
      "fieldId"       : "birthdate",
      "hiddenDate"    : true,
      "onChange"      : null,
      "tabindex"      : null
    };

    return this.each(function() {

      if (options) { $.extend(settings, options); }

      // Create the html picker skeleton
      var $fieldset = $("<fieldset class='birthday-picker'></fieldset>"),
          $year = $("<select class='birth-year' name='birth[year]'></select>"),
          $month = $("<select class='birth-month' name='birth[month]'></select>"),
          $day = $("<select class='birth-day' name='birth[day]'></select>");

      if (settings["legend"]) { $("<legend>" + settings["legend"] + "</legend>").appendTo($fieldset); }

      var tabindex = settings["tabindex"];

      // Deal with the various Date Formats
      if (settings["dateFormat"] == "bigEndian") {
        $fieldset.append($year).append($month).append($day);
        if (tabindex != null) {
          $year.attr('tabindex', tabindex);
          $month.attr('tabindex', tabindex++);
          $day.attr('tabindex', tabindex++);
        }
      } else if (settings["dateFormat"] == "littleEndian") {
        $fieldset.append($day).append($month).append($year);
        if (tabindex != null) {
          $day.attr('tabindex', tabindex);
          $month.attr('tabindex', tabindex++);
          $year.attr('tabindex', tabindex++);
        }
      } else {
        $fieldset.append($month).append($day).append($year);
        if (tabindex != null) {
          $month.attr('tabindex', tabindex);
          $day.attr('tabindex', tabindex++);
          $year.attr('tabindex', tabindex++);
        }
      }

      // Add the option placeholders if specified
      if (settings["placeholder"]) {
        $("<option value='0'>Year:</option>").appendTo($year);
        $("<option value='0'>Month:</option>").appendTo($month);
        $("<option value='0'>Day:</option>").appendTo($day);
      }

      // Build the initial option sets
      var startYear = todayYear - settings["minAge"];
      var endYear = todayYear - settings["maxAge"];
      if (settings["futureDates"] && settings["maxYear"] != todayYear) {
        if (settings["maxYear"] > 1000) { startYear = settings["maxYear"]; }
        else { startYear = todayYear + settings["maxYear"]; }
      }
      for (var i=startYear; i>=endYear; i--) { $("<option></option>").attr("value", i).text(i).appendTo($year); }
      for (var j=0; j<12; j++) { $("<option></option>").attr("value", j+1).text(months[settings["monthFormat"]][j]).appendTo($month); }
      for (var k=1; k<32; k++) { $("<option></option>").attr("value", k).text(k).appendTo($day); }
      $(this).append($fieldset);

      // Set the default date if given  - FH
      var hiddenDate;
      if (settings["defaultDate"]) {
        var defaultDate = settings["defaultDate"];      
        if(settings["monthValue"] == "number") { // format: 10/2/2012
        
          if ( defaultDate.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/i) ) {  // 10/02/2012
            $year.val(defaultDate.substr(defaultDate.lastIndexOf("/") + 1, 4));
            $month.val( defaultDate.substring(0 ,defaultDate.indexOf("/")) );
            $day.val(defaultDate.substring(defaultDate.indexOf("/") + 1, defaultDate.lastIndexOf("/")));
          } else if ( defaultDate.match(/^\d{1,2}\/\d{4}$/i) ) {    // 10/2012
            $year.val(defaultDate.substr(defaultDate.indexOf("/") + 1, 4));
            $month.val(defaultDate.substring(0 , defaultDate.indexOf("/")));
            $day.val(0); 
          } else if ( defaultDate.match(/^\d{4}$/i) ) {                  // 2012
            $year.val(defaultDate.substr(0, 4));
            $month.val(0);
            $day.val(0);
          }
          
        } else { // monthValue == name, format: October 1, 2012
        
           if ( defaultDate.match(/^\w+ \d{1,2}, \d{4}$/i) ) {       // October 3, 2012
            $year.val(defaultDate.substr(defaultDate.lastIndexOf(",") + 2, 4));
            $month.val( jQuery.inArray(defaultDate.substring(0 ,defaultDate.indexOf(" ")), months[settings["monthFormat"]]) + 1 );
            $day.val(defaultDate.substring(defaultDate.indexOf(" ") + 1, defaultDate.lastIndexOf(",")));
          } else if ( defaultDate.match(/^\w+, \d{4}$/i) ) {        // October, 2012
            $year.val(defaultDate.substr(defaultDate.indexOf(",") + 2, 4));
            $month.val( jQuery.inArray(defaultDate.substring(0 ,defaultDate.indexOf(",")), months[settings["monthFormat"]]) + 1 );
            $day.val(0); 
          } else if ( defaultDate.match(/^\d{4}$/i) ) {                // 2012
            $year.val(defaultDate.substr(0, 4));
            $month.val(0);
            $day.val(0);
          } 
          
        }
        hiddenDate = defaultDate;
        
      }

      // Create the hidden date markup
      if (settings["hiddenDate"]) {
        $("<input type='hidden' name='" + settings["fieldName"] + "'/>")
            .attr("id", settings["fieldId"])
            .val(hiddenDate)
            .appendTo($fieldset);
      }
      
      // Update the option sets according to options and user selections
      $fieldset.change(function() {
            // todays date values
        var todayDate = new Date(),
            todayYear = todayDate.getFullYear(),
            todayMonth = todayDate.getMonth() + 1,
            todayDay = todayDate.getDate(),
            // currently selected values
            selectedYear = parseInt($year.val(), 10),
            selectedMonth = parseInt($month.val(), 10),
            selectedDay = parseInt($day.val(), 10),
            // number of days in currently selected year/month
            actMaxDay = (new Date(selectedYear, selectedMonth, 0)).getDate(),
            // max values currently in the markup
            curMaxMonth = parseInt($month.children(":last").val()),
            curMaxDay = parseInt($day.children(":last").val());

        // Dealing with the number of days in a month
        // http://bugs.jquery.com/ticket/3041
        if (curMaxDay > actMaxDay) {
          while (curMaxDay > actMaxDay) {
            $day.children(":last").remove();
            curMaxDay--;
          }
        } else if (curMaxDay < actMaxDay) {
          while (curMaxDay < actMaxDay) {
            curMaxDay++;
            $day.append("<option value=" + curMaxDay + ">" + curMaxDay + "</option>");
          }
        }

        // Dealing with future months/days in current year
        // or months/days that fall after the minimum age
        if (!settings["futureDates"] && selectedYear == startYear) {
          if (curMaxMonth > todayMonth) {
            while (curMaxMonth > todayMonth) {
              $month.children(":last").remove();
              curMaxMonth--;
            }
            // reset the day selection
            $day.children(":first").attr("selected", "selected");
          }
          if (selectedMonth === todayMonth) {
              while (curMaxDay > todayDay) {
                  $day.children(":last").remove();
                  curMaxDay -= 1;
              }
          }
        }

        // Adding months back that may have been removed
        // http://bugs.jquery.com/ticket/3041
        if (selectedYear != startYear && curMaxMonth != 12) {
          while (curMaxMonth < 12) {
            $month.append("<option value=" + (curMaxMonth+1) + ">" + months[settings["monthFormat"]][curMaxMonth] + "</option>");
            curMaxMonth++;
          }
        }

        // disable condition
        if ( selectedYear == 0 ) {
          $month.attr('disabled',true);
          $day.attr('disabled',true);
        } else if ( selectedMonth == 0 ) {
          $month.removeAttr('disabled');        
          $day.attr('disabled',true);
        } else {
          $month.removeAttr('disabled');
          $day.removeAttr('disabled');  
        }
        
        // update the hidden date - FH
        if(settings["monthValue"] == "number") { // format: 10/2/2012
        
          if ((selectedYear * selectedMonth * selectedDay) != 0) {
            hiddenDate = selectedMonth + "/" + selectedDay + "/" + selectedYear;
          } else if ( (selectedYear * selectedMonth) != 0 && selectedDay == 0) {
            hiddenDate = selectedMonth + "/" + selectedYear;
          } else if ( selectedYear != 0 && selectedMonth == 0 ) {
            hiddenDate = selectedYear;
          } else {
            hiddenDate = "";
          }
          
        } else { // monthValue == name, format: October 1, 2012
        
          if ((selectedYear * selectedMonth * selectedDay) != 0) {
            hiddenDate = months[settings["monthFormat"]][((selectedMonth - 1))] + " " + selectedDay + ", " + selectedYear;
          } else if ( (selectedYear * selectedMonth) != 0 && selectedDay == 0) {
            hiddenDate = months[settings["monthFormat"]][((selectedMonth - 1))]  + ", " + selectedYear;
          } else if ( selectedYear != 0 && selectedMonth == 0 ) {
            hiddenDate = selectedYear;
          } else {
            hiddenDate = "";
          }        
          
        }        

          $(this).find('#'+settings["fieldId"]).val(hiddenDate);
          if (settings["onChange"] != null) {
            settings["onChange"](hiddenDate);
          }          
      });
    });
  };
})( jQuery );
