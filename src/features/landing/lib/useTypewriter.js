import { useEffect, useRef, useState } from "react";

export function useTypewriter(text, active, charDelayMs = 16) {
  const [displayed, setDisplayed] = useState(() => (active ? "" : text));
  const [done, setDone] = useState(!active);

  const textRef = useRef(text);
  const activeRef = useRef(active);
  textRef.current = text;
  activeRef.current = active;

  useEffect(() => {
    if (!active) {
      setDisplayed(text);
      setDone(true);
      return;
    }

    setDisplayed("");
    setDone(false);

    let index = 0;

    const id = window.setInterval(() => {
      index += 1;
      const slice = textRef.current.slice(0, index);
      setDisplayed(slice);

      if (index >= textRef.current.length) {
        window.clearInterval(id);
        setDone(true);
      }
    }, charDelayMs);

    return () => {
      window.clearInterval(id);
    };
  }, [text, active, charDelayMs]);

  return { displayed, done };
}
