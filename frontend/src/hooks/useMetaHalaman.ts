import { useEffect } from "react";

function setMeta(name: string, content: string) {
  let tag = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);

  if (!tag) {
    tag = document.createElement("meta");
    tag.name = name;
    document.head.appendChild(tag);
  }

  tag.content = content;
}

export function useMetaHalaman(title: string, description: string) {
  useEffect(() => {
    document.title = `${title} | t.anda Survei`;
    setMeta("description", description);
    setMeta("application-name", "t.anda Survei");
    setMeta("author", "Tim t.anda");
    setMeta("keywords", "survei online, kuesioner, responden, poin, hadiah");
    setMeta("theme-color", "#19b7c8");
  }, [description, title]);
}
