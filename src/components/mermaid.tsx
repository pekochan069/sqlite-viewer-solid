import { useNavigate, useRouter } from "@tanstack/solid-router";
import mermaid from "mermaid";
import { createEffect, createResource, Match, Suspense, Switch } from "solid-js";
import { useMermaid } from "./contexts/mermaid.context";

type MermaidProps = {
  code: string;
};

async function renderMermaid(code: string) {
  if (code === "") {
    return;
  }

  mermaid.initialize({
    startOnLoad: false,
  });
  return await mermaid.render("mermaid", code);
}

export function Mermaid() {
  const { code } = useMermaid();
  let mermaidContainer: HTMLDivElement | undefined;
  const [rendered] = createResource(code, renderMermaid);
  const router = useRouter();
  const navigate = useNavigate({ from: "/" });

  createEffect(() => {
    if (rendered()) {
      mermaidContainer!.innerHTML = rendered()!.svg;
      mermaidContainer!.querySelectorAll<SVGGElement>(".nodes > .node").forEach((node) => {
        node.addEventListener("click", () => {
          const table = node.id.split("-")[1];
          navigate({
            to: "/table/$table",
            params: { table },
          });
          // window.location.href = `/table/${table}`;
          // router.pu
        });
      });
    }
  });

  return (
    <div>
      <div>
        <h2>Mermaid</h2>
        <div ref={mermaidContainer} id="mermaid-container"></div>
      </div>
    </div>
  );
}
