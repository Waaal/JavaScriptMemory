const timeLimit = 160;
const unlimitedTime = 'no';
const cardNumber = 16;
const difficulty = "easy";
const username = "";

let timeInput;
let unlimitedTimeInput;
let cardNumberInput;
let difficultyInput;
let usernameInput;

function initSettings()
{
    timeInput = document.getElementById("time-ID");
    unlimitedTimeInput = document.getElementById("unlimited-time-ID");
    cardNumberInput = document.getElementById("cardNumber-ID");
    difficultyInput = document.getElementById("difficulty-ID");
    usernameInput = document.getElementById("username-ID");
    
    initStorage();
    loadStorage();

    timeInput.addEventListener('change', changeStorage);
    unlimitedTimeInput.addEventListener('change', changeStorage);
    cardNumberInput.addEventListener('change', changeStorage);
    difficultyInput.addEventListener('change', changeStorage);
    usernameInput.addEventListener('change', changeStorage);
}

function initStorage()
{
    if(localStorage.getItem("timeLimit") == null)
    {
        localStorage.setItem('timeLimit', timeLimit);
    }
    if(localStorage.getItem("unlimitedTime") == null)
    {
        localStorage.setItem('unlimitedTime', unlimitedTime);
    }
    if(localStorage.getItem("cardNumber") == null)
    {
        localStorage.setItem('cardNumber', cardNumber);
    }
    if(localStorage.getItem("difficulty") == null)
    {
        localStorage.setItem('difficulty', difficulty);
    }
    if(localStorage.getItem("username") == null)
    {
        localStorage.setItem('username', username);
    }
}

function changeStorage(e)
{
    let cookieName = e.currentTarget.dataset.storageName;

    let value = e.currentTarget.value;

    localStorage.setItem(cookieName, value);
    console.log(localStorage.getItem(cookieName));
}

function loadStorage()
{
    if(localStorage.getItem('unlimitedTime') == 'yes')
    {
        unlimitedTimeInput.options[0].selected = true;
        unlimitedTimeInput.options[1].selected = false;
    }
    else
    {
        unlimitedTimeInput.options[0].selected = false;
        unlimitedTimeInput.options[1].selected = true;
    }

    cardNumberInput.value = localStorage.getItem('cardNumber');
    timeInput.value = localStorage.getItem('timeLimit');
    setDifficulty(localStorage.getItem('difficulty'));

    usernameInput.value = localStorage.getItem('username');
}

function resetData()
{
    localStorage.setItem('timeLimit', timeLimit);
    localStorage.setItem('unlimitedTime', unlimitedTime);
    localStorage.setItem('cardNumber', cardNumber);
    localStorage.setItem('difficulty', difficulty);
    localStorage.setItem('username', username);

    timeInput.value = timeLimit;
    cardNumberInput.value = cardNumber;
    usernameInput.value = username;
    setDifficulty("easy");

    unlimitedTimeInput.options[0].selected = false;
    unlimitedTimeInput.options[1].selected = true;
}

function setDifficulty(difficulty)
{
    for(let i = 0; i < difficultyInput.options.length; i++)
    {
        if(difficultyInput.options[i].value != difficulty)
        {
            difficultyInput.options[i].selected = false;
        }
        else
        {
            difficultyInput.options[i].selected = true;
        }
    }
}