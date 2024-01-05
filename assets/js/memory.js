import mappingData from '../cardMapping.json' assert { type: 'json' };

let memoryContainer;
let timerSpan;
let cardsRemainSpan;
let cardsCollectedSpan;
let collectedContainer;
let collectedModal;
let collectedOpenText;
let gameWonText;

let flipCardNodes = [];

let cardData = [];

let timeRemain = 160;
let cardNumber = 6;
let difficulty = "easy";
let unlimitedTime = false;

let timeNeed = 0;

let openCardsCount = 0;
let blockOpen = false;

let countCollected = 0;
let countGameOpenCards = 0;

let collectedOpen = false;

let interval;

let endModal;
let endModalContent;

let username = "No Name";

let cardOpenSec;

let recapData;

window.onload= function()
{
    memoryContainer = document.getElementById("memory-container-ID");
    timerSpan = document.getElementById("timer-ID");
    cardsRemainSpan = document.getElementById("cards-remain-ID");
    cardsCollectedSpan = document.getElementById("cards-collected-ID");

    collectedContainer = document.getElementById("collected-ID");
    collectedModal = document.getElementById("collectedModal-ID");
    collectedOpenText = document.getElementById("collected-open-ID");
    collectedOpenText.addEventListener("click", openCollected);

    endModal = document.getElementById("end-modal-ID");
    endModalContent = document.getElementById("end-modal-content-ID");
    gameWonText = document.getElementById("game-won-ID");

    loadData();
    generateCards();

    flipCardNodes = document.querySelectorAll('.flip-card');
    flipCardNodes.forEach(element => {
        element.addEventListener('click', cardClick);
    });

    updateText();
    initRecap(flipCardNodes);

    if(unlimitedTime == 'no')
    {
        timerSpan.innerHTML = timeRemain;
    }
    else
    {
        timerSpan.innerHTML = "unlimited";
    }
    interval = setInterval(updateTime, 1000);
}

function initRecap(flipCardNodes)
{
    let noteList = [];
    let cData = [];

    flipCardNodes.forEach(element => {noteList.push(element.id)});

    cardData.forEach(element => {
        cData.push({ID:element.ID, img:element.img});
    });

    recapData = {
        noteList: noteList,
        cardData: cData,
        recap:[]
    };
}

function loadData()
{
    timeRemain = localStorage.getItem('timeLimit');
    unlimitedTime = localStorage.getItem('unlimitedTime');

    cardNumber = localStorage.getItem('cardNumber');
    difficulty = localStorage.getItem('difficulty');
    username = localStorage.getItem('username');

    if(username == "")
    {
        username = "No Name";
    }
}

function updateTime()
{
    timeNeed++;

    if(unlimitedTime == "no")
    {
        timeRemain--;
        if(timeRemain > 0)
        {
            timerSpan.innerHTML = timeRemain;
        }
        else
        {
            endGame(false);
        }
    }
}

function openCollected()
{
    if(!collectedOpen)
    {
        collectedModal.style.display = "block";
    }
    else
    {
        collectedModal.style.display = "none";
    }
    collectedOpen = !collectedOpen;
}

function cardClick(e)
{
    if(!blockOpen)
    {
        let index = cardData.findIndex(obj =>{return obj.ID == e.currentTarget.id});
        if(!cardData[index].open)
        {
            cardData[index].open = true;
            e.currentTarget.children[0].style.transform = "rotateY(180deg)";
        
            openCardsCount++;
            countGameOpenCards++;
            if(openCardsCount >= 2)
            {
                blockOpen = true;
                setTimeout(checkOpenCards, cardOpenSec);
            }
        }
    }
}

function checkOpenCards()
{
    let openCards = cardData.filter(obj=>{return (obj.open == true && !obj.collected)});
    if(openCards[0].pair == openCards[1].pair)
    {
        generateMessageBox(3,3, "Pair: " + openCards[0].pair + " collected");
        collectedContainer.innerHTML += "<span>Pair</span><span><b>"+ openCards[0].pair +"</b></span>";
        deleteSameCards(openCards);

        recapData.recap.push({c1: openCards[0].ID, c2: openCards[1].ID, remove: true});
    }
    else
    {
        closeCards(openCards);

        recapData.recap.push({c1: openCards[0].ID, c2: openCards[1].ID, remove: false});
    }
    openCardsCount = 0;
    blockOpen = false;

    if((cardNumber - countCollected) <= 0)
    {
        endGame(true);
    }
}

function deleteSameCards(openCards)
{
    openCards.forEach(e =>{
        cardData[cardData.findIndex(obj=>{return e.ID == obj.ID})].collected = true;
    });

    let indexes = findCardNodeIndexes(openCards);
    indexes.forEach(element =>{
        //flipCardNodes[element].remove();
        flipCardNodes[element].addEventListener('animationend', function(){
            //flipCardNodes[element].remove();
        });
        flipCardNodes[element].classList.add("remove-Card");
    });

    countCollected += 2;
    updateText();
}

function closeCards(openCards)
{
    openCards.forEach(e =>{
        cardData[cardData.findIndex(obj=>{return e.ID == obj.ID})].open = false;
    });

    let indexes = findCardNodeIndexes(openCards);
    indexes.forEach(element =>{
        flipCardNodes[element].children[0].style.transform = "rotateY(0deg)";
    });
}

function updateText()
{
    cardsRemainSpan.innerHTML = cardNumber - countCollected;
    cardsCollectedSpan.innerHTML = countCollected;
}

function findCardNodeIndexes(openCards)
{
    let ret = [];
    openCards.forEach(element =>{
        let index = Array.from(flipCardNodes).findIndex(obj =>{return obj.id == element.ID});
        ret.push(index);
    });

    return ret;
}

function generateCards()
{
    let cardNodes = [];
    let counter = 0;

    let gameCards;
    switch(difficulty)
    {
        case "easy":
            gameCards = mappingData.easy
            break;
        default:
            gameCards = mappingData.easy
            break;
    }

    cardOpenSec = gameCards.cards_open;

    for(const [key,value] of Object.entries(gameCards.cards))
    {
        if(counter < cardNumber)
        {
            for(let i = 0; i < 2; i++)
            {
                let id = generateId(8);
                let img;
                if(value.length == 1)
                {
                    img = value[0];
                }
                else
                {
                    img = value[i];
                }

                cardData.push({
                    ID:id,
                    pair:key,
                    img:img,
                    open: false,
                    collected:false
                });

                cardNodes.push(generateCard(img, id))
                counter++;
            }
        }
    }

    cardNumber = counter;
    cardNodes = cardNodes.sort((a, b) => 0.5 - Math.random());
    cardNodes.forEach(e=>{memoryContainer.appendChild(e)})
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

function generateId(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function endGame(win)
{
    clearInterval(interval);

    blockOpen = true;

    if(win)
    {
        gameWonText.innerHTML = "Game Won";
    }
    else
    {
        gameWonText.innerHTML = "Game Lose";
    }

    endModalContent.innerHTML += "<span><b>Player: </b>" + username +"</span>";
    endModalContent.innerHTML += "<span><b>Total cards: </b>"+cardNumber+"</span>";
    endModalContent.innerHTML += "<span><b>Cards collected: </b>"+countCollected+"</span>";
    endModalContent.innerHTML += "<span><b>Total cards clicked: </b>"+countGameOpenCards+"</span>";
    endModalContent.innerHTML += "<span><b>Difficulty: </b>"+difficulty+"</span>";
    let t = timeRemain;
    if(unlimitedTime == "yes")
    {
        t = "unlimited";
    }
    else
    {
        t = timeRemain + timeNeed;
    }
    endModalContent.innerHTML += "<span><b>Time limit: </b>"+t+"</span>";
    endModalContent.innerHTML += "<span><b>Time needed: </b>"+timeNeed+"</span>";

    endModal.style.display = "flex";

    saveGameData(win, t);
}

function saveGameData(win, t)
{
    let data = {
        won: win,
        user: username,
        difficulty: difficulty,
        cards: cardNumber,
        collected: countCollected,
        clicked: countGameOpenCards,
        timeLimit: t,
        timeNeeded: timeNeed
    }

    let localStorageObj = 
    {
        ID:generateId(12),
        data: data,
        recapData: recapData
    }

    let temp = localStorage.getItem("gameList");
    if(temp == null)
    {
        localStorage.setItem("gameList", JSON.stringify(localStorageObj));
    }
    else
    {
        localStorage.setItem("gameList", (temp +"\n"+JSON.stringify(localStorageObj)));
    }
}