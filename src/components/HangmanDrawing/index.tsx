import styles from './HangmanDrawing.module.css';

const HEAD = <div key="head" className={styles.head} />;

const BODY = <div className={styles.body} key="body" />;

const RIGHT_ARM = <div key="rightArm" className={styles.rightArm} />;

const LEFT_ARM = <div key="leftArm" className={styles.leftArm} />;

const RIGHT_LEG = <div key="rightLeg" className={styles.rightLeg} />;

const LEFT_LEG = <div key="leftLeg" className={styles.leftLeg} />;

const BODY_PARTS = [HEAD, BODY, RIGHT_ARM, LEFT_ARM, RIGHT_LEG, LEFT_LEG];

type HangmanDrawingProps = {
  numberOfGuesses: number;
};

export function HangmanDrawing({ numberOfGuesses }: HangmanDrawingProps) {
  return (
    <div className={styles.container}>
      {/* incorrect number of guesses cut the array of bodyparts */}
      {BODY_PARTS.slice(0, numberOfGuesses)}

      <div className={styles.hook} />
      <div className={styles.connector} />
      <div className={styles.hanger} />
      <div className={styles.floor} />
    </div>
  );
}

export default HangmanDrawing;
