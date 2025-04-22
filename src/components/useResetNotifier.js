import { useForm } from '@formspree/react';

export function useResetNotifier() {
  const [state, handleSubmit] = useForm('mdkgndaj');

  const sendNotification = (name) => {
    const formData = new FormData();
    formData.append('email', 'dev@qurvii.com');
    formData.append('message', `${name} downloaded the reset stock file at ${new Date().toLocaleString()}`);


    fetch('https://formspree.io/f/mdkgndaj', {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
      },
    });
  };

  return sendNotification;
}
