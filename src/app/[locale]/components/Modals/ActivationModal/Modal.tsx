import React from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup'
//type
import CommonModalI from '../CommonModali'
//lib
import Modal from '@compLibrary/Modal'
import Button from '@compLibrary/Button';
import Divider from '@compLibrary/Divider';
import Input from '@compLibrary/Input';
//styles
import styles from './Modal.module.scss';
import { sendActivationCode } from '@api/Queries/Post';
import { isAxiosError } from 'axios';

type FormikValues = {
  code: string
}

interface ActivationModalProps extends CommonModalI {
  onSuccess: (startingDate: string, endingDate: string) => void
}
const ActivationModal = (props: ActivationModalProps) => {
    const {
        show, 
        close, 
        onSuccess
    } = props

    const formik = useFormik<FormikValues>({
      initialValues: {
        code: ""
      }, 
      validationSchema: Yup.object({
        code: Yup.string().required("Field is required.").min(0).max(19).matches(/^(\d{4}-)(\d{4}-)(\d{4}-)(\d{4})$/, 'Please, provide valid code.')
      }),
      onSubmit: async (values, {resetForm}) => {
        try {
          const response = await sendActivationCode({
            code: values.code
          })
          console.log("res", response)
          if(!response.status){
            close()
            onSuccess(response.startingDate, response.endingDate)
            resetForm()
          }
        } catch (error) {
          if(isAxiosError(error)){
            console.log("activation code send error ", error)
            if(error.response?.data){
              if(error.response.data.status === 401){
                formik.setFieldError('code', error.response.data.error)
              }
            }
          }
        }
      }
    })

    const handleChange = (e:any) => {
      const { value, selectionStart } = e.target;
      const isBackspace = e.nativeEvent.inputType === 'deleteContentBackward';
    
      let inputValue = value.replace(/-/g, ''); // Remove any existing dashes
      let formattedValue = inputValue
        .replace(/\D/g, '') // Remove any non-numeric characters
        .replace(/(\d{4})/g, '$1-') // Add a dash after every 4 characters
        .slice(0, 19);

        if (isBackspace && value[selectionStart - 1] === '-') {
        formattedValue = formattedValue.slice(0, selectionStart - 1) + formattedValue.slice(selectionStart);
      }
      
      formik.setFieldTouched('code', false, false);
      formik.setFieldValue('code', formattedValue);
    };

  return (      
    <>
    <Modal 
        isOpen={show}
        close={close}
        className={styles.activationModal}
        header={
          <>
            <div className={styles.header}>
              <h5>Aktiwasiýa koduny giriziň</h5>
              <Button color='light' roundedLg onClick={()=> close()}>
                  X
              </Button>
            </div>
            <Divider />
          </>
        }
    >
      <form onSubmit={formik.handleSubmit} className={styles.theForm}>
        <Input 
          type='text'
          placeholder='xxxx-xxxx-xxxx-xxxx'
          name='code'
          max={16}
          value={formik.values.code}
          onChange={handleChange}
          className={styles.inputField}
        />

        <span className={styles.error}>
          {
            formik.errors.code && formik.touched.code && formik.errors.code
          }
        </span>

        <Button color='violet' htmlType='submit'>
          kabul et
        </Button>
      </form>
    </Modal> 
    </>
  )
}

export default ActivationModal
