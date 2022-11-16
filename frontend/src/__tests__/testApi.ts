import "isomorphic-fetch";
import {submitForm} from "../utils/submitForm";

const ONE_MILLISECOND = 1;
const ONE_SECOND = 1000 * ONE_MILLISECOND;
const ONE_MINUTE = 60 * ONE_SECOND;
const FIVE_MINUTES = 5 * ONE_MINUTE

describe("API", () => {
  function makeTestData(index: number) {
    return {
      email: `test.${index}@example.com`,
      verifyEmail: `test.${index}@example.com`,
      fakeCAPTCHA: "INVALID",
      fullName: "Test Name",
      idNumber: `${index}_${Math.random()}`,
      phoneNumber: `${index}_${Math.random()}`,
      // TODO: test with proper turnstile token
      turnstileToken: "INVALID",
    };
  }

  it.skip("should register a submission", async () => {
    const response = await submitForm(makeTestData(666))
    expect(response.status).toBe(201)
  });

  it.skip('should withstand many concurrent requests', async () => {
    const numRequests = 2500;
    const empty = new Array(numRequests).fill(null);
    console.log("Load test", {numRequests})
    const start = Date.now();
    let doneCount = 0;
    console.log(`Requests Done: ${doneCount}/${numRequests}`)
    const responses = await Promise.all(empty.map(async (v, index) => {
      let r = Response.error();
      try {
        // @ts-ignore
        r = await submitForm(makeTestData(index));
      } catch (e) {
      }
      doneCount++;
      if (doneCount % 50 === 0) {
        console.log(`Requests Done: ${doneCount}/${numRequests}`)
      }
      return r;
    }))
    const end = Date.now();
    const duration = end - start
    const responsesOk = responses.filter(r => r.status === 201);
    expect(responsesOk.length).toBeGreaterThanOrEqual(numRequests * 0.9)
    console.log(`Testing ${numRequests}, OK:${responsesOk.length}/${numRequests}, ERRORED:${numRequests - responsesOk.length} submissions took ${duration}ms`)
  }, FIVE_MINUTES);
});
