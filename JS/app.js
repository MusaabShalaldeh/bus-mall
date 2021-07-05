'use strict'


let productsHolder = [];

let lastSetOfImages = [];

let maxRounds = 25;

let round = 0;

const voteSection = document.getElementById('voteImages');


const resultSection = document.getElementById('resultSection');

const clickSFX = document.getElementById('clickSFX');
const clickSFX2 = document.getElementById('clickSFX2');

const fixedHeight = 256;
const fixedWidth = 300;


function Product(productName, imgPath){

    this.productName = productName;
    this.imgPath = imgPath;

    this.timesVoted = 0;
    this.timesShown = 0;

    productsHolder.push(this);
}


new Product('bag','Images/bag.jpg');
new Product('banana','Images/banana.jpg');
new Product('bathroom','Images/bathroom.jpg');
new Product('boots','Images/boots.jpg');
new Product('breakfast','Images/breakfast.jpg');

new Product('bubblegum','Images/bubblegum.jpg');
new Product('chair','Images/chair.jpg');
new Product('cthulhu','Images/cthulhu.jpg');
new Product('dog-duck','Images/dog-duck.jpg');
new Product('dragon','Images/dragon.jpg');

new Product('pen','Images/pen.jpg');
new Product('pet-sweep','Images/pet-sweep.jpg');
new Product('scissors','Images/scissors.jpg');
new Product('shark','Images/shark.jpg');
new Product('sweep','Images/sweep.png');

new Product('tauntaun','Images/tauntaun.jpg');
new Product('unicorn','Images/unicorn.jpg');
new Product('water-Can','Images/water-can.jpg');
new Product('wine-glass','Images/wine-glass.jpg');





function renderImages(){
    if(round >= maxRounds)
    {
        triggerVoteEnd();
        return;
    }
    round += 1;

    // render images


    let vote1 = randomNum(0,productsHolder.length - 1);
    let vote2 = randomNum(0,productsHolder.length - 1);
    let vote3 = randomNum(0,productsHolder.length - 1);

    while(checkIfValuesMatch(vote1,vote2,vote3))
    {
        vote1 = randomNum(0,productsHolder.length - 1);
        vote2 = randomNum(0,productsHolder.length - 1);
        vote3 = randomNum(0,productsHolder.length - 1);
    }

    // loop through this array
    const votesArr = [vote1,vote2,vote3];

    lastSetOfImages = votesArr;

    for (let i = 0; i < votesArr.length; i++) {

        const img = document.createElement('img');
        voteSection.appendChild(img);

        productsHolder[votesArr[i]].timesShown += 1;

        img.src = productsHolder[votesArr[i]].imgPath;
        img.width = fixedWidth;
        img.height = fixedHeight;
    }
    //add click event
    voteSection.addEventListener('click', voteThis);
}

function voteThis(event)
{
    //order of execution matters.

    //stopping sound incase the user spams clicking so that it can be replayed.
    clickSFX.pause();
    clickSFX.currentTime = 0;

    //get the voted object and increase its times voted value
    const votedObjIndex = compareChildren(voteSection, event.target);

    productsHolder[lastSetOfImages[votedObjIndex]].timesVoted += 1;

    //removing existing images
    voteSection.innerHTML = '';

    //play click sfx
    clickSFX.play();

    renderImages();
}


function triggerVoteEnd()
{
    //remove click event
    voteSection.removeEventListener('click', voteThis);
    //add buttons to show result and redo the vote

    // resultSection
    round = 0;
    //results button
    const viewResultsButton = document.createElement('button');
    viewResultsButton.textContent= 'View Results';
    viewResultsButton.id = 'resultsButton';
    resultSection.appendChild(viewResultsButton);
    viewResultsButton.onclick = showResults;


    const restartButton = document.createElement('button');
    restartButton.textContent= 'Restart Vote';
    restartButton.id = 'restartButton';
    voteSection.appendChild(restartButton);
    restartButton.onclick = restartVote;
}

function showResults()
{
    clickSFX2.play();
    document.getElementById('resultsButton').style.display = 'none';

    //print out results
    const _ul = document.createElement('ul');
    _ul.id = 'resultsList';
    resultSection.appendChild(_ul);

    for (let i = 0; i < productsHolder.length; i++) {

        // banana had 3 votes, and was seen 5 times.
        const p = productsHolder[i];
        const sentence = p.productName+' had '+p.timesVoted+' votes, and was seem '+p.timesShown+' times.';

        const _li = document.createElement('li');
        _ul.appendChild(_li);
        _li.textContent = sentence;
    }
}

function restartVote()
{
    //restart the vote process
    clickSFX2.play();

    //remove buttons
    voteSection.removeChild(document.getElementById('restartButton'));
    resultSection.removeChild(document.getElementById('resultsButton'));

    //reset times shown and voted
    for (let i = 0; i < productsHolder.length; i++) {
        productsHolder[i].timesShown = 0;
        productsHolder[i].timesVoted = 0;
    }

    //reset last images set
    lastSetOfImages = [];

    //remove existing results list.
    //double checking if the element exists or not to not cause errors.
    if(document.getElementById('resultsList') != null)
        resultSection.removeChild(document.getElementById('resultsList'));


    renderImages();
}


renderImages();







//-------------------------------------------
//Helper Functions
function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


function checkIfValuesMatch(val1, val2, val3){
    //will check all values
    if(val1 == val2 || val1 == val3 || val2 == val3)
        return true;
    else
        return false;
}

function compareChildren(parentElement, element){

    const children = parentElement.children;

    for (let i = 0; i < children.length; i++) {

        if(children[i] == element){

            return i;
        }
    }
}
//-------------------------------------------