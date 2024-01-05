let recapData;

let cardContainer;

let cardNodes = [];

let speedLabel;

let recapWaitTime = 1000;
let cardWaitTime = 1000;
let step = 0;

let stop = true;

let speed = 1;

window.onload = function()
{
    recapData = JSON.parse(localStorage.getItem("recap"));
    cardContainer = document.getElementById("memory-container-ID");

    speedLabel = document.getElementById("speed-label-ID");

    document.getElementById("start-ID").addEventListener("click", startRecap);
    document.getElementById("stop-ID").addEventListener("click", stopRecap);
    document.getElementById("reset-ID").addEventListener("click", resetRecap);

    document.getElementById("slow-ID").addEventListener("click", slowSpeed);
    document.getElementById("fast-ID").addEventListener("click", fastSpeed);

    renderCards();
}

function startRecap()
{
    stop = false;
    nextStep();
}

function stopRecap()
{
    stop = true;
}

function resetRecap()
{
    step = 0;
    while(cardContainer.firstChild)
    {
        cardContainer.removeChild(cardContainer.lastChild);
    }
    renderCards();
}

function slowSpeed()
{
    if(speed > 1)
    {
        speed--;
        changeSpeed();
    }
}

function fastSpeed()
{
    if(speed < 5)
    {
        speed++;
        changeSpeed();
    }
}

function changeSpeed()
{
    switch(speed)
    {
        case 1:
            recapWaitTime = 1000;
            cardWaitTime = 1000;
            break;
        case 2:
            recapWaitTime = 700;
            cardWaitTime = 700;
            changeCardTransitionTime("0.5s");
            break;
        case 3:
            recapWaitTime = 500;
            cardWaitTime = 500;
            changeCardTransitionTime("0.3s");
            break;
        case 4:
            recapWaitTime = 200;
            cardWaitTime = 200;
            changeCardTransitionTime("0.1s");
            break;
        case 5:
            recapWaitTime = 50;
            cardWaitTime = 100;
            changeCardTransitionTime("0.1s");
        break;
    }
    speedLabel.innerHTML = speed+"x";
}

function changeCardTransitionTime(time)
{
    cardNodes.forEach(element => {
        element.firstChild.style.transition = "transform " + time;
    });
}

function nextStep()
{
    if(step < recapData.recap.length && !stop)
    {
        setTimeout(playStep, recapWaitTime);
    }else if(!stop)
    {
        alert("Recap end");
    }
}

function playStep()
{
    let recap = recapData.recap[step];

    let card1 = document.getElementById(recap.c1);
    let card2 = document.getElementById(recap.c2);

    card1.children[0].style.transform = "rotateY(180deg)";
    card2.children[0].style.transform = "rotateY(180deg)";

    setTimeout(function(){
        closeCards(recap, card1, card2);
    }, cardWaitTime);
}

function closeCards(recap, card1, card2)
{
    if(!recap.remove)
    {
        card1.children[0].style.transform = "rotateY(0deg)";
        card2.children[0].style.transform = "rotateY(0deg)";
    }
    else
    {
        card1.classList.add("remove-Card");
        card2.classList.add("remove-Card");
    }

    step++;
    nextStep();
}

function renderCards()
{
    let cardArr = [];
    recapData.cardData.forEach(element => {
        cardArr[element.ID] = element.img;
    });

    recapData.noteList.forEach(note =>{
        let cardData = cardArr[note];
        let card = generateCard(cardData, note);
        cardNodes.push(card);
        cardContainer.appendChild(card);
    });
}

function generateCard(imgLink, id)
{
    let flipCard = document.createElement("div");
    flipCard.id = id;
    flipCard.classList.add("flip-card");

    let flipCardInner = document.createElement("div");
    flipCardInner.classList.add("flip-card-inner");

    let flipCardFront = document.createElement("div");
    let flipCardBack = document.createElement("div");

    flipCardFront.classList.add("flip-card-front");
    flipCardBack.classList.add("flip-card-back");

    let imgFront = document.createElement("img");
    let imgBack = document.createElement("img");

    imgFront.src = "pictures/back.png";
    imgBack.src = "pictures/easy/" + imgLink;

    flipCardBack.appendChild(imgBack);
    flipCardFront.appendChild(imgFront);

    flipCardInner.appendChild(flipCardFront);
    flipCardInner.appendChild(flipCardBack);

    flipCard.appendChild(flipCardInner);
    return flipCard;
}