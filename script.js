let signs = ['+', '-', '*']
let container_main = document.querySelector('.main')
let container_start = document.querySelector('.start')
let container_start_h3 = container_start.querySelector('h3')
let question_field = document.querySelector('.question')
let answer_buttons = document.querySelectorAll('.answer')
let start_button = document.querySelector('.start-btn')

let cookie = false
let cookies = document.cookie.split('; ')

for (let i=0; i < cookies.length; i+= 1){
    if (cookies[i].split('=')[0] == 'numbers_high_score'){
        cookie = cookies[i].split('=')[1]
        break
    }
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex != 0){
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array
}

if (cookie){
    let data = cookie.split('/')
    container_start_h3.innerHTML = `<h3>Минулого разу ви дали ${data[1]} правильних відповідей із ${data[0]}. Точність: ${Math.round(data[1] * 100 / data[0])}%.</h3>`
}

function randint(min, max){
    return Math.round(Math.random()*(max-min)+min )
}

function getRandomSign(){
    return signs[randint(0, 2)]
}

class Question{
    constructor(){
        let a= randint(1, 30)
        let b = randint(1, 30)
        let sign = getRandomSign()
        this.question = `${a} ${sign} ${b}`
        if (sign == '+') {this.correct = a + b}
        else if(sign == '-') {this.correct = a - b}
        else if(sign == '*') {this.correct = a * b}
        this.answer = [
            randint(this.correct - 20, this.correct - 1),
            randint(this.correct - 20, this.correct - 1),
            this.correct,
            randint(this.correct + 1, this.correct + 20),
            randint(this.correct + 1 , this.correct + 20),

        ]
        shuffle(this.answer);
    }

    display() {
        question_field.innerHTML= this.question
        for (let i = 0; i < this.answer.length; i += 1){
            answer_buttons[i].innerHTML = this.answer[i]
        }
    }
}

let current_question;
let correct_answer_given;
let total_answer_given;

let correct_ans = [];
let all_ans = [];
let percents = [];

const table = document.querySelector('.res');
let timer = document.querySelector('.clock')
const tableBody = table.querySelector('tbody');

function addResultToTable(correct, total) {
    const newRow = document.createElement('tr');
    const correctCell = document.createElement('td');
    correctCell.textContent = correct;
    
    const totalCell = document.createElement('td');
    totalCell.textContent = total;
    
    const accuracyCell = document.createElement('td');
    const accuracy = total > 0 ? Math.round(correct * 100 / total) : 0;
    accuracyCell.textContent = `${accuracy}%`;
    
    newRow.appendChild(totalCell);
    newRow.appendChild(correctCell);
    newRow.appendChild(accuracyCell);
    
    tableBody.appendChild(newRow);
}

start_button.addEventListener('click', function() {
    container_main.style.display = 'flex';
    container_start.style.display = 'none';
    table.style.display = 'none';

    current_question = new Question();
    current_question.display();

    correct_answer_given = 0;
    total_answer_given = 0;

    let time_left = 30;
    timer.innerHTML = time_left;

    let game_timer = setInterval(function() {
        time_left -= 1;
        timer.innerHTML = time_left;

        if (time_left <= 0) {
            clearInterval(game_timer);

            let new_cookie = `numbers_high_score=${total_answer_given}/${correct_answer_given}; max-age=100000000000`;
            document.cookie = new_cookie;

            container_main.style.display = 'none';
            container_start.style.display = 'flex';
            table.style.display = 'table';

            correct_ans.push(correct_answer_given);
            all_ans.push(total_answer_given);
            percents.push(new_cookie);

            container_start_h3.innerHTML = `<h3>Ви дали ${correct_answer_given} правильних відповідей із ${total_answer_given}. Точність: ${Math.round(correct_answer_given * 100 / total_answer_given)}%.</h3>`;

            addResultToTable(correct_answer_given, total_answer_given);
        } 
    }, 1000); 
});

for (let i = 0; i < answer_buttons.length; i +=1) {
    answer_buttons[i].addEventListener('click', function() {
        if (answer_buttons[i].innerHTML == current_question.correct) {
            correct_answer_given += 1
            answer_buttons[i].style.background = '#95f595'
        } else {
            answer_buttons[i].style.background = '#f78181'
            
            
        }
        anime({
                targets: answer_buttons[i],
                background: '#f0c9ed',
                duration: 500,
                delay: 100,
                easing: 'linear'
            })

        total_answer_given +=1
        current_question = new Question()
        current_question.display()
    })
}

anime({
    targets: '.start-btn',
    duration: 5000,
    easing: 'linear',
    backgroundColor: [
        { value: '#ffadad'}, 
        { value: '#ffd6a5'}, 
        { value: '#fdffb6'},
        { value: '#caffbf'},
        { value: '#9bf6ff'},
        { value: '#a0c4ff'},
        { value: '#bdb2ff'}
    ],
  loop: true
});
