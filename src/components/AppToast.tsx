'use client';

import { RootState, setError, setSuccess } from '@/store/rtk.store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AppToast = () => {
  const { error, success } = useSelector((state: RootState) => state.groups);

  const dispatch = useDispatch();

  useEffect(() => {
    if (success) {
      toast.success(success);

      const timeout = setTimeout(() => {
        dispatch(setSuccess(null));
      }, 3000);
      return () => clearTimeout(timeout);
    }

    if (error) {
      toast.error(error.error.message);

      const timeout = setTimeout(() => {
        dispatch(setError(null));
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [error, success, dispatch]);

  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
};
