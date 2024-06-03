import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAlert } from '@/context/AlertContext';

interface AlertProps {
  type?: string;
  message: string;
}

const Alert: React.FC<AlertProps> = ({ type = 'success', message }) => {
  const { hideAlert } = useAlert();
  const [visible, setVisible] = useState<boolean>(true);
  const [show, setShow] = useState<string>('show');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false);
      setShow((prevShow) => (prevShow === 'show' ? 'hide' : 'show'));
      setTimeout(() => {
        hideAlert();
      }, 500);
    }, 4000);

    return () => {
      clearTimeout(timeout);
    };
  }, [message, setShow, setVisible, hideAlert]);

  const hideHandler = () => {
    setVisible(false);
    setShow('hide');
    setTimeout(() => {
      hideAlert();
    }, 500);
  };

  const divmotion = {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { y: '-100%', opacity: 0, transition: { duration: 0.5 } },
    transition: { duration: 0.5 },
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={visible ? 'show' : 'hide'}
          {...divmotion}
          className={`alert bg-sky-400 text-white flex justify-between items-center fixed top-20 right-10 rounded-lg shadow-md px-4 py-2.5 z-50`}
          role="alert"
        >
          {message}
          <button type="button" className="btn btn-outline-primary close" onClick={hideHandler} aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;
