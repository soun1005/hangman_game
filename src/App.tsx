import { useCallback, useEffect, useState } from 'react';
import { HangmanDrawing } from './components/HangmanDrawing';
import { HangmanWord } from './components/HangmanWord';
import { Keyboard } from './components/Keyboard';
import ResetBtn from './components/ResetBtn';
import wordAPI from './assets/service/wordAPI';
import styles from './App.module.css';

// random word api address
const apiAddress = 'https://random-word-api.herokuapp.com/word';

async function fetchData() {
  const randomWord = await wordAPI<string[]>(apiAddress);
  return randomWord[0].toString();
}

function App() {
  const [wordToGuess, setWordToGuess] = useState<string | null>(null);
  const [guessedLetters, setGuesssedLetters] = useState<string[]>([]);

  useEffect(() => {
    fetchData().then((result) => setWordToGuess(result));
  }, []);

  const inCorrectLetters = guessedLetters.filter(
    (letter) => !wordToGuess?.includes(letter)
  );

  // Function to reset the game
  const resetGame = async () => {
    const newWord = await fetchData();
    setWordToGuess(newWord);
    setGuesssedLetters([]);
  };

  const isLoser = inCorrectLetters.length >= 6;
  const isWinner =
    wordToGuess &&
    wordToGuess
      .split('')
      // if every single letter is included as guessed letters, then it means we won
      .every((letter) => guessedLetters.includes(letter));

  // useCallback is like useMemo -> it only rerenders when 'guessedLetters' change (dependency)
  // so that useEffect isn't triggered every time
  const addGuessedLetter = useCallback(
    (letter: string) => {
      if (guessedLetters.includes(letter) || isLoser || isWinner) return;

      // add all current letters in the state array and add newly clicked letter at the end
      setGuesssedLetters((currentLetters) => [...currentLetters, letter]);
    },
    [guessedLetters, isWinner, isLoser]
  );

  // previous version
  // function addGuessedLetter(letter: string) {
  //   if (guessedLetters.includes(letter)) return;

  //   // add all current letters in the state array and add newly clicked letter at the end
  //   setGuesssedLetters((currentLetters) => [...currentLetters, letter]);
  // }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key;
      // single letter
      if (!key.match(/^[a-z]$/)) return;

      e.preventDefault();
      addGuessedLetter(key);
    };
    document.addEventListener('keypress', handler);

    return () => {
      document.removeEventListener('keypress', handler);
    };
  }, [addGuessedLetter, guessedLetters, setWordToGuess]);

  // Effect to listen for Enter key press and reset the game
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key;
      // Check if the pressed key is Enter
      if (key === 'Enter') {
        e.preventDefault();
        // call reset function
        resetGame();
      }
    };
    const clickHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.innerText === 'RESET') {
        e.preventDefault();
        resetGame();
      }
    };

    document.addEventListener('keypress', handler);
    document.addEventListener('click', clickHandler);
    return () => {
      document.removeEventListener('keypress', handler);
      document.addEventListener('click', clickHandler);
    };
    // No dependencies, as this effect should only run once when the component mounts
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Hangman game</h1>
      <div className={styles.wrap}>
        <div className={`${styles.resultmessage} ${styles.desktopVersion}`}>
          {isWinner && 'You won! - tab Enter to restart'}
          {isLoser && 'FAILED!!!! - tab Enter to restart'}
        </div>
        <div className={`${styles.resultmessage} ${styles.phoneVersion}`}>
          {isWinner && 'You won! - click reset to restart'}
          {isLoser && 'FAILED!!!! - click reset to restart'}
        </div>

        <HangmanDrawing numberOfGuesses={inCorrectLetters.length} />
        <HangmanWord
          reveal={isLoser}
          guessedLetters={guessedLetters}
          wordToGuess={wordToGuess}
        />
        <div className={styles.keyboard}></div>
        <Keyboard
          disabled={isWinner || isLoser}
          activeLetters={guessedLetters.filter(
            (letter) => wordToGuess && wordToGuess.includes(letter)
          )}
          inactiveLetters={inCorrectLetters}
          addGuessedLetter={addGuessedLetter}
        />
        <ResetBtn />
      </div>
    </div>
  );
}

export default App;
