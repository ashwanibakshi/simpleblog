$(document).ready(function(){
    $('#subs').click(function(){
         var sub = $("#subs1").text();
         if(!sub=='')
         {
        alert('thanks to subscribe')
         }else{
             alert('please provide the email address')
         }
    });
});