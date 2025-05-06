gsap.registerPlugin(ScrollTrigger)

const chatUser = document.querySelectorAll(".chat-user")

chatUser.forEach(user => {
    gsap.from(user, {
        y: "10vw",
        opacity: 0,
        scrollTrigger: {
            trigger: user,
            start: "90% bottom",
            end: "center bottom",
            scrub: true,
            markers: false,
        }
    })
});