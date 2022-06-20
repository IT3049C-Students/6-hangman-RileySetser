class Hangman {
  constructor(_canvas) {
    if (!_canvas) {
      throw new Error(`invalid canvas provided`);
    }

    this.canvas = _canvas;
    this.ctx = this.canvas.getContext(`2d`);
  }

  /**
   * This function takes a difficulty string as a patameter
   * would use the Fetch API to get a random word from the Hangman
   * To get an easy word: https://hangman-micro-service-bpblrjerwh.now.sh?difficulty=easy
   * To get an medium word: https://hangman-micro-service-bpblrjerwh.now.sh?difficulty=medium
   * To get an hard word: https://hangman-micro-service-bpblrjerwh.now.sh?difficulty=hard
   * The results is a json object that looks like this:
   *    { word: "book" }
   * */
  getRandomWord(difficulty) {
    return fetch(
      `https://hangman-micro-service.herokuapp.com/?difficulty=${difficulty}`
    )
      .then((r) => r.json())
      .then((r) => r.word);
  }

  /**
   *
   * @param {string} difficulty a difficulty string to be passed to the getRandomWord Function
   * @param {function} next callback function to be called after a word is reveived from the API.
   */
  async start(difficulty, next) {
    // get word and set it to the class's this.word
    this.promise = this.getRandomWord(difficulty);
    this.word = await this.promise;
    console.log(this.word);
    next();
    // clear canvas
    this.clearCanvas();
    // draw base
    this.drawBase();
    // reset this.guesses to empty array
    this.guesses = [];
    // reset this.isOver to false
    this.isOver = false;
    // reset this.didWin to false
    this.didWin = false;
  }

  /**
   *
   * @param {string} letter the guessed letter.
   */
  guess(letter) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    console.log(letter);
    //(STUDENT'S COMMENTS)
    //creating a string that contains the alphabet, both uppercase and lowercase, used to detect numbers and symbols.
    console.log(alphabet);

    // Check if nothing was provided and throw an error if so
    if (!letter) {
      throw "There is no letter. Please input a letter."
    }
    console.log("there is something there");

    // Check for invalid cases (numbers, symbols, ...) throw an error if it is

    let splitLetters = letter.split('');
    console.log(splitLetters);

    for (const letters of splitLetters) {
      console.log(letters);
      if (!alphabet.includes(letters)) {
        throw "Please enter in a letter.";
      }
    }

    console.log("it is a letter");

    // Check if more than one letter was provided. throw an error if it is.
    if (splitLetters.length > 1) {
      throw "Please enter only ONE letter."
    }
    console.log("and there is only one letter.");

    // if it's a letter, convert it to lower case for consistency.
    let lowerCased = letter.toLowerCase();

    // check if this.guesses includes the letter. Throw an error if it has been guessed already.
    if (this.guesses.includes(lowerCased)) {
      throw "You already guessed this letter.";
    } else {
      this.guesses.push(lowerCased);
    }
    console.log("this letter has not yet been guessed.")

    // add the new letter to the guesses array.
    if (this.word.includes(lowerCased)) {
      this.checkWin();
      console.log('the word does contain this letter');
    } else {
      this.onWrongGuess();
      console.log('the word does not contain this letter');
    }
    // check if the word includes the guessed letter:
    //    if it's is call checkWin()
    //    if it's not call onWrongGuess()
  }

  checkWin() {
    let splitWord = this.word.split('');
    let unknown = 0;
    for (const letter in splitWord) {
      if (!this.guesses.includes(letter)) {
        unknown++;
      }
    }

    if (unknown === 0) {
      this.didWin = true;
      this.isOver = true;
    }
    // using the word and the guesses array, figure out how many remaining unknowns.
    // if zero, set both didWin, and isOver to true
  }

  /**
   * Based on the number of wrong guesses, this function would determine and call the appropriate drawing function
   * drawHead, drawBody, drawRightArm, drawLeftArm, drawRightLeg, or drawLeftLeg.
   * if the number wrong guesses is 6, then also set isOver to true and didWin to false.
   */
  onWrongGuess() {
    let wrongGuesses = 0;
    let splitWord = this.word.split('');
    for (const letter in splitWord) {
      if (!this.guesses.includes(letter)) {
        wrongGuesses++;
      }
    }
    switch (wrongGuesses) {
      case 1:
        this.drawHead();
        break;
      case 2:
        this.drawBody();
        break;
      case 3:
        this.drawRightArm();
        break;
      case 4:
        this.drawLeftArm();
        break;
      case 5:
        this.drawRightLeg();
        break;
      case 6:
        this.drawLeftLeg();
        this.isOver = true;
        this.didWin = false;
        break;
    }
  }

  /**
   * This function will return a string of the word placeholder
   * It will have underscores in the correct number and places of the unguessed letters.
   * i.e.: if the word is BOOK, and the letter O has been guessed, this would return _ O O _
   */
  getWordHolderText() {
    return `test`;
  }

  /**
   * This function returns a string of all the previous guesses, seperated by a comma
   * This would return something that looks like
   * (Guesses: A, B, C)
   * Hint: use the Array.prototype.join method.
   */
  getGuessesText() {
    return `test`;
  }

  /**
   * Clears the canvas
   */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draws the hangman base
   */
  drawBase() {
    this.ctx.fillRect(95, 10, 150, 10); // Top
    this.ctx.fillRect(245, 10, 10, 50); // Noose
    this.ctx.fillRect(95, 10, 10, 400); // Main beam
    this.ctx.fillRect(10, 410, 175, 10); // Base
  }

  drawHead() {}

  drawBody() {}

  drawLeftArm() {}

  drawRightArm() {}

  drawLeftLeg() {}

  drawRightLeg() {}
}
