export function Header() {
  return <>
    <div className="container flex justify-center">
      <img src="/logo.jpg" className="logo" alt="logo"/>
    </div>
    <div
      className="border-2 max-w-screen-sm rounded-3xl bg-gray-50 transition-shadow hover:shadow shadow-gray-400 p-4">
      <div className="text-center">
        <h1>אירוע גנרי 2022</h1>
        <h2>⚡️ השיבה למקום גנרי ⚡️</h2>
        <h1>Generic Event 2022</h1>
        <h2>⚡️ Generic Event Reloaded ⚡️</h2>
      </div>
    </div>
  </>;
}

export default Header;
