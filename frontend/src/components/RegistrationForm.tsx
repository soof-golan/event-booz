import {useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import maybeJson from "../utils/maybeJson";
import {SubmissionResponse} from "../types/SubmissionResponse";
import {submitForm} from "../utils/submitForm";
import {SubmissionFormData} from "../types/formData";
import {turnstileSiteKey} from "../consts";

export const RegistrationForm = () => {
  const {register, handleSubmit, getValues, formState: {errors, isSubmitting}} = useForm<SubmissionFormData>({
    shouldUseNativeValidation: true,
    criteriaMode: "all",
    mode: "onBlur"
  });
  const [disabled, setDisabled] = useState(false)
  const defaultSubmitText = "Submit הרשמה";
  const failedSubmissionText = "Failed to submit, try again הרשמה נכשלה, נסו שנית";
  const [buttonContent, setButtonContent] = useState(defaultSubmitText)
  const [turnstileToken, setTurnstileToken] = useState('')

  useEffect(() => {
    // @ts-ignore
    window.javascriptCallback = (token: string) => {
      setTurnstileToken(token);
    }
    return () => {
      // @ts-ignore
      delete window.javascriptCallback;
    }
  }, [])

  const onSubmit = async (data: SubmissionFormData) => {
    const dataWithToken = {...data, turnstileToken}
    const response = await submitForm(dataWithToken);
    setDisabled(response.status == 201)
    const responseData = await maybeJson(response) as SubmissionResponse;
    if (response.status == 201) {
      setButtonContent("Submission successful ❤️ ההרשמה הצליחה")
      setDisabled(true);
    } else {
      setButtonContent(failedSubmissionText + " " + JSON.stringify(responseData))
      setTimeout(() => {
        setButtonContent(defaultSubmitText)
      }, 10000)
    }
  };

  return (

    <div className="border-2 max-w-screen-sm rounded-3xl bg-gray-50 transition-shadow hover:shadow shadow-gray-400">
      <form onSubmit={handleSubmit(onSubmit)} className="px-4">

        <div className="container items-center text-center">
          <div className="grid grid-cols-2 gap-4 p-4 ">
            <label htmlFor="email">Email</label>
            <label>אימייל</label>
          </div>
          <input className="textField" type="email" {...register("email", {required: true})} />
          {errors?.email ? <p className="text-red-600">{errors?.email?.type as string}</p> : <br/>}
          <br/>
          <div className="grid grid-cols-2 gap-4 p-4 ">
            <label htmlFor="verifyEmail">Email Again</label>
            <label>אימייל שוב</label>
          </div>
          <input className="textField" type="email" {...register("verifyEmail", {
            required: true,
            validate: value => value === getValues("email")
          })} />
          <div className="text-red-600">
            {errors?.verifyEmail ?
              errors?.verifyEmail?.type === 'validate' ?
                <><p>Emails not identical</p><p>מיילים לא זהים</p></> :
                <p>{errors?.verifyEmail?.type as string}</p> :
              <br/>}
          </div>
          <br/>
          <div className="grid grid-cols-2 gap-4 p-4">
            <label htmlFor="fullName">Full Name</label>
            <label>שם מלא</label>
          </div>
          <input className="textField" type="text" {...register("fullName", {
            required: true,
            minLength: 2,
            maxLength: 256
          })}/>
          {errors?.fullName ? <p className="text-red-600">{errors?.fullName?.type as string}</p> : <br/>}
          <br/>
          <div className="grid grid-cols-2 gap-4 p-4 ">
            <label htmlFor="phoneNumber">Israeli phone number (digits only)</label>
            <label>מספר טלפון ישראלי (רק ספרות)</label>
          </div>
          <p>נא לודא את המספר לפני השליחה</p>
          <p>Please verify before submitting</p>
          <input className="textField" type="text" {...register("phoneNumber", {
            required: true,
            pattern: /^(?:(?:(?:[+]?|00)972-?|0)5[0-9]-?[0-9]{7}|666)$/
          })} />
          <div className="text-red-600">
            {errors?.phoneNumber ? (
              errors?.phoneNumber?.type !== "pattern" ?
                <p>{errors?.phoneNumber?.type as string}</p> :
                <>
                  <p>Not an IL phone number. Just enter - 666</p>
                  <p dir="rtl">לא מספר ישראלי. אם אין מספר ישראלי הכנסו 666</p>
                </>
            ) : <br/>}
          </div>
          <br/>
          <div className="grid grid-cols-2 gap-4 p-4 ">
            <label htmlFor="idNumber">Passport (non Israeli)</label>
            <label>תעודת זהות (ישראלית)</label>
          </div>
          <p>נא לודא את המספר לפני השליחה</p>
          <p>Please verify before submitting</p>
          <input className="textField" type="text" {...register("idNumber", {
            required: true,
            minLength: 2,
            maxLength: 256,
          })} />
          {errors?.idNumber ? <p className="text-red-600">{errors?.idNumber?.type as string}</p> : <br/>}
          <br/>
          <div className="flex container justify-center">
            <div className="cf-turnstile" data-sitekey={turnstileSiteKey} data-callback="javascriptCallback"></div>
          </div>
          <br/>
          <div className="grid grid-cols-1 gap-4 py-4 ">
            <div/>
            <input disabled={disabled || isSubmitting} className="submitButton py-4" type="submit"
                   value={buttonContent}/>
          </div>
        </div>
      </form>
    </div>
  )
};

export default RegistrationForm;
