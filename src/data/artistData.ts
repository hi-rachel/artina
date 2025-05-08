import { Artist } from "@/types/met";

export const artistMap: Record<string, string> = {
  rembrandt: "Rembrandt",
  vermeer: "Johannes Vermeer",
  fragonard: "Jean-Honoré Fragonard",
  caravaggio: "Caravaggio",
  titian: "Titian",
  rubens: "Peter Paul Rubens",

  manet: "Édouard Manet",
  courbet: "Gustave Courbet",
  "van-gogh": "Vincent van Gogh",
  degas: "Edgar Degas",
  cezanne: "Paul Cézanne",
  toulouse: "Henri de Toulouse-Lautrec",
  ingres: "Jean-Auguste-Dominique Ingres",
  goya: "Francisco Goya",
  renoir: "Pierre-Auguste Renoir",
  morisot: "Berthe Morisot",
  hokusai: "Katsushika Hokusai",

  klimt: "Gustav Klimt",
  rodin: "Auguste Rodin",
};

export const artistGroups: Record<string, Artist[]> = {
  "17th–18th Century Classics": [
    {
      slug: "rembrandt",
      name: "Rembrandt",
      thumbnailUrl:
        "https://images.metmuseum.org/CRDImages/ad/original/DT4656.jpg",
    },
    {
      slug: "vermeer",
      name: "Johannes Vermeer",
      thumbnailUrl:
        "https://images.metmuseum.org/CRDImages/ep/original/DP353256.jpg",
    },
    {
      slug: "fragonard",
      name: "Jean-Honoré Fragonard",
      thumbnailUrl:
        "https://images.metmuseum.org/CRDImages/ep/original/DP-1014-001.jpg",
    },
    {
      slug: "caravaggio",
      name: "Caravaggio",
      thumbnailUrl:
        "https://images.metmuseum.org/CRDImages/dp/original/DP818639.jpg",
    },
    {
      slug: "titian",
      name: "Titian",
      thumbnailUrl:
        "https://images.metmuseum.org/CRDImages/dp/original/DP875539.jpg",
    },
    {
      slug: "rubens",
      name: "Peter Paul Rubens",
      thumbnailUrl:
        "https://images.metmuseum.org/CRDImages/ep/original/DP-14286-003.jpg",
    },
  ],
  "Late 19th Century": [
    {
      slug: "manet",
      name: "Édouard Manet",
      thumbnailUrl:
        "https://images.metmuseum.org/CRDImages/ep/original/DT4224.jpg",
    },
    {
      slug: "courbet",
      name: "Gustave Courbet",
      thumbnailUrl:
        "https://images.metmuseum.org/CRDImages/ep/original/DT1967.jpg",
    },
    {
      slug: "van-gogh",
      name: "Vincent van Gogh",
      thumbnailUrl:
        "https://images.metmuseum.org/CRDImages/ep/original/DT1567.jpg",
    },
    {
      slug: "degas",
      name: "Edgar Degas",
      thumbnailUrl:
        "https://images.metmuseum.org/CRDImages/ep/original/DP-20101-001.jpg",
    },
    {
      slug: "cezanne",
      name: "Paul Cézanne",
      thumbnailUrl:
        "https://images.metmuseum.org/CRDImages/ep/original/DT1939.jpg",
    },
    {
      slug: "toulouse",
      name: "Henri de Toulouse-Lautrec",
      thumbnailUrl:
        "https://images.metmuseum.org/CRDImages/dp/original/DP835484.jpg",
    },
    {
      slug: "ingres",
      name: "Jean-Auguste-Dominique Ingres",
      thumbnailUrl:
        "https://images.metmuseum.org/CRDImages/rl/original/DP-19264-001.jpg",
    },
    {
      slug: "goya",
      name: "Francisco Goya",
      thumbnailUrl:
        "https://images.metmuseum.org/CRDImages/ep/original/DP123853.jpg",
    },
    {
      slug: "renoir",
      name: "Pierre-Auguste Renoir",
      thumbnailUrl:
        "https://images.metmuseum.org/CRDImages/rl/original/DP-34501-001.jpg",
    },
    {
      slug: "morisot",
      name: "Berthe Morisot",
      thumbnailUrl:
        "https://images.metmuseum.org/CRDImages/dp/original/DP815336.jpg",
    },
    {
      slug: "hokusai",
      name: "Katsushika Hokusai",
      thumbnailUrl:
        "https://images.metmuseum.org/CRDImages/as/original/DP141042.jpg",
    },
  ],
  "Early 20th Century": [
    {
      slug: "klimt",
      name: "Gustav Klimt",
      thumbnailUrl:
        "https://images.metmuseum.org/CRDImages/ep/original/DP243354.jpg",
    },
    {
      slug: "rodin",
      name: "Auguste Rodin",
      thumbnailUrl:
        "https://images.metmuseum.org/CRDImages/es/original/DP221863.jpg",
    },
  ],
};
