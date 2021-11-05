import { render } from "react-dom";
import Button from "@/components/Button";

render(
  <div>
    <h1>Prew</h1>
    <h2>Welcome</h2>
    <Button>hello</Button>
    <img src="/icon.png" alt="icon" />
  </div>,
  document.getElementById("root")
);
