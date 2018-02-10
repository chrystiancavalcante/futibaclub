const videoTemplete =  Handlebars.compile($("#video-template").html())
const bidTemplete   =  Handlebars.compile($("#bid-template").html())

$(function(){

const socket = io('', { query: { match: MATCH_INDEX}})
socket.on('connect', function(){

     console.log('connected')
})

socket.on('score', function(score){
 
    console.log('score', score)

$(".match-"+score.match+"-a").html(score.scoreA)
$(".match-"+score.match+"-b").html(score.scoreB)

if(MATCH_INDEX == score.match){

$(".score-team-a").html(score.scoreA);
$(".score-team-b").html(score.scoreB);
     
if(score.notify =='1'){
     
    console.log('notificar')

$('#audio-gol')[0].currentTime = 0;
$('#audio-gol')[0].play();


$('.goooolllll').addClass('goooolllll-anim') 
$('.goooolllll-text').addClass('goooolllll-text-anim')
$('.goooolllll-text').on('transitionend webkitTransitionEnd oTransitionEnd', function(){
$('.goooolllll').removeClass('goooolllll-anim')
$('.goooolllll-text').removeClass('goooolllll-text-anim')

  
     })
    

    }
         
  }

})

socket.on('supporters', function(supporters){
 
    console.log(supporters)
     
$(".bar-team-a").css('width', supporters.teamA+'%')  
$(".bar-team-b").css('width', supporters.teamB+'%')
     
})

socket.on('video', function(video){

$("#videos-wrapper").append(videoTemplete({ video }))
             
})

socket.on('bid', function(bid){
 
$("#bids-wrapper").prepend(bidTemplete(bid))
                 
})       

  
$("#na-torcida-a").click(function(){
$.post("/match/"+MATCH_INDEX+"/supporters", { team: 'a'}, function(data)
{})


             
    return false;
             
})
           
$("#na-torcida-b").click(function(){
$.post("/match/"+MATCH_INDEX+"/supporters", { team: 'b'}, function(data)
{})


            
    return false;
    
          
 })
   
})

