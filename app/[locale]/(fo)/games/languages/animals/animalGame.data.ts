// animalGame.data.ts
export type Animal = {
  id: string;
  img: string;
  es: string;
  en: string;
};

export const ANIMALS: Animal[] = [
  { id: "wolf", img: "/games/animals/wolf.png", es: "lobo", en: "wolf" },
  { id: "cat", img: "/games/animals/cat.png", es: "gato", en: "cat" },
  { id: "dog", img: "/games/animals/dog.png", es: "perro", en: "dog" },
  { id: "bear", img: "/games/animals/bear.png", es: "oso", en: "bear" },
  { id: "horse", img: "/games/animals/horse.png", es: "caballo", en: "horse" },
];
