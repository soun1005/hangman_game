import styles from './HangmanWord.module.css';

type HangmanWordProps = {
  guessedLetters: string[];
  wordToGuess: string | null;
  reveal?: boolean;
};

export function HangmanWord({
  guessedLetters,
  wordToGuess,
  reveal = false,
}: HangmanWordProps) {
  if (wordToGuess === null) return;

  return (
    <div className={styles.container}>
      {wordToGuess.split('').map((letter, index) => (
        <span className={styles.word} key={index}>
          <span
            className={
              guessedLetters.includes(letter) || reveal
                ? `${styles.guessedLetters} ${styles.visible}`
                : `${styles.guessedLetters} ${styles.hidden}`
            }
          >
            {letter}
          </span>
        </span>
      ))}
    </div>
  );
}
