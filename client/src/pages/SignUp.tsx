import React, { useState } from "react";
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'
import YupPassword from 'yup-password'
import { useNavigate, Link } from 'react-router-dom';
import FormInput from "components/forms/FormInput";
import GradientButton from "components/shared/GradientButton";
import { publicFetch } from "utils";
import axios from "axios";

YupPassword(yup)


const SignUp = () => {
    let navigate = useNavigate()

    const [btnLoading, setBtnLoading] = useState(false)

    interface IFormInputs {
        Email: string,
        Password: string,
        Confirmation: string
    }

    interface ISubmitCredentialsDTO {
        email: string,
        password: string
    }
    
    
    //need to add existing email validation
    
    const registerSchema = yup.object().shape({
        Email: yup.string().email().required(),
        Password: yup.string().password().required(),
        Confirmation: yup.string().oneOf([yup.ref("Password")], 'Passwords must match.')
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
            const { data } = await publicFetch.post(
                'auth/local/signup',
                credentials
            )
            console.log(data)
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
                    <form onSubmit={handleSubmit(async (formData) => await submitHandler(formData))} className="space-y-6">
                        <FormInput type="text" label="Email" register={register} errors={errors.Email} required={true}>
                            {errors.Email && errors.Email?.message && <span>{errors.Email.message}</span>}
                        </FormInput>
                        <FormInput label="Password" type="password" register={register} errors={errors.Password} required={true}>
                            {errors.Password && errors.Password?.message && <span>{errors.Password.message}</span>}
                        </FormInput>
                        <FormInput label="Confirmation" type="password" register={register} errors={errors.Confirmation} required={true}>
                            {errors.Confirmation && errors.Confirmation?.message && <span>{errors.Confirmation.message}</span>}
                        </FormInput>

                        <GradientButton type="submit" text="Submit" size="md" loading={btnLoading} />
                        <span className="mt-4 text-xs text-gray-500">Already have an account? <Link to ="/signin"><span className="cursor-pointer hover:text-orange-500">Sign In</span></Link></span>
                    </form>
                </div>
            </div>
        </div>
    )


}

export default SignUp