import {SubmissionFormData} from "../types/formData";
import {apiUrl} from "../consts";

export const submitForm = async (data: SubmissionFormData) => {
  return await fetch(`${apiUrl}/`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    mode: 'cors'
  });
}
