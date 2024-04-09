'use client';
import React, {useState, useEffect}from 'react'
import { useRouter } from 'next/navigation';
//styles
import classNames from 'classnames/bind';
import styles from './page.module.scss';
//libs
import Input from '@compLibrary/Input';
import Button from '@compLibrary/Button';
// form controller
import { useFormik } from "formik";
import * as Yup from 'yup';
import { confirmUser, registerUser } from '@api/Queries/Post';
/// react toast 
import toast from 'react-hot-toast'
//utils
import { isUndefined } from '@utils/helpers';


interface FormikValues {
    owner: string
    username: string
    code: string 
}
type ModeType = 'register' | 'otp' 

function CreatePostObject (values: FormikValues, dynamicKey: 'email' | 'phoneNumber'){
    const data = {
        code: values.code, 
        owner: values.owner, 
        [dynamicKey]: values.username
    }
    return data
}

const cn = classNames.bind(styles)
const Register = () => {
    // console.log(window?.history)

    const router = useRouter();
    const [mode, setMode] = useState<ModeType>('register');
    const [resLoading, setResLoading] = useState<boolean>(false)

    const formik = useFormik<FormikValues>({
        initialValues: {
            owner: 'web-676b2566-9ad0-4cdc-a5c3-5f340b2f87dc', 
            username: "", 
            code: ""
        }, 
        validationSchema: Yup.object({
            username: Yup.string().required().test("username", "Invalid username", (value) => {
                const phoneRegex = /^993\d{8}$/;
                const emailRegex = /^[^\s@]+@[^\s@]+\.(com|ru|gov|biz|mil|info|edu|org|net)$/;
                return phoneRegex.test(value) || emailRegex.test(value);
            }), 
            owner: Yup.string().nullable(), 
            code: mode === 'register' ? Yup.string().nullable() : 
                Yup.string().required().test('code', "Invalid code", (value) => {
                    const codeRegex = /^\d{6}$/;
                    return codeRegex.test(value)
                })
        }), 
        onSubmit: async (values, {resetForm}) => {
            // console.log("values", values)
            if(mode === 'register'){
                setResLoading(true)
                const response = await registerUser(values)
                console.log("pre register response", response)
                if(response.status)
                    setMode('otp')
                setResLoading(false)
                    
            }else { /// in otp submit
                const dynamicKey =  values.username.includes('@') ?  'email' : 'phoneNumber'
                setResLoading(true)
                const response = await confirmUser(CreatePostObject(values, dynamicKey))
                if(response.status && !isUndefined(response.access_token)){
                    localStorage.setItem('auth', JSON.stringify({
                        accessToken: response.access_token, 
                        type: response.profileType, 
                        username: response.username
                    }))
                    console.log("response otp", response)
                    if(!isUndefined(localStorage.getItem('path')))
                        router.push(localStorage.getItem('path')!)
                    else router.push('/')
                    resetForm()
                }else toast.error('Please enter valid code.')
                    
                setResLoading(false)
            }
        }
    })

    return (
        <div className={styles.wrapper}>
            
            <div className={styles.card}>
                <div className={styles.card_body}>

                    <h4>Register with 
                        <span>Aydym.com</span>
                    </h4>
                    <p>It's time to join with Listen and gain full awesome music experience.</p>

                    <form onSubmit={formik.handleSubmit}> 
                        <div className={styles.field}>
                            {
                                mode === 'register' ? 
                                (
                                    <Input 
                                        type='text'
                                        fontSize='medium'
                                        value={formik.values.username}
                                        onChange={formik.handleChange}
                                        placeholder='Enter number or email'
                                        name='username'
                                        autoComplete='off'
                                    />
                                ) : (
                                    <Input 
                                        type='text'
                                        fontSize='medium'
                                        value={formik.values.code}
                                        onChange={formik.handleChange}
                                        placeholder='Enter the code'
                                        name='code'
                                        autoComplete='off'
                                    />
                                )
                            }
                        </div>

                        
                        <div className={styles.error}>
                            {
                                formik.errors.username &&  formik.touched.username ?  
                                formik.errors.username 
                                : 
                                formik.errors.code && formik.touched.code ? 
                                formik.errors.code : ""
                            }
                        </div>

                        <div className={cn({
                            submit: true, 
                            submit_flexible: mode === 'otp'
                        })}>
                            {
                                mode === 'register' && (
                                    <Button 
                                        color='darkblue' 
                                        style={{width: '100%'}} 
                                        htmlType='submit'
                                        loading={resLoading}
                                        disabled={resLoading}
                                    >
                                        Отправить код подтверждения
                                    </Button>
                                )
                            }
                            {
                                mode === 'otp' && (
                                    <>
                                        <Button 
                                            color='darkblue' 
                                            htmlType='button'
                                            onClick={() => {
                                                setMode('register')
                                                // formik.setFieldValue('code', '')
                                            }}
                                        >
                                            Back to register
                                        </Button>
                                        <Button 
                                            color='darkblue' 
                                            htmlType='submit'
                                            loading={resLoading}
                                            disabled={resLoading}
                                        >
                                            Войти в систему
                                        </Button>
                                    </>
                                    
                                )
                            }
                        </div>

                        
                    </form>

                </div>
            </div>

        </div>
    )
}

export default Register
