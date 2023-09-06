import { useState } from "react";
import { Button } from "./components/ui/button";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="w-screen h-screen flex flex-col justify-center gap-4 items-center">
      <h1 className="text-3xl w-full text-center">Vite + React</h1>

      <Button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </Button>

      <p>
        Edit <code>src/App.tsx</code> and save to test HMR
      </p>
    </div>
  );
}

export default App;
