import { useState, useEffect, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'

interface BlurTextProps {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  style?: React.CSSProperties;
}

const buildKeyframes = (from: object, steps: object[]): object => {
  const keys = new Set([
    ...Object.keys(from),
    ...steps.flatMap((s) => Object.keys(s)),
  ]);

  const keyframes: { [key: string]: any[] } = {};
  keys.forEach((k) => {
    keyframes[k] = [
      (from as any)[k],
      ...steps.map((s) => (s as any)[k])
    ];
  });
  return keyframes;
};

export const BlurText = ({
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words',
  direction = 'top',
  style = {},
}: BlurTextProps) => {
  const elements = useMemo(() => {
    if (animateBy === 'words') {
      return text.split(' ');
    } else {
      return text.split('');
    }
  }, [text, animateBy]);

  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(currentRef);
        }
      },
      { threshold: 0.1, rootMargin: '0px' }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    }
  }, []);

  const defaultFrom = useMemo(
    () =>
      direction === 'top'
        ? { filter: 'blur(10px)', opacity: 0, y: -50 }
        : { filter: 'blur(10px)', opacity: 0, y: 50 },
    [direction]
  );

  const defaultTo = useMemo(
    () => [
      {
        filter: 'blur(5px)',
        opacity: 0.5,
        y: direction === 'top' ? 5 : -5,
      },
      {
        filter: 'blur(0px)',
        opacity: 1,
        y: 0,
      },
    ],
    [direction]
  );

  const fromSnapshot = defaultFrom;
  const toSnapshots = defaultTo;

  return (
    <p
      ref={ref}
      className={className}
      style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', ...style }}
    >
      {elements.map((segment, index) => {
        const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);

        return (
          <motion.span
            className="inline-block will-change-[transform,filter,opacity]"
            key={index}
            initial={fromSnapshot as any}
            animate={inView ? animateKeyframes as any : fromSnapshot as any}
            transition={{
              duration: 0.7,
              times: [0, 0.5, 1],
              delay: inView ? (index * delay) / 1000 : 0,
              ease: (t: number) => t,
            }}
            style={animateBy === 'words' ? { marginRight: '0.5em' } : {}}
          >
            {segment === ' ' ? '\u00A0' : segment}
          </motion.span>
        );
      })}
    </p>
  );
};