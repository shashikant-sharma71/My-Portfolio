var typed = new Typed(".multiple-text", {
    strings: ["Frontend Developer", "Web Developer", "Python Programmer"],
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 1000,
    loop: true
})

        
        
        
        
        
        
        
        
        
        
        
        
          /*===================toggle icon navbar===================*/
            let menuIcon = document.querySelector('#menu-icon');
            let navbar = document.querySelector('.navbar');

            menuIcon.onclick=()=>{
                menuIcon.classList.toggle(' bx bx-x');
                navbar.classList.toggle('active');
            };







let section = document.querySelestorAll('section');
let navLink = document.querySelestorAll('header nav a');

window.onscroll = () => {
    section.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop-150;
        let height = sec.offsetHeight;
        let id = sec.gerAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
            });
        };
    });
     
        /*===================sticky navber===================*/

        let header =document.querySelector('header');

        header.classList.toggle('sticky',window.scrollY>100);

         /*===================Remove  toggle icon and navber when click navbar link (scroll)===================*/
         menuIcon.classList.remove('bx-x');
         navbar.classList.remove('active');
};
     

 /*===================scroll Reveal ===================*/
 ScrollReveal({ 
    reset: true,
    distance: '80px', 
    duration:2000,
    delay: 200

 });
 ScrollReveal().reveal('.home-content,heading', { origin:'top'});

           
