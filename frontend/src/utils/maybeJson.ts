export const maybeJson = async (r: Response) => {
  const text = await r.text();
  try {
    return JSON.parse(text)
  } catch (e) {
    console.log({e, text, headers: r.headers})
    return {}
  }
}

export default maybeJson;
