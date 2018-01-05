console.log('index');
setTimeout(function () {
    document.querySelector('.pageLoad').style.display='none'
},2000)
let nextBtn=document.getElementById('nextBtn');
nextBtn.onclick=function () {
    location.href='./next.html'
}