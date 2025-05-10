gsap.registerPlugin(ScrollTrigger)

const chatUser = document.querySelectorAll(".chat-user")
const chatNeoma = document.querySelectorAll(".chat-neoma")

chatUser.forEach(user => {
    gsap.from(user, {
        y: "10vw",
        opacity: 0,
        scrollTrigger: {
            trigger: user,
            start: "90% bottom",
            end: "100% bottom",
            scrub: false,
            markers: false,
        }
    })
});

chatNeoma.forEach(neoma => {
    gsap.from(neoma, {
        y: "10vw",
        opacity: 0,
        scrollTrigger: {
            trigger: neoma,
            start: "90% bottom",
            end: "100% bottom",
            scrub: false,
            markers: false,
        }
    })
});