import maybeJson from "../utils/maybeJson";

describe("testUtils", () => {
  it("should return JSON", async () => {
    const response = {
      text: () => Promise.resolve('{"foo": "bar"}'),
      headers: {
        get: () => "application/json"
      }
    };
    // @ts-ignore
    const json = await maybeJson(response);
    expect(json).toEqual({foo: "bar"});
  });

  it("should return empty object on error", async () => {
    const response = {
      text: () => Promise.resolve("notjson"),
    };
    // @ts-ignore
    const json = await maybeJson(response);
    expect(json).toEqual({});
  });
});
