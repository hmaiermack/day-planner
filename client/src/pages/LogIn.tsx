import React, { useContext, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'
import YupPassword from 'yup-password'
import { useNavigate, Link } from 'react-router-dom';
import FormInput from "components/forms/FormInput";
import GradientButton from "components/shared/GradientButton";
import { publicFetch } from "utils";
import axios from "axios";
import FormSuccess from "components/forms/FormSuccess";
import { decodeToken } from 'react-jwt';
import { AuthContext } from 'context/AuthContext';

YupPassword(yup)

interface IResponseData {
    access_token: string,
    refresh_token: string
}



const LogIn = () => {
    const authContext = useContext(AuthContext)

    let navigate = useNavigate()

    const [btnLoading, setBtnLoading] = useState(false)
    const [loginSuccess, setLoginSuccess] = useState(false)

    interface IFormInputs {
        Email: string,
        Password: string
    }

    interface ISubmitCredentialsDTO {
        email: string,
        password: string
    }
    
    
    //need to add existing email validation
    
    const registerSchema = yup.object().shape({
        Email: yup.string().email().required(),
        Password: yup.string().password().required(),
    })

    const { register, setError, formState: { errors }, handleSubmit } = useForm<IFormInputs>({
        resolver: yupResolver(registerSchema)
    });

    const submitHandler: SubmitHandler<IFormInputs> = async (inputs: IFormInputs) => {
        const credentials: ISubmitCredentialsDTO = {
            email: inputs.Email,
            password: inputs.Password
        }
        try {
            setBtnLoading(true)
            const {data} = await publicFetch.post<IResponseData>(
                'auth/local/signup',
                credentials
            )
            let token = data.access_token
            let decoded: any = decodeToken(token)
            
            authContext?.setAuthState({
                AT: data.access_token,
                RT: data.refresh_token,
                expiresAt: decoded.exp
            })
            setLoginSuccess(true)
            // this is where we navigate back
            // give some time to see success message
            setTimeout(() => {
                navigate('/dashboard')
            }, 700)
        } catch (error) {
            setBtnLoading(false)
            if(axios.isAxiosError(error) && error.response?.data.message.includes('Email')) {
                console.log(error.response)
                setError('Email', {message: error.response.data.message}, {shouldFocus: true})
            }
        } finally {
            setBtnLoading(false)
        }
    }

    return (
        <div className="container">
            <div className="min-h-screen bg-gray-100 flex flex-col justify-center">
                <div className="max-w-md w-full mx-auto">
                    <div className="text-center font-bold text-3xl text-orange-500 uppercase">Day Dash</div>
                    <div className="text-xl font-medium text-gray-600 m-2 text-center">Sign Up</div>
                </div>
                <div className="max-w-md w-full mx-auto bg-white p-8 border border-gray-600 rounded">
                    <form onSubmit={handleSubmit(async (formData) => submitHandler(formData))} className="space-y-6">
                        {loginSuccess && <FormSuccess text="Sign up successful!" />}
                        <FormInput type="text" label="Email" register={register} errors={errors.Email} required={true}>
                            {errors.Email && errors.Email?.message && <span>{errors.Email.message}</span>}
                        </FormInput>
                        <FormInput label="Password" type="password" register={register} errors={errors.Password} required={true}>
                            {errors.Password && errors.Password?.message && <span>{errors.Password.message}</span>}
                        </FormInput>
                        
                        <GradientButton type="submit" text="Submit" size="md" loading={btnLoading} />
                        <span className="mt-4 text-xs text-gray-500">Already have an account? <Link to ="/signin"><span className="cursor-pointer hover:text-orange-500">Sign In</span></Link></span>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LogIn