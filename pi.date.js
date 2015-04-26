function initPiDate (context) {
  'use strict';
  var Pi = context.Pi;

  // Date Specific
  // Culutural
  Pi.prototype.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  Pi.prototype.days   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  Pi.prototype.dateformat  =  'dmy';

  // String to date
  String.prototype.$$toDate = function(f) {
      if(this.length > 30 ) {
        return;
      }
      f = f || Pi.dateformat;
      var m = this.split(/[ \/:-]/g);
      if(m.length < 6) {
          m = m.concat(['00', '00', '00'].slice(0, 6 - m.length));
      }
      var t =    m[f.indexOf('y')] + '-' +m[f.indexOf('m')]  +  '-' + m[f.indexOf('d')] ;
      t += 'T' + m.slice(3).join(':') + 'Z'; //configure as needed
      return new Date(t);

  };

  // hdr = header   =  Overide default header
  // tpl = template =  Overide day template
  // trimDays = trimCharactes of day title,  ie  2  will make Su,Mo,Tu ....
  // MonthTrim = trim characters for month ie 3 will make Jan, Feb,Mar, ...
  // date parse in a date.
  // o.dayTpl day renderer

 Pi.prototype.Calendar = function(o) {
    var _self = this;
    var now = new Date();
    var today   = now.getDate();
    o = o || {};
    o.date = o.date || now;
    o.dayTrim = o.dayTrim ||  2;
    o.monthTrim = o.monthTrim ||  3;
    o.header =  o.header ||  "<div class='menu'><div class='block prev s'> « </div><div class='block chooser s' >.</div><div class='block next s'> » </div></div>";

    var _a = {
        //  UI interaction function overridable.
        day :  o.dayFunc    || function(d) {  console.log( d + "-" + o.month + "-" + o.year);  },
        month: o.monthFunc || function(e) { _a.move_date(0,_self.months.indexOf(e.target.innerHTML),"month");     },
        year: o.monthFunc || function(e) { _a.move_date(0, e.target.innerHTML, "year" );   },
        prev : function(m)      {  _a.move_date(-1); },
        next:  function(m)      {  _a.move_date(1);  },
        chooser : function(m)   {  var k = ctn.getAttribute('data-d'); if(k ==="month") {_a.r_year();} else { _a.r_decade();}  },
        event: function(m)      {  console.log('open event'); },
        // Helper Functions
        dsplit : function() {   // Split months
            o.year = o.date.getFullYear();
            o.decade = o.year -(o.year % 10);
            o.month = o.date.getMonth();
            o.day   = o.date.getDate();
        },
        move_date: function(i,s,k) {
            k = k || ctn.getAttribute('data-d');
            console.log(k);
            console.log(i);
            if(k === 'decade' && i !== 0) {
               o.year += i * 10;
            } else {
                o[k] = s ||  o[k] + i;
            }
            o.date = new Date(o.year, o.month, o.day);
            _a.dsplit();
            _a['r_'+k]();
        },
        // Render Functions
        r_month : function() {
                  ctn.setAttribute("data-d", "month");
                  var current = now.getFullYear() === o.year  && now.getMonth() === o.month;
                  o.dayTpl =  o.dayTpl || function(d){ return d;} ;
                  o.dayNames =  o.dayNames || '<div class="title"><div class="block day">'+ ( o.dayTrim ? _self.days.map(function(s) { return s.substring(0,o.dayTrim) }) : _self.days).join("</div><div class='block day'>")  +'</div></div>';
                  var cal =  o.dayNames;
                  for (var i=0,  il = new Date(o.year, o.month, 1).getDay(); i < il; i++) {
                       cal +=  '<div class="block day"></div>';
                  }
                  for (var j = 1, jl = (new Date(o.year, o.month+1, 0).getDate() + 1); j < jl; j++) {
                          cal+= '<div class="block day s ' + ( current && j === today ? 'today' : '') +' " data-day="'+j+'"  >'+o.dayTpl(j)+'</div>';
                  }
                  display.innerHTML  = cal;
                  chooser.innerHTML = _self.months[o.date.getMonth()] + " " + o.year ;
        },
        r_year : function() {
                ctn.setAttribute("data-d", "year");
                chooser.innerHTML =  o.year;
                display.innerHTML  = '<div class="block month s">'+ ( o.monthTrim ? _self.months.map(function(s) { return s.substring(0,o.monthTrim) }) : _self.months).join("</div><div class='block month s'>") + '</div>';
        },
        r_decade : function(){
               ctn.setAttribute("data-d", "decade");
               var cal = "";
               for (var i=o.decade -1; i < o.decade + 11; i++) {
                    cal +=  '<div class="block year s">'+i+'</div>';
               }
               chooser.innerHTML =  o.decade + '-'+(o.decade+9);
               display.innerHTML  = cal;
        }
    };
     _a.dsplit();  // split dates
    // Render Calendar
     var el = document.getElementById(o.id);
     var ctn =  document.createElement('div');
     var display =  document.createElement('div');
     ctn.classList.add('datepicker', 'block-group');
     ctn.addEventListener('click', function(e)  {
        if(e.target.classList.contains('s')){
            Array.prototype.slice.call(e.target.classList, 0).map( function(c) {  if(typeof _a[c] === "function") {   _a[c](e);  } });
        }
     });
     ctn.innerHTML =  o.header;
     el.appendChild(ctn);
     var chooser = el.getElementsByClassName('chooser')[0];
     ctn.appendChild(display);
     _a.r_month();

 };
}
