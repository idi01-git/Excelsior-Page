import gsap from "gsap";
import {SplitText} from "gsap/SplitText";
import {CustomEase} from "gsap/all";

gsap.registerPlugin(SplitText, CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1");

let split = new SplitText(".hero-copy p", {
    type: "words",
    wordsClass: "word",
});

const textPaths=document.querySelectorAll(".loader svg textPath");

const startTextLengths=Array.from(textPaths).map((tp) =>
    parseFloat(tp.getAttribute("textLength"))
);

const startTextOffsets=Array.from(textPaths).map((tp) =>
    parseFloat(tp.getAttribute("startOffset"))
);

const targetTextLengths=[4000, 3500, 3250, 3000, 2500, 2000, 1500, 1250];
const orbitRadii=[775, 700, 625, 550, 475, 400, 325, 250];

const maxOrbitRadius=orbitRadii[0];
const maxAnimDuration= 1.25;
const minAnimDuration= 1;

textPaths.forEach((textPath, index)=>{
    const animationDelay=(textPaths.length-1-index)*0.1;
    const currentOrbitRadius=orbitRadii[index];
    const currentDuration= minAnimDuration+(currentOrbitRadius/maxOrbitRadius)*(maxAnimDuration-minAnimDuration);

const pathLength=2*Math.PI*currentOrbitRadius*3;
const textLengthIncrease=targetTextLengths[index]-startTextLengths[index];
const offsetAdjustment=(textLengthIncrease/2/pathLength)*100;
const targetOffset=startTextOffsets[index]-offsetAdjustment;

gsap.to(textPath,{
    attr:{
        textLength: targetTextLengths[index],
        startOffset: targetOffset+"%",
    },
    duration: currentDuration,
    delay: animationDelay,
    ease:"power2.inOut",
    yoyo:true,
    repeat: -1,
    repeatDelay:0,
    });
});

let loaderRotation=0;

function animateRotation(){
    const spinDirection = Math.random() < 0.5?1:-1;
    loaderRotation +=25*spinDirection;

    gsap.to("svg", {
        rotation: loaderRotation,
        duration: 2,
        ease: "power2.inOut",
        onComplete: animateRotation,
    });
}

animateRotation();

const counterText=document.querySelector(".counter p");
const count={value:0};

gsap.to(count, {
    value:100,
    duration: 4,
    delay: 1,
    ease: "power1.out",
    onUpdate: function(){
        counterText.textContent=Math.floor(count.value);
    },
    onComplete: function(){
        gsap.to(".counter", {
            opacity:0,
            duration: 0.5,
            delay: 1,
        });
    },
});

const orbitTextElements=document.querySelectorAll(".orbit-text");
gsap.set(orbitTextElements, {opacity: 0});

const orbitTextsReversed=Array.from(orbitTextElements).reverse();

gsap.to(orbitTextsReversed, {
    opacity:1,
    duration: 0.75,
    stagger: 0.125,
    ease: "power1.out",
});

gsap.to(orbitTextsReversed, {
    opacity: 0,
    duration: 0.75,
    stagger: 0.1,
    delay:6,
    ease: "power1.out",
    onComplete: function(){
        gsap.to(".loader",{
            opacity:0,
            duration:1,
            onComplete: ()=>{
                document.querySelector(".loader").remove();
            },
        });

        gsap.to(".hero-bg", {
            scale:1,
            duration:2,
            delay: -0.5,
            ease: "hop",
        });

        gsap.to(".hero-copy p .word", {
            y:"0%",
            duration:2,
            delay: -0.25,
            stagger: 0.1,
            ease: "hop",
        });
    },
});