const
    inquirer = require('inquirer'),
    words = require('./words'),
    color = require('cli-color')

let level = ''

module.exports.run = (flags) => {

    if (flags.difficulty.toLowerCase() === 'easy') {
        level = 'easy'
    }
    else if (flags.difficulty.toLowerCase() === 'hard') {
        level = 'hard'
    }

    const game = new Game(level)
    game.init()
    // console.log('\nNumber of Guesses: ', numOfGuesses)
    // console.log('Correct Anwer: ', correctAnswer)
    // console.log('Display Array\'size: ', displayArray.length)
    // console.log('Display Array: ', displayArray)
}
// console.log(wordArray.easy)
// console.log(wordArray.hard)

// Global variables
let
    answer = '',
    numOfGuesses = 0,
    correctAnswer = 0,
    count = 0

let
    lettersArray = [],
    guessedLettersArray = [],
    displayArray = []

const
    valuesArray = []

class Game {

    constructor(difficulty) {

        this.difficulty = difficulty

        if (difficulty === 'easy') {
            answer = words.easy[Math.floor(Math.random() * (words.easy.length + 1))]
            // console.log('Easy Word: ', answer)
        }
        else if (difficulty === 'hard') {
            answer = words.hard[Math.floor(Math.random() * (words.hard.length + 1))]
            // console.log('Hard Word: ', answer)
        }
    }

    init() {

        numOfGuesses = 4
        correctAnswer = answer.length
        displayArray = [answer.length]

        lettersArray = answer.toUpperCase().split('')
        // console.log(lettersArray)

        for (let i = 0; i < answer.length; i++) {
            displayArray[i] = '_ '
        }

        this.displayGame(displayArray.join(' '))

        this.displaySelection()

        this.addValue(this.countLetter(lettersArray))
    }

    displayGame(str) {

        console.log(color.yellow('-------- Mystery Game ----------------\n'))
        console.log(color.yellow('\n\t' + str + '\n'))
        console.log(color.yellow('\n--------------------------------------\n'))
    }

    displayGuessedLetter(arr) {

        console.log(color.blue('-------- Guessed Letters ----------------\n'))
        console.log(color.blue('\t' + arr.join(' ') + '\n'))
        console.log(color.blue('\n--------------------------------------\n'))
    }

    displaySelection() {

        inquirer.prompt([ {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: [ 'Guess a letter', 'Get a hint', 'View guessed letters' ]
        } ]).then((selection) => {

            // console.log(valuesArray.join(' '))
            if (selection.choice === 'Guess a letter') {
                this.guessedLetter()
            }
            else if (selection.choice === 'Get a hint') {

                this.getHint()

                this.displaySelection()

                if (correctAnswer < 1) {
                    console.log(color.green('\n--------------------------------------\n'))
                    console.log(color.green('\tCONGRATS!\n'))
                    console.log(color.green('--------------------------------------\n'))

                    this.repeat()
                }
            }
            else if (selection.choice === 'View guessed letters') {
                // console.log('\t' + guessedLettersArray.join(' '))
                this.displayGuessedLetter(guessedLettersArray)

                this.displayGame(displayArray.join(' '))

                this.displaySelection()
            }
        })
    }

    guessedLetter() {
        inquirer.prompt([ {
            type: 'input',
            name: 'letter',
            message: 'Guess a letter: '
        } ]).then((input) => {

            guessedLettersArray.push(input.letter.toUpperCase())

            if (lettersArray.includes(input.letter.toUpperCase()) === false) {
                numOfGuesses--
            }

            // console.log(numOfGuesses)

            for (let i = 0; i < answer.length; i++) {
                if (input.letter.toUpperCase() === lettersArray[i]) {
                    displayArray[i] = input.letter.toUpperCase()

                    correctAnswer--
                    // console.log('Answer: ', lettersArray[i])
                    // console.log('Guess: ', input.letter)
                }
            }

            this.displayGame(displayArray.join(' '))

            this.displaySelection()

            if (correctAnswer < 1) {
                console.log(color.green('\n--------------------------------------\n'))
                console.log(color.green('\tCONGRATS!\n'))
                console.log(color.green('--------------------------------------\n'))

                this.repeat()
            }
            else if (numOfGuesses < 1) {
                console.log(color.red('\n--------------------------------------\n'))
                console.log(color.red('\tGAME OVER!'))
                console.log(color.red('--------------------------------------\n'))

                this.repeat()
            }
        })
    }

    getHint() {

        let letter = valuesArray[count]
        for (let i = 0; i < lettersArray.length; i++) {
            if ( (letter === lettersArray[i]) && (displayArray[i] === '_ ') ) {
                displayArray[i] = letter
                correctAnswer--
                // console.log(correctAnswer)
            }
        }

        if (count < valuesArray.length) {
            count++
        }

        return this.displayGame(displayArray.join(' '))
    }

    repeat() {

        inquirer.prompt([ {
            type: 'input',
            name: 'answer',
            message: 'Would you like to play again? [choices: yes, no]'
        } ]).then((input) => {

            if (input.answer === 'yes') {
                const game = new Game(level)
                game.init()
            }
                else if (input.answer === 'no') {
                process.exit()
            }
        })
    }

    countLetter(arr) {

        const characters = {}

        for (let i = 0; i < arr.length; i++) {
            arr[i].toUpperCase()
            if (characters[arr[i]] === undefined) {
                characters[arr[i]] = 1
            }
            else {
                characters[arr[i]] = characters[arr[i]] + 1
            }
          }

          return characters
    }

    addValue(obj) {

        const
            array = [],
            array2 = [],
            array3 = []

        const key = Object.keys(obj)
        const value = Object.values(obj)

        for (let i = 0; i < value.length; i++) {
            if (value[i] === 1) {
                array.push(key[i])
            }
            else if (value[i] === 2) {
                array2.push(key[i])
            }
            else if (value[i] === 3) {
                array3.push(key[i])
            }
        }

        for (let i = 0; i < array.length; i++) {
            valuesArray.push(array[i])
        }

        for (let i = 0; i < array2.length; i++) {
            valuesArray.push(array2[i])
        }

        for (let i = 0; i < array3.length; i++) {
            valuesArray.push(array3[i])
        }
    }
}
