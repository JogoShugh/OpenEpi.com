jQuery.noConflict();
//Do not use the "$" naming convention for jQuery
//It conflicts with the prototype library
jQuery(document).ready(function(){
jQuery('button#toMenu').click(function(){
     jQuery('div#menuDiv').show();
     jQuery('div#appDiv').hide()
  })
if((ScreenConfig=='smartphone') || ((ScreenConfig=='auto') && (device=='smartphone')))
   {
     jQuery('div#menuDiv').hide();
     jQuery('button#toMenu').show();
   }
   else
   {
     jQuery('button#toMenu').hide();
   }
});

